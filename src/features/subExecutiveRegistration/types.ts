export type QuestionType =
  | 'short_text'
  | 'long_text'
  | 'single_choice'
  | 'multiple_choice'
  | 'yes_no'
  | 'number'
  | 'url';

export interface SelectOption {
  id: number | string;
  name: string;
}

export interface Team extends SelectOption {
  id: string;
  slug: string;
  description: string | null;
}

export interface ActiveCycle {
  id: string;
  title: string;
  startAt: string | null;
  endAt: string | null;
}

export interface FormOptions {
  departments: SelectOption[];
  semesters: SelectOption[];
  teams: Team[];
  activeCycle: ActiveCycle | null;
}

export interface ScreeningQuestion {
  id: string;
  teamId: string;
  questionText: string;
  questionType: QuestionType;
  isRequired: boolean;
  displayOrder: number;
  options: string[] | null;
}

export type AnswerValue = string | string[];

export interface ApplicationFormData {
  fullName: string;
  departmentId: string;
  studentId: string;
  semesterId: string;
  teamId: string;
  eduEmail: string;
  personalEmail: string;
  phoneNumber: string;
  linkedinUrl: string;
}

export interface ApplicationSubmissionResult {
  applicationNumber: string;
  status: string;
  submittedAt: string;
  applicantName: string;
  studentId: string;
  teamName: string;
  recruitmentCycle: string;
}
