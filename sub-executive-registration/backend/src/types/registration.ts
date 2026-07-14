export type QuestionType =
  | 'short_text'
  | 'long_text'
  | 'single_choice'
  | 'multiple_choice'
  | 'yes_no'
  | 'url';

export interface ScreeningQuestionRow {
  id: string;
  team_id: string;
  question_text: string;
  help_text: string | null;
  question_type: QuestionType;
  is_required: boolean;
  display_order: number;
  options: string[] | null;
  allow_other: boolean;
}

export interface ApplicationAnswerInput {
  questionId: string;
  answerText?: string | null;
  answerJson?: string[] | null;
  otherText?: string | null;
}

export interface TeamPreferenceInput {
  teamId: string;
  preferenceOrder: 1 | 2;
  answers: ApplicationAnswerInput[];
}

export interface CreateApplicationInput {
  fullName: string;
  departmentId: number;
  studentId: string;
  austrcId: string;
  semesterId: number;

  personalEmail: string;
  eduEmail: string;
  phoneNumber: string;
  presentAddress: string;
  facebookUrl: string;

  workedWithAustrcBefore: boolean;
  previousWorkDescription?: string | null;

  teamPreferences: TeamPreferenceInput[];
}

export interface UploadedApplicantPhoto {
  url: string;
  publicId: string;
  originalName: string;
  format: string;
  bytes: number;
}