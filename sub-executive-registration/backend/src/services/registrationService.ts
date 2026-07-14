import type { PoolClient } from 'pg';

import {
  pool,
  withTransaction,
} from '../config/database';

import type {
  ApplicationAnswerInput,
  CreateApplicationInput,
  ScreeningQuestionRow,
  TeamPreferenceInput,
  UploadedApplicantPhoto,
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
  start_at: Date;
  end_at: Date;
}

interface TeamNameRow {
  id: string;
  name: string;
}

export async function getFormOptions() {
  const [
    departmentsResult,
    semestersResult,
    teamsResult,
    cycleResult,
  ] = await Promise.all([
    pool.query<IdNameRow>(
      `SELECT id, name
       FROM departments
       WHERE is_active = TRUE
       ORDER BY display_order`,
    ),

    pool.query<IdNameRow>(
      `SELECT id, name
       FROM semesters
       WHERE is_active = TRUE
       ORDER BY display_order`,
    ),

    pool.query<TeamRow>(
      `SELECT
         id,
         name,
         slug,
         description
       FROM teams
       WHERE is_active = TRUE
       ORDER BY display_order`,
    ),

    pool.query<RecruitmentCycleRow>(
      `SELECT
         id,
         title,
         start_at,
         end_at
       FROM recruitment_cycles
       WHERE is_active = TRUE
         AND NOW() BETWEEN start_at AND end_at
       LIMIT 1`,
    ),
  ]);

  const activeCycle =
    cycleResult.rows[0] ?? null;

  return {
    departments: departmentsResult.rows,
    semesters: semestersResult.rows,
    teams: teamsResult.rows,

    activeCycle: activeCycle
      ? {
          id: activeCycle.id,
          title: activeCycle.title,
          startAt:
            activeCycle.start_at.toISOString(),
          endAt:
            activeCycle.end_at.toISOString(),
        }
      : null,
  };
}

export async function getTeamQuestions(
  teamId: string,
) {
  const teamResult =
    await pool.query<TeamRow>(
      `SELECT
         id,
         name,
         slug,
         description
       FROM teams
       WHERE id = $1
         AND is_active = TRUE`,
      [teamId],
    );

  const team = teamResult.rows[0];

  if (!team) {
    throw new AppError(
      404,
      'TEAM_NOT_FOUND',
      'The selected team does not exist.',
    );
  }

  const questionsResult =
    await pool.query<ScreeningQuestionRow>(
      `SELECT
         id,
         team_id,
         question_text,
         help_text,
         question_type,
         is_required,
         display_order,
         options,
         allow_other
       FROM screening_questions
       WHERE team_id = $1
         AND is_active = TRUE
       ORDER BY display_order`,
      [teamId],
    );

  return {
    team,

    questions: questionsResult.rows.map(
      (question) => ({
        id: question.id,
        teamId: question.team_id,
        questionText:
          question.question_text,
        helpText: question.help_text,
        questionType:
          question.question_type,
        isRequired:
          question.is_required,
        displayOrder:
          question.display_order,
        options: question.options,
        allowOther:
          question.allow_other,
      }),
    ),
  };
}

function answerHasValue(
  answer:
    | ApplicationAnswerInput
    | undefined,
): boolean {
  return Boolean(
    answer?.answerText?.trim() ||
      answer?.answerJson?.length ||
      answer?.otherText?.trim(),
  );
}

function validatePreferenceAnswers(
  preference: TeamPreferenceInput,
  questions: ScreeningQuestionRow[],
): void {
  const questionById = new Map(
    questions.map((question) => [
      question.id,
      question,
    ]),
  );

  const answerByQuestionId =
    new Map<string, ApplicationAnswerInput>();

  for (const answer of preference.answers) {
    if (
      answerByQuestionId.has(
        answer.questionId,
      )
    ) {
      throw new AppError(
        400,
        'DUPLICATE_ANSWER',
        'The same screening question was answered more than once.',
      );
    }

    if (
      !questionById.has(
        answer.questionId,
      )
    ) {
      throw new AppError(
        400,
        'INVALID_QUESTION',
        'One submitted question does not belong to its selected team.',
      );
    }

    answerByQuestionId.set(
      answer.questionId,
      answer,
    );
  }

  const missingRequiredQuestions =
    questions
      .filter(
        (question) =>
          question.is_required &&
          !answerHasValue(
            answerByQuestionId.get(
              question.id,
            ),
          ),
      )
      .map((question) => ({
        questionId: question.id,
        questionText:
          question.question_text,
        preferenceOrder:
          preference.preferenceOrder,
      }));

  if (
    missingRequiredQuestions.length > 0
  ) {
    throw new AppError(
      400,
      'REQUIRED_ANSWERS_MISSING',
      `Please answer all required questions for team preference ${preference.preferenceOrder}.`,
      missingRequiredQuestions,
    );
  }

  for (
    const [questionId, answer]
    of answerByQuestionId
  ) {
    const question =
      questionById.get(questionId);

    if (!question) continue;

    const answerText =
      answer.answerText?.trim() || null;

    const answerJson =
      answer.answerJson ?? null;

    const otherText =
      answer.otherText?.trim() || null;

    if (
      question.question_type ===
      'multiple_choice'
    ) {
      if (!answerJson?.length) {
        throw new AppError(
          400,
          'INVALID_MULTIPLE_CHOICE_ANSWER',
          `Select at least one option for: ${question.question_text}`,
        );
      }

      const invalidSelection =
        answerJson.some(
          (value) =>
            !question.options?.includes(
              value,
            ),
        );

      if (invalidSelection) {
        throw new AppError(
          400,
          'INVALID_CHOICE',
          `An invalid option was selected for: ${question.question_text}`,
        );
      }

      const selectedOther =
        answerJson.includes('Other');

      if (
        selectedOther &&
        question.allow_other &&
        !otherText
      ) {
        throw new AppError(
          400,
          'OTHER_TEXT_REQUIRED',
          `Write the Other value for: ${question.question_text}`,
        );
      }

      if (
        !selectedOther &&
        otherText
      ) {
        throw new AppError(
          400,
          'UNEXPECTED_OTHER_TEXT',
          `Other text was provided without selecting Other for: ${question.question_text}`,
        );
      }

      continue;
    }

    if (!answerText) {
      throw new AppError(
        400,
        'INVALID_TEXT_ANSWER',
        `An answer is required for: ${question.question_text}`,
      );
    }

    if (
      question.question_type ===
      'single_choice'
    ) {
      if (
        !question.options?.includes(
          answerText,
        )
      ) {
        throw new AppError(
          400,
          'INVALID_CHOICE',
          `An invalid option was selected for: ${question.question_text}`,
        );
      }

      const selectedOther =
        answerText === 'Other';

      if (
        selectedOther &&
        question.allow_other &&
        !otherText
      ) {
        throw new AppError(
          400,
          'OTHER_TEXT_REQUIRED',
          `Write the Other value for: ${question.question_text}`,
        );
      }

      if (
        !selectedOther &&
        otherText
      ) {
        throw new AppError(
          400,
          'UNEXPECTED_OTHER_TEXT',
          `Other text was provided without selecting Other for: ${question.question_text}`,
        );
      }
    }

    if (
      question.question_type ===
        'yes_no' &&
      !['Yes', 'No'].includes(
        answerText,
      )
    ) {
      throw new AppError(
        400,
        'INVALID_YES_NO_ANSWER',
        `Choose Yes or No for: ${question.question_text}`,
      );
    }

    if (
      question.question_type === 'url'
    ) {
      try {
        const parsedUrl =
          new URL(answerText);

        if (
          !['http:', 'https:'].includes(
            parsedUrl.protocol,
          )
        ) {
          throw new Error(
            'Unsupported protocol',
          );
        }
      } catch {
        throw new AppError(
          400,
          'INVALID_URL_ANSWER',
          `Enter a valid URL for: ${question.question_text}`,
        );
      }
    }
  }
}

async function getActiveCycle(
  client: PoolClient,
): Promise<RecruitmentCycleRow> {
  const result =
    await client.query<RecruitmentCycleRow>(
      `SELECT
         id,
         title,
         start_at,
         end_at
       FROM recruitment_cycles
       WHERE is_active = TRUE
         AND NOW() BETWEEN start_at AND end_at
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

async function ensureAcademicOptionsExist(
  client: PoolClient,
  departmentId: number,
  semesterId: number,
): Promise<void> {
  const result =
    await client.query<{
      valid: boolean;
    }>(
      `SELECT EXISTS (
         SELECT 1
         FROM departments d,
              semesters s
         WHERE d.id = $1
           AND d.is_active = TRUE
           AND s.id = $2
           AND s.is_active = TRUE
       ) AS valid`,
      [
        departmentId,
        semesterId,
      ],
    );

  if (!result.rows[0]?.valid) {
    throw new AppError(
      400,
      'INVALID_ACADEMIC_OPTION',
      'The selected department or semester is invalid.',
    );
  }
}

export async function createApplication(
  input: CreateApplicationInput,
  photo: UploadedApplicantPhoto,
) {
  return withTransaction(
    async (client) => {
      const cycle =
        await getActiveCycle(client);

      await ensureAcademicOptionsExist(
        client,
        input.departmentId,
        input.semesterId,
      );

      const teamIds =
        input.teamPreferences.map(
          (preference) =>
            preference.teamId,
        );

      const teamsResult =
        await client.query<TeamNameRow>(
          `SELECT id, name
           FROM teams
           WHERE id = ANY($1::uuid[])
             AND is_active = TRUE
           FOR SHARE`,
          [teamIds],
        );

      const teamById = new Map(
        teamsResult.rows.map(
          (team) => [
            team.id,
            team,
          ],
        ),
      );

      if (
        teamById.size !==
        teamIds.length
      ) {
        throw new AppError(
          404,
          'TEAM_NOT_FOUND',
          'One of the selected teams does not exist or is inactive.',
        );
      }

      for (
        const preference
        of input.teamPreferences
      ) {
        const questionsResult =
          await client.query<ScreeningQuestionRow>(
            `SELECT
               id,
               team_id,
               question_text,
               help_text,
               question_type,
               is_required,
               display_order,
               options,
               allow_other
             FROM screening_questions
             WHERE team_id = $1
               AND is_active = TRUE
             ORDER BY display_order
             FOR SHARE`,
            [preference.teamId],
          );

        validatePreferenceAnswers(
          preference,
          questionsResult.rows,
        );
      }

const duplicateResult =
  await client.query<{
    application_number: string;
  }>(
    `SELECT application_number
     FROM applications
     WHERE recruitment_cycle_id = $1
       AND (
         student_id = $2

         OR LOWER(edu_email) =
            LOWER($3)

         OR LOWER(personal_email) =
            LOWER($4)

         OR (
           UPPER(BTRIM($5::text)) <> 'N/A'

           AND LOWER(BTRIM(austrc_id)) =
               LOWER(BTRIM($5::text))
         )
       )
     LIMIT 1`,
    [
      cycle.id,
      input.studentId,
      input.eduEmail,
      input.personalEmail,
      input.austrcId,
    ],
  );

      if (duplicateResult.rows[0]) {
        throw new AppError(
          409,
          'ALREADY_APPLIED',
          `An application already exists with the same Student ID, AUSTRC ID or email for this recruitment cycle. Application number: ${duplicateResult.rows[0].application_number}`,
        );
      }

const applicationResult =
  await client.query<{
    id: string;
    application_number: string;
  }>(
    `INSERT INTO applications (
       recruitment_cycle_id,
       full_name,
       department_id,
       student_id,
       austrc_id,
       semester_id,
       personal_email,
       edu_email,
       phone_number,
       present_address,
       facebook_url,
       photo_url,
       photo_public_id,
       photo_original_name,
       photo_format,
       photo_bytes,
       worked_with_austrc_before,
       previous_work_description,
       status
     )
     VALUES (
       $1,
       $2,
       $3,
       $4,
       $5,
       $6,
       LOWER($7),
       LOWER($8),
       $9,
       $10,
       $11,
       $12,
       $13,
       $14,
       $15,
       $16,
       $17,
       $18,
       'draft'
     )
     RETURNING
       id,
       application_number`,
    [
      cycle.id,
      input.fullName,
      input.departmentId,
      input.studentId,
      input.austrcId,
      input.semesterId,
      input.personalEmail,
      input.eduEmail,
      input.phoneNumber,
      input.presentAddress,
      input.facebookUrl,
      photo.url,
      photo.publicId,
      photo.originalName,
      photo.format,
      photo.bytes,
      input.workedWithAustrcBefore,

      input.workedWithAustrcBefore
        ? input
            .previousWorkDescription
            ?.trim() || null
        : null,
    ],
  );

      const application =
        applicationResult.rows[0];

      if (!application) {
        throw new AppError(
          500,
          'APPLICATION_CREATE_FAILED',
          'Could not create the application.',
        );
      }

      for (
        const preference
        of [...input.teamPreferences]
          .sort(
            (left, right) =>
              left.preferenceOrder -
              right.preferenceOrder,
          )
      ) {
        const preferenceResult =
          await client.query<{
            id: string;
          }>(
            `INSERT INTO
               application_team_preferences (
                 application_id,
                 team_id,
                 preference_order
               )
             VALUES ($1, $2, $3)
             RETURNING id`,
            [
              application.id,
              preference.teamId,
              preference.preferenceOrder,
            ],
          );

        const savedPreference =
          preferenceResult.rows[0];

        if (!savedPreference) {
          throw new AppError(
            500,
            'PREFERENCE_CREATE_FAILED',
            'Could not save a selected team preference.',
          );
        }

        for (
          const answer
          of preference.answers
        ) {
          await client.query(
            `INSERT INTO
               application_answers (
                 application_team_preference_id,
                 question_id,
                 answer_text,
                 answer_json,
                 other_text
               )
             VALUES (
               $1,
               $2,
               $3,
               $4::jsonb,
               $5
             )`,
            [
              savedPreference.id,
              answer.questionId,
              answer.answerText?.trim() ||
                null,
              answer.answerJson?.length
                ? JSON.stringify(
                    answer.answerJson,
                  )
                : null,
              answer.otherText?.trim() ||
                null,
            ],
          );
        }
      }

      const submittedResult =
        await client.query<{
          status: string;
          submitted_at: Date;
        }>(
          `UPDATE applications
           SET
             status = 'submitted',
             submitted_at = NOW()
           WHERE id = $1
           RETURNING
             status,
             submitted_at`,
          [application.id],
        );

      const submittedApplication =
        submittedResult.rows[0];

      if (!submittedApplication) {
        throw new AppError(
          500,
          'APPLICATION_SUBMIT_FAILED',
          'The application was saved but could not be submitted.',
        );
      }

      const firstPreference =
        input.teamPreferences.find(
          (preference) =>
            preference.preferenceOrder ===
            1,
        );

      const secondPreference =
        input.teamPreferences.find(
          (preference) =>
            preference.preferenceOrder ===
            2,
        );

      return {
        applicationNumber:
          application.application_number,

        status:
          submittedApplication.status,

        submittedAt:
          submittedApplication
            .submitted_at
            .toISOString(),

        applicantName:
          input.fullName,

        studentId:
          input.studentId,

        firstPreferenceTeamName:
          firstPreference
            ? teamById.get(
                firstPreference.teamId,
              )?.name ?? ''
            : '',

        secondPreferenceTeamName:
          secondPreference
            ? teamById.get(
                secondPreference.teamId,
              )?.name ?? null
            : null,

        recruitmentCycle:
          cycle.title,

        photoUrl:
          photo.url,
      };
    },
  );
}

export async function getApplicationStatus(
  applicationNumber: string,
  studentId: string,
) {
  const result =
    await pool.query<{
      application_number: string;
      status: string;
      submitted_at: Date | null;
      updated_at: Date;
      full_name: string;
      student_id: string;
      first_preference_team:
        | string
        | null;
      second_preference_team:
        | string
        | null;
      recruitment_cycle: string;
      photo_url: string;
    }>(
      `SELECT
         application_number,
         status,
         submitted_at,
         updated_at,
         full_name,
         student_id,
         first_preference_team,
         second_preference_team,
         recruitment_cycle,
         photo_url
       FROM v_sub_ex_applications
       WHERE application_number = $1
         AND student_id = $2`,
      [
        applicationNumber,
        studentId,
      ],
    );

  const application =
    result.rows[0];

  if (!application) {
    throw new AppError(
      404,
      'APPLICATION_NOT_FOUND',
      'No application matched that application number and Student ID.',
    );
  }

  return {
    applicationNumber:
      application.application_number,

    status:
      application.status,

    submittedAt:
      application.submitted_at
        ?.toISOString() ?? null,

    updatedAt:
      application.updated_at
        .toISOString(),

    applicantName:
      application.full_name,

    studentId:
      application.student_id,

    firstPreferenceTeamName:
      application
        .first_preference_team,

    secondPreferenceTeamName:
      application
        .second_preference_team,

    recruitmentCycle:
      application
        .recruitment_cycle,

    photoUrl:
      application.photo_url,
  };
}