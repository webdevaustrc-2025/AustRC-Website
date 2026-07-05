import { Link, useParams } from 'react-router-dom';
import { useState, useEffect, type MouseEvent, type ReactNode } from 'react';
import {
  Users,
  Radio,
  ClipboardList,
  CalendarDays,
  BookOpen,
  Armchair,
  Monitor,
  Target,
  ChevronLeft,
  Sparkles,
  ArrowRight,
  Map,
  Trophy,
  CheckCircle2,
  Package,
  UserCheck,
  UsersRound,
  Code2,
  Database,
  Github,
  Rocket,
  ShieldCheck,
  Zap,
  BrainCircuit,
  Palette,
  FileText,
  Search,
  SlidersHorizontal,
  UploadCloud,
  Lightbulb,
  CheckSquare,
  Workflow,
} from 'lucide-react';
import {
  BOOTCAMP_BASE_PATH,
  getBootcampWingBySlug,
  bootcampWings,
} from '@/data/bootcampData';
import { useTokens } from '@/tokens/useTokens';
import wing1Logo from '@/assets/wing 1.jpeg';
import wing2Logo from '@/assets/wing 2.jpeg';
import wing3Logo from '@/assets/wing 3.jpeg';
import wing4Logo from '@/assets/wing 4.jpeg';

// ─── Slugs ───────────────────────────────────────────────────────────────────
const WING1_SLUG = 'basic-robotics-projects';
const WING4_SLUG = 'web-app-development';

// ─── Logo resolver ────────────────────────────────────────────────────────────
// Safer than array index mapping. Now logos are connected directly with slug.
const WING_LOGOS: Record<string, string> = {
  'basic-robotics-projects': wing1Logo,
  'pcb-design-fabrication': wing2Logo,
  '3D-design-&-modeling': wing3Logo,
  'web-app-development': wing4Logo,
};

function getWingLogo(slug: string): string {
  return WING_LOGOS[slug] || '';
}

// ─── Registration links ───────────────────────────────────────────────────────
const WING_REGISTRATION_LINKS: Record<string, string> = {
  'basic-robotics-projects': 'https://forms.gle/pqVYq2gsyut8CJTf7',
  'pcb-design-fabrication': 'https://forms.gle/mf7WbLd3YbnL89vz5',
  '3D-design-&-modeling': 'https://forms.gle/cVBThKHWajzxgwkN7',
  'web-app-development': 'https://forms.gle/PvEhHp86NjyPGSjT6',
};

// ─── Solo / Team config ───────────────────────────────────────────────────────
const WING_FORMAT_TAG: Record<string, 'Solo' | 'Team'> = {
  'basic-robotics-projects': 'Team',
  'pcb-design-fabrication': 'Solo',
  'solidworks-bootcamp-roadmap': 'Solo',
  'web-app-development': 'Team',
};

// ─── Wing 4 Documentation Data ────────────────────────────────────────────────
// This data replaces only Wing 4 information from the uploaded Web App Bootcamp PDF.
const WING4_DOCUMENTATION_DETAILS = {
  eyebrow: 'Wing 4',
  title: 'Web App Development',
  shortTitle: 'Web App Development',
  detailIntro:
    'From your first backend endpoint to a complete, secure, and deployed web application. Build, connect, and deploy one beginner-friendly project through setup, data, users, frontend, experience, security, and a final hackathon.',
  targetGroup: 'Beginner-friendly web app learners',
  mode: 'Git-based • Hands-on • Deployment-focused',
  groupFormat: 'Team-based final hackathon',
  requirement: 'Laptop, internet connection, curiosity, and willingness to build step by step',
  timeline: '6 classes + final hackathon',
  classCount: '6 Classes',
  capacity: 'Limited seats',
  softwareAccess:
    'VS Code, Git, GitHub, Postman, Node.js, Express, TypeScript, Render, MongoDB, Mongoose, PostgreSQL, Redis, Socket.IO, React, Figma / Wireframes',
  status: 'Final Hackathon Included',

  highlights: [
    'Understand the full web application flow from browser to backend and database.',
    'Build and test REST APIs with useful endpoints, requests, and reliable responses.',
    'Work with stored data, fast temporary data, caching, and database-backed CRUD operations.',
    'Add authentication, authorization, permissions, real-time updates, and one small AI-powered action.',
    'Create a working React frontend that signs users in, sends data, shows results, and updates live.',
    'Collaborate professionally through GitHub issues, branches, commits, pull requests, reviews, and merges.',
    'Improve UI/UX, responsive screens, accessibility, documentation, and project clarity.',
    'Deploy, secure, explain, and present a complete full-stack web application with confidence.',
  ],

  roadmap: [
    {
      period: 'Class 1',
      title: 'Setup, GitHub, and the first backend',
      points: [
        'Set up development tools and starter project.',
        'Understand requests, responses, endpoints, and status codes in plain language.',
        'Create a small backend and test it before adding a frontend.',
        'Follow the shared GitHub workflow: issue, branch, commit, pull request, review, and merge.',
        'Deploy the first API so every new update can be viewed online.',
      ],
    },
    {
      period: 'Class 2',
      title: 'Database basics and complete CRUD operations',
      points: [
        'Learn why applications need databases and what information should be stored.',
        'Connect the backend to a database and define a simple note structure.',
        'Create endpoints to add, view, edit, and delete notes.',
        'Reject incomplete or incorrect input with understandable messages.',
        'Test every operation before the frontend is connected.',
      ],
    },
    {
      period: 'Class 3',
      title: 'Users, permissions, cache, real-time updates, and simple AI',
      points: [
        'Create sign-up and sign-in flows and understand authentication.',
        'Use authorization so users can perform only the actions allowed to them.',
        'Store structured user information separately from notes where appropriate.',
        'Use caching or temporary storage for fast information such as online-user presence.',
        'Send note changes instantly and add one small AI-powered action without making AI the main focus.',
      ],
    },
    {
      period: 'Class 4',
      title: 'React frontend and API integration',
      points: [
        'Understand components, state, forms, and basic page structure.',
        'Build sign-up, sign-in, note list, and note editing screens.',
        'Connect forms and pages to the deployed API.',
        'Show loading, success, empty, and error states clearly.',
        'Receive live note changes through the real-time connection.',
      ],
    },
    {
      period: 'Class 5',
      title: 'UI/UX, responsive design, accessibility, and documentation',
      points: [
        'Plan simple screens and user flows with a quick wireframe.',
        'Use consistent spacing, typography, buttons, forms, and feedback messages.',
        'Make the interface work properly on mobile and desktop screens.',
        'Apply basic accessibility: readable text, labels, keyboard focus, and clear contrast.',
        'Write a useful README with setup steps, features, APIs, and live links.',
      ],
    },
    {
      period: 'Class 6',
      title: 'Web security, secure coding, and beginner CTF practice',
      points: [
        'Understand common web risks using safe, practical examples.',
        'Protect passwords, secrets, authentication flows, and private endpoints.',
        'Validate input and check permissions on the server side.',
        'Avoid exposing sensitive configuration or unnecessary information.',
        'Identify and fix controlled weaknesses in an authorized beginner security lab.',
      ],
    },
  ],

  outcomes: [
    'Participants can explain how a web app works from browser to database.',
    'Participants can build and test a deployed backend API.',
    'Participants can create a database-connected REST API with full CRUD operations.',
    'Participants can add users, permissions, temporary data, live communication, and light AI integration.',
    'Participants can build a functional React frontend connected to a deployed API.',
    'Participants can improve usability, responsiveness, accessibility, and documentation.',
    'Participants leave with a secure-development mindset and basic defensive web testing understanding.',
    'Participants can build and present a small but meaningful live web project in the final hackathon.',
  ],
} as const;

const WING4_MILESTONES = [
  { no: 1, label: 'Setup' },
  { no: 2, label: 'Data' },
  { no: 3, label: 'Users + Live' },
  { no: 4, label: 'Frontend' },
  { no: 5, label: 'Experience' },
  { no: 6, label: 'Security' },
];

const WING4_CLASS_DETAILS: Array<{
  classNo: number;
  phase: string;
  title: string;
  subtitle: string;
  points: string[];
  tools: string;
  handsOn: string;
  byEnd: string;
  icon: ReactNode;
}> = [
  {
    classNo: 1,
    phase: 'Setup',
    title: 'Setup, GitHub, and the first backend',
    subtitle: 'Go from an empty folder to a simple API available through a live link.',
    points: [
      'Set up the development tools and starter project.',
      'Understand requests, responses, endpoints, and status codes in plain language.',
      'Create a small backend and test it before adding a frontend.',
      'Follow the shared GitHub workflow: issue, branch, commit, pull request, review, and merge.',
      'Deploy the first API so every new update can be viewed online.',
    ],
    tools: 'VS Code, Git, GitHub, Postman, Node.js, Express, TypeScript, Render',
    handsOn:
      'Create one basic endpoint, test it, push the code through a branch, and merge it into the shared project.',
    byEnd: 'Participants can explain what a backend does and open their first deployed API.',
    icon: <Code2 size={20} color="#2ECC71" strokeWidth={2.2} />,
  },
  {
    classNo: 2,
    phase: 'Data',
    title: 'Database basics and complete CRUD operations',
    subtitle: 'Make the project remember notes instead of losing them whenever the server restarts.',
    points: [
      'Learn why applications need databases and what information should be stored.',
      'Connect the backend to a database and define a simple note structure.',
      'Create endpoints to add, view, edit, and delete notes.',
      'Reject incomplete or incorrect input with understandable messages.',
      'Test every operation before the frontend is connected.',
    ],
    tools: 'MongoDB, Mongoose, REST API, CRUD, Postman',
    handsOn:
      'Build the notes API so data remains saved and can be created, read, updated, and deleted.',
    byEnd: 'Participants finish with a working, database-connected REST API.',
    icon: <Database size={20} color="#2ECC71" strokeWidth={2.2} />,
  },
  {
    classNo: 3,
    phase: 'Users + Live',
    title: 'Users, permissions, cache, real-time updates, and simple AI',
    subtitle:
      'Add features that let multiple users work safely and see changes without refreshing.',
    points: [
      'Create sign-up and sign-in flows and understand authentication.',
      'Use authorization so users can perform only the actions allowed to them.',
      'Store structured user information separately from notes when appropriate.',
      'Use caching or temporary storage for fast information such as online-user presence.',
      'Send note changes instantly and add one small AI-powered action without making AI the main focus.',
    ],
    tools: 'PostgreSQL, Redis, Socket.IO, authentication, authorization, AI API',
    handsOn:
      'Protect selected endpoints, send a live update when a note changes, and connect one simple AI action.',
    byEnd:
      'Participants understand identity, permissions, temporary data, live communication, and light AI integration.',
    icon: <Zap size={20} color="#2ECC71" strokeWidth={2.2} />,
  },
  {
    classNo: 4,
    phase: 'Frontend',
    title: 'React frontend and API integration',
    subtitle: 'Transform the backend endpoints into a clear web application in the browser.',
    points: [
      'Understand components, state, forms, and basic page structure.',
      'Build sign-up, sign-in, note list, and note editing screens.',
      'Connect forms and pages to the deployed API.',
      'Show loading, success, empty, and error states clearly.',
      'Receive live note changes through the real-time connection.',
    ],
    tools: 'React, API integration, forms, state, Socket.IO client',
    handsOn:
      'Build the main screens, send data to the backend, display saved notes, and show another user’s update live.',
    byEnd: 'Participants complete a functional full-stack application that works from a browser.',
    icon: <Monitor size={20} color="#2ECC71" strokeWidth={2.2} />,
  },
  {
    classNo: 5,
    phase: 'Experience',
    title: 'UI/UX, responsive design, accessibility, and documentation',
    subtitle: 'Make the application easier to use, easier to understand, and ready to present.',
    points: [
      'Plan simple screens and user flows with a quick wireframe.',
      'Use consistent spacing, typography, buttons, forms, and feedback messages.',
      'Make the interface work properly on mobile and desktop screens.',
      'Apply basic accessibility: readable text, labels, keyboard focus, and clear contrast.',
      'Write a useful README with setup steps, features, APIs, and live links.',
    ],
    tools: 'Figma or wireframes, responsive CSS, accessibility basics, README documentation',
    handsOn:
      'Improve the existing screens, test different sizes, fix confusing interactions, and document the project.',
    byEnd:
      'Participants can present an organized, responsive application that new users and judges can understand.',
    icon: <Palette size={20} color="#2ECC71" strokeWidth={2.2} />,
  },
  {
    classNo: 6,
    phase: 'Security',
    title: 'Web security, secure coding, and beginner CTF practice',
    subtitle:
      'Learn how common mistakes create risk and how developers can reduce that risk from the beginning.',
    points: [
      'Understand common web risks using safe, practical examples.',
      'Protect passwords, secrets, authentication flows, and private endpoints.',
      'Validate input and check permissions on the server side.',
      'Avoid exposing sensitive configuration or unnecessary information.',
      'Identify and fix controlled weaknesses in an authorized beginner security lab.',
    ],
    tools: 'Secure configuration, validation, authorization checks, beginner CTF',
    handsOn:
      'Review the project for common security mistakes, apply fixes, and solve short guided challenges in a safe environment.',
    byEnd:
      'Participants leave with a secure-development mindset and a basic understanding of defensive web testing.',
    icon: <ShieldCheck size={20} color="#2ECC71" strokeWidth={2.2} />,
  },
];

const WING4_FINAL_HACKATHON = {
  intro:
    'The culmination of the journey. Teams combine everything they have learned to build a small but meaningful web experience and present their thinking with confidence.',
  coreConcept:
    'Explore an idea, build a small but meaningful web experience, and present the journey with confidence.',
  teamJourney: [
    {
      title: 'Explore',
      text: 'Understand the theme and choose a useful problem.',
      icon: <Search size={18} color="#2ECC71" strokeWidth={2.2} />,
    },
    {
      title: 'Shape',
      text: 'Select a realistic set of core features.',
      icon: <CheckSquare size={18} color="#2ECC71" strokeWidth={2.2} />,
    },
    {
      title: 'Build',
      text: 'Connect backend, data, and frontend.',
      icon: <Code2 size={18} color="#2ECC71" strokeWidth={2.2} />,
    },
    {
      title: 'Refine',
      text: 'Improve clarity, stability, and safety.',
      icon: <SlidersHorizontal size={18} color="#2ECC71" strokeWidth={2.2} />,
    },
    {
      title: 'Share',
      text: 'Demonstrate the idea and explain choices.',
      icon: <UploadCloud size={18} color="#2ECC71" strokeWidth={2.2} />,
    },
  ],
  ideas: [
    'REST APIs, database-backed CRUD, authentication, or live updates.',
    'Responsive screens, clear user flows, caching, or a small AI-assisted feature.',
    'GitHub collaboration, deployment, documentation, and a project demo.',
  ],
  gains: [
    'Confidence to turn a simple idea into a working application.',
    'Experience in teamwork, deployment, problem solving, and presentation.',
    'A stronger foundation for future projects, portfolios, and competitions.',
  ],
};

// ─── Components list: Wing 1 only ─────────────────────────────────────────────
const WING1_COMPONENTS = [
  {
    category: 'Microcontrollers',
    items: [{ name: 'ESP32', qty: 1 }],
  },
  {
    category: 'Sensors',
    items: [
      { name: 'PIR Motion Sensor', qty: 1 },
      { name: 'LDR (Light Dependent Resistor)', qty: 1 },
      { name: 'Soil Moisture Sensor', qty: 1 },
      { name: 'IR Sensor (pair)', qty: 2 },
      { name: 'DHT11 Temperature & Humidity Sensor', qty: 1 },
      { name: 'Sonar Sensor', qty: 1 },
    ],
  },
  {
    category: 'Actuators',
    items: [
      { name: 'SG-90 Servo Motor', qty: 1 },
      { name: 'Relay Module 2 channel', qty: 1 },
      { name: 'Water Pump DC 6V', qty: 1 },
    ],
  },
  {
    category: 'Displays',
    items: [{ name: 'LCD (16x2, I2C)', qty: 1 }],
  },
  {
    category: 'General Electronics',
    items: [
      { name: 'LEDs (Assorted Colors)', qty: 10 },
      { name: 'Push Switch', qty: 5 },
      { name: 'Resistors - 100Ω, 220Ω, 1kΩ, 4.7kΩ, 10kΩ', qty: 50 },
      { name: 'Breadboards', qty: 2 },
      { name: 'Jumper Wires (Pack of 30) MM, MF, FF', qty: 3 },
    ],
  },
  {
    category: 'Power Supply',
    items: [
      { name: '3.7Volt 18650 Battery', qty: 2 },
      { name: '2-cell battery case', qty: 1 },
      { name: '2-cell Battery charger', qty: 1 },
    ],
  },
];

type TabKey = 'learn' | 'roadmap' | 'outcomes' | 'components';

function getRegistrationUrl(slug: string, fallbackUrl: string) {
  return WING_REGISTRATION_LINKS[slug] || fallbackUrl;
}

function handleRegistrationClick(e: MouseEvent<HTMLAnchorElement>, url: string) {
  if (!url || url === '#') {
    e.preventDefault();
    alert('Registration form link will be added soon.');
  }
}

// ─── Wing Logo Display Component ──────────────────────────────────────────────
const WingLogoFrame = ({
  src,
  alt,
  eyebrow,
  variant = 'desktop',
}: {
  src: string;
  alt: string;
  eyebrow: string;
  variant?: 'desktop' | 'mobile';
}) => {
  const imgMaxH = variant === 'desktop' ? '200px' : '165px';
  const padding = variant === 'desktop' ? '26px 22px' : '20px 18px';

  return (
    <div
      className={`wing-logo-frame wing-logo-frame--${variant}`}
      style={{ width: '100%' }}
    >
      <div className="wlf-texture" />
      <div className="wlf-glow" />
      <div className="wlf-shimmer" />

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding,
        }}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            draggable={false}
            style={{
              display: 'block',
              width: '100%',
              maxWidth: '100%',
              height: 'auto',
              maxHeight: imgMaxH,
              objectFit: 'contain',
              objectPosition: 'center',
              borderRadius: '10px',
              userSelect: 'none',
              filter:
                'drop-shadow(0 0 10px rgba(46,204,113,0.22)) drop-shadow(0 6px 18px rgba(0,0,0,0.65))',
              transition: 'filter 0.4s ease, transform 0.4s ease',
            }}
            className="wlf-img"
          />
        ) : (
          <div
            style={{
              width: '100%',
              minHeight: variant === 'desktop' ? '180px' : '145px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2ECC71',
              fontWeight: 900,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              border: '1px dashed rgba(46,204,113,0.35)',
              borderRadius: '12px',
            }}
          >
            {eyebrow}
          </div>
        )}
      </div>

      <div className="wlf-pill">
        <span className="wlf-pill-dot" />
        <span className="wlf-pill-text">{eyebrow}</span>
      </div>
    </div>
  );
};

// ─── Components Table: Wing 1 only ───────────────────────────────────────────
const ComponentsTable = ({ t }: { t: ReturnType<typeof useTokens> }) => {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '20px',
          padding: '12px 16px',
          background: 'rgba(46,204,113,0.07)',
          border: '1px solid rgba(46,204,113,0.25)',
          borderRadius: '12px',
        }}
      >
        <Package size={16} color="#2ECC71" strokeWidth={2} />
        <span style={{ color: t.textSecondary, fontSize: '13px', lineHeight: 1.6 }}>
          The following components are required for the Basic Robotics Projects wing.
          Participants are expected to arrange these components before the bootcamp begins.
        </span>
      </div>

      <div className="components-table-scroll">
        <div
          style={{
            minWidth: '560px',
            border: '1px solid rgba(46,204,113,0.25)',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '180px 1fr 90px',
              background: 'rgba(46,204,113,0.18)',
              borderBottom: '1px solid rgba(46,204,113,0.3)',
              padding: '14px 20px',
              gap: '12px',
            }}
          >
            {['Category', 'Component', 'Quantity'].map((h) => (
              <span
                key={h}
                style={{
                  color: '#2ECC71',
                  fontSize: '12px',
                  fontWeight: 900,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  textAlign: h === 'Quantity' ? 'center' : 'left',
                }}
              >
                {h}
              </span>
            ))}
          </div>

          {WING1_COMPONENTS.map((group, gi) =>
            group.items.map((item, ii) => {
              const rowKey = `${gi}-${ii}`;
              const isFirstInGroup = ii === 0;
              const isLastInGroup = ii === group.items.length - 1;
              const isLastGroup = gi === WING1_COMPONENTS.length - 1;
              const showBorderBottom = !(isLastGroup && isLastInGroup);

              return (
                <div
                  key={rowKey}
                  onMouseEnter={() => setHoveredRow(rowKey)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '180px 1fr 90px',
                    gap: '12px',
                    padding: '13px 20px',
                    borderBottom: showBorderBottom
                      ? '1px solid rgba(46,204,113,0.1)'
                      : 'none',
                    background:
                      hoveredRow === rowKey
                        ? 'rgba(46,204,113,0.07)'
                        : gi % 2 === 0
                          ? 'rgba(46,204,113,0.02)'
                          : 'rgba(0,0,0,0.15)',
                    transition: 'background 0.2s ease',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      borderRight: '1px solid rgba(46,204,113,0.12)',
                      paddingRight: '12px',
                      minHeight: '32px',
                    }}
                  >
                    {isFirstInGroup ? (
                      <span
                        style={{
                          color: '#2ECC71',
                          fontSize: '13px',
                          fontWeight: 800,
                          lineHeight: 1.4,
                        }}
                      >
                        {group.category}
                      </span>
                    ) : (
                      <span
                        style={{
                          color: 'transparent',
                          fontSize: '13px',
                          userSelect: 'none',
                        }}
                      >
                        —
                      </span>
                    )}
                  </div>

                  <span
                    style={{
                      color: t.textPrimary,
                      fontSize: '14px',
                      lineHeight: 1.6,
                      fontWeight: hoveredRow === rowKey ? 600 : 400,
                      transition: 'font-weight 0.2s ease',
                    }}
                  >
                    {item.name}
                  </span>

                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: '36px',
                        height: '28px',
                        background: 'rgba(46,204,113,0.12)',
                        border: '1px solid rgba(46,204,113,0.3)',
                        borderRadius: '8px',
                        color: '#2ECC71',
                        fontSize: '13px',
                        fontWeight: 900,
                        padding: '0 8px',
                      }}
                    >
                      {item.qty}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: '12px',
          gap: '8px',
          alignItems: 'center',
        }}
      >
        <span style={{ color: t.textSecondary, fontSize: '12px' }}>
          Total unique components:
        </span>
        <span
          style={{
            color: '#2ECC71',
            fontSize: '13px',
            fontWeight: 800,
            background: 'rgba(46,204,113,0.1)',
            border: '1px solid rgba(46,204,113,0.3)',
            borderRadius: '8px',
            padding: '2px 10px',
          }}
        >
          {WING1_COMPONENTS.reduce((acc, g) => acc + g.items.length, 0)}
        </span>
      </div>
    </div>
  );
};

// ─── Wing 4 Milestone Strip ──────────────────────────────────────────────────
const Wing4MilestoneStrip = ({ t }: { t: ReturnType<typeof useTokens> }) => {
  return (
    <div
      style={{
        border: '1px solid rgba(46,204,113,0.22)',
        borderRadius: '18px',
        padding: '22px',
        background:
          'linear-gradient(135deg, rgba(46,204,113,0.07), rgba(46,204,113,0.025))',
        marginBottom: '24px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
        <Workflow size={18} color="#2ECC71" strokeWidth={2.3} />
        <div>
          <p
            style={{
              margin: 0,
              color: '#2ECC71',
              fontSize: '11px',
              fontWeight: 900,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
            }}
          >
            One Project. Six Visible Milestones.
          </p>
          <p style={{ margin: '5px 0 0', color: t.textSecondary, fontSize: '13px', lineHeight: 1.6 }}>
            The same beginner-friendly project grows in every class, from setup to security.
          </p>
        </div>
      </div>

      <div className="wing4-milestone-strip">
        {WING4_MILESTONES.map((item, index) => (
          <div key={item.no} className="wing4-milestone-item">
            <div className="wing4-milestone-number">{item.no}</div>
            <span style={{ color: t.textSecondary, fontSize: '12px', fontWeight: 800 }}>
              {item.label}
            </span>
            {index < WING4_MILESTONES.length - 1 && <div className="wing4-milestone-line" />}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Wing 4 Roadmap Section ──────────────────────────────────────────────────
const Wing4RoadmapSection = ({ t }: { t: ReturnType<typeof useTokens> }) => {
  return (
    <div style={{ display: 'grid', gap: '16px' }}>
      <div
        style={{
          border: '1px solid rgba(46,204,113,0.24)',
          borderRadius: '18px',
          padding: '20px',
          background: 'rgba(46,204,113,0.04)',
        }}
      >
        <p
          style={{
            margin: '0 0 8px',
            color: '#2ECC71',
            fontSize: '11px',
            fontWeight: 900,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
          }}
        >
          Every class uses the same practical rhythm
        </p>
        <div className="wing4-rhythm-grid">
          {['Explain', 'Live code', 'Practice', 'Push', 'Review', 'Deploy'].map((item, index) => (
            <div key={item} className="wing4-rhythm-item">
              <span className="wing4-rhythm-number">{index + 1}</span>
              <span style={{ color: t.textSecondary, fontSize: '13px', fontWeight: 700 }}>
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>

      {WING4_CLASS_DETAILS.map((item) => (
        <article key={item.classNo} className="wing4-class-card">
          <aside className="wing4-class-side">
            <span className="wing4-class-no">{item.classNo}</span>
            <span className="wing4-class-phase">{item.phase}</span>
          </aside>

          <div className="wing4-class-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <span className="wing4-icon-box">{item.icon}</span>
              <div>
                <p
                  style={{
                    margin: 0,
                    color: '#2ECC71',
                    fontSize: '10px',
                    fontWeight: 900,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                  }}
                >
                  Class {item.classNo} Outcome
                </p>
                <h3
                  style={{
                    margin: '4px 0 0',
                    color: t.textPrimary,
                    fontSize: 'clamp(18px, 2vw, 24px)',
                    fontWeight: 900,
                    lineHeight: 1.25,
                  }}
                >
                  {item.title}
                </h3>
              </div>
            </div>

            <p
              style={{
                margin: '0 0 16px',
                color: '#2ECC71',
                fontSize: '14px',
                lineHeight: 1.7,
                fontStyle: 'italic',
                fontWeight: 600,
              }}
            >
              {item.subtitle}
            </p>

            <ul
              style={{
                margin: '0 0 18px',
                paddingLeft: '20px',
                color: t.textSecondary,
                lineHeight: 1.8,
                fontSize: '14px',
              }}
            >
              {item.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>

            <div className="wing4-meta-grid">
              <div className="wing4-meta-row">
                <Github size={16} color="#2ECC71" strokeWidth={2.2} />
                <span>
                  <strong>Tools introduced:</strong> {item.tools}
                </span>
              </div>

              <div className="wing4-meta-row wing4-meta-row--soft">
                <Code2 size={16} color="#2ECC71" strokeWidth={2.2} />
                <span>
                  <strong>Hands-on:</strong> {item.handsOn}
                </span>
              </div>

              <div className="wing4-meta-row">
                <CheckCircle2 size={16} color="#2ECC71" strokeWidth={2.2} />
                <span>
                  <strong>By the end:</strong> {item.byEnd}
                </span>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};

// ─── Wing 4 Final Hackathon ──────────────────────────────────────────────────
const Wing4FinalHackathon = ({
  t,
  mounted,
}: {
  t: ReturnType<typeof useTokens>;
  mounted: boolean;
}) => {
  return (
    <section
      style={{
        marginBottom: '56px',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'none' : 'translateY(24px)',
        transition: 'opacity .6s ease .48s,transform .6s ease .48s',
      }}
    >
      <div className="section-title">
        <div className="section-title-bar" />
        <span className="section-title-text">Final Challenge</span>
      </div>

      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '24px',
          border: '1px solid rgba(46,204,113,0.28)',
          padding: '34px',
          background:
            'linear-gradient(135deg, rgba(46,204,113,0.08) 0%, rgba(4,12,8,0.7) 100%)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.32)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-90px',
            right: '-80px',
            width: '260px',
            height: '260px',
            background: 'radial-gradient(circle,rgba(46,204,113,0.16) 0%,transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              border: '1px solid rgba(46,204,113,0.35)',
              background: 'rgba(46,204,113,0.1)',
              borderRadius: '999px',
              padding: '6px 16px',
              marginBottom: '18px',
            }}
          >
            <Rocket size={14} color="#2ECC71" strokeWidth={2.4} />
            <span
              style={{
                color: '#2ECC71',
                fontSize: '11px',
                fontWeight: 900,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              The Final Hackathon
            </span>
          </div>

          <h2
            style={{
              margin: '0 0 14px',
              color: t.textPrimary,
              fontSize: 'clamp(26px, 4vw, 44px)',
              fontWeight: 950,
              letterSpacing: '-0.025em',
              lineHeight: 1.1,
            }}
          >
            Start with curiosity.{' '}
            <span style={{ color: '#2ECC71', textShadow: '0 0 18px rgba(46,204,113,0.35)' }}>
              Finish with a live project.
            </span>
          </h2>

          <p
            style={{
              margin: '0 0 24px',
              maxWidth: '760px',
              color: t.textSecondary,
              fontSize: '15px',
              lineHeight: 1.85,
            }}
          >
            {WING4_FINAL_HACKATHON.intro}
          </p>

          <div className="wing4-core-box">
            <Lightbulb size={28} color="#2ECC71" strokeWidth={2.2} />
            <div>
              <p
                style={{
                  margin: '0 0 5px',
                  color: '#2ECC71',
                  fontSize: '11px',
                  fontWeight: 900,
                  letterSpacing: '0.13em',
                  textTransform: 'uppercase',
                }}
              >
                Core Concept
              </p>
              <p
                style={{
                  margin: 0,
                  color: t.textPrimary,
                  fontSize: 'clamp(17px, 2.2vw, 24px)',
                  fontWeight: 850,
                  lineHeight: 1.45,
                }}
              >
                {WING4_FINAL_HACKATHON.coreConcept}
              </p>
            </div>
          </div>

          <div style={{ marginTop: '28px' }}>
            <p
              style={{
                margin: '0 0 14px',
                color: '#2ECC71',
                fontSize: '11px',
                fontWeight: 900,
                letterSpacing: '0.13em',
                textTransform: 'uppercase',
              }}
            >
              A Possible Team Journey
            </p>

            <div className="wing4-final-journey">
              {WING4_FINAL_HACKATHON.teamJourney.map((step, index) => (
                <div key={step.title} className="wing4-journey-card">
                  <span className="wing4-journey-number">{index + 1}</span>
                  <span className="wing4-journey-icon">{step.icon}</span>
                  <strong style={{ color: t.textPrimary, fontSize: '14px' }}>
                    {step.title}
                  </strong>
                  <p style={{ margin: '6px 0 0', color: t.textSecondary, fontSize: '12px', lineHeight: 1.55 }}>
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="wing4-final-grid">
            <div className="wing4-final-list-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <Code2 size={18} color="#2ECC71" strokeWidth={2.2} />
                <h3
                  style={{
                    margin: 0,
                    color: '#2ECC71',
                    fontSize: '13px',
                    fontWeight: 900,
                    letterSpacing: '0.09em',
                    textTransform: 'uppercase',
                  }}
                >
                  Ideas Teams May Apply
                </h3>
              </div>
              <ul style={{ margin: 0, paddingLeft: '20px', color: t.textSecondary, lineHeight: 1.8, fontSize: '14px' }}>
                {WING4_FINAL_HACKATHON.ideas.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="wing4-final-list-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <BrainCircuit size={18} color="#2ECC71" strokeWidth={2.2} />
                <h3
                  style={{
                    margin: 0,
                    color: '#2ECC71',
                    fontSize: '13px',
                    fontWeight: 900,
                    letterSpacing: '0.09em',
                    textTransform: 'uppercase',
                  }}
                >
                  What Participants May Gain
                </h3>
              </div>
              <ul style={{ margin: 0, paddingLeft: '20px', color: t.textSecondary, lineHeight: 1.8, fontSize: '14px' }}>
                {WING4_FINAL_HACKATHON.gains.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export function BootcampWingDetailPage() {
  const { wingSlug } = useParams();
  const wing = getBootcampWingBySlug(wingSlug);
  const t = useTokens();

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('learn');
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [hoveredInfo, setHoveredInfo] = useState<number | null>(null);

  const safeSlug = wing?.slug ?? '';
  const isWing1 = safeSlug === WING1_SLUG;

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(timer);
  }, []);

  // Prevent blank tab when user moves from Wing 1 Components tab to another wing.
  useEffect(() => {
    if (activeTab === 'components' && !isWing1) {
      setActiveTab('learn');
    }
  }, [activeTab, isWing1, safeSlug]);

  // ── 404 ──────────────────────────────────────────────────────────────────
  if (!wing) {
    return (
      <main
        style={{
          minHeight: '100vh',
          backgroundColor: t.pageBg,
          color: t.textPrimary,
          padding: '120px 20px 60px',
        }}
      >
        <style>{`
          @keyframes fadeUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
          .nf-link { transition:all .25s ease; display:flex; align-items:center; justify-content:space-between; color:inherit; text-decoration:none; }
          .nf-link:hover { background:rgba(46,204,113,0.1)!important; border-color:rgba(46,204,113,0.55)!important; transform:translateX(6px); }
          .nf-back:hover { box-shadow:0 8px 28px rgba(46,204,113,0.5)!important; transform:translateY(-2px); }
        `}</style>

        <div style={{ maxWidth: '680px', margin: '0 auto', animation: 'fadeUp 0.5s ease both' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '80px',
                height: '80px',
                borderRadius: '24px',
                background: 'rgba(46,204,113,0.1)',
                border: '1px solid rgba(46,204,113,0.25)',
                marginBottom: '20px',
              }}
            >
              <Target size={36} color="#2ECC71" strokeWidth={1.6} />
            </div>

            <h1
              style={{
                fontSize: 'clamp(26px,5vw,40px)',
                fontWeight: 900,
                marginBottom: '14px',
              }}
            >
              Wing Not Found
            </h1>

            <p style={{ color: t.textSecondary, lineHeight: 1.8, fontSize: '16px' }}>
              The bootcamp wing you are looking for does not exist. Choose one of the available
              wings below.
            </p>
          </div>

          <div style={{ display: 'grid', gap: '12px', marginBottom: '32px' }}>
            {bootcampWings.map((item, i) => (
              <Link
                key={item.slug}
                to={`${BOOTCAMP_BASE_PATH}/${item.slug}`}
                className="nf-link"
                style={{
                  border: '1px solid rgba(46,204,113,0.2)',
                  borderRadius: '14px',
                  padding: '18px 20px',
                  backgroundColor: 'rgba(46,204,113,0.03)',
                  animation: `fadeUp 0.5s ease ${0.1 + i * 0.07}s both`,
                }}
              >
                <div>
                  <span
                    style={{
                      color: '#2ECC71',
                      fontSize: '11px',
                      fontWeight: 800,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {item.eyebrow}
                  </span>
                  <p style={{ margin: '4px 0 0', fontWeight: 700, color: t.textPrimary }}>
                    {item.title}
                  </p>
                </div>
                <ArrowRight size={18} color="#2ECC71" />
              </Link>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link
              to={BOOTCAMP_BASE_PATH}
              className="nf-back"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: '#000',
                backgroundColor: '#2ECC71',
                padding: '13px 28px',
                borderRadius: '12px',
                fontWeight: 800,
                textDecoration: 'none',
                transition: 'all .25s ease',
                boxShadow: '0 4px 20px rgba(46,204,113,0.35)',
              }}
            >
              <ChevronLeft size={16} strokeWidth={2.5} /> Back to Bootcamp
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const isWing4 = wing.slug === WING4_SLUG;

  // Only Wing 4 gets replaced by PDF documentation data.
  const displayWing = isWing4 ? { ...wing, ...WING4_DOCUMENTATION_DETAILS } : wing;

  const logoSrc = getWingLogo(displayWing.slug);
  const formatTag = WING_FORMAT_TAG[displayWing.slug];

  const infoItems = [
    {
      icon: <Target size={17} color="#2ECC71" strokeWidth={2} />,
      label: 'Target Group',
      value: displayWing.targetGroup,
    },
    {
      icon: <Radio size={17} color="#2ECC71" strokeWidth={2} />,
      label: 'Mode',
      value: displayWing.mode,
    },
    {
      icon: <Users size={17} color="#2ECC71" strokeWidth={2} />,
      label: 'Group Format',
      value: displayWing.groupFormat,
    },
    {
      icon: <ClipboardList size={17} color="#2ECC71" strokeWidth={2} />,
      label: 'Requirement',
      value: displayWing.requirement,
    },
    {
      icon: <CalendarDays size={17} color="#2ECC71" strokeWidth={2} />,
      label: 'Duration',
      value: displayWing.timeline,
    },
    {
      icon: <BookOpen size={17} color="#2ECC71" strokeWidth={2} />,
      label: 'Class Count',
      value: displayWing.classCount,
    },
    ...(displayWing.capacity
      ? [
          {
            icon: <Armchair size={17} color="#2ECC71" strokeWidth={2} />,
            label: 'Capacity',
            value: displayWing.capacity,
          },
        ]
      : []),
    ...(displayWing.softwareAccess
      ? [
          {
            icon: <Monitor size={17} color="#2ECC71" strokeWidth={2} />,
            label: 'Software Access',
            value: displayWing.softwareAccess,
          },
        ]
      : []),
    ...(isWing4
      ? [
          {
            icon: <Rocket size={17} color="#2ECC71" strokeWidth={2} />,
            label: 'Final Challenge',
            value: 'Teams build, refine, deploy, and present a meaningful live web project.',
          },
          {
            icon: <Workflow size={17} color="#2ECC71" strokeWidth={2} />,
            label: 'Class Rhythm',
            value: 'Explain • Live code • Practice • Push • Review • Deploy',
          },
        ]
      : []),
  ];

  const tabs: Array<{ key: TabKey; label: string; icon: ReactNode }> = [
    {
      key: 'learn',
      label: 'What You Learn',
      icon: <CheckCircle2 size={14} strokeWidth={2.2} />,
    },
    {
      key: 'roadmap',
      label: 'Roadmap',
      icon: <Map size={14} strokeWidth={2.2} />,
    },
    {
      key: 'outcomes',
      label: 'Outcomes',
      icon: <Trophy size={14} strokeWidth={2.2} />,
    },
    ...(isWing1
      ? [
          {
            key: 'components' as TabKey,
            label: 'Components',
            icon: <Package size={14} strokeWidth={2.2} />,
          },
        ]
      : []),
  ];

  const registrationUrl = getRegistrationUrl(displayWing.slug, displayWing.registrationUrl);

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: t.pageBg,
        color: t.textPrimary,
        overflowX: 'hidden',
      }}
    >
      <style>{`
        @keyframes glowPulse     { 0%,100%{opacity:.5}  50%{opacity:1} }
        @keyframes floatY        { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes dotPulse      { 0%,100%{box-shadow:0 0 0 0 rgba(46,204,113,.5)} 50%{box-shadow:0 0 0 5px rgba(46,204,113,0)} }
        @keyframes tabSlide      { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes borderGlow    { 0%,100%{border-color:rgba(46,204,113,.3)} 50%{border-color:rgba(46,204,113,.65)} }
        @keyframes wlfShimmer    { 0%{transform:translateX(-130%) skewX(-16deg)} 100%{transform:translateX(230%) skewX(-16deg)} }
        @keyframes wlfGlowPulse  { 0%,100%{opacity:.5;transform:translate(-50%,-50%) scale(1)} 50%{opacity:.88;transform:translate(-50%,-50%) scale(1.08)} }
        @keyframes fadeUp        { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes tagPop        { 0%{transform:scale(0.85);opacity:0} 100%{transform:scale(1);opacity:1} }

        .back-link { display:inline-flex; align-items:center; gap:8px; text-decoration:none; transition:all .25s ease; font-weight:600; font-size:14px; }
        .back-link:hover { gap:12px; }
        .back-link .arrow { transition:transform .25s ease; display:inline-flex; }
        .back-link:hover .arrow { transform:translateX(-4px); }

        .reg-btn-main {
          position:relative; overflow:hidden; display:inline-flex; align-items:center; gap:8px;
          background-color:#2ECC71; color:#000; padding:14px 28px; border-radius:12px;
          font-weight:800; font-size:15px; text-decoration:none;
          box-shadow:0 4px 20px rgba(46,204,113,.4); transition:all .3s cubic-bezier(.4,0,.2,1);
        }
        .reg-btn-main::before { content:''; position:absolute; inset:0; background:linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent); transform:translateX(-100%); transition:transform .5s ease; }
        .reg-btn-main:hover::before { transform:translateX(100%); }
        .reg-btn-main:hover { transform:translateY(-3px); box-shadow:0 12px 32px rgba(46,204,113,.55); }

        .outline-btn-main { display:inline-flex; align-items:center; gap:6px; border:1px solid rgba(46,204,113,.3); color:inherit; padding:14px 24px; border-radius:12px; font-weight:700; font-size:15px; text-decoration:none; background:rgba(46,204,113,.04); transition:all .25s ease; }
        .outline-btn-main:hover { background:rgba(46,204,113,.1)!important; border-color:rgba(46,204,113,.55)!important; transform:translateY(-2px); }

        .info-card-item { transition:all .28s cubic-bezier(.4,0,.2,1); cursor:default; }
        .info-card-item:hover { transform:translateY(-5px) scale(1.03); border-color:rgba(46,204,113,.55)!important; box-shadow:0 10px 30px rgba(46,204,113,.15); background:rgba(46,204,113,.07)!important; }

        .tab-button { background:none; border:none; cursor:pointer; transition:all .25s ease; position:relative; padding:12px 22px; border-radius:10px 10px 0 0; font-weight:700; font-size:14px; display:inline-flex; align-items:center; gap:7px; }
        .tab-button::after { content:''; position:absolute; bottom:-1px; left:50%; transform:translateX(-50%); width:0; height:2px; background:#2ECC71; border-radius:999px; transition:width .3s ease; }
        .tab-button.tab-active::after { width:75%; }
        .tab-button:hover:not(.tab-active) { background:rgba(46,204,113,.06); }
        .tab-content-anim { animation:tabSlide .35s cubic-bezier(.4,0,.2,1) both; }

        .learn-card { display:flex; align-items:flex-start; gap:12px; border:1px solid rgba(46,204,113,.15); border-radius:14px; padding:16px 18px; background:rgba(46,204,113,.03); transition:all .25s ease; cursor:default; }
        .learn-card:hover { border-color:rgba(46,204,113,.4)!important; background:rgba(46,204,113,.07)!important; transform:translateY(-3px); box-shadow:0 6px 20px rgba(46,204,113,.12); }

        .roadmap-row { display:grid; grid-template-columns:130px 1fr; border:1px solid rgba(46,204,113,.18); border-radius:16px; overflow:hidden; transition:all .3s cubic-bezier(.4,0,.2,1); cursor:default; }
        .roadmap-row:hover { border-color:rgba(46,204,113,.5)!important; transform:translateX(8px); box-shadow:0 6px 24px rgba(46,204,113,.14); }

        .outcome-row { display:flex; align-items:flex-start; gap:14px; padding:16px 20px; border:1px solid rgba(46,204,113,.14); border-radius:14px; background:rgba(46,204,113,.025); transition:all .25s ease; cursor:default; }
        .outcome-row:hover { border-color:rgba(46,204,113,.4)!important; background:rgba(46,204,113,.07)!important; transform:translateX(7px); }

        .format-tag {
          display:inline-flex; align-items:center; gap:6px;
          border-radius:999px; padding:5px 14px;
          font-size:12px; font-weight:800; letter-spacing:0.08em; text-transform:uppercase;
          animation:tagPop .4s cubic-bezier(.34,1.56,.64,1) both;
        }
        .format-tag--team {
          background:rgba(46,204,113,0.14); border:1.5px solid rgba(46,204,113,0.45); color:#2ECC71;
        }
        .format-tag--solo {
          background:rgba(99,179,237,0.12); border:1.5px solid rgba(99,179,237,0.4); color:#63B3ED;
        }

        .final-cta-reg { position:relative; overflow:hidden; display:inline-flex; align-items:center; gap:10px; background-color:#2ECC71; color:#000; padding:15px 36px; border-radius:14px; font-weight:900; font-size:16px; text-decoration:none; box-shadow:0 6px 24px rgba(46,204,113,.45); transition:all .3s cubic-bezier(.4,0,.2,1); }
        .final-cta-reg::before { content:''; position:absolute; inset:0; background:linear-gradient(90deg,transparent,rgba(255,255,255,.28),transparent); transform:translateX(-100%); transition:transform .5s ease; }
        .final-cta-reg:hover::before { transform:translateX(100%); }
        .final-cta-reg:hover { transform:translateY(-4px); box-shadow:0 16px 36px rgba(46,204,113,.55); }

        .section-title { display:flex; align-items:center; gap:12px; margin-bottom:22px; }
        .section-title-bar { width:4px; height:24px; border-radius:999px; background:linear-gradient(180deg,#2ECC71,rgba(46,204,113,.25)); box-shadow:0 0 10px rgba(46,204,113,.5); }
        .section-title-text { color:#2ECC71; font-size:11px; font-weight:800; letter-spacing:.15em; text-transform:uppercase; }
        .fee-badge { animation:floatY 3.5s ease-in-out infinite; }
        .status-dot { animation:dotPulse 1.8s ease-in-out infinite; }

        .components-table-scroll {
          width:100%;
          overflow-x:auto;
          -webkit-overflow-scrolling:touch;
          border-radius:16px;
        }

        .wing-logo-frame {
          position: relative;
          border-radius: 20px;
          border: 1px solid rgba(46,204,113,0.28);
          background: linear-gradient(145deg, rgba(8,22,14,0.98) 0%, rgba(4,12,8,0.98) 100%);
          overflow: hidden;
          box-shadow: 0 0 0 1px rgba(46,204,113,0.06), 0 8px 40px rgba(0,0,0,0.5), 0 0 50px rgba(46,204,113,0.07);
          transition: box-shadow .4s ease, border-color .4s ease;
        }
        .wing-logo-frame::before {
          content:''; position:absolute; top:0; left:0; right:0; height:3px; z-index:5;
          background:linear-gradient(90deg,#2ECC71,#3DED97,#27AE60);
          border-radius:20px 20px 0 0;
        }
        .wing-logo-frame:hover {
          border-color: rgba(46,204,113,0.5);
          box-shadow: 0 0 0 1px rgba(46,204,113,0.1), 0 12px 50px rgba(0,0,0,0.55), 0 0 70px rgba(46,204,113,0.16);
        }
        .wing-logo-frame:hover .wlf-img {
          filter: drop-shadow(0 0 20px rgba(46,204,113,0.42)) drop-shadow(0 8px 20px rgba(0,0,0,0.7)) !important;
          transform: scale(1.04);
        }
        .wlf-texture {
          position:absolute; inset:0; pointer-events:none; z-index:0;
          background-image: radial-gradient(circle,rgba(46,204,113,0.055) 1px,transparent 1px);
          background-size: 22px 22px;
        }
        .wlf-glow {
          position:absolute; left:50%; top:50%;
          transform:translate(-50%,-50%);
          width:80%; height:80%; border-radius:50%;
          background:radial-gradient(circle,rgba(46,204,113,0.18) 0%,transparent 70%);
          filter:blur(20px); pointer-events:none; z-index:1;
          animation:wlfGlowPulse 3.8s ease-in-out infinite;
        }
        .wlf-shimmer {
          position:absolute; inset:0; z-index:3; pointer-events:none;
          background:linear-gradient(105deg,transparent 30%,rgba(255,255,255,0.055) 50%,transparent 70%);
          animation:wlfShimmer 5.5s ease-in-out infinite;
        }
        .wlf-img {
          display:block; width:100%; max-width:100%; height:auto;
          object-fit:contain; object-position:center; border-radius:10px;
          user-select:none;
          filter:drop-shadow(0 0 10px rgba(46,204,113,0.22)) drop-shadow(0 6px 18px rgba(0,0,0,0.65));
          transition:filter .4s ease, transform .4s ease;
        }
        .wlf-pill {
          position:absolute; bottom:10px; left:10px; z-index:4;
          display:inline-flex; align-items:center; gap:5px;
          background:rgba(4,12,8,0.82); border:1px solid rgba(46,204,113,0.35);
          border-radius:999px; padding:4px 11px; backdrop-filter:blur(10px);
        }
        .wlf-pill-dot {
          width:5px; height:5px; border-radius:50%; background:#2ECC71;
          box-shadow:0 0 5px rgba(46,204,113,0.9); flex-shrink:0;
          animation:dotPulse 2s ease-in-out infinite;
        }
        .wlf-pill-text { color:#2ECC71; font-size:9px; font-weight:800; letter-spacing:.12em; text-transform:uppercase; }

        .hero-grid {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 48px;
          align-items: flex-start;
        }
        .hero-right-col {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .logo-mobile-block { display: none; }
        .fee-inline-strip { display: none; }

        .wing4-milestone-strip {
          display:grid;
          grid-template-columns:repeat(6, 1fr);
          gap:10px;
          align-items:center;
        }
        .wing4-milestone-item {
          position:relative;
          display:flex;
          flex-direction:column;
          align-items:center;
          gap:8px;
          text-align:center;
        }
        .wing4-milestone-number {
          position:relative;
          z-index:2;
          width:42px;
          height:42px;
          border-radius:50%;
          display:flex;
          align-items:center;
          justify-content:center;
          color:#2ECC71;
          font-size:18px;
          font-weight:950;
          background:rgba(46,204,113,0.12);
          border:2px solid rgba(46,204,113,0.55);
          box-shadow:0 0 20px rgba(46,204,113,0.18);
        }
        .wing4-milestone-line {
          position:absolute;
          top:21px;
          left:calc(50% + 28px);
          width:calc(100% - 46px);
          height:2px;
          background:linear-gradient(90deg,rgba(46,204,113,0.45),rgba(46,204,113,0.1));
          pointer-events:none;
        }

        .wing4-rhythm-grid {
          display:grid;
          grid-template-columns:repeat(6, 1fr);
          gap:10px;
        }
        .wing4-rhythm-item {
          border:1px solid rgba(46,204,113,0.16);
          background:rgba(46,204,113,0.035);
          border-radius:12px;
          padding:12px;
          display:flex;
          align-items:center;
          justify-content:center;
          flex-direction:column;
          gap:6px;
          text-align:center;
        }
        .wing4-rhythm-number {
          width:22px;
          height:22px;
          border-radius:50%;
          display:flex;
          align-items:center;
          justify-content:center;
          background:rgba(46,204,113,0.14);
          color:#2ECC71;
          font-size:11px;
          font-weight:900;
          border:1px solid rgba(46,204,113,0.35);
        }

        .wing4-class-card {
          display:grid;
          grid-template-columns:120px 1fr;
          overflow:hidden;
          border:1px solid rgba(46,204,113,0.2);
          border-radius:20px;
          background:rgba(46,204,113,0.025);
          box-shadow:0 8px 30px rgba(0,0,0,0.24);
          transition:all .28s ease;
        }
        .wing4-class-card:hover {
          transform:translateY(-3px);
          border-color:rgba(46,204,113,0.45);
          box-shadow:0 14px 36px rgba(46,204,113,0.12);
        }
        .wing4-class-side {
          background:linear-gradient(180deg,rgba(4,20,12,0.95),rgba(2,10,7,0.95));
          border-right:1px solid rgba(46,204,113,0.22);
          padding:22px 14px;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          gap:12px;
          text-align:center;
        }
        .wing4-class-no {
          color:#2ECC71;
          font-size:52px;
          font-weight:950;
          line-height:1;
          text-shadow:0 0 18px rgba(46,204,113,0.4);
        }
        .wing4-class-phase {
          color:#2ECC71;
          font-size:11px;
          font-weight:900;
          letter-spacing:0.12em;
          text-transform:uppercase;
          border:1px solid rgba(46,204,113,0.35);
          background:rgba(46,204,113,0.09);
          border-radius:999px;
          padding:5px 10px;
        }
        .wing4-class-body {
          padding:24px;
        }
        .wing4-icon-box {
          width:38px;
          height:38px;
          border-radius:12px;
          background:rgba(46,204,113,0.1);
          border:1px solid rgba(46,204,113,0.25);
          display:flex;
          align-items:center;
          justify-content:center;
          flex-shrink:0;
        }
        .wing4-meta-grid {
          display:grid;
          gap:10px;
        }
        .wing4-meta-row {
          display:flex;
          align-items:flex-start;
          gap:10px;
          border:1px solid rgba(46,204,113,0.15);
          border-radius:12px;
          padding:12px 14px;
          background:rgba(46,204,113,0.025);
          color:inherit;
          font-size:13px;
          line-height:1.65;
        }
        .wing4-meta-row span {
          color:rgba(220,235,225,0.78);
        }
        .wing4-meta-row strong {
          color:#2ECC71;
        }
        .wing4-meta-row--soft {
          background:rgba(46,204,113,0.06);
          border-color:rgba(46,204,113,0.24);
        }

        .wing4-core-box {
          border:1px solid rgba(46,204,113,0.28);
          background:rgba(46,204,113,0.06);
          border-radius:18px;
          padding:22px;
          display:flex;
          align-items:center;
          gap:18px;
        }
        .wing4-final-journey {
          display:grid;
          grid-template-columns:repeat(5, 1fr);
          gap:12px;
        }
        .wing4-journey-card {
          position:relative;
          border:1px solid rgba(46,204,113,0.2);
          background:rgba(46,204,113,0.04);
          border-radius:16px;
          padding:24px 14px 16px;
          min-height:142px;
          text-align:center;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:flex-start;
          transition:all .25s ease;
        }
        .wing4-journey-card:hover {
          transform:translateY(-4px);
          border-color:rgba(46,204,113,0.45);
          background:rgba(46,204,113,0.075);
        }
        .wing4-journey-number {
          position:absolute;
          top:-13px;
          width:28px;
          height:28px;
          border-radius:50%;
          display:flex;
          align-items:center;
          justify-content:center;
          background:#2ECC71;
          color:#000;
          font-size:12px;
          font-weight:950;
        }
        .wing4-journey-icon {
          width:38px;
          height:38px;
          border-radius:13px;
          display:flex;
          align-items:center;
          justify-content:center;
          background:rgba(46,204,113,0.11);
          border:1px solid rgba(46,204,113,0.25);
          margin-bottom:10px;
        }
        .wing4-final-grid {
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:16px;
          margin-top:24px;
        }
        .wing4-final-list-card {
          border:1px solid rgba(46,204,113,0.2);
          background:rgba(46,204,113,0.04);
          border-radius:18px;
          padding:20px;
        }

        @media (max-width: 900px) {
          .wing4-rhythm-grid {
            grid-template-columns:repeat(3, 1fr);
          }
          .wing4-final-journey {
            grid-template-columns:repeat(2, 1fr);
          }
          .wing4-final-grid {
            grid-template-columns:1fr;
          }
        }

        @media (max-width: 700px) {
          .hero-grid {
            grid-template-columns: 1fr;
            gap: 0;
          }
          .hero-right-col { display: none; }
          .logo-mobile-block {
            display: block;
            width: 100%;
            margin-bottom: 20px;
          }
          .fee-inline-strip {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            background: rgba(46,204,113,0.09);
            border: 1px solid rgba(46,204,113,0.32);
            border-radius: 12px;
            padding: 8px 16px 8px 12px;
            margin-bottom: 22px;
          }
          .hero-eyebrow-wrap { justify-content: center; }
          .hero-cta-row { justify-content: center; }
          .hero-desc { margin-left:auto; margin-right:auto; }
          .hero-text-col { text-align: center; }
          .format-tags-row { justify-content: center; }

          .wing4-milestone-strip {
            grid-template-columns:repeat(2, 1fr);
            gap:14px;
          }
          .wing4-milestone-line {
            display:none;
          }
          .wing4-class-card {
            grid-template-columns:1fr;
          }
          .wing4-class-side {
            flex-direction:row;
            justify-content:space-between;
            border-right:none;
            border-bottom:1px solid rgba(46,204,113,0.22);
          }
          .wing4-class-no {
            font-size:42px;
          }
          .wing4-class-body {
            padding:20px;
          }
          .wing4-core-box {
            align-items:flex-start;
            flex-direction:column;
          }
        }

        @media (max-width: 520px) {
          .wing4-rhythm-grid {
            grid-template-columns:repeat(2, 1fr);
          }
          .wing4-final-journey {
            grid-template-columns:1fr;
          }
        }

        @media (max-width: 420px) {
          .tab-button { padding:9px 8px; font-size:11px; gap:4px; }
          .roadmap-row { grid-template-columns:85px 1fr; }
        }
      `}</style>

      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', overflow: 'hidden', paddingTop: '108px', paddingBottom: '64px' }}>
        <div
          style={{
            position: 'absolute',
            top: '-140px',
            right: '-140px',
            width: '520px',
            height: '520px',
            background: 'radial-gradient(circle,rgba(46,204,113,0.13) 0%,transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none',
            animation: 'glowPulse 3.5s ease-in-out infinite',
          }}
        />

        <div
          style={{
            position: 'absolute',
            bottom: '-100px',
            left: '-100px',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle,rgba(46,204,113,0.07) 0%,transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none',
            animation: 'glowPulse 5s ease-in-out infinite 1.5s',
          }}
        />

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'none' : 'translateY(-12px)',
              transition: 'opacity .4s ease,transform .4s ease',
              marginBottom: '36px',
            }}
          >
            <Link to={BOOTCAMP_BASE_PATH} className="back-link" style={{ color: t.textSecondary }}>
              <span className="arrow">
                <ChevronLeft size={16} strokeWidth={2.5} />
              </span>
              Back to Bootcamp
            </Link>
          </div>

          <div className="hero-grid">
            <div
              className="hero-text-col"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'none' : 'translateY(30px)',
                transition: 'opacity .6s ease .1s,transform .6s ease .1s',
              }}
            >
              <div style={{ display: 'flex', marginBottom: '18px' }}>
                <div
                  className="hero-eyebrow-wrap"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    flexWrap: 'wrap',
                  }}
                >
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: 'rgba(46,204,113,0.12)',
                      border: '1px solid rgba(46,204,113,0.3)',
                      borderRadius: '999px',
                      padding: '6px 16px',
                    }}
                  >
                    <span
                      style={{
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        backgroundColor: '#2ECC71',
                        display: 'inline-block',
                        boxShadow: '0 0 8px rgba(46,204,113,0.8)',
                        animation: 'dotPulse 2s ease-in-out infinite',
                      }}
                    />
                    <span
                      style={{
                        color: '#2ECC71',
                        fontSize: '12px',
                        fontWeight: 800,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {displayWing.eyebrow}
                    </span>
                  </div>

                  {formatTag && (
                    <div
                      className={`format-tag format-tag--${formatTag.toLowerCase()}`}
                      style={{ animationDelay: '0.2s' }}
                    >
                      {formatTag === 'Team' ? (
                        <UsersRound size={12} strokeWidth={2.5} />
                      ) : (
                        <UserCheck size={12} strokeWidth={2.5} />
                      )}
                      {formatTag}
                    </div>
                  )}
                </div>
              </div>

              <div className="logo-mobile-block">
                <WingLogoFrame
                  src={logoSrc}
                  alt={`${displayWing.title} wing logo`}
                  eyebrow={displayWing.eyebrow}
                  variant="mobile"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div className="fee-inline-strip">
                  <span
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      background: 'rgba(46,204,113,0.15)',
                      border: '1px solid rgba(46,204,113,0.35)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Sparkles size={13} color="#2ECC71" strokeWidth={2} />
                  </span>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                    <span
                      style={{
                        color: '#2ECC71',
                        fontSize: '9px',
                        fontWeight: 800,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        lineHeight: 1,
                      }}
                    >
                      Registration Fee
                    </span>
                    <span
                      style={{
                        color: '#2ECC71',
                        fontSize: '18px',
                        fontWeight: 900,
                        lineHeight: 1.1,
                        textShadow: '0 0 14px rgba(46,204,113,0.5)',
                      }}
                    >
                      {displayWing.fee}
                    </span>
                    <span style={{ color: t.textSecondary, fontSize: '10px', lineHeight: 1 }}>
                      {displayWing.mode}
                    </span>
                  </div>

                  {displayWing.status && (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        backgroundColor: 'rgba(46,204,113,0.12)',
                        border: '1px solid rgba(46,204,113,0.28)',
                        borderRadius: '999px',
                        padding: '3px 10px',
                        color: '#2ECC71',
                        fontSize: '10px',
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <span
                        className="status-dot"
                        style={{
                          width: '5px',
                          height: '5px',
                          borderRadius: '50%',
                          backgroundColor: '#2ECC71',
                          display: 'inline-block',
                        }}
                      />
                      {displayWing.status}
                    </span>
                  )}
                </div>
              </div>

              <h1
                style={{
                  fontSize: 'clamp(36px,5.5vw,64px)',
                  lineHeight: 1.1,
                  fontWeight: 900,
                  marginBottom: '20px',
                  letterSpacing: '-0.025em',
                }}
              >
                {displayWing.title}
              </h1>

              <p
                className="hero-desc"
                style={{
                  color: t.textSecondary,
                  fontSize: '17px',
                  lineHeight: 1.85,
                  maxWidth: '680px',
                  marginBottom: '36px',
                }}
              >
                {displayWing.detailIntro}
              </p>

              <div
                className="hero-cta-row"
                style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center' }}
              >
                <a
                  href={registrationUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => handleRegistrationClick(e, registrationUrl)}
                  className="reg-btn-main"
                >
                  <Sparkles size={15} strokeWidth={2.2} />
                  Register Now — {displayWing.fee}
                </a>

                <Link to={BOOTCAMP_BASE_PATH} className="outline-btn-main">
                  All Wings <ArrowRight size={15} strokeWidth={2} />
                </Link>
              </div>
            </div>

            <div
              className="hero-right-col"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'none' : 'translateX(30px)',
                transition: 'opacity .6s ease .22s,transform .6s ease .22s',
              }}
            >
              <WingLogoFrame
                src={logoSrc}
                alt={`${displayWing.title} wing logo`}
                eyebrow={displayWing.eyebrow}
                variant="desktop"
              />

              <div
                className="fee-badge"
                style={{
                  border: '1.5px solid rgba(46,204,113,0.4)',
                  borderRadius: '22px',
                  padding: '26px 30px',
                  textAlign: 'center',
                  background: 'rgba(46,204,113,0.07)',
                  backdropFilter: 'blur(14px)',
                  boxShadow:
                    '0 8px 36px rgba(46,204,113,0.18), inset 0 1px 0 rgba(46,204,113,0.2)',
                }}
              >
                <p
                  style={{
                    color: '#2ECC71',
                    fontSize: '11px',
                    fontWeight: 800,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    marginBottom: '10px',
                  }}
                >
                  Registration Fee
                </p>

                <p
                  style={{
                    fontSize: '44px',
                    fontWeight: 900,
                    color: '#2ECC71',
                    lineHeight: 1,
                    textShadow: '0 0 24px rgba(46,204,113,0.55)',
                    marginBottom: '8px',
                  }}
                >
                  {displayWing.fee}
                </p>

                <p style={{ color: t.textSecondary, fontSize: '13px', lineHeight: 1.5 }}>
                  {displayWing.mode}
                </p>
              </div>

              {displayWing.status && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <div
                    style={{
                      backgroundColor: 'rgba(46,204,113,0.12)',
                      border: '1px solid rgba(46,204,113,0.3)',
                      borderRadius: '999px',
                      padding: '7px 18px',
                      color: '#2ECC71',
                      fontSize: '13px',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span
                      className="status-dot"
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: '#2ECC71',
                        display: 'inline-block',
                      }}
                    />
                    {displayWing.status}
                  </div>
                </div>
              )}

              {formatTag && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <div
                    className={`format-tag format-tag--${formatTag.toLowerCase()}`}
                    style={{ fontSize: '13px', padding: '7px 20px' }}
                  >
                    {formatTag === 'Team' ? (
                      <UsersRound size={14} strokeWidth={2.5} />
                    ) : (
                      <UserCheck size={14} strokeWidth={2.5} />
                    )}
                    {formatTag} Wing
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          height: '1px',
          background: 'linear-gradient(90deg,transparent,rgba(46,204,113,0.3),transparent)',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      />

      {/* ─── MAIN CONTENT ─────────────────────────────────────────────────── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px 90px' }}>
        {/* Quick Details */}
        <section
          style={{
            marginBottom: '56px',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'none' : 'translateY(24px)',
            transition: 'opacity .6s ease .3s,transform .6s ease .3s',
          }}
        >
          <div className="section-title">
            <div className="section-title-bar" />
            <span className="section-title-text">Quick Details</span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))',
              gap: '14px',
            }}
          >
            {infoItems.map((item, i) => (
              <div
                key={item.label}
                className="info-card-item"
                onMouseEnter={() => setHoveredInfo(i)}
                onMouseLeave={() => setHoveredInfo(null)}
                style={{
                  border:
                    hoveredInfo === i
                      ? '1px solid rgba(46,204,113,.55)'
                      : '1px solid rgba(46,204,113,.16)',
                  borderRadius: '16px',
                  padding: '18px',
                  backgroundColor:
                    hoveredInfo === i ? 'rgba(46,204,113,.07)' : 'rgba(46,204,113,.03)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  {item.icon}
                  <span
                    style={{
                      color: '#2ECC71',
                      fontSize: '11px',
                      fontWeight: 800,
                      letterSpacing: '.1em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {item.label}
                  </span>
                </div>

                <p
                  style={{
                    margin: 0,
                    color: t.textPrimary,
                    fontWeight: 700,
                    fontSize: '14px',
                    lineHeight: 1.6,
                  }}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Tabbed Curriculum */}
        <section
          style={{
            marginBottom: '56px',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'none' : 'translateY(24px)',
            transition: 'opacity .6s ease .42s,transform .6s ease .42s',
          }}
        >
          <div className="section-title">
            <div className="section-title-bar" />
            <span className="section-title-text">Curriculum</span>
          </div>

          <div
            role="tablist"
            aria-label="Bootcamp curriculum tabs"
            style={{
              display: 'flex',
              gap: '4px',
              borderBottom: '1px solid rgba(46,204,113,0.18)',
              marginBottom: '28px',
              flexWrap: 'wrap',
            }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`tab-button ${activeTab === tab.key ? 'tab-active' : ''}`}
                style={{
                  color: activeTab === tab.key ? '#2ECC71' : t.textSecondary,
                  backgroundColor: activeTab === tab.key ? 'rgba(46,204,113,0.07)' : 'transparent',
                  ...(tab.key === 'components'
                    ? {
                        borderTop: '1px solid rgba(46,204,113,0.25)',
                        borderLeft: '1px solid rgba(46,204,113,0.15)',
                        borderRight: '1px solid rgba(46,204,113,0.15)',
                      }
                    : {}),
                }}
              >
                {tab.icon}
                {tab.label}

                {tab.key === 'components' && (
                  <span
                    style={{
                      marginLeft: '4px',
                      background: 'rgba(46,204,113,0.18)',
                      border: '1px solid rgba(46,204,113,0.35)',
                      color: '#2ECC71',
                      fontSize: '9px',
                      fontWeight: 900,
                      letterSpacing: '0.08em',
                      borderRadius: '999px',
                      padding: '1px 7px',
                      textTransform: 'uppercase',
                    }}
                  >
                    W1
                  </span>
                )}
              </button>
            ))}
          </div>

          <div key={activeTab} className="tab-content-anim">
            {activeTab === 'learn' && (
              <>
                {isWing4 && <Wing4MilestoneStrip t={t} />}

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))',
                    gap: '12px',
                  }}
                >
                  {displayWing.highlights.map((item) => (
                    <div key={item} className="learn-card">
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: '#2ECC71',
                          flexShrink: 0,
                          marginTop: '6px',
                          boxShadow: '0 0 6px rgba(46,204,113,0.6)',
                        }}
                      />
                      <span style={{ color: t.textSecondary, fontSize: '14px', lineHeight: 1.75 }}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'roadmap' &&
              (isWing4 ? (
                <Wing4RoadmapSection t={t} />
              ) : (
                <div style={{ display: 'grid', gap: '14px' }}>
                  {displayWing.roadmap.map((item, i) => (
                    <div
                      key={`${item.period}-${item.title}`}
                      className="roadmap-row"
                      style={{
                        backgroundColor:
                          hoveredCard === i ? 'rgba(46,204,113,0.05)' : 'rgba(46,204,113,0.025)',
                      }}
                      onMouseEnter={() => setHoveredCard(i)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <div
                        style={{
                          backgroundColor: 'rgba(46,204,113,0.1)',
                          borderRight: '1px solid rgba(46,204,113,0.2)',
                          padding: '22px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textAlign: 'center',
                        }}
                      >
                        <span
                          style={{
                            color: '#2ECC71',
                            fontWeight: 900,
                            fontSize: '13px',
                            lineHeight: 1.45,
                          }}
                        >
                          {item.period}
                        </span>
                      </div>

                      <div style={{ padding: '22px 26px' }}>
                        <h3
                          style={{
                            fontSize: '17px',
                            fontWeight: 800,
                            marginBottom: '12px',
                            color: t.textPrimary,
                          }}
                        >
                          {item.title}
                        </h3>

                        <ul
                          style={{
                            margin: 0,
                            paddingLeft: '18px',
                            color: t.textSecondary,
                            lineHeight: 1.85,
                            fontSize: '14px',
                          }}
                        >
                          {item.points.map((point) => (
                            <li key={point}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              ))}

            {activeTab === 'outcomes' && (
              <div style={{ display: 'grid', gap: '10px' }}>
                {displayWing.outcomes.map((item, i) => (
                  <div key={item} className="outcome-row">
                    <span
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(46,204,113,0.15)',
                        border: '1.5px solid rgba(46,204,113,0.4)',
                        color: '#2ECC71',
                        fontSize: '12px',
                        fontWeight: 900,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '1px',
                      }}
                    >
                      {i + 1}
                    </span>
                    <span style={{ color: t.textSecondary, fontSize: '15px', lineHeight: 1.78 }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'components' && isWing1 && <ComponentsTable t={t} />}
          </div>
        </section>

        {isWing4 && <Wing4FinalHackathon t={t} mounted={mounted} />}

        {/* Final CTA */}
        <section
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'none' : 'translateY(24px)',
            transition: 'opacity .6s ease .54s,transform .6s ease .54s',
          }}
        >
          <div
            style={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '24px',
              border: '1px solid rgba(46,204,113,0.3)',
              padding: '60px 40px',
              background:
                'linear-gradient(135deg,rgba(46,204,113,0.09) 0%,rgba(46,204,113,0.03) 100%)',
              textAlign: 'center',
              animation: 'borderGlow 4s ease-in-out infinite',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-70px',
                left: '-70px',
                width: '240px',
                height: '240px',
                background: 'radial-gradient(circle,rgba(46,204,113,0.14) 0%,transparent 70%)',
                borderRadius: '50%',
                pointerEvents: 'none',
              }}
            />

            <div
              style={{
                position: 'absolute',
                bottom: '-70px',
                right: '-70px',
                width: '240px',
                height: '240px',
                background: 'radial-gradient(circle,rgba(46,204,113,0.1) 0%,transparent 70%)',
                borderRadius: '50%',
                pointerEvents: 'none',
              }}
            />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(46,204,113,0.12)',
                  border: '1px solid rgba(46,204,113,0.32)',
                  borderRadius: '999px',
                  padding: '6px 18px',
                  marginBottom: '22px',
                  color: '#2ECC71',
                  fontSize: '12px',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                <Sparkles size={13} strokeWidth={2.2} color="#2ECC71" />
                {displayWing.fee === 'Free'
                  ? '100% Free — Limited Seats'
                  : `${displayWing.fee} — Limited Seats`}
              </div>

              <h2
                style={{
                  fontSize: 'clamp(24px,4vw,42px)',
                  fontWeight: 900,
                  marginBottom: '16px',
                  letterSpacing: '-0.015em',
                }}
              >
                Ready to Join{' '}
                <span
                  style={{
                    color: '#2ECC71',
                    textShadow: '0 0 20px rgba(46,204,113,0.4)',
                  }}
                >
                  {displayWing.shortTitle}
                </span>
                ?
              </h2>

              <p
                style={{
                  color: t.textSecondary,
                  fontSize: '16px',
                  lineHeight: 1.8,
                  maxWidth: '560px',
                  margin: '0 auto 36px',
                }}
              >
                {isWing4
                  ? 'Build, connect, deploy, secure, and present a real web application through six practical classes and a final hackathon.'
                  : 'This bootcamp wing is completely free. Secure your spot now before seats fill up.'}
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <a
                  href={registrationUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => handleRegistrationClick(e, registrationUrl)}
                  className="final-cta-reg"
                >
                  Register for {displayWing.shortTitle}
                  <ArrowRight size={17} strokeWidth={2.5} />
                </a>

                <Link
                  to={BOOTCAMP_BASE_PATH}
                  className="outline-btn-main"
                  style={{ padding: '15px 28px', fontSize: '15px' }}
                >
                  Explore All Wings
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}