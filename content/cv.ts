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

export const cvMeta = {
  title: "Software Engineer · Backend Developer",
  subtitle: "Python & data engineering · distributed systems · application security",
  updated: "2026",
};

export const summary = [
  "Software engineer and backend developer building reliable, maintainable systems in Go, Python and TypeScript. I work across the whole backend lifecycle — system design, data modelling, API implementation, authentication, caching, documentation, and the Linux environment it all runs on.",
  "My work spans a 74-module Go commerce platform, a 39-package TypeScript framework, and production services for education, savings and logistics. I have built and compared traditional monoliths, modular monoliths and microservices, and care most about keeping a system maintainable while it is still allowed to grow.",
  "Currently deepening Python and data engineering alongside a Computer Science degree, with a continuing interest in distributed systems and application security.",
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
      "Designed and built the backend as a single Go deployable organised into 74 modules across five bounded domains — commerce, social, creator, platform and core.",
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
      "Backend development on Eko Xpedite Exchange with the Newdich team — merchant, agent and end-user flows, and the service architecture connecting them.",
    points: [
      "Built backend services in Node.js and TypeScript across three distinct actor models — merchant, agent and end user — over one shared representation of accounts and movements.",
      "Recorded the acting party separately from the account acted on, so agent-initiated transactions are attributable to both and the audit trail survives a dispute.",
      "Defined typed API contracts between services rather than shared internals, because the consumer is a team rather than a single author.",
    ],
    tech: "Node.js · TypeScript · REST APIs · PostgreSQL · Docker · Linux",
  },
  {
    title: "Senior Full Stack Engineer",
    org: "TechVenture Solutions",
    period: "2022 — 2023",
    blurb: "Backend APIs and delivery practice for business-critical products.",
    points: [
      "Introduced test-first patterns and raised coverage from near-zero to production-grade thresholds.",
      "Built and maintained scalable backend APIs underpinning revenue-carrying products.",
      "Improved release reliability with automated CI/CD checks and safer deployment workflows.",
      "Mentored junior engineers through code review, pairing and architecture walkthroughs.",
    ],
    tech: "Node.js · TypeScript · PostgreSQL · CI/CD · Docker",
  },
  {
    title: "Full Stack Developer",
    org: "Digital Innovations Ltd",
    period: "2021 — 2022",
    blurb: "End-to-end web product delivery across frontend, backend and deployment.",
    points: [
      "Delivered web products from requirement to deployment.",
      "Optimised data access paths and improved query performance in high-usage modules.",
      "Worked with product and operations teams to turn business requirements into stable releases.",
    ],
    tech: "JavaScript · Node.js · SQL · Linux",
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
      "A CLI that generates fullstack projects, plus 11 frontend framework adapters over the same backend contracts.",
    ],
    tech: "TypeScript · Node.js · pnpm workspaces · Zod · ESM",
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
      "One database transaction per settlement covering payment status, wallet credit, ledger entries and contribution state — all four land or none do.",
      "14 BullMQ queues with 10+ processors keeping verification, payouts, notifications and reminders off the request path.",
    ],
    tech: "TypeScript · Fastify 5 · Prisma · PostgreSQL 15 · Redis 7 · BullMQ · React 19 · Nomba · Argon2",
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
    name: "PowerWatch",
    role: "Backend engineer",
    slug: "powerwatch",
    line: "Crowd-sourced electricity outage tracking for Nigeria, built for the Orange internship programme.",
    points: [
      "20 Prisma models including a six-level geographic hierarchy — country through neighbourhood — so one dataset answers both street-level and state-level questions.",
      "Reports kept immutable and outages inferred separately, so improving the clustering is a re-run rather than a data migration.",
    ],
    tech: "TypeScript · Fastify · Prisma · MySQL · React · MapLibre · Firebase · Swagger",
  },
  {
    name: "Utils-tool",
    role: "Author · live",
    slug: "utils-tool",
    line: "28 image, PDF, file and developer tools in one codebase that runs fully local or serverless.",
    points: [
      "A capability system: every tool declares its runtime needs and the server reports what it actually supports, so the UI never offers a tool that would fail.",
      "Layered FastAPI backend with a storage abstraction resolving to the local filesystem or Vercel Blob.",
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
      "An evidence system where every claim in an answer cites the page it came from, and a recovery-aware loop that treats a tool failure as a branch rather than an ending.",
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
      "Meal configuration with per-item sides, proteins, quantities and instructions, in a picker that becomes a bottom sheet on mobile and a dialog on desktop.",
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
    title: "Undergraduate study",
    org: "Delta State University, Abraka",
    period: "Prior",
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
