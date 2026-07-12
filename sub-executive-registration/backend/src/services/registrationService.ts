import type { PoolClient } from 'pg';
import { pool, withTransaction } from '../config/database';
import type {
  CreateApplicationInput,
  ScreeningQuestionRow,
} from '../types/registration';
import { AppError } from '../utils/AppError';

interface IdNameRow {
  id: number | string;
  name: string;
}

interface TeamRow extends IdNameRow {
  id: string;
  slug: string;
  description: string | null;
}

interface RecruitmentCycleRow {
  id: string;
  title: string;
  start_at: Date | null;
  end_at: Date | null;
}

export async function getFormOptions() {
  const [departmentsResult, semestersResult, teamsResult, cycleResult] =
    await Promise.all([
      pool.query<IdNameRow>(
        `SELECT id, code || ' — ' || name AS name
         FROM departments
         WHERE is_active = TRUE
         ORDER BY id`,
      ),
      pool.query<IdNameRow>(
        `SELECT id, name
         FROM semesters
         WHERE is_active = TRUE
         ORDER BY display_order`,
      ),
      pool.query<TeamRow>(
        `SELECT id, name, slug, description
         FROM teams
         WHERE is_active = TRUE
         ORDER BY name`,
      ),
      pool.query<RecruitmentCycleRow>(
        `SELECT id, title, start_at, end_at
         FROM recruitment_cycles
         WHERE is_active = TRUE
           AND (start_at IS NULL OR start_at <= NOW())
           AND (end_at IS NULL OR end_at >= NOW())
         LIMIT 1`,
      ),
    ]);

  const activeCycle = cycleResult.rows[0] ?? null;

  return {
    departments: departmentsResult.rows,
    semesters: semestersResult.rows,
    teams: teamsResult.rows,
    activeCycle: activeCycle
      ? {
          id: activeCycle.id,
          title: activeCycle.title,
          startAt: activeCycle.start_at?.toISOString() ?? null,
          endAt: activeCycle.end_at?.toISOString() ?? null,
        }
      : null,
  };
}

export async function getTeamQuestions(teamId: string) {
  const teamResult = await pool.query<TeamRow>(
    `SELECT id, name, slug, description
     FROM teams
     WHERE id = $1 AND is_active = TRUE`,
    [teamId],
  );

  const team = teamResult.rows[0];
  if (!team) {
    throw new AppError(404, 'TEAM_NOT_FOUND', 'The selected team does not exist.');
  }

  const questionsResult = await pool.query<ScreeningQuestionRow>(
    `SELECT
       id,
       team_id,
       question_text,
       question_type,
       is_required,
       display_order,
       options
     FROM screening_questions
     WHERE team_id = $1 AND is_active = TRUE
     ORDER BY display_order`,
    [teamId],
  );

  return {
    team,
    questions: questionsResult.rows.map((question) => ({
      id: question.id,
      teamId: question.team_id,
      questionText: question.question_text,
      questionType: question.question_type,
      isRequired: question.is_required,
      displayOrder: question.display_order,
      options: question.options,
    })),
  };
}

function answerHasValue(
  answer: CreateApplicationInput['answers'][number] | undefined,
): boolean {
  return Boolean(answer?.answerText?.trim() || answer?.answerJson?.length);
}

async function getActiveCycle(client: PoolClient): Promise<RecruitmentCycleRow> {
  const result = await client.query<RecruitmentCycleRow>(
    `SELECT id, title, start_at, end_at
     FROM recruitment_cycles
     WHERE is_active = TRUE
       AND (start_at IS NULL OR start_at <= NOW())
       AND (end_at IS NULL OR end_at >= NOW())
     LIMIT 1
     FOR SHARE`,
  );

  const cycle = result.rows[0];
  if (!cycle) {
    throw new AppError(
      409,
      'REGISTRATION_CLOSED',
      'There is no active Sub-Executive recruitment cycle right now.',
    );
  }

  return cycle;
}

export async function createApplication(input: CreateApplicationInput) {
  return withTransaction(async (client) => {
    const cycle = await getActiveCycle(client);

    const teamResult = await client.query<{ id: string; name: string }>(
      `SELECT id, name
       FROM teams
       WHERE id = $1 AND is_active = TRUE
       FOR SHARE`,
      [input.teamId],
    );

    const team = teamResult.rows[0];
    if (!team) {
      throw new AppError(404, 'TEAM_NOT_FOUND', 'The selected team does not exist.');
    }

    const questionsResult = await client.query<ScreeningQuestionRow>(
      `SELECT
         id,
         team_id,
         question_text,
         question_type,
         is_required,
         display_order,
         options
       FROM screening_questions
       WHERE team_id = $1 AND is_active = TRUE
       ORDER BY display_order
       FOR SHARE`,
      [input.teamId],
    );

    const questions = questionsResult.rows;
    const questionById = new Map(questions.map((question) => [question.id, question]));
    const answerByQuestionId = new Map<string, CreateApplicationInput['answers'][number]>();

    for (const answer of input.answers) {
      if (answerByQuestionId.has(answer.questionId)) {
        throw new AppError(
          400,
          'DUPLICATE_ANSWER',
          'The same screening question was answered more than once.',
        );
      }

      if (!questionById.has(answer.questionId)) {
        throw new AppError(
          400,
          'INVALID_QUESTION',
          'One submitted question does not belong to the selected team.',
        );
      }

      answerByQuestionId.set(answer.questionId, answer);
    }

    const missingRequiredQuestions = questions
      .filter(
        (question) =>
          question.is_required && !answerHasValue(answerByQuestionId.get(question.id)),
      )
      .map((question) => ({
        questionId: question.id,
        questionText: question.question_text,
      }));

    if (missingRequiredQuestions.length > 0) {
      throw new AppError(
        400,
        'REQUIRED_ANSWERS_MISSING',
        'Please answer all required team screening questions.',
        missingRequiredQuestions,
      );
    }

    for (const [questionId, answer] of answerByQuestionId) {
      const question = questionById.get(questionId);
      if (!question) continue;

      if (
        question.question_type === 'multiple_choice' &&
        !answer.answerJson?.length
      ) {
        throw new AppError(
          400,
          'INVALID_MULTIPLE_CHOICE_ANSWER',
          `A multiple-choice answer is required for: ${question.question_text}`,
        );
      }

      if (
        question.question_type !== 'multiple_choice' &&
        !answer.answerText?.trim()
      ) {
        throw new AppError(
          400,
          'INVALID_TEXT_ANSWER',
          `A text answer is required for: ${question.question_text}`,
        );
      }

      if (
        ['single_choice', 'multiple_choice'].includes(question.question_type) &&
        question.options?.length
      ) {
        const selectedValues =
          question.question_type === 'multiple_choice'
            ? answer.answerJson ?? []
            : [answer.answerText ?? ''];

        const invalidSelection = selectedValues.some(
          (value) => !question.options?.includes(value),
        );

        if (invalidSelection) {
          throw new AppError(
            400,
            'INVALID_CHOICE',
            `An invalid option was selected for: ${question.question_text}`,
          );
        }
      }
    }

    const existingApplicantResult = await client.query<{ id: string }>(
      `SELECT id
       FROM applicants
       WHERE student_id = $1
       FOR UPDATE`,
      [input.studentId],
    );

    let applicantId: string;
    const existingApplicant = existingApplicantResult.rows[0];

    if (existingApplicant) {
      const updatedApplicantResult = await client.query<{ id: string }>(
        `UPDATE applicants
         SET
           full_name = $2,
           department_id = $3,
           semester_id = $4,
           edu_email = LOWER($5),
           personal_email = LOWER($6),
           phone_number = $7,
           linkedin_url = $8
         WHERE id = $1
         RETURNING id`,
        [
          existingApplicant.id,
          input.fullName,
          input.departmentId,
          input.semesterId,
          input.eduEmail,
          input.personalEmail,
          input.phoneNumber,
          input.linkedinUrl,
        ],
      );

      applicantId = updatedApplicantResult.rows[0]?.id ?? existingApplicant.id;
    } else {
      const insertedApplicantResult = await client.query<{ id: string }>(
        `INSERT INTO applicants (
           full_name,
           department_id,
           student_id,
           semester_id,
           edu_email,
           personal_email,
           phone_number,
           linkedin_url
         )
         VALUES ($1, $2, $3, $4, LOWER($5), LOWER($6), $7, $8)
         RETURNING id`,
        [
          input.fullName,
          input.departmentId,
          input.studentId,
          input.semesterId,
          input.eduEmail,
          input.personalEmail,
          input.phoneNumber,
          input.linkedinUrl,
        ],
      );

      const insertedApplicant = insertedApplicantResult.rows[0];
      if (!insertedApplicant) {
        throw new AppError(500, 'APPLICANT_CREATE_FAILED', 'Could not create applicant.');
      }

      applicantId = insertedApplicant.id;
    }

    const existingApplication = await client.query<{ application_number: string }>(
      `SELECT application_number
       FROM applications
       WHERE applicant_id = $1 AND recruitment_cycle_id = $2`,
      [applicantId, cycle.id],
    );

    if (existingApplication.rows[0]) {
      throw new AppError(
        409,
        'ALREADY_APPLIED',
        `You have already submitted an application for this recruitment cycle. Application number: ${existingApplication.rows[0].application_number}`,
      );
    }

    const applicationResult = await client.query<{
      id: string;
      application_number: string;
      status: string;
      submitted_at: Date;
    }>(
      `INSERT INTO applications (
         applicant_id,
         recruitment_cycle_id,
         team_id
       )
       VALUES ($1, $2, $3)
       RETURNING id, application_number, status, submitted_at`,
      [applicantId, cycle.id, input.teamId],
    );

    const application = applicationResult.rows[0];
    if (!application) {
      throw new AppError(500, 'APPLICATION_CREATE_FAILED', 'Could not create application.');
    }

    for (const answer of input.answers) {
      await client.query(
        `INSERT INTO application_answers (
           application_id,
           question_id,
           answer_text,
           answer_json
         )
         VALUES ($1, $2, $3, $4::jsonb)`,
        [
          application.id,
          answer.questionId,
          answer.answerText?.trim() || null,
          answer.answerJson?.length ? JSON.stringify(answer.answerJson) : null,
        ],
      );
    }

    return {
      applicationNumber: application.application_number,
      status: application.status,
      submittedAt: application.submitted_at.toISOString(),
      applicantName: input.fullName,
      studentId: input.studentId,
      teamName: team.name,
      recruitmentCycle: cycle.title,
    };
  });
}

export async function getApplicationStatus(
  applicationNumber: string,
  studentId: string,
) {
  const result = await pool.query<{
    application_number: string;
    status: string;
    submitted_at: Date;
    updated_at: Date;
    full_name: string;
    student_id: string;
    team_name: string;
    recruitment_cycle: string;
  }>(
    `SELECT
       application_number,
       status,
       submitted_at,
       updated_at,
       full_name,
       student_id,
       team_name,
       recruitment_cycle
     FROM v_sub_ex_applications
     WHERE application_number = $1 AND student_id = $2`,
    [applicationNumber, studentId],
  );

  const application = result.rows[0];
  if (!application) {
    throw new AppError(
      404,
      'APPLICATION_NOT_FOUND',
      'No application matched that application number and Student ID.',
    );
  }

  return {
    applicationNumber: application.application_number,
    status: application.status,
    submittedAt: application.submitted_at.toISOString(),
    updatedAt: application.updated_at.toISOString(),
    applicantName: application.full_name,
    studentId: application.student_id,
    teamName: application.team_name,
    recruitmentCycle: application.recruitment_cycle,
  };
}
