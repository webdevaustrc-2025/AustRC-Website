export type QuestionType =
  | 'short_text'
  | 'long_text'
  | 'single_choice'
  | 'multiple_choice'
  | 'yes_no'
  | 'number'
  | 'url';

export interface ScreeningQuestionRow {
  id: string;
  team_id: string;
  question_text: string;
  question_type: QuestionType;
  is_required: boolean;
  display_order: number;
  options: string[] | null;
}

export interface ApplicationAnswerInput {
  questionId: string;
  answerText?: string | null;
  answerJson?: string[] | null;
}

export interface CreateApplicationInput {
  fullName: string;
  departmentId: number;
  studentId: string;
  semesterId: number;
  teamId: string;
  eduEmail: string;
  personalEmail: string;
  phoneNumber: string;
  linkedinUrl?: string | null;
  answers: ApplicationAnswerInput[];
}
