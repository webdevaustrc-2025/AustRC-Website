import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ChangeEvent,
  type FormEvent,
} from 'react';
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  ClipboardCheck,
  ImagePlus,
  LoaderCircle,
  Send,
  Users,
} from 'lucide-react';
import { useTokens } from '@/tokens/useTokens';
import {
  ApiError,
  getFormOptions,
  getTeamQuestions,
  submitApplication,
} from './api/registrationApi';
import { QuestionField } from './components/QuestionField';
import type {
  ApplicationFormData,
  ApplicationSubmissionResult,
  FormOptions,
  QuestionAnswer,
  ScreeningQuestion,
} from './types';
import './subExecutiveRegistration.css';

const MAX_PHOTO_BYTES = 4 * 1024 * 1024;
const ALLOWED_PHOTO_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
]);
const STRICT_EMAIL_PATTERN =
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

const AUST_EMAIL_PATTERN =
  /^[A-Z0-9._%+-]+@aust\.edu$/i;
const initialForm: ApplicationFormData = {
  fullName: '',
  departmentId: '',
  studentId: '',
  austrcId: '',
  semesterId: '',
  personalEmail: '',
  eduEmail: '',
  phoneNumber: '',
  presentAddress: '',
  facebookUrl: '',
  workedWithAustrcBefore: '',
  previousWorkDescription: '',
  firstTeamId: '',
  secondTeamId: '',
};

function formatDate(value: string | null): string {
  if (!value) return 'Not specified';

  return new Intl.DateTimeFormat('en-BD', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Dhaka',
  }).format(new Date(value));
}

function hasAnswerValue(answer: QuestionAnswer | undefined): boolean {
  if (!answer) return false;
  return Array.isArray(answer.value)
    ? answer.value.length > 0
    : answer.value.trim().length > 0;
}

function validateTeamAnswers(
  label: string,
  questions: ScreeningQuestion[],
  answers: Record<string, QuestionAnswer>,
): string | null {
  for (const question of questions) {
    const answer = answers[question.id];

    if (question.isRequired && !hasAnswerValue(answer)) {
      return `${label}: please answer “${question.questionText}”`;
    }

    const selectedOther = Array.isArray(answer?.value)
      ? answer.value.includes('Other')
      : answer?.value === 'Other';

    if (
      selectedOther &&
      question.allowOther &&
      !answer?.otherText.trim()
    ) {
      return `${label}: please specify the Other value for “${question.questionText}”`;
    }
  }

  return null;
}

export function SubExecutiveRegistrationPage() {
  const t = useTokens();
  const [options, setOptions] = useState<FormOptions | null>(null);
  const [form, setForm] = useState<ApplicationFormData>(initialForm);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState('');

  const [firstQuestions, setFirstQuestions] = useState<ScreeningQuestion[]>([]);
  const [secondQuestions, setSecondQuestions] = useState<ScreeningQuestion[]>([]);
  const [firstAnswers, setFirstAnswers] = useState<
    Record<string, QuestionAnswer>
  >({});
  const [secondAnswers, setSecondAnswers] = useState<
    Record<string, QuestionAnswer>
  >({});

  const [loadingOptions, setLoadingOptions] = useState(true);
  const [loadingFirstQuestions, setLoadingFirstQuestions] = useState(false);
  const [loadingSecondQuestions, setLoadingSecondQuestions] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] =
    useState<ApplicationSubmissionResult | null>(null);

  const themeVariables = {
    '--subex-page-bg': t.pageBg,
    '--subex-page-alt': t.pageBgAlt,
    '--subex-surface': t.surfaceCard,
    '--subex-surface-hover': t.surfaceCardHover,
    '--subex-text-primary': t.textPrimary,
    '--subex-text-secondary': t.textSecondary,
    '--subex-text-muted': t.textMutedMid,
    '--subex-border': t.borderDefault,
    '--subex-border-brand': t.borderBrand,
    '--subex-brand': t.brandGreen,
    '--subex-brand-dark': t.brandGreenDark,
  } as CSSProperties;

  useEffect(() => {
    let cancelled = false;

    async function loadOptions() {
      try {
        setLoadingOptions(true);
        const data = await getFormOptions();
        if (!cancelled) setOptions(data);
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Could not load the registration form.',
          );
        }
      } finally {
        if (!cancelled) setLoadingOptions(false);
      }
    }

    void loadOptions();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!photo) {
      setPhotoPreview('');
      return;
    }

    const objectUrl = URL.createObjectURL(photo);
    setPhotoPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);

  const selectedFirstTeam = useMemo(
    () =>
      options?.teams.find((team) => team.id === form.firstTeamId) ?? null,
    [form.firstTeamId, options],
  );

  const selectedSecondTeam = useMemo(
    () =>
      options?.teams.find((team) => team.id === form.secondTeamId) ?? null,
    [form.secondTeamId, options],
  );

  function updateFormField(
    field: keyof ApplicationFormData,
    value: string,
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function loadFirstTeamQuestions(teamId: string) {
    setFirstQuestions([]);
    setFirstAnswers({});

    if (!teamId) return;

    try {
      setLoadingFirstQuestions(true);
      const data = await getTeamQuestions(teamId);
      setFirstQuestions(data.questions);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Could not load first-preference questions.',
      );
    } finally {
      setLoadingFirstQuestions(false);
    }
  }

  async function loadSecondTeamQuestions(teamId: string) {
    setSecondQuestions([]);
    setSecondAnswers({});

    if (!teamId) return;

    try {
      setLoadingSecondQuestions(true);
      const data = await getTeamQuestions(teamId);
      setSecondQuestions(data.questions);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Could not load second-preference questions.',
      );
    } finally {
      setLoadingSecondQuestions(false);
    }
  }

  async function handleFirstTeamChange(teamId: string) {
    setError('');

    setForm((current) => ({
      ...current,
      firstTeamId: teamId,
      secondTeamId:
        teamId && current.secondTeamId === teamId
          ? ''
          : current.secondTeamId,
    }));

    if (teamId && form.secondTeamId === teamId) {
      setSecondQuestions([]);
      setSecondAnswers({});
    }

    await loadFirstTeamQuestions(teamId);
  }

  async function handleSecondTeamChange(teamId: string) {
    setError('');

    if (teamId && teamId === form.firstTeamId) {
      setError('The second preference must be different from the first preference.');
      return;
    }

    setForm((current) => ({ ...current, secondTeamId: teamId }));
    await loadSecondTeamQuestions(teamId);
  }

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0] ?? null;
    setError('');

    if (!selectedFile) {
      setPhoto(null);
      return;
    }

    if (!ALLOWED_PHOTO_TYPES.has(selectedFile.type)) {
      event.target.value = '';
      setPhoto(null);
      setError('Attach only a PNG, JPG or JPEG image.');
      return;
    }

    if (selectedFile.size > MAX_PHOTO_BYTES) {
      event.target.value = '';
      setPhoto(null);
      setError('The applicant photo cannot be larger than 4 MB.');
      return;
    }

    setPhoto(selectedFile);
  }

function validateForm(): string | null {
  const personalEmail =
    form.personalEmail.trim();

  const eduEmail =
    form.eduEmail.trim();

  if (
    !STRICT_EMAIL_PATTERN.test(
      personalEmail,
    )
  ) {
    return 'Enter a valid personal email address, for example yourname@gmail.com.';
  }

  if (
    !AUST_EMAIL_PATTERN.test(
      eduEmail,
    )
  ) {
    return 'Educational email must be a valid @aust.edu email address.';
  }
  if (!form.austrcId.trim()) {
    return 'Enter your AUSTRC ID. If you do not have one, write N/A.';
  }
  if (!photo) {
    return 'Please attach your applicant photo.';
  }

  if (!form.firstTeamId) {
    return 'Please select your first team preference.';
  }

  if (
    form.secondTeamId &&
    form.firstTeamId ===
      form.secondTeamId
  ) {
    return 'First and second team preferences must be different.';
  }

  if (!form.workedWithAustrcBefore) {
    return 'Please select whether you worked with AUSTRC, ARC or RoboMania before.';
  }

  if (
    form.workedWithAustrcBefore ===
      'yes' &&
    !form.previousWorkDescription.trim()
  ) {
    return 'Please describe your previous AUSTRC, ARC or RoboMania work.';
  }

  return (
    validateTeamAnswers(
      'First preference',
      firstQuestions,
      firstAnswers,
    ) ||
    (form.secondTeamId
      ? validateTeamAnswers(
          'Second preference',
          secondQuestions,
          secondAnswers,
        )
      : null)
  );
}

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!photo) return;

    try {
      setSubmitting(true);
      const submissionResult = await submitApplication(
        form,
        photo,
        firstAnswers,
        secondAnswers,
      );
      setResult(submissionResult);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (submitError) {
      setError(
        submitError instanceof ApiError || submitError instanceof Error
          ? submitError.message
          : 'Your application could not be submitted.',
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSubmitting(false);
    }
  }

  function resetApplication() {
    setForm(initialForm);
    setPhoto(null);
    setFirstQuestions([]);
    setSecondQuestions([]);
    setFirstAnswers({});
    setSecondAnswers({});
    setResult(null);
    setError('');
  }

  const loadingAnyQuestions =
    loadingFirstQuestions || loadingSecondQuestions;

  return (
    <div className="subex-page" style={themeVariables}>
      <div className="subex-ambient subex-ambient-one" />
      <div className="subex-ambient subex-ambient-two" />

      <div className="subex-container">
        <section className="subex-hero">
          <div className="subex-eyebrow">
            <span className="subex-live-dot" />
            {options?.activeCycle?.title || 'Sub-Executive Recruitment'}
          </div>
          <h1>
            Build, innovate and grow with <span>AUSTRC</span>
          </h1>
          <p>
            Submit your real academic information, upload your photo and choose
            a first and optional second team preference. Only the questions for
            your selected teams will appear.
          </p>

        </section>

        {result ? (
          <section className="subex-success-card">
            <div className="subex-success-icon">
              <CheckCircle2 size={48} />
            </div>
            <p className="subex-section-kicker">Application submitted</p>
            <h2>Thank you, {result.applicantName}!</h2>
            <p className="subex-success-message">
              Your first preference is{' '}
              <strong>{result.firstPreferenceTeamName}</strong>
              {result.secondPreferenceTeamName && (
                <>
                  {' '}and your second preference is{' '}
                  <strong>{result.secondPreferenceTeamName}</strong>
                </>
              )}
              .
            </p>

            <div className="subex-application-number">
              <span>Your application number</span>
              <strong>{result.applicationNumber}</strong>
              <small>Save this number for future status checking.</small>
            </div>

            <div className="subex-success-details">
              <div>
                <span>Student ID</span>
                <strong>{result.studentId}</strong>
              </div>
              <div>
                <span>Status</span>
                <strong>{result.status.replaceAll('_', ' ')}</strong>
              </div>
              <div>
                <span>Recruitment</span>
                <strong>{result.recruitmentCycle}</strong>
              </div>
              <div>
                <span>Submitted</span>
                <strong>{formatDate(result.submittedAt)}</strong>
              </div>
            </div>

            <button
              className="subex-primary-button"
              type="button"
              onClick={resetApplication}
            >
              Submit another application
            </button>
          </section>
        ) : (
          <section className="subex-form-layout">
            <aside className="subex-info-panel">
              <div className="subex-info-card subex-sticky-card">
                <p className="subex-section-kicker">Before you begin</p>
                <h2>Application information</h2>
                <ul className="subex-check-list">
                  <li>
                    <ClipboardCheck size={18} /> Use accurate academic and
                    contact information.
                  </li>
                  <li>
                    <ClipboardCheck size={18} /> Rename the photo with your name
                    before selecting it.
                  </li>
                  <li>
                    <ClipboardCheck size={18} /> First and second preferences
                    must be different.
                  </li>
                  <li>
                    <ClipboardCheck size={18} /> Answer each selected team’s
                    questions in your own words.
                  </li>
                </ul>

                {options?.activeCycle ? (
                  <div className="subex-cycle-card">
                    <span>Active recruitment</span>
                    <strong>{options.activeCycle.title}</strong>
                    <small>
                      Closes: July 20, 2026
                    </small>
                  </div>
                ) : !loadingOptions ? (
                  <div className="subex-closed-card">
                    <AlertCircle size={18} />
                    Registration is currently closed.
                  </div>
                ) : null}
              </div>
            </aside>

            <form className="subex-registration-form" onSubmit={handleSubmit}>
              {error && (
                <div className="subex-error-banner" role="alert">
                  <AlertCircle size={20} />
                  <span>{error}</span>
                </div>
              )}

              <div className="subex-form-card">
                <div className="subex-section-heading">
                  <span>01</span>
                  <div>
                    <p className="subex-section-kicker">Basic information</p>
                    <h2>Personal and academic details</h2>
                  </div>
                </div>

                {loadingOptions ? (
                  <div className="subex-loading-state">
                    <LoaderCircle className="subex-spin" size={20} />
                    Loading registration options...
                  </div>
                ) : (
                  <div className="subex-form-grid">
                    <div className="subex-field-group subex-full-width">
                      <label htmlFor="subex-full-name">
                        Name <span className="subex-required">*</span>
                      </label>
                      <input
                        id="subex-full-name"
                        type="text"
                        value={form.fullName}
                        onChange={(event) =>
                          updateFormField('fullName', event.target.value)
                        }
                        required
                        minLength={2}
                        maxLength={150}
                        disabled={submitting}
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div className="subex-field-group">
                      <label htmlFor="subex-department">
                        Department <span className="subex-required">*</span>
                      </label>
                      <select
                        id="subex-department"
                        value={form.departmentId}
                        onChange={(event) =>
                          updateFormField('departmentId', event.target.value)
                        }
                        required
                        disabled={submitting}
                      >
                        <option value="">Select department</option>
                        {options?.departments.map((department) => (
                          <option key={department.id} value={department.id}>
                            {department.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="subex-field-group">
                      <label htmlFor="subex-student-id">
                        Student ID <span className="subex-required">*</span>
                      </label>
                      <input
                        id="subex-student-id"
                        type="text"
                        value={form.studentId}
                        onChange={(event) =>
                          updateFormField('studentId', event.target.value)
                        }
                        required
                        maxLength={50}
                        disabled={submitting}
                        placeholder="Example: 20230104001"
                      />
                    </div>
                    <div className="subex-field-group">
  <label htmlFor="subex-austrc-id">
    AUSTRC ID{' '}
    <span className="subex-required">
      *
    </span>
  </label>

  <input
    id="subex-austrc-id"
    type="text"

    value={form.austrcId}

    onChange={(event) =>
      updateFormField(
        'austrcId',
        event.target.value,
      )
    }

    onBlur={(event) => {
      const value =
        event.target.value.trim();

      const compactValue =
        value.replace(/\s+/g, '');

      updateFormField(
        'austrcId',

        /^(n\/a|na)$/i.test(
          compactValue,
        )
          ? 'N/A'
          : value,
      );
    }}

    required
    minLength={1}
    maxLength={50}
    disabled={submitting}

    placeholder="Enter AUSTRC ID or N/A"
  />

  <small className="subex-field-hint">
    If you do not have an AUSTRC ID,
    write N/A.
  </small>
</div>
                    <div className="subex-field-group">
                      <label htmlFor="subex-semester">
                        Semester <span className="subex-required">*</span>
                      </label>
                      <select
                        id="subex-semester"
                        value={form.semesterId}
                        onChange={(event) =>
                          updateFormField('semesterId', event.target.value)
                        }
                        required
                        disabled={submitting}
                      >
                        <option value="">Select semester</option>
                        {options?.semesters.map((semester) => (
                          <option key={semester.id} value={semester.id}>
                            {semester.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="subex-field-group">
                      <label htmlFor="subex-phone">
                        Phone number <span className="subex-required">*</span>
                      </label>
                      <input
                        id="subex-phone"
                        type="tel"
                        value={form.phoneNumber}
                        onChange={(event) =>
                          updateFormField('phoneNumber', event.target.value)
                        }
                        required
                        minLength={7}
                        maxLength={25}
                        disabled={submitting}
                        placeholder="+8801XXXXXXXXX"
                      />
                    </div>

                    <div className="subex-field-group">
  <label htmlFor="subex-personal-email">
    Personal mail{' '}
    <span className="subex-required">
      *
    </span>
  </label>

  <input
    id="subex-personal-email"
    type="email"
    inputMode="email"
    autoComplete="email"

    value={form.personalEmail}

    onChange={(event) =>
      updateFormField(
        'personalEmail',
        event.target.value.replace(
          /\s/g,
          '',
        ),
      )
    }

    onBlur={(event) =>
      updateFormField(
        'personalEmail',
        event.target.value
          .trim()
          .toLowerCase(),
      )
    }

    pattern={
      STRICT_EMAIL_PATTERN.source
    }

    title="Enter a valid email address, for example yourname@gmail.com."

    required
    maxLength={255}
    disabled={submitting}

    placeholder="yourname@gmail.com"
  />

  <small className="subex-field-hint">
    Enter a complete and valid personal
    email address.
  </small>
</div>

                    <div className="subex-field-group">
  <label htmlFor="subex-edu-email">
    Edu mail{' '}
    <span className="subex-required">
      *
    </span>
  </label>

  <input
    id="subex-edu-email"
    type="email"
    inputMode="email"
    autoComplete="email"

    value={form.eduEmail}

    onChange={(event) =>
      updateFormField(
        'eduEmail',
        event.target.value
          .toLowerCase()
          .replace(/\s/g, ''),
      )
    }

    onBlur={(event) =>
      updateFormField(
        'eduEmail',
        event.target.value
          .trim()
          .toLowerCase(),
      )
    }

    pattern={
      AUST_EMAIL_PATTERN.source
    }

    title="Enter your official AUST educational email ending with @aust.edu."

    required
    maxLength={255}
    disabled={submitting}

    placeholder="student-id@aust.edu"
  />

  <small className="subex-field-hint">
    Only an official email ending with
    @aust.edu is accepted.
  </small>
</div>

                    <div className="subex-field-group subex-full-width">
                      <label htmlFor="subex-address">
                        Present address <span className="subex-required">*</span>
                      </label>
                      <textarea
                        id="subex-address"
                        rows={3}
                        value={form.presentAddress}
                        onChange={(event) =>
                          updateFormField('presentAddress', event.target.value)
                        }
                        required
                        maxLength={2000}
                        disabled={submitting}
                        placeholder="Enter your present address"
                      />
                    </div>

                    <div className="subex-field-group subex-full-width">
                      <label htmlFor="subex-facebook">
                        Facebook ID link{' '}
                        <span className="subex-required">*</span>
                      </label>
                      <input
                        id="subex-facebook"
                        type="url"
                        value={form.facebookUrl}
                        onChange={(event) =>
                          updateFormField('facebookUrl', event.target.value)
                        }
                        required
                        maxLength={1000}
                        disabled={submitting}
                        placeholder="https://www.facebook.com/your-profile"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="subex-form-card">
                <div className="subex-section-heading">
                  <span>02</span>
                  <div>
                    <p className="subex-section-kicker">Photo and experience</p>
                    <h2>Applicant picture and previous work</h2>
                  </div>
                </div>

                <div className="subex-photo-layout">
                  <label className="subex-photo-picker" htmlFor="subex-photo">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Applicant preview" />
                    ) : (
                      <div className="subex-photo-placeholder">
                        <ImagePlus size={34} />
                        <strong>Attach your picture</strong>
                        <span>PNG, JPG or JPEG · Maximum 4 MB</span>
                      </div>
                    )}
                    <input
                      id="subex-photo"
                      type="file"
                      accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                      onChange={handlePhotoChange}
                      required
                      disabled={submitting}
                    />
                  </label>

                  <div className="subex-photo-copy">
                    <Camera size={22} />
                    <div>
                      <strong>Rename the photo with your name.</strong>
                      <p>
                          This picture may appear in future
  AUSTRC social-media posts if you are
  selected.
                      </p>
                      {photo && <small>Selected: {photo.name}</small>}
                    </div>
                  </div>
                </div>

                <fieldset className="subex-field-group subex-choice-field subex-experience-field">
                  <legend>
                    Did you work in any position of AUSTRC, ARC 1.0,
                    RoboMania 1.0, ARC 2.0 or RoboMania 2.0 before?
                    <span className="subex-required"> *</span>
                  </legend>
                  <div className="subex-choice-grid">
                    {['yes', 'no'].map((value) => (
                      <label className="subex-choice-card" key={value}>
                        <input
                          type="radio"
                          name="subex-worked-before"
                          value={value}
                          checked={form.workedWithAustrcBefore === value}
                          onChange={() =>
                            setForm((current) => ({
                              ...current,
                              workedWithAustrcBefore: value as 'yes' | 'no',
                              previousWorkDescription:
                                value === 'no'
                                  ? ''
                                  : current.previousWorkDescription,
                            }))
                          }
                          required
                          disabled={submitting}
                        />
                        <span>{value === 'yes' ? 'Yes' : 'No'}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                {form.workedWithAustrcBefore === 'yes' && (
                  <div className="subex-field-group subex-conditional-field">
                    <label htmlFor="subex-previous-work">
                      Write a short description{' '}
                      <span className="subex-required">*</span>
                    </label>
                    <textarea
                      id="subex-previous-work"
                      rows={4}
                      value={form.previousWorkDescription}
                      onChange={(event) =>
                        updateFormField(
                          'previousWorkDescription',
                          event.target.value,
                        )
                      }
                      required
                      maxLength={3000}
                      disabled={submitting}
                      placeholder="Mention the event, role and main responsibilities..."
                    />
                  </div>
                )}
              </div>

              <div className="subex-form-card">
                <div className="subex-section-heading">
                  <span>03</span>
                  <div>
                    <p className="subex-section-kicker">First preference</p>
                    <h2>Select your primary team</h2>
                  </div>
                </div>

                <div className="subex-field-group">
                  <label htmlFor="subex-first-team">
                    Team <span className="subex-required">*</span>
                  </label>
                  <select
                    id="subex-first-team"
                    value={form.firstTeamId}
                    onChange={(event) =>
                      void handleFirstTeamChange(event.target.value)
                    }
                    required
                    disabled={loadingOptions || submitting}
                  >
                    <option value="">Select first preference</option>
                    {options?.teams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedFirstTeam?.description && (
                  <div className="subex-team-description">
                    <Users size={20} />
                    <p>
                      <strong>{selectedFirstTeam.name}</strong>
                      {selectedFirstTeam.description}
                    </p>
                  </div>
                )}

                <div className="subex-team-question-block">
                  <h3>First-preference team questions</h3>
                  {loadingFirstQuestions ? (
                    <div className="subex-loading-state">
                      <LoaderCircle className="subex-spin" size={20} />
                      Loading questions...
                    </div>
                  ) : !form.firstTeamId ? (
                    <div className="subex-empty-state">
                      Select your first team to see its questions.
                    </div>
                  ) : firstQuestions.length === 0 ? (
                    <div className="subex-empty-state">
                      No screening questions are configured for this team.
                    </div>
                  ) : (
                    <div className="subex-questions-list">
                      {firstQuestions.map((question) => (
                        <QuestionField
                          key={question.id}
                          question={question}
                          answer={firstAnswers[question.id]}
                          onChange={(answer) =>
                            setFirstAnswers((current) => ({
                              ...current,
                              [question.id]: answer,
                            }))
                          }
                          scope="first"
                          disabled={submitting}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="subex-form-card">
                <div className="subex-section-heading">
                  <span>04</span>
                  <div>
                    <p className="subex-section-kicker">Second preference</p>
                    <h2>Select an additional team</h2>
                  </div>
                </div>

                <div className="subex-field-group">
                  <label htmlFor="subex-second-team">
                    Additional team preference{' '}
                    <span className="subex-optional">Optional</span>
                  </label>
                  <select
                    id="subex-second-team"
                    value={form.secondTeamId}
                    onChange={(event) =>
                      void handleSecondTeamChange(event.target.value)
                    }
                    disabled={
                      loadingOptions || submitting || !form.firstTeamId
                    }
                  >
                    <option value="">No second preference</option>
                    {options?.teams
                      .filter((team) => team.id !== form.firstTeamId)
                      .map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                  </select>
                </div>

                {selectedSecondTeam?.description && (
                  <div className="subex-team-description">
                    <Users size={20} />
                    <p>
                      <strong>{selectedSecondTeam.name}</strong>
                      {selectedSecondTeam.description}
                    </p>
                  </div>
                )}

                {form.secondTeamId && (
                  <div className="subex-team-question-block">
                    <h3>Second-preference team questions</h3>
                    {loadingSecondQuestions ? (
                      <div className="subex-loading-state">
                        <LoaderCircle className="subex-spin" size={20} />
                        Loading questions...
                      </div>
                    ) : secondQuestions.length === 0 ? (
                      <div className="subex-empty-state">
                        No screening questions are configured for this team.
                      </div>
                    ) : (
                      <div className="subex-questions-list">
                        {secondQuestions.map((question) => (
                          <QuestionField
                            key={question.id}
                            question={question}
                            answer={secondAnswers[question.id]}
                            onChange={(answer) =>
                              setSecondAnswers((current) => ({
                                ...current,
                                [question.id]: answer,
                              }))
                            }
                            scope="second"
                            disabled={submitting}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="subex-submit-card">
                <div>
                  <strong>Ready to submit?</strong>
                  <span>
                    Review your information and selected-team
  answers carefully before submitting your
  application.
                  </span>
                </div>
                <button
                  className="subex-primary-button"
                  type="submit"
                  disabled={
                    submitting ||
                    loadingOptions ||
                    loadingAnyQuestions ||
                    !options?.activeCycle
                  }
                >
                  {submitting ? (
                    <>
                      <LoaderCircle className="subex-spin" size={19} />
                      Submitting application...
                    </>
                  ) : (
                    <>
                      <Send size={19} />
                      Submit application
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>
        )}
      </div>
    </div>
  );
}