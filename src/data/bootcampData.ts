export interface BootcampRoadmapItem {
  period: string;
  title: string;
  points: string[];
}

export interface BootcampWing {
  id: number;
  slug: string;
  title: string;
  shortTitle: string;
  eyebrow: string;
  summary: string;
  detailIntro: string;
  targetGroup: string;
  mode: string;
  groupFormat: string;
  requirement: string;
  timeline: string;
  classCount: string;
  capacity?: string;
  softwareAccess?: string;
  status?: string;
  fee: string;
  registrationUrl: string;
  highlights: string[];
  roadmap: BootcampRoadmapItem[];
  outcomes: string[];
}

export const BOOTCAMP_TITLE = 'Robotics Bootcamp 101';
export const BOOTCAMP_BASE_PATH = '/bootcamp';

export const bootcampWings: BootcampWing[] = [
  {
    id: 1,
    slug: 'basic-robotics-projects',
    title: 'Basic Robotics & Projects',
    shortTitle: 'Basic Robotics',
    eyebrow: 'Wing 01',
    summary:
      'A beginner-friendly hands-on wing for learning electronics, sensors, microcontrollers, relays, Bluetooth control, automation, and smart IoT-style robotics projects.',
    detailIntro:
      'This wing introduces beginners and general members to electronics and microcontroller-based robotics through team projects. Participants will build practical automated systems using sensors, relays, wireless control, and environmental data collection.',
    targetGroup: 'Beginners and general members interested in robotics and electronics.',
    mode: 'Physical, on-campus.',
    groupFormat: 'Team-based approach with a maximum of 4 members per group.',
    requirement: 'No prior experience needed.',
    timeline: '3 Weeks',
    classCount: '5 Classes',
    fee: 'Free',
    registrationUrl: '#',
    highlights: [
      'Microcontroller outputs and basic signals',
      'Sensor-based automation',
      'Relay and motor control',
      'Bluetooth-based wireless device control',
      'Final smart weather station project',
    ],
    roadmap: [
      {
        period: 'Week 1',
        title: 'Microcontroller Output & Sensor Automation',
        points: [
          'Class 1: Smart LED Control & Sensor-Based Night Lamp.',
          'Understand microcontroller outputs, digital/analog signals, and LDR automation.',
          'Class 2: Motion-Activated System Control using PIR sensors and relay modules.',
        ],
      },
      {
        period: 'Week 2',
        title: 'Environment Automation & Wireless Control',
        points: [
          'Class 3: Soil Moisture-Based Plant Watering System.',
          'Automate a motor pump based on real-time environmental input.',
          'Class 4: Bluetooth-Controlled Device using smartphone-based wireless communication.',
        ],
      },
      {
        period: 'Week 3',
        title: 'Final IoT-Based Smart Weather Station',
        points: [
          'Class 5: Smart Weather Station with IoT concept.',
          'Interface environmental sensors such as DHT11.',
          'Display and present environmental data through the final project.',
        ],
      },
    ],
    outcomes: [
      'Build beginner-level robotics circuits confidently.',
      'Understand sensors, relays, motors, and digital/analog signals.',
      'Complete a team-based smart weather station project.',
    ],
  },
  {
    id: 2,
    slug: 'pcb-design-fabrication',
    title: 'PCB Design & Fabrication',
    shortTitle: 'PCB Design',
    eyebrow: 'Wing 02',
    summary:
      'An intermediate hardware wing for moving from breadboards to professional PCB design, layout routing, fabrication, soldering, and real hardware verification.',
    detailIntro:
      'This wing helps intermediate members transition from temporary breadboard circuits to permanent hardware designs. Participants will learn schematic design, custom footprint mapping, PCB layout rules, fabrication, soldering, and board verification.',
    targetGroup: 'Intermediate members moving from breadboards to professional hardware designs.',
    mode: 'Physical, on-campus laboratory sessions.',
    groupFormat: 'Solo participation only.',
    requirement: 'Each participant must bring their own laptop and internet facility.',
    timeline: '3 Lab Days / Flexible Weekly Batches',
    classCount: '3 Sessions',
    capacity: 'Up to 30–40 members per batch.',
    fee: 'Free',
    registrationUrl: '#',
    highlights: [
      'Schematic design in CAD software',
      'Component selection and custom footprint mapping',
      'PCB layout, routing, trace width, vias, and ground planes',
      'DIY fabrication through toner transfer and chemical etching',
      'Drilling, soldering, and hardware verification',
    ],
    roadmap: [
      {
        period: 'Day 1',
        title: 'Schematic Design',
        points: [
          'Master component selection for PCB-ready circuits.',
          'Create and map custom footprints.',
          'Run electrical rule checks (ERC) in CAD software.',
        ],
      },
      {
        period: 'Day 2',
        title: 'PCB Layout & Routing',
        points: [
          'Understand trace width constraints and routing discipline.',
          'Design ground planes and via placements.',
          'Apply design for manufacturing (DFM) principles.',
        ],
      },
      {
        period: 'Day 3',
        title: 'PCB Fabrication & DIY Etching',
        points: [
          'Hands-on toner transfer and chemical etching.',
          'Board drilling, soldering, and finishing.',
          'Hardware verification and troubleshooting.',
        ],
      },
      {
        period: 'Batch Schedule',
        title: 'Available Weekly Batches',
        points: [
          'Batch 1: Every Monday at 4:20 PM.',
          'Batch 2: Every Tuesday at 3:30 PM.',
          'Batch 3: Every Thursday at 4:20 PM.',
        ],
      },
    ],
    outcomes: [
      'Design a PCB from schematic to routed board.',
      'Understand fabrication-ready layout rules.',
      'Fabricate, solder, and verify a physical board.',
    ],
  },
  {
    id: 3,
    slug: '3D-design-&-modeling',
    title: '3D Design & Modeling',
    shortTitle: 'SOLIDWORKS',
    eyebrow: 'Wing 03',
    summary:
      'A mechanical design wing for learning 3D CAD, part modeling, assembly mating, technical drawings, exploded views, simulation basics, and portfolio direction.',
    detailIntro:
      'This wing is designed for members interested in mechanical design, product modeling, structural prototyping, and robotics chassis engineering. The roadmap starts from sketching fundamentals and moves toward project-based part modeling, assemblies, technical drawings, and basic FEA analysis.',
    targetGroup: 'Members interested in mechanical design, product modeling, structural prototyping, or robotics chassis engineering.',
    mode: 'Online with live interactive sessions.',
    groupFormat: 'Individual participation; no grouping required.',
    requirement: 'Basic computer literacy; no prior CAD experience required.',
    timeline: '8 Classes',
    classCount: '8 Classes',
    softwareAccess: 'Free or student-licensed CAD tools.',
    fee: 'Free',
    registrationUrl: '#',
    highlights: [
      'Sketching fundamentals and design intent',
      'Part modeling with essential SOLIDWORKS features',
      'Assembly design and component mating',
      'Exploded views and technical drawings',
      'Basic FEA simulation and project analysis',
    ],
    roadmap: [
      {
        period: 'Class 1',
        title: 'Introduction, Sketching Fundamentals & Design Intent',
        points: [
          'Understand the SOLIDWORKS workspace and workflow.',
          'Learn sketching basics and design intent.',
        ],
      },
      {
        period: 'Class 2',
        title: 'Advanced Sketching & Essential Features',
        points: [
          'Use Extrude, Cut, Fillet, Chamfer, Pattern, and Mirror.',
          'Create clean feature-based part structures.',
        ],
      },
      {
        period: 'Classes 3–4',
        title: 'Project Introduction & Part Modeling',
        points: [
          'Start the project model with guided part modeling.',
          'Continue project part modeling with improved precision and workflow.',
        ],
      },
      {
        period: 'Classes 5–6',
        title: 'Assembly, Mating, Exploded Views & Drawings',
        points: [
          'Create assemblies and apply component mating.',
          'Complete assembly design, exploded views, and technical drawings.',
        ],
      },
      {
        period: 'Class 7',
        title: 'Simulation & Project Analysis',
        points: [
          'Introduction to simulation and basic FEA concepts.',
          'Analyze the project model for basic structural understanding.',
        ],
      },
      {
        period: 'Class 8',
        title: 'Problem Solving, Certification & Career Roadmap',
        points: [
          'Offline problem-solving session and learning resources.',
          'CSWA/CSWP certification roadmap.',
          'Portfolio building and CAD/CAE/mechanical design career opportunities.',
        ],
      },
    ],
    outcomes: [
      'Model parts and assemblies using SOLIDWORKS.',
      'Prepare technical drawings and exploded views.',
      'Understand CAD portfolio and certification pathways.',
    ],
  },
  {
    id: 4,
    slug: 'web-app-development',
    title: 'Web App Development',
    shortTitle: 'Web App Design',
    eyebrow: 'Wing 04',
    summary:
      'A beginner-friendly web app bootcamp where participants build one practical project from the first backend endpoint to a complete, secure, deployed web application.',
    detailIntro:
      'This wing introduces software architecture and IoT web dashboard development. Participants will learn how hardware systems can be connected with real-time software interfaces, databases, and active data streams to build a functional robotics control dashboard.',
    targetGroup: 'Members looking to expand into software architecture, full-stack development, or IoT web dashboard implementations.',
    mode: 'To be announced.',
    groupFormat: 'Individual or team format to be announced.',
    requirement: 'Basic computer literacy and interest in web technologies.',
    timeline: 'Planning in progress',
    classCount: 'To be announced',
    status: 'Curriculum planning in progress.',
    fee: 'Free',
    registrationUrl: '#',
    highlights: [
      'Understand the full web flow from browser to backend and database.',
      'Build and test REST APIs with useful endpoints and reliable responses.',
      'Work with stored data, database-backed CRUD operations, and fast temporary data.',
      'Database management concepts',
      'Active data streams and final robotics control dashboard',
    ],
    roadmap: [
      {
        period: 'Proposed Week 1',
        title: 'Web Interface Fundamentals',
        points: [
          'Understand the structure of modern web applications.',
          'Build clean and responsive UI sections for robotics dashboards.',
          'Learn layout, components, and user experience basics.',
        ],
      },
      {
        period: 'Proposed Week 2',
        title: 'Frontend Interactivity & Data Flow',
        points: [
          'Add interactive UI behavior and reusable components.',
          'Understand how web apps exchange data with backend/API services.',
          'Prepare dashboard sections for real-time hardware data.',
        ],
      },
      {
        period: 'Proposed Week 3',
        title: 'Database & Active Data Streams',
        points: [
          'Learn basic database management for IoT-style applications.',
          'Understand active data streams and live dashboard updates.',
          'Connect robotics data conceptually with web visualization.',
        ],
      },
      {
        period: 'Proposed Week 4',
        title: 'Final Robotics Control Dashboard',
        points: [
          'Build a final dashboard interface for robotics monitoring/control.',
          'Organize project structure for deployment.',
          'Prepare a functional demo and presentation.',
        ],
      },
    ],
    outcomes: [
      'Understand how robotics systems connect with web dashboards.',
      'Design clean interfaces for real-time monitoring.',
      'Prepare a deployable robotics control dashboard concept.',
    ],
  },
];

export function getBootcampWingBySlug(slug?: string): BootcampWing | undefined {
  return bootcampWings.find((wing) => wing.slug === slug);
}
