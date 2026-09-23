/**
 * CV content.
 *
 * Built from the CV the owner supplied, edited for a recruiter's reading
 * speed: every "designed concepts around…" bullet was replaced with a fact
 * that can be counted in a repository, and the project list was extended
 * with work the original draft left out.
 *
 * Rule: if a number appears here, it is countable in the source.
 */

/**
 * The downloadable PDF, printed from /cv by `npm run cv:pdf`. The filename
 * carries the owner's name because a recruiter's downloads folder is full of
 * files called "cv.pdf".
 */
export const CV_PDF = {
  filename: "Oluwayemi-Oyinlola-Michael-CV.pdf",
  href: "/Oluwayemi-Oyinlola-Michael-CV.pdf",
} as const;

export const cvMeta = {
  title: "Software Engineer",
  subtitle: "Software Engineering · Data Engineering · Application Security · Developer Tools",
  updated: "2026",
};

export const summary = [
  "Software engineer in Lagos, Nigeria, working across software engineering, data engineering and application security in Go, Python and TypeScript. I build products end to end: APIs and data models, processing pipelines and search, authentication and payments, and the Linux infrastructure they run on.",
  "Recent work includes a virtual football platform that shows every match identically on web, mobile and TV, a network intrusion detection system that explains each alert, a tool that enforces commit policy on GitHub, and Zudojs, an open-source TypeScript framework for building backends.",
  "On the data side, I build services that turn raw input into something people can use: network traffic into scored security incidents, audio into matched hymns and Bible verses, and simulated matches into prices, risk limits and analytics.",
  "Studying for a BSc in Computer Science at the University of the People. Open to software engineering, data engineering and platform roles.",
];

export type SkillGroup = { label: string; items: string };

export const skills: SkillGroup[] = [
  { label: "Languages", items: "Go · Python · TypeScript · JavaScript · SQL · Bash" },
  { label: "Software Engineering", items: "Node.js · Fastify · Express · Gin · FastAPI · REST APIs · gRPC · WebSockets" },
  {
    label: "Data Engineering",
    items: "Data Pipelines · Event Processing · Batch Jobs · Full-Text Search · Ranking · Recommendations · Analytics · Kafka",
  },
  { label: "Databases", items: "PostgreSQL · MySQL · MariaDB · Redis · SQLite" },
  { label: "Data Tooling", items: "Prisma · SQLAlchemy · Alembic · ent + Atlas · sqlc · BullMQ" },
  {
    label: "Architecture",
    items: "Modular Monolith · Microservices · Event-Driven Design · CQRS · Hexagonal Architecture",
  },
  {
    label: "Security",
    items: "Authentication & 2FA · Role-Based Access Control · Webhook Verification · Rate Limiting · Intrusion Detection · OWASP",
  },
  { label: "Infrastructure", items: "Linux · Docker · Kubernetes · Terraform · Nginx · Git · CI/CD · GitHub Actions" },
  { label: "Engineering Practice", items: "API Design · OpenAPI · Automated Testing · Technical Writing · CLI Tools" },
  { label: "Frontend & Mobile", items: "React · Next.js · Tailwind CSS · React Native · Expo" },
];

export type SoftSkill = { label: string; detail: string };

/**
 * Soft skills, each tied to something that happened rather than asserted.
 * An ATS matches the label; a recruiter reads the detail.
 */
export const softSkills: SoftSkill[] = [
  { label: "Leadership", detail: "Led engineering on Telente CBT and LearnBridge, from first design to delivery." },
  { label: "Written Communication", detail: "Write the design specs, READMEs and API documentation for every project I ship." },
  { label: "Teamwork", detail: "Work in shared codebases with the Newdich team and with an Orange internship team." },
  { label: "Problem Solving", detail: "Turn loosely defined product ideas into data models, services and workflows before coding." },
  { label: "Client Communication", detail: "Scoped and delivered software for schools, a church, a food business and savings groups." },
  { label: "Self-Directed Learning", detail: "Learned Go, Python data tooling and security practice alongside a degree and paid work." },
  { label: "Remote Work", detail: "Work asynchronously from WAT (UTC+1) and keep several projects moving at once." },
];

export type CvRole = {
  title: string;
  org: string;
  period: string;
  location?: string;
  blurb: string;
  points: string[];
  tech: string;
};

export const roles: CvRole[] = [
  {
    title: "Backend Engineer",
    org: "Newdich Technology",
    period: "2025 – Present",
    blurb: "Software, IoT and cybersecurity company with offices in Abuja and Okitipupa.",
    points: [
      "Build and maintain backend services in Node.js and TypeScript as part of the engineering team.",
      "Design the APIs between services and the data behind them, so other engineers can build on them safely.",
      "Designed and built the company website to a written design specification.",
    ],
    tech: "Node.js · TypeScript · REST APIs · PostgreSQL · Docker · Linux",
  },
];

export type CvProject = {
  name: string;
  role: string;
  slug?: string;
  /**
   * false keeps a project on the web CV but off the PDF. A CV is read in
   * about a minute; the PDF carries the strongest work and points at
   * /work for the rest.
   */
  paper?: boolean;
  line: string;
  points: string[];
  tech: string;
};

export const projects: CvProject[] = [
  {
    name: "Zudojs",
    role: "Author, Open Source",
    slug: "zudojs",
    line: "Open-source TypeScript framework that gives a backend project a ready-made foundation.",
    points: [
      "Provides the parts most backends rebuild every time: dependency injection, configuration, logging, events, database access, queues, storage, security and multi-tenancy.",
      "Starts and stops services in the right order, so an app never closes a database connection while something still needs it.",
      "Includes a CLI that generates new full-stack projects. BetNG and Scriptune are built on it.",
    ],
    tech: "TypeScript · Node.js · pnpm Workspaces · Zod",
  },
  {
    name: "BetNG",
    role: "Author, Open Source",
    slug: "betng",
    line: "Virtual football platform where every match is simulated once and shown identically on web, mobile, TV, shop and admin apps.",
    points: [
      "Splits the platform into independent TypeScript and Python services for matches, betting, wallets, settlement, odds, risk and analytics.",
      "Makes results impossible to tamper with: betting closes before kick-off, outcomes come from a secret server seed, and the database refuses edits to finished results.",
      "Keeps money exact by storing every amount in whole kobo, and pays out at the odds recorded when each bet was placed.",
    ],
    tech: "TypeScript · Python · FastAPI · PostgreSQL · Redis · React · Expo · Playwright · Docker",
  },
  {
    name: "SentinelX",
    role: "Author, Open Source",
    slug: "sentinelx",
    line: "Self-hosted intrusion detection and prevention for homelabs and small offices.",
    points: [
      "Watches live network traffic or packet captures and detects port scans, brute-force logins, floods, DNS abuse and custom rule matches.",
      "Groups related alerts into incidents and gives each a 0–100 risk score with the reasons behind it.",
      "Can block an attacker through the host firewall, but only after an administrator switches blocking on, and never against protected addresses.",
    ],
    tech: "Python · FastAPI · SQLAlchemy · PostgreSQL · Redis · Scapy · Next.js · Docker",
  },
  {
    name: "CommitGuard",
    role: "Author, Open Source",
    slug: "commitguard",
    line: "Stops AI coding agents from being credited in Git commits where a project's policy forbids it.",
    points: [
      "Checks commits on the developer's machine, in pull requests through a GitHub Action, and across an organisation through a GitHub App with a dashboard.",
      "Sees through disguised names, such as look-alike letters or invisible characters, that a plain text match would miss.",
      "Reads its policy from the main branch, so a pull request cannot switch off its own check. Published on PyPI and the GitHub Marketplace.",
    ],
    tech: "Python · Typer · Pydantic · SQLite · GitHub Apps · GitHub Actions · React · TypeScript",
  },
  {
    name: "Scriptune",
    role: "Author, Open Source",
    slug: "scriptune",
    line: "Listens to a hymn or a Bible verse and tells you what it is, on web, iPhone and Android.",
    points: [
      "Turns speech into text with Whisper, on a self-hosted server or on the phone itself, and never keeps the recording.",
      "Matches misheard or partial lines against seven Bible translations, including Yoruba, and 1,200 hymns.",
      "Works offline, including search and listening, for use in church with no signal.",
    ],
    tech: "TypeScript · Python · FastAPI · Whisper · PostgreSQL · Next.js · Expo · React Native",
  },
  {
    name: "Kolo",
    role: "Backend Engineer",
    slug: "kolo",
    line: "Digital platform for Ajo and Esusu savings groups, with payments through Nomba.",
    points: [
      "Records every contribution in a double-entry ledger, so each member's balance can be traced to the payments behind it.",
      "Confirms each payment directly with Nomba before crediting a wallet, so a forged notification cannot create money.",
      "Runs payouts, reminders and notifications in the background so the app stays fast.",
    ],
    tech: "TypeScript · Fastify · Prisma · PostgreSQL · Redis · BullMQ · React · Nomba",
  },
  {
    name: "Telente CBT",
    role: "Lead Engineer",
    slug: "telente-cbt",
    line: "Computer-based testing platform for schools and universities.",
    points: [
      "Runs timed exams with questions shuffled for each candidate, across four question types.",
      "Generates exam questions with AI through a separate service that students can never reach directly.",
      "Serves many schools from one platform, each with its own exams, students and billing.",
    ],
    tech: "TypeScript · Fastify · Prisma · PostgreSQL · Redis · Python · FastAPI · Docker",
  },
  {
    name: "Church Management System",
    role: "Author, Open Source",
    slug: "church-cms",
    line: "Records system and public website for a church in Okitipupa, Ondo State.",
    points: [
      "Manages members, households, attendance, income and expenses, plus the announcements and gallery on the public site.",
      "Gives each staff member only the access their job needs, logs every change, and can sign anyone out instantly.",
    ],
    tech: "Node.js · Express · MySQL · JWT · Tailwind CSS",
  },
  {
    name: "PowerWatch",
    role: "Backend Engineer, Team Project",
    slug: "powerwatch",
    line: "Lets people report power outages where they live and see outages near them on a map.",
    points: [
      "Built the backend for an Orange internship team: reports, outages, notifications and area summaries.",
      "Places every report in a location hierarchy from state down to neighbourhood, so the same data answers street-level and state-level questions.",
      "Turns many reports of one blackout into a single outage with a start, an end and a duration.",
    ],
    tech: "TypeScript · Fastify · Prisma · MySQL · Firebase · Swagger",
  },
  {
    name: "Utils-tool",
    role: "Author, Live",
    slug: "utils-tool",
    line: "Image, PDF, file and developer tools that run on your own machine or online, with no accounts and no stored uploads.",
    points: [
      "Compresses, converts, resizes and watermarks images, removes backgrounds, merges and splits PDFs, and generates favicons and QR codes.",
      "Only offers the tools the server can actually run, and rejects unsafe or oversized uploads.",
    ],
    tech: "Python · FastAPI · Pillow · pikepdf · Ghostscript · rembg",
  },
  {
    name: "Telente Store",
    paper: false,
    role: "Author",
    slug: "telente-store",
    line: "E-commerce platform with storefront, admin dashboard and API in one service.",
    points: [
      "24 feature modules behind a DI container and CQRS buses, with 150+ routes over 31 models.",
      "Inventory stored as a ledger of stock movements, so every oversell can be traced.",
      "Paystack payments and webhooks, tracked email delivery, OTP sign-in and rate limiting.",
    ],
    tech: "TypeScript 5.9 · Fastify 5 · Prisma · MySQL 8.4 · Paystack · Docker",
  },
  {
    name: "AgentLab",
    paper: false,
    role: "Author",
    slug: "agentlab",
    line: "Runs and scores AI agents across browser, sandbox and desktop environments.",
    points: [
      "Each environment has an offline mock and a cloud version, so the demo runs with no API keys.",
      "Scores runs on five weighted criteria with fixed rules, so two runs can be compared directly.",
    ],
    tech: "TypeScript · Node.js · Solari SDK · Gemini · Groq",
  },
  {
    name: "Soft Beans Palace",
    paper: false,
    role: "Designer & Engineer, Live",
    slug: "soft-beans-palace",
    line: "Online ordering for a Port Harcourt food business. Orders are sent to the business on WhatsApp.",
    points: [
      "Prices live in one data file that feeds the menu, cart, checkout and the WhatsApp message.",
    ],
    tech: "Next.js · TypeScript · Tailwind CSS · Zustand · React Hook Form · Zod",
  },
];


export type CvEducation = {
  title: string;
  org: string;
  period: string;
  note?: string;
};

export const cvEducation: CvEducation[] = [
  {
    title: "BSc Computer Science",
    org: "University of the People",
    period: "In Progress",
    note: "Coursework in software engineering, databases, computer systems and theory of computation.",
  },
  {
    title: "Senior Secondary School Certificate",
    org: "Optimum Victory College, Okitipupa, Ondo State",
    period: "Completed",
  },
];

export type CvCertification = { title: string; org: string; note?: string };

export const certifications: CvCertification[] = [
  { title: "Forward Deployed Engineer", org: "Nomba" },
  { title: "Software Engineering", org: "Newdich Technology" },
  { title: "Front-End Development", org: "ALX" },
  { title: "AI Career Essentials", org: "ALX" },
  { title: "Virtual Assistant", org: "ALX" },
];

export const development = [
  "Data Engineering: Python, Pipelines and Analytics",
  "Cybersecurity: Linux, API Hardening and Authentication",
  "Distributed Systems",
  "Go Development",
  "Database Systems and SQL Optimisation",
  "Developer Tooling and Framework Engineering",
];

export const philosophy = [
  "I approach software from both a product and a systems perspective. Making an application work is the beginning: the questions I care about are how its architecture should be organised, how data moves through it, how components communicate, how authentication and security are handled, how another engineer will find their way around it, and how it survives its requirements changing.",
  "What I enjoy most is taking a complex idea and breaking it into clear systems, services, modules, APIs, data models and workflows. The long-term direction is complex backend systems, distributed infrastructure, data platforms and secure applications.",
];
