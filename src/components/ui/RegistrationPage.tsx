import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type FormEvent,
} from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ClipboardCheck,
  Database,
  LoaderCircle,
  Send,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { useTokens } from '@/tokens/useTokens';
import { getFormOptions, getTeamQuestions } from '@/features/subExecutiveRegistration/api/registrationApi';
import type { FormOptions, ScreeningQuestion, Team } from '@/features/subExecutiveRegistration/types';
import '@/features/subExecutiveRegistration/subExecutiveRegistration.css';

const API_BASE_URL = (
  import.meta.env.VITE_SUB_EXECUTIVE_API_URL || 'http://localhost:5000/api'
).replace(/\/$/, '');

function formatDate(value: string | null): string {
  if (!value) return 'Not specified';

  return new Intl.DateTimeFormat('en-BD', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Dhaka',
  }).format(new Date(value));
}

export function RegistrationPage() {
  const t = useTokens();
  const [options, setOptions] = useState<FormOptions | null>(null);
  const [teamQuestions, setTeamQuestions] = useState<ScreeningQuestion[]>([]);
  const [formFields, setFormFields] = useState<any[]>([]);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [screeningAnswers, setScreeningAnswers] = useState<Record<string, any>>({});
  
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);

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

  // Load Form Options and Dynamic Form Config
  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        setLoadingConfig(true);
        const [optionsData, configRes] = await Promise.all([
          getFormOptions(),
          fetch(`${API_BASE_URL}/admin/form-config?category=Sub-Executive`).then((r) => r.json()),
        ]);

        if (cancelled) return;

        setOptions(optionsData);

        if (configRes.success && configRes.data) {
          const fields = configRes.data.fields || [];
          setFormFields(fields);
          
          // Initialize form values
          const initialValues: Record<string, any> = {};
          fields.forEach((field: any) => {
            if (field.type === 'checkbox') {
              initialValues[field.name] = [];
            } else {
              initialValues[field.name] = '';
            }
          });
          setFormValues(initialValues);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Could not load registration form structure.',
          );
        }
      } finally {
        if (!cancelled) setLoadingConfig(false);
      }
    }

    void init();

    return () => {
      cancelled = true;
    };
  }, []);

  const selectedTeamId = formValues['teamId'] || '';

  const selectedTeam = useMemo(
    () => options?.teams.find((team) => team.id === selectedTeamId) ?? null,
    [selectedTeamId, options],
  );

  // Load team questions when teamId changes
  const handleTeamChange = async (teamId: string) => {
    updateFieldValue('teamId', teamId);
    setTeamQuestions([]);
    setScreeningAnswers({});
    setError('');

    if (!teamId) return;

    try {
      setLoadingQuestions(true);
      const data = await getTeamQuestions(teamId);
      setTeamQuestions(data.questions);
      
      // Initialize team questions answers
      const initialAnswers: Record<string, any> = {};
      data.questions.forEach((q) => {
        if (q.questionType === 'multiple_choice') {
          initialAnswers[q.id] = [];
        } else {
          initialAnswers[q.id] = '';
        }
      });
      setScreeningAnswers(initialAnswers);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Could not load team questions.',
      );
    } finally {
      setLoadingQuestions(false);
    }
  };

  const updateFieldValue = (name: string, value: any) => {
    setFormValues((curr) => ({ ...curr, [name]: value }));
  };

  const updateScreeningAnswer = (questionId: string, value: any) => {
    setScreeningAnswers((curr) => ({ ...curr, [questionId]: value }));
  };

  const step1Fields = useMemo(() => formFields.filter((f) => f.step === '01'), [formFields]);
  const step2Fields = useMemo(() => formFields.filter((f) => f.step === '02'), [formFields]);
  const step3Fields = useMemo(() => formFields.filter((f) => f.step === '03'), [formFields]);

  // Validation
  const validateForm = (): string | null => {
    // Check required dynamic fields
    for (const field of formFields) {
      const val = formValues[field.name];
      if (field.required) {
        if (field.type === 'checkbox') {
          if (!val || val.length === 0) return `Please select at least one option for: ${field.label}`;
        } else {
          if (typeof val !== 'string' || !val.trim()) return `Please enter a value for: ${field.label}`;
        }
      }
    }

    // Check required team-specific questions
    for (const q of teamQuestions) {
      const val = screeningAnswers[q.id];
      if (q.isRequired) {
        if (q.questionType === 'multiple_choice') {
          if (!val || val.length === 0) return `Please answer: ${q.questionText}`;
        } else {
          if (typeof val !== 'string' || !val.trim()) return `Please answer: ${q.questionText}`;
        }
      }
    }

    return null;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      setSubmitting(true);

      const standardData: any = {};
      const customData: any = {};

      const standardKeys = [
        'fullName',
        'studentId',
        'departmentId',
        'semesterId',
        'phoneNumber',
        'eduEmail',
        'personalEmail',
        'linkedinUrl',
        'teamId',
      ];

      formFields.forEach((field) => {
        const val = formValues[field.name];
        if (standardKeys.includes(field.name)) {
          standardData[field.name] = val;
        } else {
          customData[field.name] = val;
        }
      });

      // Prepare team answers payload
      const answersPayload = Object.entries(screeningAnswers)
        .filter(([, val]) => (Array.isArray(val) ? val.length > 0 : Boolean(String(val).trim())))
        .map(([questionId, val]) =>
          Array.isArray(val)
            ? { questionId, answerJson: val, answerText: null }
            : { questionId, answerText: String(val).trim(), answerJson: null },
        );

      const response = await fetch(`${API_BASE_URL}/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...standardData,
          departmentId: Number(standardData.departmentId),
          semesterId: Number(standardData.semesterId),
          linkedinUrl: standardData.linkedinUrl?.trim() || null,
          answers: answersPayload,
          submissionData: {
            ...customData,
            ...screeningAnswers, // include dynamic/team screening answers in submission_data as well
          },
        }),
      });

      const payload = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.error?.message || 'Submission failed');
      }

      setResult(payload.data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Your application could not be submitted.',
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSubmitting(false);
    }
  };

  const resetApplication = () => {
    const initialValues: Record<string, any> = {};
    formFields.forEach((field) => {
      if (field.type === 'checkbox') {
        initialValues[field.name] = [];
      } else {
        initialValues[field.name] = '';
      }
    });
    setFormValues(initialValues);
    setScreeningAnswers({});
    setTeamQuestions([]);
    setResult(null);
    setError('');
  };

  // Render input based on field config
  const renderField = (field: any) => {
    const value = formValues[field.name];

    switch (field.type) {
      case 'select': {
        let selectOptions: any[] = [];
        if (field.name === 'departmentId' && options) {
          selectOptions = options.departments;
        } else if (field.name === 'semesterId' && options) {
          selectOptions = options.semesters;
        } else if (field.name === 'teamId' && options) {
          selectOptions = options.teams;
        } else if (Array.isArray(field.options)) {
          selectOptions = field.options.map((opt: any) =>
            typeof opt === 'string' ? { id: opt, name: opt } : opt
          );
        }

        return (
          <select
            id={`subex-${field.name}`}
            value={value}
            onChange={(e) =>
              field.name === 'teamId'
                ? void handleTeamChange(e.target.value)
                : updateFieldValue(field.name, e.target.value)
            }
            required={field.required}
            disabled={submitting}
          >
            <option value="">Select {field.label.toLowerCase()}</option>
            {selectOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.name}
              </option>
            ))}
          </select>
        );
      }
      case 'textarea':
        return (
          <textarea
            id={`subex-${field.name}`}
            value={value}
            onChange={(e) => updateFieldValue(field.name, e.target.value)}
            required={field.required}
            disabled={submitting}
            placeholder={field.placeholder || `Enter your ${field.label.toLowerCase()}...`}
            rows={4}
          />
        );
      case 'checkbox':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
            {field.options?.map((opt: string) => {
              const checked = Array.isArray(value) && value.includes(opt);
              return (
                <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--subex-text-secondary)' }}>
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={submitting}
                    onChange={(e) => {
                      const current = Array.isArray(value) ? [...value] : [];
                      if (e.target.checked) {
                        current.push(opt);
                      } else {
                        const idx = current.indexOf(opt);
                        if (idx > -1) current.splice(idx, 1);
                      }
                      updateFieldValue(field.name, current);
                    }}
                  />
                  {opt}
                </label>
              );
            })}
          </div>
        );
      case 'radio':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
            {field.options?.map((opt: string) => (
              <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--subex-text-secondary)' }}>
                <input
                  type="radio"
                  name={`radio-${field.name}`}
                  checked={value === opt}
                  disabled={submitting}
                  onChange={() => updateFieldValue(field.name, opt)}
                />
                {opt}
              </label>
            ))}
          </div>
        );
      default:
        return (
          <input
            id={`subex-${field.name}`}
            type={field.type || 'text'}
            value={value}
            onChange={(e) => updateFieldValue(field.name, e.target.value)}
            required={field.required}
            disabled={submitting}
            placeholder={field.placeholder || `Enter your ${field.label.toLowerCase()}`}
          />
        );
    }
  };

  const renderTeamQuestionField = (q: ScreeningQuestion) => {
    const val = screeningAnswers[q.id];

    switch (q.questionType) {
      case 'single_choice':
        return (
          <select
            value={val || ''}
            onChange={(e) => updateScreeningAnswer(q.id, e.target.value)}
            required={q.isRequired}
            disabled={submitting}
          >
            <option value="">Select an option</option>
            {q.options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );
      case 'multiple_choice':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
            {q.options?.map((opt) => {
              const checked = Array.isArray(val) && val.includes(opt);
              return (
                <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--subex-text-secondary)' }}>
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={submitting}
                    onChange={(e) => {
                      const current = Array.isArray(val) ? [...val] : [];
                      if (e.target.checked) {
                        current.push(opt);
                      } else {
                        const idx = current.indexOf(opt);
                        if (idx > -1) current.splice(idx, 1);
                      }
                      updateScreeningAnswer(q.id, current);
                    }}
                  />
                  {opt}
                </label>
              );
            })}
          </div>
        );
      case 'yes_no':
        return (
          <select
            value={val || ''}
            onChange={(e) => updateScreeningAnswer(q.id, e.target.value)}
            required={q.isRequired}
            disabled={submitting}
          >
            <option value="">Select option</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        );
      case 'long_text':
        return (
          <textarea
            value={val || ''}
            onChange={(e) => updateScreeningAnswer(q.id, e.target.value)}
            required={q.isRequired}
            disabled={submitting}
            rows={4}
            placeholder="Type your response here..."
          />
        );
      default:
        return (
          <input
            type={q.questionType === 'number' ? 'number' : q.questionType === 'url' ? 'url' : 'text'}
            value={val || ''}
            onChange={(e) => updateScreeningAnswer(q.id, e.target.value)}
            required={q.isRequired}
            disabled={submitting}
            placeholder={q.questionType === 'url' ? 'https://...' : 'Type response...'}
          />
        );
    }
  };

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
            Complete your basic information, select your preferred team and answer
            the screening questions prepared for that team.
          </p>

          <div className="subex-hero-stats">
            <div><Users size={20} /><span>Team-based selection</span></div>
            <div><Database size={20} /><span>Secure database submission</span></div>
            <div><ShieldCheck size={20} /><span>Validated application</span></div>
          </div>
        </section>

        {result ? (
          <section className="subex-success-card">
            <div className="subex-success-icon"><CheckCircle2 size={48} /></div>
            <p className="subex-section-kicker">Application submitted</p>
            <h2>Thank you, {result.applicantName}!</h2>
            <p className="subex-success-message">
              Your application for <strong>{result.teamName}</strong> has been stored
              successfully.
            </p>

            <div className="subex-application-number">
              <span>Your application number</span>
              <strong>{result.applicationNumber}</strong>
              <small>Save this number for future status checking.</small>
            </div>

            <div className="subex-success-details">
              <div><span>Student ID</span><strong>{result.studentId}</strong></div>
              <div><span>Status</span><strong>{result.status.replace('_', ' ')}</strong></div>
              <div><span>Recruitment</span><strong>{result.recruitmentCycle}</strong></div>
              <div><span>Submitted</span><strong>{formatDate(result.submittedAt)}</strong></div>
            </div>

            <button className="subex-primary-button" type="button" onClick={resetApplication}>
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
                  <li><ClipboardCheck size={18} /> Use accurate academic information.</li>
                  <li><ClipboardCheck size={18} /> Select only the team you genuinely prefer.</li>
                  <li><ClipboardCheck size={18} /> Answer team questions in your own words.</li>
                  <li><ClipboardCheck size={18} /> Check your emails and phone number carefully.</li>
                </ul>

                {options?.activeCycle ? (
                  <div className="subex-cycle-card">
                    <span>Active recruitment</span>
                    <strong>{options.activeCycle.title}</strong>
                    <small>Closes: {formatDate(options.activeCycle.endAt)}</small>
                  </div>
                ) : !loadingConfig ? (
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

              {/* STEP 1: Basic Information */}
              <div className="subex-form-card">
                <div className="subex-section-heading">
                  <span>01</span>
                  <div>
                    <p className="subex-section-kicker">Basic information</p>
                    <h2>Personal and academic details</h2>
                  </div>
                </div>

                {loadingConfig ? (
                  <div className="subex-loading-state">
                    <LoaderCircle className="subex-spin" size={20} />
                    Loading registration options...
                  </div>
                ) : (
                  <div className="subex-form-grid">
                    {step1Fields.map((field) => {
                      const isFullWidth = field.name === 'fullName' || field.name === 'linkedinUrl';
                      return (
                        <div
                          key={field.name}
                          className={`subex-field-group${isFullWidth ? ' subex-full-width' : ''}`}
                        >
                          <label htmlFor={`subex-${field.name}`}>
                            {field.label}{' '}
                            {field.required ? (
                              <span className="subex-required">*</span>
                            ) : (
                              <span className="subex-optional">Optional</span>
                            )}
                          </label>
                          {renderField(field)}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* STEP 2: Team Preference */}
              <div className="subex-form-card">
                <div className="subex-section-heading">
                  <span>02</span>
                  <div>
                    <p className="subex-section-kicker">Team preference</p>
                    <h2>Select your desired team</h2>
                  </div>
                </div>

                {loadingConfig ? (
                  <div className="subex-loading-state">
                    <LoaderCircle className="subex-spin" size={20} />
                    Loading team options...
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {step2Fields.map((field) => (
                      <div key={field.name} className="subex-field-group">
                        <label htmlFor={`subex-${field.name}`}>
                          {field.label} <span className="subex-required">*</span>
                        </label>
                        {renderField(field)}
                      </div>
                    ))}

                    {selectedTeam?.description && (
                      <div className="subex-team-description">
                        <Users size={20} />
                        <p>
                          <strong>{selectedTeam.name}</strong>
                          {selectedTeam.description}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* STEP 3: Screening / Custom Questions */}
              <div className="subex-form-card">
                <div className="subex-section-heading">
                  <span>03</span>
                  <div>
                    <p className="subex-section-kicker">Screening</p>
                    <h2>Team-specific questions</h2>
                  </div>
                </div>

                {loadingConfig || loadingQuestions ? (
                  <div className="subex-loading-state">
                    <LoaderCircle className="subex-spin" size={20} />
                    Loading screening questions...
                  </div>
                ) : !selectedTeamId ? (
                  <div className="subex-empty-state">Select a team to see its screening questions.</div>
                ) : (
                  <div className="subex-questions-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {/* Render config step 03 questions first */}
                    {step3Fields.map((field) => (
                      <div key={field.name} className="subex-field-group">
                        <label htmlFor={`subex-${field.name}`}>
                          {field.label}{' '}
                          {field.required ? (
                            <span className="subex-required">*</span>
                          ) : (
                            <span className="subex-optional">Optional</span>
                          )}
                        </label>
                        {renderField(field)}
                      </div>
                    ))}

                    {/* Render database dynamic screening questions next */}
                    {teamQuestions.map((q) => (
                      <div key={q.id} className="subex-field-group" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.25rem' }}>
                        <label style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                          {q.questionText}{' '}
                          {q.isRequired ? (
                            <span className="subex-required">*</span>
                          ) : (
                            <span className="subex-optional">Optional</span>
                          )}
                        </label>
                        <div style={{ marginTop: '0.65rem' }}>{renderTeamQuestionField(q)}</div>
                      </div>
                    ))}

                    {step3Fields.length === 0 && teamQuestions.length === 0 && (
                      <div className="subex-empty-state">No screening questions are configured for this team.</div>
                    )}
                  </div>
                )}
              </div>

              {/* Submit Card */}
              <div className="subex-submit-card">
                <div>
                  <strong>Ready to submit?</strong>
                  <span>Your information will be stored securely in the AUSTRC registration database.</span>
                </div>
                <button
                  className="subex-primary-button"
                  type="submit"
                  disabled={
                    submitting ||
                    loadingConfig ||
                    loadingQuestions ||
                    !options?.activeCycle
                  }
                >
                  {submitting ? (
                    <>
                      <LoaderCircle className="subex-spin" size={19} />
                      Submitting...
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
