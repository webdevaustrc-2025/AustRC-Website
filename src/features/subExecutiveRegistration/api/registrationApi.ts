import type {
  AnswerValue,
  ApplicationFormData,
  ApplicationSubmissionResult,
  FormOptions,
  ScreeningQuestion,
  Team,
} from '../types';

const API_BASE_URL = (
  import.meta.env.VITE_SUB_EXECUTIVE_API_URL || 'http://localhost:5000/api'
).replace(/\/$/, '');

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

export class ApiError extends Error {
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

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
  } catch {
    throw new ApiError(
      'Could not connect to the registration server. Confirm that the Node.js backend is running.',
      'NETWORK_ERROR',
      0,
    );
  }

  const payload = (await response.json().catch(() => null)) as
    | ApiSuccess<T>
    | ApiFailure
    | null;

  if (!response.ok || !payload || !payload.success) {
    const failure = payload && !payload.success ? payload.error : null;
    throw new ApiError(
      failure?.message || 'The request could not be completed.',
      failure?.code || 'REQUEST_FAILED',
      response.status,
      failure?.details,
    );
  }

  return payload.data;
}

export function getFormOptions(): Promise<FormOptions> {
  return request<FormOptions>('/form-options');
}

export function getTeamQuestions(
  teamId: string,
): Promise<{ team: Team; questions: ScreeningQuestion[] }> {
  return request(`/teams/${encodeURIComponent(teamId)}/questions`);
}

export function submitApplication(
  form: ApplicationFormData,
  answers: Record<string, AnswerValue>,
): Promise<ApplicationSubmissionResult> {
  const answerPayload = Object.entries(answers)
    .filter(([, value]) =>
      Array.isArray(value) ? value.length > 0 : Boolean(value.trim()),
    )
    .map(([questionId, value]) =>
      Array.isArray(value)
        ? { questionId, answerJson: value, answerText: null }
        : { questionId, answerText: value.trim(), answerJson: null },
    );

  return request<ApplicationSubmissionResult>('/applications', {
    method: 'POST',
    body: JSON.stringify({
      ...form,
      departmentId: Number(form.departmentId),
      semesterId: Number(form.semesterId),
      linkedinUrl: form.linkedinUrl.trim() || null,
      answers: answerPayload,
    }),
  });
}
