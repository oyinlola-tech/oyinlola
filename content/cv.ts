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
  title: "Software Engineer · Backend Developer",
  subtitle: "Python & data engineering · distributed systems · application security",
  updated: "2026",
};

export const summary = [
  "Backend-focused software engineer in Lagos, Nigeria, building production systems in Go, Python and TypeScript since 2023. I design and own the parts of a product users never see — APIs, data models, authentication, payments, queues, security controls and the Linux infrastructure underneath — from the first schema to the deployed service.",
  "As founder and lead engineer of ZudoMart I designed a 79-module Go modular monolith across five bounded domains, with escrow, verification and risk scoring modelled as explicit state machines. I also author Zudojs, a 39-package open-source TypeScript framework, and have used it to ship multi-service systems such as BetNG — twelve TypeScript and Python services behind one 187-route gateway — alongside platforms for savings groups, schools, retailers, logistics and a local church.",
  "Security runs through the work rather than beside it: SentinelX, a network intrusion detection and prevention platform with explained risk scores, and CommitGuard, a commit-provenance policy engine published to PyPI and the GitHub Marketplace. I write the tests, benchmarks and documentation that let another engineer trust a system without having to take my word for it.",
  "Currently completing a BSc in Computer Science at the University of the People while deepening data engineering, distributed systems and application security. Open to backend, platform and software engineering roles.",
];

export type SkillGroup = { label: string; items: string };

export const skills: SkillGroup[] = [
  { label: "Languages", items: "Go · Python · TypeScript · JavaScript · SQL · Bash" },
  { label: "Backend", items: "Gin · Fastify · Express · FastAPI · Node.js · REST APIs · gRPC" },
  { label: "Databases", items: "PostgreSQL · MariaDB · MySQL · Redis · SQLite / libSQL" },
  { label: "Data tooling", items: "Prisma · ent + Atlas · sqlc · pgx · Sequelize · BullMQ · Kafka" },
  {
    label: "Architecture",
    items: "Modular monolith · Microservices · Event-driven · CQRS · DI containers · Hexagonal",
  },
  { label: "Data", items: "Data pipelines · Event processing · Ranking · Recommendations · Analytics" },
  {
    label: "Security",
    items: "Argon2 · TOTP / 2FA · JWT & sessions · RBAC · HMAC webhooks · Rate limiting · OWASP practice",
  },
  { label: "Infrastructure", items: "Linux · Kali · Docker · Git · SSH · Nginx · CI/CD · Terraform" },
  { label: "Practice", items: "API design · Swagger / OpenAPI · Postman · Testing · Documentation · CLI tooling" },
  { label: "Frontend", items: "React · Next.js · Tailwind CSS · Three.js · Vanilla HTML/CSS/JS" },
];

export type SoftSkill = { label: string; detail: string };

/**
 * Soft skills, each tied to something that happened rather than asserted.
 * An ATS matches the label; a recruiter reads the detail.
 */
export const softSkills: SoftSkill[] = [
  {
    label: "Ownership & leadership",
    detail: "Founded ZudoMart and lead its engineering end to end; lead engineer on Telente CBT and LearnBridge.",
  },
  {
    label: "Written communication",
    detail: "Design specifications, READMEs, API documentation and architecture write-ups that another engineer can build from.",
  },
  {
    label: "Team collaboration",
    detail: "Ship on shared codebases with the Newdich team and an Orange internship team, through typed contracts and code review.",
  },
  {
    label: "Problem solving & systems thinking",
    detail: "Break an ambiguous product idea into services, data models, workflows and failure cases before writing code.",
  },
  {
    label: "Client & stakeholder communication",
    detail: "Delivered software for schools, a church, a food business and savings groups, translating their needs into scope.",
  },
  {
    label: "Self-directed learning",
    detail: "Study for a CS degree alongside production work; taught myself Go, Python data tooling and security practice.",
  },
  {
    label: "Remote work & time management",
    detail: "Work asynchronously across time zones from WAT (UTC+1), with milestone-driven delivery on multiple concurrent projects.",
  },
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
    title: "Founder & Lead Engineer",
    org: "ZudoMart",
    period: "2023 — present",
    blurb:
      "Africa-first social commerce platform combining marketplace, services, micro-gigs, live commerce and a multi-layer trust engine. Joined FasterCapital's EquityPilot programme in January 2026.",
    points: [
      "Designed and built the backend as a single Go deployable organised into 79 modules across five bounded domains — commerce, social, creator, platform and core.",
      "Chose a modular monolith over microservices and enforced it structurally: modules communicate by command, query and Kafka event, never by reaching into each other's data, so any domain can be extracted as a build change rather than a rewrite.",
      "Defined the database once as ent schemas with Atlas generating versioned migrations, removing drift between the ORM and the database across a schema this size.",
      "Built the trust engine — three-tier verification, escrow with dispute windows and automated release timers, and account-level risk scoring — as explicit state machines.",
      "Implemented money as minor units in a package that carries currency and refuses cross-currency arithmetic, so escrow, payouts, commissions and refunds round in one place.",
      "Ran a separate Python/FastAPI service for recommendation, ranking, moderation and forecasting, so retraining a model never requires redeploying the payment path.",
      "Owned deployment: Docker, Kubernetes, Terraform, Traefik and monitoring, versioned alongside the code.",
    ],
    tech: "Go · chi · ent + Atlas · PostgreSQL · Redis · Kafka · Python · FastAPI · Docker · Kubernetes · Terraform · Linux",
  },
  {
    title: "Backend Engineer",
    org: "Newdich Technology",
    period: "2025 — present",
    blurb:
      "Backend engineering in Node.js and TypeScript as part of the Newdich Technology team, a software, IoT and cybersecurity company operating out of Abuja and Okitipupa.",
    points: [
      "Build backend services in Node.js and TypeScript on a shared, team-owned codebase — service design, data modelling and API implementation.",
      "Define typed API contracts between services rather than shared internals, so a boundary stays legible to engineers who did not write it.",
      "Designed and built the Newdich Technology company website, governed by a written design specification the code must follow.",
    ],
    tech: "Node.js · TypeScript · REST APIs · PostgreSQL · Docker · Linux",
  },
];

export type CvProject = {
  name: string;
  role: string;
  slug?: string;
  line: string;
  points: string[];
  tech: string;
};

export const projects: CvProject[] = [
  {
    name: "Zudojs",
    role: "Author · open source",
    slug: "zudojs",
    line: "A 39-package modular TypeScript framework — the building blocks under a backend, rather than another HTTP framework.",
    points: [
      "Independent packages for DI, lifecycle, configuration, logging, events, CQRS, HTTP, database, transactions, queues, messaging, storage, security, tenancy, feature flags and observability.",
      "Token-based dependency injection instead of decorator reflection: no compiler flag, no bundler breakage, and a dependency graph you can read.",
      "Lifecycle as a real state machine — startup ordered by declared dependencies, teardown in reverse, so a consumer can never outlive the connection it reads through.",
      "A CLI that generates fullstack projects, plus 11 frontend framework adapters over the same backend contracts; the foundation under BetNG and Scriptune.",
    ],
    tech: "TypeScript · Node.js · pnpm workspaces · Zod · ESM",
  },
  {
    name: "BetNG",
    role: "Author · open source",
    slug: "betng",
    line: "A virtual football platform where every match is simulated once and seen identically on five clients, with twelve TypeScript and Python services behind one gateway.",
    points: [
      "Built 12 backend services — a gateway and seven TypeScript services on Zudojs and Prisma, plus four Python services on FastAPI — each writing only its own PostgreSQL schema and calling the others over authenticated RPC.",
      "Made the match result tamper-proof by design: betting closes before kick-off, the seed is an HMAC under a server secret, and database triggers reject any change to a committed result.",
      "Documented 14 platform invariants, each mapped to the constraint that enforces it and the test that proves it, with 2,200+ Python tests, 171 TypeScript test files and a 22-step end-to-end scenario.",
      "Shipped five clients (web, TV, shop and admin on React 19 and Vite, mobile on Expo) over a 187-route gateway, with money held as integer kobo end to end.",
    ],
    tech: "TypeScript · Zudojs · Prisma · Python · FastAPI · PostgreSQL · Redis · React · Expo · Playwright · Docker",
  },
  {
    name: "SentinelX",
    role: "Author · open source",
    slug: "sentinelx",
    line: "A self-hosted network intrusion detection and prevention platform where every alert shows its evidence, thresholds and risk breakdown.",
    points: [
      "13 detectors, a bounded YAML rule language with embedded tests, and 7 kill-chain patterns correlating detections into incidents with explained 0–100 risk scores.",
      "Guarded prevention across 4 firewall adapters (nftables, iptables, pf, Windows Firewall): off by default, enabled only by a typed confirmation, behind a safety guard that refuses to block protected addresses.",
      "100% detection with zero false positives across 13 synthetic attack experiments in the committed benchmark; 1,876 tests across unit, API, integration and kernel suites.",
    ],
    tech: "Python · FastAPI · SQLAlchemy · PostgreSQL · Redis · Scapy · Next.js · Docker · nftables",
  },
  {
    name: "CommitGuard",
    role: "Author · open source",
    slug: "commitguard",
    line: "Blocks AI-agent attribution in Git commit metadata — in local hooks, a GitHub Action and a webhook-driven GitHub App — from one detection engine.",
    points: [
      "No misjudged cases on a 9,174-case labelled dataset, reached after four of 15 recorded benchmark runs exposed bypasses; every failing run is kept in the repository.",
      "Unicode normalisation against look-alike and invisible-character disguises, and a bounded trailer parser that uses no regular expressions.",
      "Server-side checks read policy from the pull request's base commit, so a change cannot relax the rules judging it; every failure path blocks rather than passes.",
      "1,452 Python tests, 354 of them security regressions; CI on Linux, macOS and Windows; published to PyPI and the GitHub Marketplace.",
    ],
    tech: "Python · Typer · Pydantic · SQLite · GitHub Apps · GitHub Actions · React · TypeScript · Hypothesis · Playwright",
  },
  {
    name: "Kolo",
    role: "Backend engineer",
    slug: "kolo",
    line: "Digital infrastructure for Ajo and Esusu cooperative savings groups, with Nomba as the payment rail.",
    points: [
      "18 controllers, 30+ services and 32 Prisma repositories on Fastify 5 over PostgreSQL and Redis.",
      "Double-entry ledger: balances are derived from entries, so a discrepancy between what a member paid and what the group holds is reconstructable rather than lost.",
      "Hardened webhook path — HMAC signature verified first, raw event persisted, then an independent out-of-band re-verification before any wallet is credited.",
      "14 BullMQ queues with 10+ processors keeping verification, payouts, notifications and reminders off the request path.",
    ],
    tech: "TypeScript · Fastify 5 · Prisma · PostgreSQL 15 · Redis 7 · BullMQ · React 19 · Nomba · Argon2",
  },
  {
    name: "Scriptune",
    role: "Author · open source",
    slug: "scriptune",
    line: "Hear a hymn or a Bible verse and find out what it is: one API behind a website, an iPhone app and an Android app, with self-hosted Whisper speech recognition.",
    points: [
      "Zudojs modular-monolith API with 9 modules, 51 routes and 29 Prisma models over PostgreSQL 17, documented with OpenAPI.",
      "Three-stage recognition search — full-text, then pairs of the rarer words, then pg_trgm similarity — so the expensive fuzzy stage runs only when the cheap index lookups find nothing.",
      "7 Bible translations including Yoruba and 1,200 hymns, offline on the phone through SQLite FTS5 and on-device whisper.rn transcription.",
    ],
    tech: "TypeScript · Zudojs · Prisma · PostgreSQL · Python · FastAPI · Whisper · Next.js · Expo · React Native",
  },
  {
    name: "Telente CBT",
    role: "Lead engineer",
    slug: "telente-cbt",
    line: "Multi-tenant computer-based testing platform for schools and universities, with AI-assisted question generation.",
    points: [
      "47 Prisma models covering the exam, school and billing domains on Fastify over PostgreSQL 16 and Redis 7.",
      "A Python/FastAPI AI service reachable only from the TypeScript backend behind a service key — no client request ever reaches the model layer directly.",
      "Timed exams with per-candidate shuffling across four question types, with session state in Redis to keep per-second writes off the transactional path.",
    ],
    tech: "TypeScript · Fastify · Prisma · PostgreSQL 16 · Redis 7 · Python · FastAPI · Docker · Nginx",
  },
  {
    name: "Church Management System",
    role: "Author · open source",
    slug: "church-cms",
    line: "Records system and public website for a church in Okitipupa, Ondo State.",
    points: [
      "Express 5 and MySQL API with 70 endpoints over 16 tables, covering members, households, attendance, finance and public content.",
      "Four roles mapped to 23 permissions and checked on all 53 admin endpoints; revocable JWT sessions and a write-level audit log.",
      "40 automated tests: the real router stack against a database double, and every HTML page's scripts run under linkedom.",
    ],
    tech: "Node.js · Express 5 · MySQL · JWT · Multer · Tailwind CSS",
  },
  {
    name: "PowerWatch",
    role: "Backend engineer · team project",
    slug: "powerwatch",
    line: "Crowd-sourced electricity outage tracking for Nigeria — the backend of a team project for the Orange internship programme.",
    points: [
      "62 API endpoints over 20 Prisma models, including a six-level geographic hierarchy — country through neighbourhood — so one dataset answers both street-level and state-level questions.",
      "Each report opens, joins or closes its neighbourhood's outage inside one transaction, with durations recorded in minutes and daily, weekly and monthly rollups materialised on demand.",
    ],
    tech: "TypeScript · Fastify · Prisma · MySQL · Firebase · Swagger",
  },
  {
    name: "Telente Store",
    role: "Author",
    slug: "telente-store",
    line: "Production e-commerce platform as a modular monolith — storefront, admin dashboard and API in one process.",
    points: [
      "24 hexagonal feature modules behind a DI container and CQRS command/query buses, exposing 150+ routes over 31 relational models.",
      "Inventory modelled as a movement ledger rather than a mutable count, so overselling is a reconstructable event.",
      "Paystack payments with webhook handling, tracked email delivery, OTP auth, rate limiting and CORS hardening.",
    ],
    tech: "TypeScript 5.9 · Fastify 5 · Prisma · MySQL 8.4 · Paystack · Docker",
  },
  {
    name: "Utils-tool",
    role: "Author · live",
    slug: "utils-tool",
    line: "28 image, PDF, file and developer tools in one codebase that runs fully local or serverless.",
    points: [
      "A capability system: every tool declares its runtime needs and the server reports what it actually supports, so the UI never offers a tool that would fail.",
      "Magic-byte validation, hard size limits and decompression-bomb protection on a service whose entire job is accepting arbitrary files.",
    ],
    tech: "Python · FastAPI · Pillow · pikepdf · Ghostscript · rembg · HTML/CSS/JS",
  },
  {
    name: "AgentLab",
    role: "Author",
    slug: "agentlab",
    line: "An execution and evaluation runtime for AI agents across browser, sandbox and desktop.",
    points: [
      "Three environments behind one interface, each with an offline mock and a Solari cloud implementation, so the whole system demos in a second with no API keys.",
      "Deterministic scoring across five weighted dimensions instead of an LLM judge, so two runs are comparable and a regression is measurable.",
    ],
    tech: "TypeScript · Node.js · Solari SDK · Gemini · Groq",
  },
  {
    name: "Soft Beans Palace",
    role: "Designer & engineer · live",
    slug: "soft-beans-palace",
    line: "Ordering experience for a Port Harcourt food business, handing off to WhatsApp instead of a payment gateway.",
    points: [
      "One data file as the single source of truth for price, flowing to menu, cart, checkout and the outgoing message through one formatter.",
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
    period: "In progress",
    note: "Strengthening foundations in software engineering, computer systems, programming, databases and CS theory.",
  },
  {
    title: "Senior Secondary School Certificate",
    org: "Optimum Victory College, Okitipupa, Ondo State",
    period: "Completed",
  },
];

export const certifications = [
  { title: "Front-End Development", org: "ALX", note: "Practical web development fundamentals." },
  { title: "AI Career Essentials", org: "ALX", note: "AI concepts and AI-assisted workflows." },
  {
    title: "Virtual Assistant Certification",
    org: "ALX",
    note: "Remote work, digital productivity and professional workflows.",
  },
];

export const development = [
  "Data engineering — Python, pipelines and analytics workflows",
  "Cybersecurity — Linux-based practice, API hardening, auth design",
  "Backend architecture and distributed systems study",
  "Go backend development",
  "Database systems and SQL optimisation",
  "Developer tooling and framework engineering",
];

export const philosophy = [
  "I approach software from both a product and a systems perspective. Making an application work is the beginning: the questions I care about are how its architecture should be organised, how data moves through it, how components communicate, how authentication and security are handled, how another engineer will find their way around it, and how it survives its requirements changing.",
  "What I enjoy most is taking a complex idea and breaking it into clear systems, services, modules, APIs, data models and workflows. The long-term direction is complex backend systems, distributed infrastructure, data platforms and secure applications.",
];
