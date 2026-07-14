import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ExternalLink,
  Eye,
  Facebook,
  FileSpreadsheet,
  Filter,
  Image as ImageIcon,
  Loader2,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Save,
  Search,
  UserCheck,
  Users,
  X,
} from 'lucide-react';

import { useAdminStyles } from './useAdminStyles';

const configuredApiUrl =
  import.meta.env.VITE_SUB_EXECUTIVE_API_URL?.trim();

const API_BASE_URL = (
  configuredApiUrl ||
  (import.meta.env.DEV
    ? 'http://localhost:5000/api'
    : '')
).replace(/\/$/, '');

if (!API_BASE_URL) {
  throw new Error(
    'VITE_SUB_EXECUTIVE_API_URL is missing.',
  );
}

const STATUS_OPTIONS = [
  'draft',
  'submitted',
  'under_review',
  'shortlisted',
  'interview',
  'selected',
  'rejected',
  'withdrawn',
] as const;

type ApplicationStatus =
  (typeof STATUS_OPTIONS)[number];

interface SelectOption {
  id: number | string;
  name: string;
}

interface ApplicationSummary {
  id: string;
  applicationNumber: string;
  status: ApplicationStatus;

  submittedAt: string | null;
  createdAt: string;
  updatedAt: string;

  fullName: string;
  studentId: string;
  austrcId: string;

  departmentCode: string;
  departmentName: string;
  semester: string;

  personalEmail: string;
  eduEmail: string;
  phoneNumber: string;
  presentAddress: string;
  facebookUrl: string;

  photoUrl: string;
  photoPublicId: string | null;
  photoOriginalName: string | null;
  photoFormat: string | null;
  photoBytes: number | null;

  workedWithAustrcBefore: boolean;
  previousWorkDescription: string | null;

  firstPreferenceTeamId: string | null;
  firstPreferenceTeam: string | null;

  secondPreferenceTeamId: string | null;
  secondPreferenceTeam: string | null;

  recruitmentCycleId: string;
  recruitmentCycle: string;

  adminNotes: string | null;
}

interface PreferenceAnswer {
  questionId: string;
  questionCode: string;
  questionText: string;
  questionType: string;
  isRequired: boolean;
  displayOrder: number;

  answerText: string | null;
  answerJson: string[] | null;
  otherText: string | null;

  formattedAnswer: string;
}

interface PreferenceDetail {
  preferenceOrder: 1 | 2;
  teamId: string;
  teamName: string;
  answers: PreferenceAnswer[];
}

interface ApplicationDetailResponse {
  application: ApplicationSummary;
  preferences: PreferenceDetail[];
}

interface ApplicationsResponse {
  applications: ApplicationSummary[];

  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };

  stats: {
    total: number;
    submitted: number;
    underReview: number;
    shortlisted: number;
    interview: number;
    selected: number;
    rejected: number;
  };

  filters: {
    teams: SelectOption[];
    departments: SelectOption[];
    semesters: SelectOption[];
    statuses: ApplicationStatus[];
  };
}

interface ApiSuccess<T> {
  success: true;
  data: T;
}

interface ApiFailure {
  success: false;

  error?: {
    code?: string;
    message?: string;
    details?: unknown;
  };
}

function humanize(value: string): string {
  return value
    .split('_')
    .map(
      (part) =>
        part.charAt(0).toUpperCase() +
        part.slice(1),
    )
    .join(' ');
}

function formatDate(
  value: string | null,
): string {
  if (!value) {
    return 'Not submitted';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Invalid date';
  }

  return new Intl.DateTimeFormat(
    'en-BD',
    {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Asia/Dhaka',
    },
  ).format(date);
}

function formatBytes(
  bytes: number | null,
): string {
  if (!bytes) {
    return 'Unknown size';
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(1)} MB`;
}

async function adminRequest<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(
      `${API_BASE_URL}${path}`,
      {
        ...options,

        headers: {
          Accept: 'application/json',

          ...(options?.body
            ? {
                'Content-Type':
                  'application/json',
              }
            : {}),

          ...options?.headers,
        },
      },
    );
  } catch {
    throw new Error(
      'Could not connect to the Sub-Executive admin API. Confirm that the backend is running and VITE_SUB_EXECUTIVE_API_URL is correct.',
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
    !payload?.success
  ) {
    throw new Error(
      payload && !payload.success
        ? payload.error?.message ||
            'The admin request failed.'
        : 'The admin request failed.',
    );
  }

  return payload.data;
}

function StatusBadge({
  status,
}: {
  status: ApplicationStatus;
}) {
  const styles: Record<
    ApplicationStatus,
    {
      color: string;
      background: string;
      border: string;
    }
  > = {
    draft: {
      color: '#9ca3af',
      background:
        'rgba(156,163,175,.10)',
      border:
        'rgba(156,163,175,.24)',
    },

    submitted: {
      color: '#60a5fa',
      background:
        'rgba(96,165,250,.10)',
      border:
        'rgba(96,165,250,.24)',
    },

    under_review: {
      color: '#fbbf24',
      background:
        'rgba(251,191,36,.10)',
      border:
        'rgba(251,191,36,.24)',
    },

    shortlisted: {
      color: '#c084fc',
      background:
        'rgba(192,132,252,.10)',
      border:
        'rgba(192,132,252,.24)',
    },

    interview: {
      color: '#fb923c',
      background:
        'rgba(251,146,60,.10)',
      border:
        'rgba(251,146,60,.24)',
    },

    selected: {
      color: '#2ECC71',
      background:
        'rgba(46,204,113,.10)',
      border:
        'rgba(46,204,113,.24)',
    },

    rejected: {
      color: '#f87171',
      background:
        'rgba(248,113,113,.10)',
      border:
        'rgba(248,113,113,.24)',
    },

    withdrawn: {
      color: '#94a3b8',
      background:
        'rgba(148,163,184,.10)',
      border:
        'rgba(148,163,184,.24)',
    },
  };

  const current = styles[status];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 9px',
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 800,
        color: current.color,
        background: current.background,
        border:
          `1px solid ${current.border}`,
        whiteSpace: 'nowrap',
      }}
    >
      {humanize(status)}
    </span>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="subex-admin-info-item">
      <span>{label}</span>

      <div>
        {value || '—'}
      </div>
    </div>
  );
}

export function FormEditor() {
  const s = useAdminStyles();
  const t = s.t;

  const [data, setData] =
    useState<ApplicationsResponse | null>(
      null,
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [searchInput, setSearchInput] =
    useState('');

  const [search, setSearch] =
    useState('');

  const [status, setStatus] =
    useState('');

  const [teamId, setTeamId] =
    useState('');

  const [
    departmentId,
    setDepartmentId,
  ] = useState('');

  const [
    semesterId,
    setSemesterId,
  ] = useState('');

  const [page, setPage] =
    useState(1);

  const [exporting, setExporting] =
    useState(false);

  const [selectedId, setSelectedId] =
    useState<string | null>(null);

  const [detail, setDetail] =
    useState<ApplicationDetailResponse | null>(
      null,
    );

  const [
    detailLoading,
    setDetailLoading,
  ] = useState(false);

  const [
    detailError,
    setDetailError,
  ] = useState('');

  const [editStatus, setEditStatus] =
    useState<ApplicationStatus>(
      'submitted',
    );

  const [adminNotes, setAdminNotes] =
    useState('');

  const [saving, setSaving] =
    useState(false);

  const queryString = useMemo(() => {
    const params =
      new URLSearchParams({
        page: String(page),
        pageSize: '20',
      });

    if (search) {
      params.set('search', search);
    }

    if (status) {
      params.set('status', status);
    }

    if (teamId) {
      params.set('teamId', teamId);
    }

    if (departmentId) {
      params.set(
        'departmentId',
        departmentId,
      );
    }

    if (semesterId) {
      params.set(
        'semesterId',
        semesterId,
      );
    }

    return params.toString();
  }, [
    departmentId,
    page,
    search,
    semesterId,
    status,
    teamId,
  ]);

  const loadApplications =
    useCallback(async () => {
      try {
        setLoading(true);
        setError('');

        const result =
          await adminRequest<ApplicationsResponse>(
            `/admin/applications?${queryString}`,
          );

        setData(result);
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Could not load applications.',
        );
      } finally {
        setLoading(false);
      }
    }, [queryString]);

  useEffect(() => {
    void loadApplications();
  }, [loadApplications]);

  useEffect(() => {
    const timer =
      window.setTimeout(() => {
        setPage(1);

        setSearch(
          searchInput.trim(),
        );
      }, 450);

    return () =>
      window.clearTimeout(timer);
  }, [searchInput]);

  async function openApplication(
    applicationId: string,
  ) {
    setSelectedId(applicationId);
    setDetail(null);
    setDetailError('');
    setDetailLoading(true);

    try {
      const result =
        await adminRequest<ApplicationDetailResponse>(
          `/admin/applications/${encodeURIComponent(
            applicationId,
          )}`,
        );

      setDetail(result);

      setEditStatus(
        result.application.status,
      );

      setAdminNotes(
        result.application.adminNotes ??
          '',
      );
    } catch (requestError) {
      setDetailError(
        requestError instanceof Error
          ? requestError.message
          : 'Could not load the application.',
      );
    } finally {
      setDetailLoading(false);
    }
  }

  function closeDetail() {
    setSelectedId(null);
    setDetail(null);
    setDetailError('');
    setAdminNotes('');
  }

  async function saveApplication() {
    if (!selectedId || !detail) {
      return;
    }

    try {
      setSaving(true);

      const updated =
        await adminRequest<ApplicationSummary>(
          `/admin/applications/${encodeURIComponent(
            selectedId,
          )}`,
          {
            method: 'PATCH',

            body: JSON.stringify({
              status: editStatus,

              adminNotes:
                adminNotes.trim() ||
                null,
            }),
          },
        );

      setDetail((current) =>
        current
          ? {
              ...current,
              application: updated,
            }
          : current,
      );

      await loadApplications();
    } catch (requestError) {
      window.alert(
        requestError instanceof Error
          ? requestError.message
          : 'Could not update the application.',
      );
    } finally {
      setSaving(false);
    }
  }

  async function exportExcel() {
    try {
      setExporting(true);

      const params =
        new URLSearchParams();

      if (search) {
        params.set('search', search);
      }

      if (status) {
        params.set('status', status);
      }

      if (teamId) {
        params.set(
          'teamId',
          teamId,
        );
      }

      if (departmentId) {
        params.set(
          'departmentId',
          departmentId,
        );
      }

      if (semesterId) {
        params.set(
          'semesterId',
          semesterId,
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/admin/applications/export?${params.toString()}`,
        {
          headers: {
            Accept:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          },
        },
      );

      if (!response.ok) {
        const payload = (
          await response
            .json()
            .catch(() => null)
        ) as ApiFailure | null;

        throw new Error(
          payload?.error?.message ||
            'Could not export the Excel file.',
        );
      }

      const blob =
        await response.blob();

      const contentDisposition =
        response.headers.get(
          'Content-Disposition',
        ) ?? '';

      const filenameMatch =
        contentDisposition.match(
          /filename="?([^";]+)"?/i,
        );

      const filename =
        filenameMatch?.[1] ??
        'austrc-sub-executive-applications.xlsx';

      const objectUrl =
        URL.createObjectURL(blob);

      const anchor =
        document.createElement('a');

      anchor.href = objectUrl;
      anchor.download = filename;

      document.body.appendChild(
        anchor,
      );

      anchor.click();
      anchor.remove();

      URL.revokeObjectURL(
        objectUrl,
      );
    } catch (requestError) {
      window.alert(
        requestError instanceof Error
          ? requestError.message
          : 'Could not export the Excel file.',
      );
    } finally {
      setExporting(false);
    }
  }

  function resetFilters() {
    setSearchInput('');
    setSearch('');
    setStatus('');
    setTeamId('');
    setDepartmentId('');
    setSemesterId('');
    setPage(1);
  }

  const stats = data?.stats;
  const pagination = data?.pagination;

  const statCards = [
    {
      label: 'Total Applications',
      value: stats?.total ?? 0,
      icon: Users,
      accent: '#60a5fa',
    },

    {
      label: 'Under Review',
      value:
        stats?.underReview ?? 0,
      icon: Clock3,
      accent: '#fbbf24',
    },

    {
      label:
        'Shortlisted + Interview',

      value:
        (stats?.shortlisted ?? 0) +
        (stats?.interview ?? 0),

      icon: UserCheck,
      accent: '#c084fc',
    },

    {
      label: 'Selected',
      value: stats?.selected ?? 0,
      icon: CheckCircle2,
      accent: '#2ECC71',
    },
  ];

  return (
    <div style={s.page}>
      <style>
        {`
          @keyframes subexAdminSpin {
            to {
              transform: rotate(360deg);
            }
          }

          .subex-admin-stats {
            display: grid;
            grid-template-columns:
              repeat(4, minmax(0, 1fr));
            gap: 14px;
          }

          .subex-admin-filters {
            display: grid;
            grid-template-columns:
              minmax(240px, 2fr)
              repeat(4, minmax(130px, 1fr));
            gap: 10px;
          }

          .subex-admin-table-wrap {
            overflow: auto;
            border-radius: 16px;
            border:
              1px solid
              ${t.borderDefault};
          }

          .subex-admin-table {
            width: 100%;
            min-width: 1180px;
            border-collapse: collapse;
          }

          .subex-admin-table th {
            padding: 12px 14px;

            color:
              ${t.textMutedMid};

            font-size: 10px;
            letter-spacing: .08em;
            text-transform: uppercase;
            text-align: left;

            background:
              ${t.pageBgAlt};

            border-bottom:
              1px solid
              ${t.borderDefault};

            position: sticky;
            top: 0;
            z-index: 1;
          }

          .subex-admin-table td {
            padding: 13px 14px;

            color:
              ${t.textSecondary};

            font-size: 13px;

            border-bottom:
              1px solid
              ${t.borderSubtle};

            vertical-align: middle;
          }

          .subex-admin-table tbody tr {
            transition:
              background .15s;
          }

          .subex-admin-table tbody tr:hover {
            background:
              rgba(46, 204, 113, .035);
          }

          .subex-admin-candidate {
            display: flex;
            align-items: center;
            gap: 10px;
            min-width: 220px;
          }

          .subex-admin-candidate img {
            width: 42px;
            height: 42px;
            border-radius: 12px;
            object-fit: cover;

            border:
              1px solid
              ${t.borderDefault};

            background:
              ${t.pageBgAlt};
          }

          .subex-admin-modal-grid {
            display: grid;

            grid-template-columns:
              280px minmax(0, 1fr);

            gap: 22px;
          }

          .subex-admin-info-grid {
            display: grid;

            grid-template-columns:
              repeat(2, minmax(0, 1fr));

            gap: 12px;
          }

          .subex-admin-info-item {
            padding: 12px 14px;

            border:
              1px solid
              ${t.borderSubtle};

            background:
              ${t.pageBgAlt};

            border-radius: 12px;
            min-width: 0;
          }

          .subex-admin-info-item > span {
            display: block;
            margin-bottom: 5px;

            color:
              ${t.textMuted};

            font-size: 10px;
            font-weight: 800;
            letter-spacing: .08em;
            text-transform: uppercase;
          }

          .subex-admin-info-item > div {
            color:
              ${t.textPrimary};

            font-size: 13px;
            line-height: 1.55;
            overflow-wrap: anywhere;
          }

          .subex-admin-answer {
            padding: 14px;

            border:
              1px solid
              ${t.borderSubtle};

            background:
              ${t.pageBgAlt};

            border-radius: 12px;
          }

          .subex-admin-answer +
          .subex-admin-answer {
            margin-top: 10px;
          }

          .subex-admin-answer h5 {
            margin: 0 0 7px;

            color:
              ${t.textSecondary};

            font-size: 12px;
            line-height: 1.55;
          }

          .subex-admin-answer p {
            margin: 0;

            color:
              ${t.textPrimary};

            font-size: 13px;
            line-height: 1.65;
            white-space: pre-wrap;
          }

          .subex-admin-detail-scroll {
            max-height:
              calc(90vh - 80px);

            overflow: auto;
          }

          @media (max-width: 1100px) {
            .subex-admin-stats {
              grid-template-columns:
                repeat(2, minmax(0, 1fr));
            }

            .subex-admin-filters {
              grid-template-columns:
                repeat(2, minmax(0, 1fr));
            }

            .subex-admin-filters
            .subex-admin-search {
              grid-column: 1 / -1;
            }

            .subex-admin-modal-grid {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 640px) {
            .subex-admin-stats,
            .subex-admin-filters,
            .subex-admin-info-grid {
              grid-template-columns: 1fr;
            }

            .subex-admin-filters
            .subex-admin-search {
              grid-column: auto;
            }
          }
        `}
      </style>

      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent:
            'space-between',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h2
            style={{
              color: t.textPrimary,
              fontSize: 28,
              fontWeight: 900,
              margin: 0,
            }}
          >
            Sub-Executive Applications
          </h2>

          <p
            style={{
              color: t.textSecondary,
              fontSize: 13,
              margin: '5px 0 0',
            }}
          >
            Review complete candidate
            profiles, both team
            preferences, team-specific
            answers and selection status.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 10,
            flexWrap: 'wrap',
          }}
        >
          <button
            type="button"
            onClick={() =>
              void loadApplications()
            }
            style={{
              ...s.btnGhost,
              display: 'flex',
              alignItems: 'center',
              gap: 7,
            }}
            disabled={loading}
          >
            <RefreshCw
              size={15}
              style={
                loading
                  ? {
                      animation:
                        'subexAdminSpin 1s linear infinite',
                    }
                  : undefined
              }
            />

            Refresh
          </button>

          <button
            type="button"
            onClick={() =>
              void exportExcel()
            }
            style={s.btnPrimary}
            disabled={exporting}
          >
            {exporting ? (
              <Loader2
                size={16}
                style={{
                  animation:
                    'subexAdminSpin 1s linear infinite',
                }}
              />
            ) : (
              <FileSpreadsheet
                size={16}
              />
            )}

            {exporting
              ? 'Preparing...'
              : 'Export Full Excel'}
          </button>
        </div>
      </div>

      <div className="subex-admin-stats">
        {statCards.map(
          ({
            label,
            value,
            icon: Icon,
            accent,
          }) => (
            <div
              key={label}
              style={{
                ...s.card,
                padding: 17,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 13,
                  display: 'grid',
                  placeItems: 'center',
                  color: accent,

                  background:
                    `${accent}18`,

                  border:
                    `1px solid ${accent}35`,
                }}
              >
                <Icon size={20} />
              </div>

              <div>
                <div
                  style={{
                    color:
                      t.textPrimary,

                    fontSize: 24,
                    fontWeight: 900,
                  }}
                >
                  {value}
                </div>

                <div
                  style={{
                    color: t.textMuted,
                    fontSize: 11,
                    marginTop: 2,
                  }}
                >
                  {label}
                </div>
              </div>
            </div>
          ),
        )}
      </div>

      <div style={s.sectionCard}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 14,
          }}
        >
          <Filter
            size={16}
            color={t.brandGreen}
          />

          <strong
            style={{
              color: t.textPrimary,
              fontSize: 14,
            }}
          >
            Search and filters
          </strong>

          <button
            type="button"
            onClick={resetFilters}
            style={{
              ...s.btnGhost,
              marginLeft: 'auto',
              padding: '7px 12px',
              fontSize: 12,
            }}
          >
            Clear filters
          </button>
        </div>

        <div className="subex-admin-filters">
          <div
            className="subex-admin-search"
            style={{
              position: 'relative',
            }}
          >
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: 13,
                top: '50%',
                transform:
                  'translateY(-50%)',
                color: t.textMuted,
              }}
            />

            <input
              value={searchInput}
              onChange={(event) =>
                setSearchInput(
                  event.target.value,
                )
              }
              placeholder="Search name, Student ID, AUSTRC ID, application number, email or phone..."
              style={{
                ...s.inputBase,
                paddingLeft: 40,
              }}
            />
          </div>

          <select
            value={status}
            onChange={(event) => {
              setStatus(
                event.target.value,
              );

              setPage(1);
            }}
            style={s.inputBase}
          >
            <option value="">
              All statuses
            </option>

            {STATUS_OPTIONS.map(
              (item) => (
                <option
                  key={item}
                  value={item}
                >
                  {humanize(item)}
                </option>
              ),
            )}
          </select>

          <select
            value={teamId}
            onChange={(event) => {
              setTeamId(
                event.target.value,
              );

              setPage(1);
            }}
            style={s.inputBase}
          >
            <option value="">
              Any selected team
            </option>

            {data?.filters.teams.map(
              (item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.name}
                </option>
              ),
            )}
          </select>

          <select
            value={departmentId}
            onChange={(event) => {
              setDepartmentId(
                event.target.value,
              );

              setPage(1);
            }}
            style={s.inputBase}
          >
            <option value="">
              All departments
            </option>

            {data?.filters.departments.map(
              (item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.name}
                </option>
              ),
            )}
          </select>

          <select
            value={semesterId}
            onChange={(event) => {
              setSemesterId(
                event.target.value,
              );

              setPage(1);
            }}
            style={s.inputBase}
          >
            <option value="">
              All semesters
            </option>

            {data?.filters.semesters.map(
              (item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.name}
                </option>
              ),
            )}
          </select>
        </div>
      </div>

      {error && (
        <div
          style={{
            padding: '13px 16px',
            borderRadius: 12,
            color: '#f87171',

            background:
              'rgba(239,68,68,.09)',

            border:
              '1px solid rgba(239,68,68,.22)',
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          ...s.sectionCard,
          padding: 0,
          overflow: 'hidden',
        }}
      >
        {loading ? (
          <div
            style={{
              minHeight: 300,
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <Loader2
              size={30}
              color={t.brandGreen}
              style={{
                animation:
                  'subexAdminSpin 1s linear infinite',
              }}
            />
          </div>
        ) : !data?.applications.length ? (
          <div
            style={{
              ...s.empty,
              border: 'none',
              borderRadius: 0,
            }}
          >
            No applications match the
            current filters.
          </div>
        ) : (
          <div
            className="subex-admin-table-wrap"
            style={{
              border: 'none',
              borderRadius: 0,
            }}
          >
            <table className="subex-admin-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Application</th>
                  <th>Academic</th>
                  <th>
                    First Preference
                  </th>
                  <th>
                    Second Preference
                  </th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {data.applications.map(
                  (application) => (
                    <tr
                      key={
                        application.id
                      }
                    >
                      <td>
                        <div className="subex-admin-candidate">
                          <img
                            src={
                              application.photoUrl
                            }
                            alt={
                              application.fullName
                            }
                          />

                          <div>
                            <strong
                              style={{
                                display:
                                  'block',

                                color:
                                  t.textPrimary,

                                fontSize: 13,
                              }}
                            >
                              {
                                application.fullName
                              }
                            </strong>

                            <span
                              style={{
                                color:
                                  t.textMuted,

                                fontSize: 11,
                              }}
                            >
                              {
                                application.studentId
                              }
                            </span>

                            <span
  style={{
    display: 'block',
    color: t.textMuted,
    fontSize: 11,
    marginTop: 2,
  }}
>
  AUSTRC ID: {application.austrcId}
</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <strong
                          style={{
                            display:
                              'block',

                            color:
                              t.textPrimary,

                            fontSize: 12,
                          }}
                        >
                          {
                            application.applicationNumber
                          }
                        </strong>

                        <span
                          style={{
                            color:
                              t.textMuted,

                            fontSize: 11,
                          }}
                        >
                          {
                            application.recruitmentCycle
                          }
                        </span>
                      </td>

                      <td>
                        <span
                          style={{
                            display:
                              'block',

                            color:
                              t.textPrimary,
                          }}
                        >
                          {
                            application.departmentName
                          }
                        </span>

                        <span
                          style={{
                            color:
                              t.textMuted,

                            fontSize: 11,
                          }}
                        >
                          Semester{' '}
                          {
                            application.semester
                          }
                        </span>
                      </td>

                      <td
                        style={{
                          maxWidth: 210,
                          color:
                            t.textPrimary,
                        }}
                      >
                        {application.firstPreferenceTeam ||
                          '—'}
                      </td>

                      <td
                        style={{
                          maxWidth: 210,
                        }}
                      >
                        {application.secondPreferenceTeam ||
                          'Not selected'}
                      </td>

                      <td>
                        <StatusBadge
                          status={
                            application.status
                          }
                        />
                      </td>

                      <td
                        style={{
                          whiteSpace:
                            'nowrap',
                        }}
                      >
                        {formatDate(
                          application.submittedAt ??
                            application.createdAt,
                        )}
                      </td>

                      <td>
                        <button
                          type="button"
                          onClick={() =>
                            void openApplication(
                              application.id,
                            )
                          }
                          style={{
                            ...s.btnEdit,
                            minWidth: 92,
                            flex: 'none',
                          }}
                        >
                          <Eye size={14} />
                          View
                        </button>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        )}

        {pagination &&
          pagination.total > 0 && (
            <div
              style={{
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',

                justifyContent:
                  'space-between',

                gap: 12,

                borderTop:
                  `1px solid ${t.borderDefault}`,

                flexWrap: 'wrap',
              }}
            >
              <span
                style={{
                  color: t.textMuted,
                  fontSize: 12,
                }}
              >
                Page {pagination.page} of{' '}
                {pagination.totalPages}
                {' · '}
                {pagination.total}{' '}
                matching application
                {pagination.total === 1
                  ? ''
                  : 's'}
              </span>

              <div
                style={{
                  display: 'flex',
                  gap: 8,
                }}
              >
                <button
                  type="button"
                  style={{
                    ...s.btnGhost,
                    padding: '8px 11px',
                  }}
                  disabled={page <= 1}
                  onClick={() =>
                    setPage((current) =>
                      Math.max(
                        1,
                        current - 1,
                      ),
                    )
                  }
                >
                  <ChevronLeft
                    size={16}
                  />
                </button>

                <button
                  type="button"
                  style={{
                    ...s.btnGhost,
                    padding: '8px 11px',
                  }}
                  disabled={
                    page >=
                    pagination.totalPages
                  }
                  onClick={() =>
                    setPage((current) =>
                      Math.min(
                        pagination.totalPages,
                        current + 1,
                      ),
                    )
                  }
                >
                  <ChevronRight
                    size={16}
                  />
                </button>
              </div>
            </div>
          )}
      </div>

      {selectedId && (
        <div
          style={s.overlay}
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeDetail();
            }
          }}
        >
          <div
            style={{
              ...s.modal,
              maxWidth: 1180,
              padding: 0,
            }}
          >
            <div style={s.modalHeader}>
              <div>
                <h3
                  style={{
                    margin: 0,

                    color:
                      t.textPrimary,

                    fontSize: 19,
                  }}
                >
                  Candidate Application
                  Details
                </h3>

                <p
                  style={{
                    margin:
                      '4px 0 0',

                    color:
                      t.textMuted,

                    fontSize: 12,
                  }}
                >
                  Complete profile,
                  preferences and submitted
                  answers
                </p>
              </div>

              <button
                type="button"
                onClick={closeDetail}
                style={{
                  ...s.btnGhost,
                  padding: 8,
                }}
                aria-label="Close application details"
              >
                <X size={18} />
              </button>
            </div>

            <div
              className="subex-admin-detail-scroll"
              style={{
                padding: 22,
              }}
            >
              {detailLoading ? (
                <div
                  style={{
                    minHeight: 360,
                    display: 'grid',
                    placeItems:
                      'center',
                  }}
                >
                  <Loader2
                    size={30}
                    color={
                      t.brandGreen
                    }
                    style={{
                      animation:
                        'subexAdminSpin 1s linear infinite',
                    }}
                  />
                </div>
              ) : detailError ? (
                <div
                  style={{
                    ...s.empty,
                    color: '#f87171',
                  }}
                >
                  {detailError}
                </div>
              ) : detail ? (
                <div className="subex-admin-modal-grid">
                  <aside
                    style={{
                      display: 'flex',
                      flexDirection:
                        'column',
                      gap: 14,
                    }}
                  >
                    <div
                      style={{
                        ...s.card,
                        padding: 15,
                      }}
                    >
                      <img
                        src={
                          detail.application
                            .photoUrl
                        }
                        alt={
                          detail.application
                            .fullName
                        }
                        style={{
                          width: '100%',

                          aspectRatio:
                            '1 / 1',

                          objectFit:
                            'cover',

                          borderRadius: 14,

                          background:
                            t.pageBgAlt,
                        }}
                      />

                      <div
                        style={{
                          paddingTop: 14,
                        }}
                      >
                        <h4
                          style={{
                            margin: 0,

                            color:
                              t.textPrimary,

                            fontSize: 19,
                          }}
                        >
                          {
                            detail.application
                              .fullName
                          }
                        </h4>

                        <p
                          style={{
                            margin:
                              '5px 0',

                            color:
                              t.textMuted,
                          }}
                        >
                          {
                            detail.application
                              .studentId
                          }
                        </p>

                        <StatusBadge
                          status={
                            detail.application
                              .status
                          }
                        />
                      </div>
                    </div>

                    <div
                      style={{
                        ...s.card,
                        padding: 15,
                        gap: 10,
                      }}
                    >
                      <a
                        href={
                          detail.application
                            .photoUrl
                        }
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          ...s.btnEdit,
                          textDecoration:
                            'none',
                        }}
                      >
                        <ImageIcon
                          size={14}
                        />

                        Open photo
                      </a>

                      <a
                        href={
                          detail.application
                            .facebookUrl
                        }
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          ...s.btnEdit,
                          textDecoration:
                            'none',
                        }}
                      >
                        <Facebook
                          size={14}
                        />

                        Facebook profile
                      </a>

                      <div
                        style={{
                          color:
                            t.textMuted,

                          fontSize: 11,
                          lineHeight: 1.6,
                        }}
                      >
                        {detail.application
                          .photoFormat
                          ?.toUpperCase() ||
                          'IMAGE'}
                        {' · '}
                        {formatBytes(
                          detail.application
                            .photoBytes,
                        )}
                      </div>

                      {detail.application
                        .photoOriginalName && (
                        <div
                          style={{
                            color:
                              t.textMuted,

                            fontSize: 11,
                            lineHeight: 1.6,
                            overflowWrap:
                              'anywhere',
                          }}
                        >
                          Original file:{' '}
                          {
                            detail.application
                              .photoOriginalName
                          }
                        </div>
                      )}
                    </div>

                    <div
                      style={{
                        ...s.card,
                        padding: 15,
                      }}
                    >
                      <label
                        style={s.label}
                      >
                        Application status
                      </label>

                      <select
                        value={editStatus}
                        onChange={(event) =>
                          setEditStatus(
                            event.target
                              .value as ApplicationStatus,
                          )
                        }
                        style={
                          s.inputBase
                        }
                      >
                        {STATUS_OPTIONS.map(
                          (item) => (
                            <option
                              key={item}
                              value={item}
                            >
                              {humanize(
                                item,
                              )}
                            </option>
                          ),
                        )}
                      </select>

                      <label
                        style={{
                          ...s.label,
                          marginTop: 14,
                        }}
                      >
                        Private admin notes
                      </label>

                      <textarea
                        value={adminNotes}
                        onChange={(event) =>
                          setAdminNotes(
                            event.target
                              .value,
                          )
                        }
                        rows={6}
                        maxLength={5000}
                        placeholder="Interview observations, selection notes, follow-up details..."
                        style={{
                          ...s.inputBase,
                          resize:
                            'vertical',
                        }}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          void saveApplication()
                        }
                        disabled={saving}
                        style={{
                          ...s.btnPrimary,
                          marginTop: 12,
                          width: '100%',
                        }}
                      >
                        {saving ? (
                          <Loader2
                            size={15}
                            style={{
                              animation:
                                'subexAdminSpin 1s linear infinite',
                            }}
                          />
                        ) : (
                          <Save
                            size={15}
                          />
                        )}

                        {saving
                          ? 'Saving...'
                          : 'Save review'}
                      </button>
                    </div>
                  </aside>

                  <main
                    style={{
                      display: 'flex',
                      flexDirection:
                        'column',
                      gap: 18,
                      minWidth: 0,
                    }}
                  >
                    <section
                      style={{
                        ...s.card,
                        padding: 18,
                      }}
                    >
                      <h4
                        style={{
                          margin:
                            '0 0 14px',

                          color:
                            t.textPrimary,
                        }}
                      >
                        Applicant information
                      </h4>

                      <div className="subex-admin-info-grid">
                        <InfoItem
                          label="Application Number"
                          value={
                            detail.application
                              .applicationNumber
                          }
                        />

                        <InfoItem
                          label="Recruitment Cycle"
                          value={
                            detail.application
                              .recruitmentCycle
                          }
                        />

                        <InfoItem
                          label="Full Name"
                          value={
                            detail.application
                              .fullName
                          }
                        />

                        <InfoItem
                          label="Student ID"
                          value={
                            detail.application
                              .studentId
                          }
                        />
                        <InfoItem
  label="AUSTRC ID"
  value={
    detail.application.austrcId
  }
/>
                        <InfoItem
                          label="Department"
                          value={
                            detail.application
                              .departmentName
                          }
                        />

                        <InfoItem
                          label="Semester"
                          value={
                            detail.application
                              .semester
                          }
                        />

                        <InfoItem
                          label="Personal Email"
                          value={
                            <a
                              href={`mailto:${detail.application.personalEmail}`}
                              style={{
                                color:
                                  t.brandGreen,
                              }}
                            >
                              {
                                detail.application
                                  .personalEmail
                              }
                            </a>
                          }
                        />

                        <InfoItem
                          label="Educational Email"
                          value={
                            <a
                              href={`mailto:${detail.application.eduEmail}`}
                              style={{
                                color:
                                  t.brandGreen,
                              }}
                            >
                              {
                                detail.application
                                  .eduEmail
                              }
                            </a>
                          }
                        />

                        <InfoItem
                          label="Phone Number"
                          value={
                            <a
                              href={`tel:${detail.application.phoneNumber}`}
                              style={{
                                color:
                                  t.brandGreen,
                              }}
                            >
                              {
                                detail.application
                                  .phoneNumber
                              }
                            </a>
                          }
                        />

                        <InfoItem
                          label="Submitted At"
                          value={formatDate(
                            detail.application
                              .submittedAt ??
                              detail.application
                                .createdAt,
                          )}
                        />

                        <InfoItem
                          label="Last Updated"
                          value={formatDate(
                            detail.application
                              .updatedAt,
                          )}
                        />

                        <InfoItem
                          label="Current Status"
                          value={
                            <StatusBadge
                              status={
                                detail.application
                                  .status
                              }
                            />
                          }
                        />

                        <div
                          style={{
                            gridColumn:
                              '1 / -1',
                          }}
                        >
                          <InfoItem
                            label="Present Address"
                            value={
                              detail.application
                                .presentAddress
                            }
                          />
                        </div>

                        <div
                          style={{
                            gridColumn:
                              '1 / -1',
                          }}
                        >
                          <InfoItem
                            label="Facebook Profile"
                            value={
                              <a
                                href={
                                  detail.application
                                    .facebookUrl
                                }
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  color:
                                    t.brandGreen,
                                }}
                              >
                                {
                                  detail.application
                                    .facebookUrl
                                }
                              </a>
                            }
                          />
                        </div>

                        <div
                          style={{
                            gridColumn:
                              '1 / -1',
                          }}
                        >
                          <InfoItem
                            label="Previous AUSTRC / ARC / RoboMania Work"
                            value={
                              detail.application
                                .workedWithAustrcBefore
                                ? detail.application
                                    .previousWorkDescription ||
                                  'Yes — no description provided.'
                                : 'No previous position or work reported.'
                            }
                          />
                        </div>
                      </div>
                    </section>

                    {detail.preferences.map(
                      (preference) => (
                        <section
                          key={
                            preference.preferenceOrder
                          }
                          style={{
                            ...s.card,
                            padding: 18,
                          }}
                        >
                          <div
                            style={{
                              display:
                                'flex',

                              alignItems:
                                'center',

                              justifyContent:
                                'space-between',

                              gap: 12,

                              marginBottom: 14,

                              flexWrap:
                                'wrap',
                            }}
                          >
                            <div>
                              <span
                                style={{
                                  ...s.tag,
                                  marginBottom: 7,
                                }}
                              >
                                {preference.preferenceOrder ===
                                1
                                  ? 'First Preference'
                                  : 'Second Preference'}
                              </span>

                              <h4
                                style={{
                                  margin: 0,

                                  color:
                                    t.textPrimary,

                                  fontSize: 17,
                                }}
                              >
                                {
                                  preference.teamName
                                }
                              </h4>
                            </div>

                            <span
                              style={{
                                color:
                                  t.textMuted,

                                fontSize: 12,
                              }}
                            >
                              {
                                preference.answers
                                  .length
                              }{' '}
                              question
                              {preference.answers
                                .length === 1
                                ? ''
                                : 's'}
                            </span>
                          </div>

                          {preference.answers
                            .length === 0 ? (
                            <div
                              style={{
                                ...s.empty,
                                padding: 24,
                              }}
                            >
                              This team currently
                              has no team-specific
                              questions.
                            </div>
                          ) : (
                            preference.answers.map(
                              (answer) => (
                                <article
                                  className="subex-admin-answer"
                                  key={
                                    answer.questionId
                                  }
                                >
                                  <h5>
                                    {
                                      answer.displayOrder
                                    }
                                    .{' '}
                                    {
                                      answer.questionText
                                    }
                                    {answer.isRequired
                                      ? ' *'
                                      : ''}
                                  </h5>

                                  <p>
                                    {answer.formattedAnswer ||
                                      'Not answered'}
                                  </p>

                                  {answer.otherText &&
                                    !answer.formattedAnswer.includes(
                                      answer.otherText,
                                    ) && (
                                      <p
                                        style={{
                                          marginTop: 8,
                                          color:
                                            t.textSecondary,
                                        }}
                                      >
                                        Other:{' '}
                                        {
                                          answer.otherText
                                        }
                                      </p>
                                    )}
                                </article>
                              ),
                            )
                          )}
                        </section>
                      ),
                    )}

                    {detail.preferences.length ===
                      1 && (
                      <section
                        style={{
                          ...s.card,
                          padding: 18,
                        }}
                      >
                        <span
                          style={{
                            ...s.tag,
                            marginBottom: 7,
                          }}
                        >
                          Second Preference
                        </span>

                        <p
                          style={{
                            margin: 0,
                            color:
                              t.textMuted,
                            fontSize: 13,
                          }}
                        >
                          The candidate did not
                          select an additional
                          second team preference.
                        </p>
                      </section>
                    )}

                    <section
                      style={{
                        ...s.card,
                        padding: 18,
                      }}
                    >
                      <h4
                        style={{
                          margin:
                            '0 0 12px',

                          color:
                            t.textPrimary,
                        }}
                      >
                        Quick contact
                      </h4>

                      <div
                        style={{
                          display: 'flex',
                          gap: 10,
                          flexWrap: 'wrap',
                          alignItems:
                            'center',
                        }}
                      >
                        <a
                          href={`mailto:${detail.application.personalEmail}`}
                          style={{
                            ...s.btnEdit,
                            flex: 'none',
                            textDecoration:
                              'none',
                          }}
                        >
                          <Mail size={14} />
                          Email
                        </a>

                        <a
                          href={`tel:${detail.application.phoneNumber}`}
                          style={{
                            ...s.btnEdit,
                            flex: 'none',
                            textDecoration:
                              'none',
                          }}
                        >
                          <Phone size={14} />
                          Call
                        </a>

                        <a
                          href={
                            detail.application
                              .facebookUrl
                          }
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            ...s.btnEdit,
                            flex: 'none',
                            textDecoration:
                              'none',
                          }}
                        >
                          <ExternalLink
                            size={14}
                          />

                          Facebook
                        </a>

                        <span
                          style={{
                            display:
                              'inline-flex',

                            alignItems:
                              'center',

                            gap: 6,

                            color:
                              t.textMuted,

                            fontSize: 12,
                          }}
                        >
                          <MapPin size={14} />

                          {
                            detail.application
                              .presentAddress
                          }
                        </span>
                      </div>
                    </section>
                  </main>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}