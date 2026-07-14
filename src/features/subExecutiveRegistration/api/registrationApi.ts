import type {
  ApplicationFormData,
  ApplicationSubmissionResult,
  FormOptions,
  QuestionAnswer,
  ScreeningQuestion,
  Team,
} from '../types';

const configuredApiUrl =
  import.meta.env
    .VITE_SUB_EXECUTIVE_API_URL
    ?.trim();

const API_BASE_URL = (
  configuredApiUrl ||
  (
    import.meta.env.DEV
      ? 'http://localhost:5000/api'
      : ''
  )
).replace(/\/$/, '');

if (!API_BASE_URL) {
  throw new Error(
    'VITE_SUB_EXECUTIVE_API_URL is missing from the production environment.',
  );
}

interface ApiSuccess<T> {
  success: true;
  data: T;
}

interface ApiFailure {
  success: false;

  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

interface AnswerPayload {
  questionId: string;
  answerText: string | null;
  answerJson: string[] | null;
  otherText: string | null;
}

export class ApiError
  extends Error {
  constructor(
    message: string,

    public readonly code: string,

    public readonly status: number,

    public readonly details?: unknown,
  ) {
    super(message);

    this.name = 'ApiError';
  }
}

async function request<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  let response: Response;

  try {
    const isFormData =
      options?.body instanceof
      FormData;

    response = await fetch(
      `${API_BASE_URL}${path}`,
      {
        ...options,

        headers: {
          Accept:
            'application/json',

          ...(
            isFormData
              ? {}
              : {
                  'Content-Type':
                    'application/json',
                }
          ),

          ...options?.headers,
        },
      },
    );
  } catch {
    throw new ApiError(
      'Could not connect to the registration server. Confirm that the backend is running and the API URL is correct.',
      'NETWORK_ERROR',
      0,
    );
  }

  const payload = (
    await response
      .json()
      .catch(() => null)
  ) as
    | ApiSuccess<T>
    | ApiFailure
    | null;

  if (
    !response.ok ||
    !payload ||
    !payload.success
  ) {
    const failure =
      payload &&
      !payload.success
        ? payload.error
        : null;

    throw new ApiError(
      failure?.message ||
        'The request could not be completed.',

      failure?.code ||
        'REQUEST_FAILED',

      response.status,

      failure?.details,
    );
  }

  return payload.data;
}

export function getFormOptions():
  Promise<FormOptions> {
  return request<FormOptions>(
    '/form-options',
  );
}

export function getTeamQuestions(
  teamId: string,
): Promise<{
  team: Team;
  questions: ScreeningQuestion[];
}> {
  return request(
    `/teams/${encodeURIComponent(
      teamId,
    )}/questions`,
  );
}

function makeAnswerPayload(
  answers:
    Record<string, QuestionAnswer>,
): AnswerPayload[] {
  return Object
    .entries(answers)
    .filter(([, answer]) => {
      const hasValue =
        Array.isArray(answer.value)
          ? answer.value.length > 0
          : answer.value
              .trim()
              .length > 0;

      return (
        hasValue ||
        answer.otherText
          .trim()
          .length > 0
      );
    })
    .map(
      ([questionId, answer]) => ({
        questionId,

        answerText:
          Array.isArray(
            answer.value,
          )
            ? null
            : answer.value
                .trim() || null,

        answerJson:
          Array.isArray(
            answer.value,
          )
            ? answer.value
            : null,

        otherText:
          answer.otherText
            .trim() || null,
      }),
    );
}

export function submitApplication(
  form: ApplicationFormData,
  photo: File,

  firstTeamAnswers:
    Record<string, QuestionAnswer>,

  secondTeamAnswers:
    Record<string, QuestionAnswer>,
): Promise<ApplicationSubmissionResult> {
  const teamPreferences = [
    {
      teamId:
        form.firstTeamId,

      preferenceOrder: 1,

      answers:
        makeAnswerPayload(
          firstTeamAnswers,
        ),
    },
  ];

  if (form.secondTeamId) {
    teamPreferences.push({
      teamId:
        form.secondTeamId,

      preferenceOrder: 2,

      answers:
        makeAnswerPayload(
          secondTeamAnswers,
        ),
    });
  }

  const payload = {
    fullName:
      form.fullName.trim(),

    departmentId:
      Number(form.departmentId),

    studentId:
      form.studentId.trim(),

      austrcId:
  form.austrcId.trim(),
    semesterId:
      Number(form.semesterId),

    personalEmail:
      form.personalEmail.trim(),

    eduEmail:
      form.eduEmail.trim(),

    phoneNumber:
      form.phoneNumber.trim(),

    presentAddress:
      form.presentAddress.trim(),

    facebookUrl:
      form.facebookUrl.trim(),

    workedWithAustrcBefore:
      form.workedWithAustrcBefore ===
      'yes',

    previousWorkDescription:
      form.workedWithAustrcBefore ===
      'yes'
        ? form
            .previousWorkDescription
            .trim()
        : null,

    teamPreferences,
  };

  const body = new FormData();

  body.append(
    'payload',
    JSON.stringify(payload),
  );

  body.append(
    'photo',
    photo,
    photo.name,
  );

  return request<ApplicationSubmissionResult>(
    '/applications',
    {
      method: 'POST',
      body,
    },
  );
}