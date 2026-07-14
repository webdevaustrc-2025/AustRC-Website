export type QuestionType =
  | 'short_text'
  | 'long_text'
  | 'single_choice'
  | 'multiple_choice'
  | 'yes_no'
  | 'url';

export interface SelectOption {
  id: number | string;
  name: string;
}

export interface Team
  extends SelectOption {
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
  helpText: string | null;
  questionType: QuestionType;
  isRequired: boolean;
  displayOrder: number;
  options: string[] | null;
  allowOther: boolean;
}

export type AnswerValue =
  | string
  | string[];

export interface QuestionAnswer {
  value: AnswerValue;
  otherText: string;
}

export interface ApplicationFormData {
  fullName: string;
  departmentId: string;
  studentId: string;
  austrcId: string;
  semesterId: string;

  personalEmail: string;
  eduEmail: string;
  phoneNumber: string;
  presentAddress: string;
  facebookUrl: string;

  workedWithAustrcBefore:
    | 'yes'
    | 'no'
    | '';

  previousWorkDescription: string;

  firstTeamId: string;
  secondTeamId: string;
}

export interface ApplicationSubmissionResult {
  applicationNumber: string;
  status: string;
  submittedAt: string;

  applicantName: string;
  studentId: string;

  firstPreferenceTeamName: string;

  secondPreferenceTeamName:
    | string
    | null;

  recruitmentCycle: string;
  photoUrl: string;
}