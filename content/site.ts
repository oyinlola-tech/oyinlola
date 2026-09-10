/**
 * Profile facts. Sourced from oyinlola.site (CV, contact), from the
 * repositories themselves (counts, stacks), and from positioning the owner
 * of this site wrote directly. Nothing here is invented.
 */

export const site = {
  name: "Oluwayemi Oyinlola Michael",
  short: "Oyinlola",
  role: "Software Engineer",
  /** The one-line positioning statement. */
  positioning:
    "I build the systems behind useful products — backend APIs, data pipelines, developer tools, and the architecture that holds them together.",
  description:
    "Software engineer in Nigeria. Backend systems, developer tools and data-driven applications in Go, Python and TypeScript — with a working interest in distributed systems, data engineering and application security.",
  location: "Nigeria",
  timezone: "WAT · UTC+1",
  email: "oluwayemioyinlola2@gmail.com",
  phone: "+234 913 351 9489",
  url: "https://oyinlola.site",
  available: true,
  availableFor: "Backend, platform and software engineering roles",
} as const;

/** Shown under the hero — what the work is pointed at right now. */
export const focus = [
  "Backend engineering",
  "Python & data engineering",
  "Distributed systems",
  "Developer infrastructure",
] as const;

export const links = {
  github: "https://github.com/oyinlola-tech",
  linkedin: "https://linkedin.com/in/oluwayemioyinlola",
  twitter: "https://twitter.com/oyinlola141",
  site: "https://oyinlola.site",
  cv: "/cv",
} as const;

export type NavItem = { label: string; href: string; glyph: string; cta?: boolean };

/** The dock's mark links home, so there is no "Index" item duplicating it. */
export const nav: NavItem[] = [
  { label: "Work", href: "/work", glyph: "work" },
  { label: "Engineering", href: "/engineering", glyph: "stack" },
  { label: "Lab", href: "/lab", glyph: "lab" },
  { label: "About", href: "/about", glyph: "about" },
  { label: "CV", href: "/cv", glyph: "cv" },
  { label: "Contact", href: "/contact", glyph: "contact", cta: true },
];

/** Hero telemetry. Every figure is countable in a repository. */
export const telemetry = [
  { value: "74", label: "Go modules", detail: "Zudomart · 5 domains" },
  { value: "39", label: "TS packages", detail: "Zudojs framework" },
  { value: "15", label: "Case studies", detail: "Shipped & in progress" },
  { value: "3", label: "Core languages", detail: "Go · Python · TypeScript" },
] as const;

/* ------------------------------------------------------------------ *
 *  Engineering — the five layers the work actually sits in.
 * ------------------------------------------------------------------ */

export type Discipline = {
  id: string;
  title: string;
  lede: string;
  body: string;
  items: string[];
  evidence: string[];
};

export const disciplines: Discipline[] = [
  {
    id: "backend",
    title: "Backend",
    lede: "The strongest part of the work.",
    body: "I care about how a backend is structured, not only whether the endpoints return 200. Where do the boundaries go, what owns which data, what happens when a dependency is down, and how does the next engineer find their way around it. Most of what I build is a modular monolith with real internal seams, because that buys the operational simplicity of one process without giving up the option to split later.",
    items: [
      "Go",
      "Node.js",
      "TypeScript",
      "Fastify",
      "Gin",
      "REST APIs",
      "Authentication",
      "Authorization",
      "Validation",
      "Caching",
      "Background processing",
      "API documentation",
    ],
    evidence: ["zudomart", "kolo", "telente-store"],
  },
  {
    id: "architecture",
    title: "Architecture",
    lede: "How one application evolves.",
    body: "Monolith → modular monolith → microservices is not a ladder you are supposed to climb; it is a set of trade-offs you pick between, and the interesting question is how one codebase moves along it without a rewrite. That question is what Zudojs came out of: how do developers build complex backend systems without reinventing the architecture every time?",
    items: [
      "Modular monolith",
      "Microservices",
      "Event-driven systems",
      "CQRS",
      "Dependency injection",
      "Hexagonal ports & adapters",
      "Domain boundaries",
      "Lifecycle & graceful shutdown",
      "Multi-tenancy",
    ],
    evidence: ["zudojs", "zudomart", "telente-store"],
  },
  {
    id: "data",
    title: "Data",
    lede: "Where the work is heading.",
    body: "Deliberately moving toward Python and data engineering — pipelines, event processing, ranking and recommendation, and the analytics that make a product improve rather than just run. In Zudomart this is a separate Python service so a retrained ranker never requires redeploying the payments path.",
    items: [
      "Python",
      "FastAPI",
      "Data pipelines",
      "Event processing",
      "Analytics",
      "Recommendation systems",
      "Ranking",
      "Vector search",
      "Automation",
    ],
    evidence: ["zudomart", "telente-cbt", "utils-tool"],
  },
  {
    id: "security",
    title: "Security",
    lede: "Not a separate identity — a way of building.",
    body: "I am a cybersecurity enthusiast rather than a security professional, and the honest framing is that it changes how I build backends rather than being its own job. Argon2 over bcrypt. Magic bytes over file extensions. Verify before you persist a TOTP secret. Rate limits that survive a restart. Audit trails written before the first dispute, not after it.",
    items: [
      "Secure API design",
      "Argon2 & password hashing",
      "TOTP / 2FA",
      "JWT & session design",
      "RBAC & permissions",
      "Cryptography",
      "Rate limiting",
      "Input validation",
      "Webhook signature verification",
      "Linux & Kali",
    ],
    evidence: ["authenticator-lab", "kolo", "learnbridge"],
  },
  {
    id: "infrastructure",
    title: "Infrastructure",
    lede: "I do not only meet software through an IDE.",
    body: "Most of what I do starts in a shell. Bash, SSH, Docker, Postgres and MariaDB on the box, Nginx or Apache in front, and a deploy that can be rolled back. Knowing the environment underneath the application is what makes the application's failure modes legible.",
    items: [
      "Linux",
      "Docker",
      "Bash",
      "Git & GitHub",
      "SSH",
      "PostgreSQL",
      "MariaDB",
      "Redis",
      "Nginx",
      "CI/CD",
      "Postman",
      "pgAdmin",
    ],
    evidence: ["zudomart", "telente-cbt", "utils-tool"],
  },
];

/** Compact stack summary — used on the home page and in the terminal. */
export type StackGroup = { title: string; items: string[] };

export const stack: StackGroup[] = [
  { title: "Backend", items: ["Go", "Python", "TypeScript", "Node.js", "Fastify", "Gin"] },
  { title: "Databases", items: ["PostgreSQL", "MariaDB", "MySQL", "Redis", "Prisma", "ent", "sqlc", "pgx"] },
  { title: "Data", items: ["Python", "Data pipelines", "Event processing", "Analytics", "Ranking"] },
  {
    title: "Architecture",
    items: ["Modular monolith", "Microservices", "Event-driven", "CQRS", "DI containers"],
  },
  { title: "Infrastructure", items: ["Linux", "Docker", "Git", "Bash", "SSH", "Nginx", "CI/CD"] },
  {
    title: "Security",
    items: ["Argon2", "Cryptography", "Secure auth", "RBAC", "Rate limiting", "App security"],
  },
];

/* ------------------------------------------------------------------ *
 *  Background
 * ------------------------------------------------------------------ */

export type Role = {
  title: string;
  org: string;
  period: string;
  current?: boolean;
  points: string[];
};

/** From the CV published at oyinlola.site/cv. */
export const experience: Role[] = [
  {
    title: "Founder & Lead Engineer",
    org: "ZudoMart",
    period: "2023 — present",
    current: true,
    points: [
      "Leading ZudoMart as an early-stage startup, currently in MVP refinement.",
      "Building and validating trust-first product flows for commerce, services and micro-gigs.",
      "Designing escrow, verification and safety workflows for real-world informal trading.",
      "Executing milestone-driven delivery aligned with EquityPilot support and market validation.",
    ],
  },
  {
    title: "Backend Engineer",
    org: "Newdich Technology",
    period: "2025 — present",
    current: true,
    points: [
      "Backend development in Node.js and TypeScript on Eko Xpedite Exchange with the Newdich team.",
      "Merchant, agent and end-user flows, and the system architecture connecting them.",
      "Service design, API contracts and data modelling across the platform.",
    ],
  },
  {
    title: "Senior Full Stack Engineer",
    org: "TechVenture Solutions",
    period: "2022 — 2023",
    points: [
      "Introduced test-first engineering patterns and raised coverage from near-zero to production-grade thresholds.",
      "Built and maintained scalable backend APIs used by business-critical products.",
      "Improved deployment reliability with automated CI/CD checks and safer release workflows.",
      "Mentored junior engineers through code review, pairing and architecture walkthroughs.",
    ],
  },
  {
    title: "Full Stack Developer",
    org: "Digital Innovations Ltd",
    period: "2021 — 2022",
    points: [
      "Delivered web products end to end across frontend, backend and deployment setup.",
      "Optimised data access paths and improved query performance in high-usage modules.",
      "Converted business requirements into stable releases with product and operations teams.",
    ],
  },
];

export type Education = { title: string; org: string; period: string; note?: string };

export const education: Education[] = [
  {
    title: "BSc Computer Science",
    org: "University of the People",
    period: "In progress",
    note: "Formal computer science alongside production engineering work.",
  },
  {
    title: "Software engineering programmes",
    org: "ALX",
    period: "Completed",
    note: "Project-based training in engineering fundamentals and delivery.",
  },
];

export type Principle = { title: string; body: string };

export const principles: Principle[] = [
  {
    title: "Boundaries before frameworks",
    body: "Most systems fail at the seams, not in the middle. I draw module boundaries and type contracts first, then pick the framework that fits them — which is why Zudomart is 74 Go modules in one deployable, not 74 services.",
  },
  {
    title: "A monolith you can split",
    body: "Modular monoliths get the operational simplicity of one process with the option to extract later. Every module owns its ports, adapters and data, so extraction is a build change rather than a rewrite.",
  },
  {
    title: "Understand it underneath",
    body: "Rather than only using Fastify or Express, I want to know how a framework should structure an application at all. That question is what Zudojs is — not another Node framework, but an attempt at the building blocks underneath one.",
  },
  {
    title: "Ship the whole thing",
    body: "An API without a storefront is a demo. I build the backend, the dashboard, the public site, the payment flow, the emails and the deploy — the last ten percent is where products actually get judged.",
  },
  {
    title: "Trust is an engineering problem",
    body: "Escrow, verification, dispute windows and audit trails are not policy documents — they are state machines. On a platform where people send strangers money, that state machine is the product.",
  },
  {
    title: "Build for thin margins and slow networks",
    body: "Almost everything I have shipped serves Nigerian schools, shops, savings groups and traders. That means small payloads, offline-tolerant flows, local payment rails, and no patience for a product that almost works.",
  },
];

/** About-page narrative, kept out of the component. */
export const aboutBody = [
  "I'm Oluwayemi Oyinlola Michael, a software engineer from Nigeria focused on backend development and systems engineering.",
  "I enjoy building the parts of software that users don't always see: APIs, databases, authentication systems, event-driven services, data pipelines, developer tools, and the architecture that connects everything together.",
  "I work primarily with Go, Python and TypeScript, across PostgreSQL, Redis, Fastify, Gin, Docker and Linux. Most of what I have shipped serves Nigerian businesses — schools, shops, savings groups, traders — which is a demanding teacher, because those users have thin margins, slow networks and no patience for a product that almost works.",
  "I'm particularly interested in how a system evolves from a simple application into reliable, maintainable infrastructure. That interest is what led me through monolith, modular monolith and microservice architectures, and into building my own framework and developer tooling experiments.",
  "I'm also developing my knowledge in data engineering and cybersecurity — not as separate careers, but because a serious backend needs both. Software engineering, databases, distributed systems, data and security are one problem viewed from five angles.",
];
