import type { Request, Response } from 'express';
import ExcelJS from 'exceljs';
import { z } from 'zod';
import { pool } from '../config/database';
import { AppError } from '../utils/AppError';

const applicationStatuses = [
  'draft',
  'submitted',
  'under_review',
  'shortlisted',
  'interview',
  'selected',
  'rejected',
  'withdrawn',
] as const;

const filtersSchema = z.object({
  search: z.string().trim().max(200).optional().default(''),
  status: z.enum(applicationStatuses).optional(),
  teamId: z.guid().optional(),
  departmentId: z.coerce.number().int().positive().optional(),
  semesterId: z.coerce.number().int().positive().optional(),
  page: z.coerce.number().int().positive().max(100000).default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});

const applicationIdSchema = z.object({
  id: z.guid(),
});

const updateApplicationSchema = z
  .object({
    status: z.enum(applicationStatuses).optional(),
    adminNotes: z.string().trim().max(5000).nullable().optional(),
  })
  .refine((value) => value.status !== undefined || value.adminNotes !== undefined, {
    message: 'Provide a status or admin note to update.',
  });

type ParsedFilters = z.infer<typeof filtersSchema>;

interface ApplicationListRow {
  application_id: string;
  application_number: string;
  status: string;
  submitted_at: Date | null;
  created_at: Date;
  updated_at: Date;
  full_name: string;
  student_id: string;
  austrc_id: string;
  department_code: string;
  department_name: string;
  semester: string;
  personal_email: string;
  edu_email: string;
  phone_number: string;
  present_address: string;
  facebook_url: string;
  photo_url: string;
  photo_public_id: string | null;
  photo_original_name: string | null;
  photo_format: string | null;
  photo_bytes: number | null;
  worked_with_austrc_before: boolean;
  previous_work_description: string | null;
  first_preference_team_id: string | null;
  first_preference_team: string | null;
  second_preference_team_id: string | null;
  second_preference_team: string | null;
  recruitment_cycle_id: string;
  recruitment_cycle: string;
  admin_notes: string | null;
}

interface AnswerRow {
  application_id: string;
  application_number: string;
  full_name: string;
  student_id: string;
  preference_order: number;
  team_id: string;
  team_name: string;
  question_id: string;
  question_code: string;
  display_order: number;
  question_text: string;
  question_type: string;
  is_required: boolean;
  answer_text: string | null;
  answer_json: string[] | null;
  other_text: string | null;
  answered_at: Date | null;
}

function parseFilters(query: Request['query']): ParsedFilters {
  const parsed = filtersSchema.safeParse(query);

  if (!parsed.success) {
    throw new AppError(400, 'INVALID_ADMIN_FILTERS', 'One or more filters are invalid.', z.flattenError(parsed.error));
  }

  return parsed.data;
}

function buildFilterClause(filters: ParsedFilters, startIndex = 1) {
  const clauses: string[] = [];
  const values: unknown[] = [];

  const addValue = (value: unknown) => {
    values.push(value);
    return `$${startIndex + values.length - 1}`;
  };

  if (filters.search) {
    const placeholder = addValue(`%${filters.search}%`);
    clauses.push(`(
      a.full_name ILIKE ${placeholder}
      OR a.student_id ILIKE ${placeholder}
      OR a.austrc_id ILIKE ${placeholder}
      OR a.application_number ILIKE ${placeholder}
      OR a.personal_email ILIKE ${placeholder}
      OR a.edu_email ILIKE ${placeholder}
      OR a.phone_number ILIKE ${placeholder}
    )`);
  }

  if (filters.status) {
    clauses.push(`a.status = ${addValue(filters.status)}`);
  }

  if (filters.departmentId) {
    clauses.push(`a.department_id = ${addValue(filters.departmentId)}`);
  }

  if (filters.semesterId) {
    clauses.push(`a.semester_id = ${addValue(filters.semesterId)}`);
  }

  if (filters.teamId) {
    const placeholder = addValue(filters.teamId);
    clauses.push(`EXISTS (
      SELECT 1
      FROM application_team_preferences filter_pref
      WHERE filter_pref.application_id = a.id
        AND filter_pref.team_id = ${placeholder}
    )`);
  }

  return {
    sql: clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '',
    values,
  };
}

function formatAnswer(row: Pick<AnswerRow, 'answer_text' | 'answer_json' | 'other_text'>): string {
  const baseValue = row.answer_json?.length
    ? row.answer_json.join(', ')
    : row.answer_text?.trim() ?? '';

  if (row.other_text?.trim()) {
    return baseValue ? `${baseValue} — Other: ${row.other_text.trim()}` : row.other_text.trim();
  }

  return baseValue;
}

function normalizeStatus(status: string): string {
  return status
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function formatApplication(row: ApplicationListRow) {
  return {
    id: row.application_id,
    applicationNumber: row.application_number,
    status: row.status,
    submittedAt: row.submitted_at?.toISOString() ?? null,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
    fullName: row.full_name,
    studentId: row.student_id,
    austrcId: row.austrc_id,
    departmentCode: row.department_code,
    departmentName: row.department_name,
    semester: row.semester,
    personalEmail: row.personal_email,
    eduEmail: row.edu_email,
    phoneNumber: row.phone_number,
    presentAddress: row.present_address,
    facebookUrl: row.facebook_url,
    photoUrl: row.photo_url,
    photoPublicId: row.photo_public_id,
    photoOriginalName: row.photo_original_name,
    photoFormat: row.photo_format,
    photoBytes: row.photo_bytes,
    workedWithAustrcBefore: row.worked_with_austrc_before,
    previousWorkDescription: row.previous_work_description,
    firstPreferenceTeamId: row.first_preference_team_id,
    firstPreferenceTeam: row.first_preference_team,
    secondPreferenceTeamId: row.second_preference_team_id,
    secondPreferenceTeam: row.second_preference_team,
    recruitmentCycleId: row.recruitment_cycle_id,
    recruitmentCycle: row.recruitment_cycle,
    adminNotes: row.admin_notes,
  };
}

export async function getAdminApplications(request: Request, response: Response) {
  const filters = parseFilters(request.query);
  const filter = buildFilterClause(filters);
  const offset = (filters.page - 1) * filters.pageSize;
  const limitPlaceholder = `$${filter.values.length + 1}`;
  const offsetPlaceholder = `$${filter.values.length + 2}`;

  const [applicationsResult, countResult, statusStatsResult, filterOptionsResult] = await Promise.all([
    pool.query<ApplicationListRow>(
      `SELECT v.*
       FROM v_sub_ex_applications v
       JOIN applications a ON a.id = v.application_id
       ${filter.sql}
       ORDER BY COALESCE(a.submitted_at, a.created_at) DESC, a.created_at DESC
       LIMIT ${limitPlaceholder}
       OFFSET ${offsetPlaceholder}`,
      [...filter.values, filters.pageSize, offset],
    ),
    pool.query<{ total: string }>(
      `SELECT COUNT(*)::text AS total
       FROM applications a
       ${filter.sql}`,
      filter.values,
    ),
    pool.query<{ status: string; count: string }>(
      `SELECT status, COUNT(*)::text AS count
       FROM applications
       GROUP BY status`,
    ),
    Promise.all([
      pool.query<{ id: string; name: string }>(
        `SELECT id, name FROM teams WHERE is_active = TRUE ORDER BY display_order`,
      ),
      pool.query<{ id: number; name: string }>(
        `SELECT id, name FROM departments WHERE is_active = TRUE ORDER BY display_order`,
      ),
      pool.query<{ id: number; name: string }>(
        `SELECT id, name FROM semesters WHERE is_active = TRUE ORDER BY display_order`,
      ),
    ]),
  ]);

  const total = Number(countResult.rows[0]?.total ?? 0);
  const statusCounts = Object.fromEntries(
    applicationStatuses.map((status) => [status, 0]),
  ) as Record<(typeof applicationStatuses)[number], number>;

  for (const row of statusStatsResult.rows) {
    if (row.status in statusCounts) {
      statusCounts[row.status as keyof typeof statusCounts] = Number(row.count);
    }
  }

  const [teamsResult, departmentsResult, semestersResult] = filterOptionsResult;

  response.json({
    success: true,
    data: {
      applications: applicationsResult.rows.map(formatApplication),
      pagination: {
        page: filters.page,
        pageSize: filters.pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / filters.pageSize)),
      },
      stats: {
        total: Object.values(statusCounts).reduce((sum, value) => sum + value, 0),
        submitted: statusCounts.submitted,
        underReview: statusCounts.under_review,
        shortlisted: statusCounts.shortlisted,
        interview: statusCounts.interview,
        selected: statusCounts.selected,
        rejected: statusCounts.rejected,
      },
      filters: {
        teams: teamsResult.rows,
        departments: departmentsResult.rows,
        semesters: semestersResult.rows,
        statuses: applicationStatuses,
      },
    },
  });
}

export async function getAdminApplicationById(request: Request, response: Response) {
  const params = applicationIdSchema.safeParse(request.params);

  if (!params.success) {
    throw new AppError(400, 'INVALID_APPLICATION_ID', 'The application ID is invalid.');
  }

  const applicationResult = await pool.query<ApplicationListRow>(
    `SELECT *
     FROM v_sub_ex_applications
     WHERE application_id = $1`,
    [params.data.id],
  );

  const application = applicationResult.rows[0];

  if (!application) {
    throw new AppError(404, 'APPLICATION_NOT_FOUND', 'The requested application was not found.');
  }

  const answersResult = await pool.query<AnswerRow>(
    `SELECT
       a.id AS application_id,
       a.application_number,
       a.full_name,
       a.student_id,
       pref.preference_order,
       t.id AS team_id,
       t.name AS team_name,
       q.id AS question_id,
       q.code AS question_code,
       q.display_order,
       q.question_text,
       q.question_type,
       q.is_required,
       ans.answer_text,
       ans.answer_json,
       ans.other_text,
       ans.created_at AS answered_at
     FROM application_team_preferences pref
     JOIN applications a ON a.id = pref.application_id
     JOIN teams t ON t.id = pref.team_id
     LEFT JOIN screening_questions q
       ON q.team_id = pref.team_id
      AND q.is_active = TRUE
     LEFT JOIN application_answers ans
       ON ans.application_team_preference_id = pref.id
      AND ans.question_id = q.id
     WHERE pref.application_id = $1
     ORDER BY pref.preference_order, q.display_order`,
    [params.data.id],
  );

  const preferences = [1, 2]
    .map((preferenceOrder) => {
      const preferenceRows = answersResult.rows.filter(
        (row) => row.preference_order === preferenceOrder,
      );
      const firstRow = preferenceRows[0];

      if (!firstRow) return null;

      return {
        preferenceOrder,
        teamId: firstRow.team_id,
        teamName: firstRow.team_name,
        answers: preferenceRows
          .filter((row) => row.question_id)
          .map((row) => ({
            questionId: row.question_id,
            questionCode: row.question_code,
            questionText: row.question_text,
            questionType: row.question_type,
            isRequired: row.is_required,
            displayOrder: row.display_order,
            answerText: row.answer_text,
            answerJson: row.answer_json,
            otherText: row.other_text,
            formattedAnswer: formatAnswer(row) || 'Not answered',
          })),
      };
    })
    .filter(Boolean);

  response.json({
    success: true,
    data: {
      application: formatApplication(application),
      preferences,
    },
  });
}

export async function updateAdminApplication(request: Request, response: Response) {
  const params = applicationIdSchema.safeParse(request.params);
  const body = updateApplicationSchema.safeParse(request.body);

  if (!params.success) {
    throw new AppError(400, 'INVALID_APPLICATION_ID', 'The application ID is invalid.');
  }

  if (!body.success) {
    throw new AppError(400, 'INVALID_APPLICATION_UPDATE', 'The application update is invalid.', z.flattenError(body.error));
  }

  const result = await pool.query<ApplicationListRow>(
    `UPDATE applications
     SET
       status = COALESCE($2, status),
       admin_notes = CASE WHEN $3::boolean THEN $4 ELSE admin_notes END
     WHERE id = $1
     RETURNING id`,
    [
      params.data.id,
      body.data.status ?? null,
      body.data.adminNotes !== undefined,
      body.data.adminNotes ?? null,
    ],
  );

  if (!result.rows[0]) {
    throw new AppError(404, 'APPLICATION_NOT_FOUND', 'The requested application was not found.');
  }

  const updatedResult = await pool.query<ApplicationListRow>(
    `SELECT * FROM v_sub_ex_applications WHERE application_id = $1`,
    [params.data.id],
  );

  response.json({
    success: true,
    data: formatApplication(updatedResult.rows[0]!),
  });
}

export async function exportRegistrations(request: Request, response: Response) {
  const filters = parseFilters({ ...request.query, page: '1', pageSize: '100' });
  const filter = buildFilterClause(filters);

  const applicationsResult = await pool.query<ApplicationListRow>(
    `SELECT v.*
     FROM v_sub_ex_applications v
     JOIN applications a ON a.id = v.application_id
     ${filter.sql}
     ORDER BY COALESCE(a.submitted_at, a.created_at) DESC, a.created_at DESC`,
    filter.values,
  );

  const applicationIds = applicationsResult.rows.map((row) => row.application_id);

  const answersResult = applicationIds.length
    ? await pool.query<AnswerRow>(
        `SELECT
           a.id AS application_id,
           a.application_number,
           a.full_name,
           a.student_id,
           pref.preference_order,
           t.id AS team_id,
           t.name AS team_name,
           q.id AS question_id,
           q.code AS question_code,
           q.display_order,
           q.question_text,
           q.question_type,
           q.is_required,
           ans.answer_text,
           ans.answer_json,
           ans.other_text,
           ans.created_at AS answered_at
         FROM applications a
         JOIN application_team_preferences pref ON pref.application_id = a.id
         JOIN teams t ON t.id = pref.team_id
         JOIN screening_questions q
           ON q.team_id = pref.team_id
          AND q.is_active = TRUE
         LEFT JOIN application_answers ans
           ON ans.application_team_preference_id = pref.id
          AND ans.question_id = q.id
         WHERE a.id = ANY($1::uuid[])
         ORDER BY a.created_at DESC, pref.preference_order, q.display_order`,
        [applicationIds],
      )
    : { rows: [] as AnswerRow[] };

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'AUST Robotics Club';
  workbook.created = new Date();

  const summarySheet = workbook.addWorksheet('Summary', {
    views: [{ showGridLines: false }],
  });
  const applicationsSheet = workbook.addWorksheet('Applications', {
    views: [{ state: 'frozen', ySplit: 1 }],
  });
  const answersSheet = workbook.addWorksheet('Detailed Answers', {
    views: [{ state: 'frozen', ySplit: 1 }],
  });

  const green = '2ECC71';
  const darkGreen = '178B4A';
  const softGreen = 'EAF9F0';
  const borderColor = 'D9E2DC';

  summarySheet.mergeCells('A1:D1');
  summarySheet.getCell('A1').value = 'AUST Robotics Club — Sub-Executive Registration Export';
  summarySheet.getCell('A1').font = { bold: true, size: 16, color: { argb: 'FFFFFFFF' } };
  summarySheet.getCell('A1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${darkGreen}` } };
  summarySheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };
  summarySheet.getRow(1).height = 32;
  summarySheet.addRow(['Generated At', new Date(), '', '']);
  summarySheet.addRow(['Total Exported Applications', applicationsResult.rows.length, '', '']);
  summarySheet.addRow([]);
  summarySheet.addRow(['Status', 'Count', 'First Preference Team', 'Count']);

  const statusMap = new Map<string, number>();
  const firstTeamMap = new Map<string, number>();
  for (const row of applicationsResult.rows) {
    statusMap.set(row.status, (statusMap.get(row.status) ?? 0) + 1);
    const firstTeam = row.first_preference_team ?? 'Not selected';
    firstTeamMap.set(firstTeam, (firstTeamMap.get(firstTeam) ?? 0) + 1);
  }

  const statusEntries = [...statusMap.entries()].sort((a, b) => b[1] - a[1]);
  const teamEntries = [...firstTeamMap.entries()].sort((a, b) => b[1] - a[1]);
  const summaryRows = Math.max(statusEntries.length, teamEntries.length);
  for (let index = 0; index < summaryRows; index += 1) {
    summarySheet.addRow([
      statusEntries[index] ? normalizeStatus(statusEntries[index]![0]) : '',
      statusEntries[index]?.[1] ?? '',
      teamEntries[index]?.[0] ?? '',
      teamEntries[index]?.[1] ?? '',
    ]);
  }
  summarySheet.columns = [
    { width: 24 },
    { width: 14 },
    { width: 46 },
    { width: 14 },
  ];

  const answerColumnMap = new Map<string, { key: string; header: string }>();
  for (const row of answersResult.rows) {
    const key = `p${row.preference_order}_${row.team_id}_${row.question_id}`;
    if (!answerColumnMap.has(key)) {
      answerColumnMap.set(key, {
        key,
        header: `${row.preference_order === 1 ? '1st' : '2nd'} Preference — ${row.team_name} — ${row.question_text}`,
      });
    }
  }

  const baseColumns: Partial<ExcelJS.Column>[] = [
    { header: 'Application Number', key: 'applicationNumber', width: 22 },
    { header: 'Status', key: 'status', width: 18 },
    { header: 'Submitted At', key: 'submittedAt', width: 22 },
    { header: 'Full Name', key: 'fullName', width: 28 },
    { header: 'Department', key: 'department', width: 18 },
    { header: 'Student ID', key: 'studentId', width: 18 },
    {
  header: 'AUSTRC ID',
  key: 'austrcId',
  width: 18,
},
    { header: 'Semester', key: 'semester', width: 12 },
    { header: 'Personal Email', key: 'personalEmail', width: 30 },
    { header: 'Educational Email', key: 'eduEmail', width: 30 },
    { header: 'Phone Number', key: 'phoneNumber', width: 19 },
    { header: 'Present Address', key: 'presentAddress', width: 42 },
    { header: 'Facebook Profile', key: 'facebookUrl', width: 38 },
    { header: 'Photo URL', key: 'photoUrl', width: 42 },
    { header: 'Photo Public ID', key: 'photoPublicId', width: 38 },
    { header: 'Worked with AUSTRC/ARC/RoboMania Before', key: 'workedBefore', width: 26 },
    { header: 'Previous Work Description', key: 'previousWorkDescription', width: 44 },
    { header: 'First Preference', key: 'firstPreference', width: 40 },
    { header: 'Second Preference', key: 'secondPreference', width: 40 },
    { header: 'Recruitment Cycle', key: 'recruitmentCycle', width: 34 },
    { header: 'Admin Notes', key: 'adminNotes', width: 44 },
  ];

  applicationsSheet.columns = [
    ...baseColumns,
    ...[...answerColumnMap.values()].map((column) => ({
      header: column.header,
      key: column.key,
      width: 48,
    })),
  ];

  const answersByApplication = new Map<string, Record<string, string>>();
  for (const row of answersResult.rows) {
    const values = answersByApplication.get(row.application_id) ?? {};
    values[`p${row.preference_order}_${row.team_id}_${row.question_id}`] = formatAnswer(row);
    answersByApplication.set(row.application_id, values);
  }

  for (const application of applicationsResult.rows) {
    const excelRow = applicationsSheet.addRow({
      applicationNumber: application.application_number,
      status: normalizeStatus(application.status),
      submittedAt: application.submitted_at ?? application.created_at,
      fullName: application.full_name,
      department: application.department_name,
      studentId: application.student_id,
      austrcId:application.austrc_id,
      semester: application.semester,
      personalEmail: application.personal_email,
      eduEmail: application.edu_email,
      phoneNumber: application.phone_number,
      presentAddress: application.present_address,
      facebookUrl: application.facebook_url,
      photoUrl: application.photo_url,
      photoPublicId: application.photo_public_id ?? '',
      workedBefore: application.worked_with_austrc_before ? 'Yes' : 'No',
      previousWorkDescription: application.previous_work_description ?? '',
      firstPreference: application.first_preference_team ?? '',
      secondPreference: application.second_preference_team ?? '',
      recruitmentCycle: application.recruitment_cycle,
      adminNotes: application.admin_notes ?? '',
      ...(answersByApplication.get(application.application_id) ?? {}),
    });

    excelRow.getCell('facebookUrl').value = {
      text: application.facebook_url,
      hyperlink: application.facebook_url,
    };
    excelRow.getCell('photoUrl').value = {
      text: application.photo_url,
      hyperlink: application.photo_url,
    };
    excelRow.getCell('submittedAt').numFmt = 'dd-mmm-yyyy hh:mm AM/PM';
  }

  answersSheet.columns = [
    { header: 'Application Number', key: 'applicationNumber', width: 22 },
    { header: 'Full Name', key: 'fullName', width: 28 },
    { header: 'Student ID', key: 'studentId', width: 18 },
    { header: 'Preference', key: 'preference', width: 14 },
    { header: 'Team', key: 'team', width: 42 },
    { header: 'Question Order', key: 'questionOrder', width: 14 },
    { header: 'Question', key: 'question', width: 58 },
    { header: 'Question Type', key: 'questionType', width: 20 },
    { header: 'Required', key: 'required', width: 12 },
    { header: 'Answer', key: 'answer', width: 58 },
    { header: 'Other Text', key: 'otherText', width: 36 },
  ];

  for (const answer of answersResult.rows) {
    answersSheet.addRow({
      applicationNumber: answer.application_number,
      fullName: answer.full_name,
      studentId: answer.student_id,
      preference: answer.preference_order === 1 ? 'First' : 'Second',
      team: answer.team_name,
      questionOrder: answer.display_order,
      question: answer.question_text,
      questionType: normalizeStatus(answer.question_type),
      required: answer.is_required ? 'Yes' : 'No',
      answer: formatAnswer(answer),
      otherText: answer.other_text ?? '',
    });
  }

  for (const sheet of [applicationsSheet, answersSheet]) {
    sheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: 1, column: sheet.columnCount },
    };
    sheet.getRow(1).height = 34;
    sheet.getRow(1).font = { bold: true, color: { argb: 'FF000000' } };
    sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${green}` } };
    sheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

    sheet.eachRow((row, rowNumber) => {
      row.alignment = { vertical: 'top', wrapText: true };
      if (rowNumber > 1 && rowNumber % 2 === 0) {
        row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${softGreen}` } };
      }
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin', color: { argb: `FF${borderColor}` } },
          left: { style: 'thin', color: { argb: `FF${borderColor}` } },
          bottom: { style: 'thin', color: { argb: `FF${borderColor}` } },
          right: { style: 'thin', color: { argb: `FF${borderColor}` } },
        };
      });
    });
  }

  const summaryHeader = summarySheet.getRow(5);
  summaryHeader.font = { bold: true };
  summaryHeader.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${green}` } };
  summarySheet.getCell('B2').numFmt = 'dd-mmm-yyyy hh:mm AM/PM';

  response.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  );
  response.setHeader(
    'Content-Disposition',
    `attachment; filename="austrc-sub-executive-applications-${new Date().toISOString().slice(0, 10)}.xlsx"`,
  );
  response.setHeader('Cache-Control', 'no-store');

  await workbook.xlsx.write(response);
  response.end();
}