/**
 * Case studies.
 *
 * Facts come from each project's own repository — README, schema, route
 * tables, package manifests — read directly, not summarised from memory.
 * Counts are countable.
 *
 * LINKS: every URL in this file returned HTTP 200 when checked. Projects
 * whose repositories are private, or whose deployments have gone down, carry
 * no link rather than a broken one. Do not add a link without checking it.
 */

export type CaseStudy = {
  slug: string;
  name: string;
  kind: string;
  category: string;
  year: string;
  role: string;
  /** Omitted where a project has no status worth stating. */
  status?: "Live" | "Open source" | "Private" | "Archived";
  summary: string;
  overview: string[];
  problem: string[];
  architecture: { title: string; body: string }[];
  decisions: { title: string; body: string }[];
  metrics: { value: string; label: string }[];
  stack: string[];
  links: { label: string; href: string }[];
  hue: number;
  featured: boolean;
};

export const work: CaseStudy[] = [
  /* ================================================================== */
  {
    slug: "zudomart",
    name: "Zudomart",
    kind: "Social commerce super-app",
    category: "Commerce & marketplace",
    year: "2023 — present",
    role: "Founder & lead engineer",
    summary:
      "A Go modular monolith for African social commerce — 79 modules across five domains, escrow and three-tier verification, with a Python service for ranking, recommendation and fraud detection.",
    overview: [
      "Zudomart is an Africa-first super-app: an integrated marketplace for goods, services and micro-gigs, with live commerce, short-form video and a multi-layer trust engine. Buyers discover products through creators, live shopping, reels and communities; creators monetise through subscriptions, gifts and affiliate commissions.",
      "I founded it in 2023 and lead the engineering. In January 2026 it joined FasterCapital's EquityPilot programme, which put the current phase on milestones: harden escrow and fraud detection, pilot creator ad monetisation, and validate local payment integrations.",
      "It is the largest system I have built. The backend is one deployable Go binary organised as 79 modules across five domains, beside a separate Python service owning everything model-shaped.",
      "The engineering problem was never a single feature. It was keeping commerce, social and creator concerns from bleeding into each other while all three share users, payments and a feed.",
    ],
    problem: [
      "Social commerce is three products wearing one coat. A storefront has carts, inventory, escrow, refunds and tax. A social network has feeds, reels, comments and follows. A creator economy has livestreams, subscriptions, gifts and affiliate payouts. Each has a different consistency requirement and a different failure mode.",
      "On top of that sits the reason the product exists at all. Africa's informal peer-to-peer economy runs on direct messages and cash, and it is heavily exposed to fraud — an estimated 65% of traders report losses to scams on informal platforms. A marketplace that does not solve trust is just another place to get robbed.",
      "Building that as microservices from day one means paying distributed-systems tax — network hops, partial failures, deploy choreography, distributed transactions — before a single user justifies it. Building it as an unstructured monolith means the commerce code and the feed code fuse into something nobody can extract later.",
      "So the constraint was: one process to operate, hard module boundaries inside it, and no module allowed to reach into another module's data.",
    ],
    architecture: [
      {
        title: "Five domains, 79 modules",
        body: "commerce (26 modules — products, categories, customers, carts, orders, payments, wallets, escrows, ledger, payouts, settlements, invoices, refunds, disputes, commissions, pricings, promotions, marketing, inventories, fulfillments, shipping, taxation, receipts, stores, wishlists, pos), social (14 — posts, feeds, stories, reels, videos, comments, reactions, likes, follows, reviews, brands, collections, jobs, audit), creator (5 — creators, livestreams, subscriptions, gifts, affiliates), platform (20 — admins, employees, api_keys, moderation, fraud, kyc, notifications, messages, mail, workflows, automation, events, jobs, support, settings, feature_flags, experimentation, integrations, achievements, audit) and core (14 — users, auths, profiles, verification, search, ai, ranking, recommendations, analytics, insights, reports, trends, subscriptions, i18n).",
      },
      {
        title: "The trust engine",
        body: "Three-tier verification gates what an account may do: browse, transact, or receive payouts. Escrow holds buyer funds until delivery is confirmed, with dispute windows and automated release timers. Fraud signals from the Python service feed back as account-level risk scores. Together these are the product — everything else is a marketplace anyone could build.",
      },
      {
        title: "CQRS and an event spine",
        body: "Modules never call each other's internals. Writes go through commands, reads through queries, and cross-domain effects travel as events over Kafka. An order paid in commerce becomes an event; the creator domain turns it into an affiliate commission; core turns it into a ranking signal. None of them import each other.",
      },
      {
        title: "Layered dependency rule",
        body: "shared/ holds cross-module type contracts — DTOs, models, permissions, responses. pkg/ holds domain-free Go libraries — auth, JWT, cache, money, resilience. platform/ holds infrastructure adapters — Redis, Kafka, S3, Postgres, gRPC, payments. Dependencies point inward only, which is what makes a module extractable.",
      },
      {
        title: "Schema as the single source of truth",
        body: "The database is defined once as ent schemas in db/, with Atlas generating versioned migrations from them. No hand-written DDL, and no drift between the ORM's idea of the schema and the database's.",
      },
      {
        title: "Python service for the model layer",
        body: "FastAPI with PyTorch and vector search, deployed separately: recommendation, ranking, moderation, vision, NLP and forecasting. Go owns transactions and correctness; Python owns anything that is a model artefact. Retraining a ranker must never require redeploying the payments path.",
      },
      {
        title: "Deployment",
        body: "Docker and Kubernetes manifests, Terraform for infrastructure, Traefik for ingress and a monitoring stack — all versioned in deployments/ next to the code they run.",
      },
    ],
    decisions: [
      {
        title: "Modular monolith over microservices",
        body: "One binary to deploy, one place to debug, one transaction boundary where it matters — but module boundaries strict enough that extracting any domain into its own service is a build-graph change, not a rewrite. The whole architecture rests on this.",
      },
      {
        title: "Escrow on small transactions",
        body: "Escrow is normal on large purchases and almost unheard of on the ₦2,000 trades that make up most of this market, because the fee model does not work. Making it work at that size — cheap holds, short windows, automated release — is the differentiator, and it is a state-machine problem before it is a payments problem.",
      },
      {
        title: "ent + Atlas over a hand-rolled data layer",
        body: "Code generation from schema gives compile-time safety across 79 modules touching one database. At this many entities, a runtime-typed ORM turns every migration into a manual audit.",
      },
      {
        title: "Money as minor units, never floats",
        body: "A dedicated money package in pkg/ carries currency alongside amount and refuses cross-currency arithmetic. Escrow, split payouts, affiliate commissions and refunds all compose from it, so rounding is decided in one place instead of thirty.",
      },
      {
        title: "Go 1.26 and a small dependency surface",
        body: "chi for routing, pgx for Postgres, ent for data, golang-jwt for tokens. Nearly everything else is standard library. Fewer dependencies means fewer upgrade cliffs on a codebase meant to last.",
      },
    ],
    metrics: [
      { value: "79", label: "Go modules" },
      { value: "5", label: "Bounded domains" },
      { value: "13k+", label: "Go source files" },
      { value: "2", label: "Runtimes (Go + Python)" },
    ],
    stack: [
      "Go 1.26",
      "chi",
      "ent + Atlas",
      "PostgreSQL",
      "Redis",
      "Kafka",
      "Elasticsearch",
      "Python",
      "FastAPI",
      "PyTorch",
      "Docker",
      "Kubernetes",
      "Terraform",
    ],
    links: [{ label: "Programme announcement", href: "https://www.oyinlola.site/zudomart" }],
    hue: 26,
    featured: true,
  },

  /* ================================================================== */
  {
    slug: "zudojs",
    name: "Zudojs",
    kind: "TypeScript application framework",
    category: "Developer tooling",
    year: "2026",
    role: "Author",
    status: "Open source",
    summary:
      "A 39-package modular TypeScript framework — DI, lifecycle, config, HTTP, events, CQRS, queues, tenancy and observability, each usable on its own, with the dependency direction enforced by a build-time check.",
    overview: [
      "Zudojs is a modular TypeScript framework for backend services, APIs, distributed systems and fullstack platforms. It exists because I kept rewriting the same infrastructure — a DI container, layered config, a lifecycle with graceful shutdown, an event bus, a queue abstraction — in every project, slightly differently each time.",
      "Rather than one opinionated runtime, it is 39 independent packages published under the @zudojs scope: 2,032 TypeScript source files, roughly 198,000 lines, 242 package test files. An application installs only the concerns it actually has.",
      "Three beliefs sit under all of it. Explicit over implicit — dependencies, boundaries and lifecycles should be visible and enforceable. Composition over inheritance — behaviour is assembled, not inherited. Type safety end to end — types flow from request input to database output rather than stopping at the controller.",
      "The design constraint was explicitness. Frameworks that resolve dependencies by reflection and register behaviour by side effect are pleasant for a week and opaque forever after. Everything in Zudojs is registered by an explicit token and ordered by a declared dependency graph.",
    ],
    problem: [
      "Node's ecosystem is excellent at HTTP and thin everywhere else. The moment an application needs background jobs, an event bus, multi-tenancy, feature flags, transactions and tracing to work together, you are assembling seven unrelated libraries with seven lifecycle models and no shared context.",
      "The two usual answers are both bad. Adopt a batteries-included framework and inherit its entire runtime and deployment model. Or hand-roll the glue and rebuild it, differently, in the next project.",
      "There is a third problem underneath both: in a framework, breaking changes propagate outward. If a foundation package depends on a transport package, every application that touches the foundation inherits the transport's instability. Most frameworks solve this with convention. Zudojs solves it with a check that fails the build.",
      "Zudojs is the third answer: independent packages with consistent contracts, so composition is a choice rather than a condition of entry.",
    ],
    architecture: [
      {
        title: "Five tiers, dependencies flowing inward",
        body: "Every package sits at a tier: 0 leaf (errors, types), 1 foundation (container, config, logger, events, cache, queue, database, security, tenancy and the rest), 2 application (core, runtime, cqrs, auth, rpc, api, openapi), 3 transport (http, cli), 4 developer experience (testing). A package may depend only on its own tier or lower. The graph is a DAG with no upward arrows, which is what keeps @zudojs/errors stable enough for all 39 packages to import it.",
      },
      {
        title: "The tier map is executable",
        body: "scripts/package-tiers.js is the single source of truth, imported by both the architecture check and the Vitest boundary test. It also verifies that no cycles exist and that every internal dependency uses the workspace:* protocol, so pnpm resolves siblings from source rather than quietly from the registry.",
      },
      {
        title: "Runtime as a state machine",
        body: "Created → Initializing → Ready → Running → Draining → Stopped, with components moving through register → install → initialize → start → running → stop → dispose. Startup orders modules by declared dependencies; shutdown reverses it, drains in-flight requests to a deadline, then disposes. SIGINT and SIGTERM are handled by the runtime, not by application code.",
      },
      {
        title: "Context without passing context",
        body: "AsyncLocalStorage carries execution, tenant, transaction and logger context through async call chains, so a repository three layers down knows which tenant it is serving without that being threaded through every signature. Long-running operations take an AbortSignal, which is what makes graceful shutdown and timeouts actually cancel work rather than orphan it.",
      },
      {
        title: "Controlled context, not the whole application",
        body: "Plugins, modules and middleware receive a narrow context — container, config, logger, events — rather than the application object. A plugin cannot reach past its boundary, which is the difference between an extension point and a back door.",
      },
      {
        title: "Errors as values",
        body: "Every package roots its errors in @zudojs/errors. Each carries a machine-readable code, a cause, a severity, structured metadata, a transport status code, and an expose flag deciding whether it is safe to show a client. Internal failures are mapped at the transport boundary rather than leaking upward.",
      },
      {
        title: "Infrastructure neutrality",
        body: "@zudojs/adapters is the boundary between the framework and the outside world. Databases, queues, cloud providers and storage backends sit behind it, so an application is never coupled to a vendor by its framework.",
      },
      {
        title: "Generation and frontend adapters",
        body: "zudojs-cli scaffolds backend, frontend or fullstack workspaces across three backend architectures — monolith, modular monolith, microservice — and eleven frontend targets: React, Next, Vue, Nuxt, Angular, Svelte, SvelteKit, Astro, vanilla, Flutter and React Native. Fullstack projects get apps/web beside apps/backend or apps/gateway, a shared types package, and a dev proxy.",
      },
    ],
    decisions: [
      {
        title: "Monorepo, independently published packages",
        body: "One repository for coherent contracts, separate publishes so nobody installs 39 packages to get a DI container. Each package has its own build, types and version — 37 at 1.0.0, openapi and auth-oauth at 1.1.0.",
      },
      {
        title: "Token-based DI instead of decorator reflection",
        body: "Decorator-and-metadata DI needs a compiler flag, breaks under bundlers, and hides the dependency graph. Explicit tokens are more typing and dramatically more debuggable. The container supports singleton, scoped and transient lifetimes, and detects circular dependencies at resolution with a named error rather than a stack overflow.",
      },
      {
        title: "One tier map, imported twice",
        body: "The boundary rules were originally duplicated between the check script and the test. The copies drifted, and auth-oauth ended up passing the Vitest check while failing the script — the exact failure the rule exists to prevent, produced by the tooling meant to enforce it. Both now import the same module, and the comment above it says why.",
      },
      {
        title: "Lifecycle as a real state machine",
        body: "@zudojs/lifecycle orders startup by declared dependencies and tears down in reverse, so a queue consumer can never outlive the database connection it reads through. Graceful shutdown is a framework guarantee, not an application chore.",
      },
      {
        title: "Small files, enforced",
        body: "Maximum five files per folder excluding the barrel, maximum 150 lines per file, dot-notation names like pluginLifecycle.core.ts, and barrel index.ts files that re-export public API and contain no logic. Arbitrary limits, but they make a 2,000-file codebase navigable by path alone.",
      },
      {
        title: "ESM-only, strict TypeScript, modern floor",
        body: "No dual CJS/ESM build matrix. Node 24 and pnpm 11 are the floor, TypeScript is pinned through a workspace catalogue, and releases go through changesets. The framework targets modern Node and refuses to carry the compatibility surface that supporting everything would bring.",
      },
    ],
    metrics: [
      { value: "39", label: "Packages" },
      { value: "198k", label: "Lines of TypeScript" },
      { value: "5", label: "Enforced tiers" },
      { value: "11", label: "Frontend adapters" },
    ],
    stack: ["TypeScript", "Node.js", "pnpm workspaces", "Zod", "Vitest", "changesets", "ESM"],
    links: [
      { label: "Documentation", href: "https://zudojs.oyinlola.site" },
      { label: "Source", href: "https://github.com/oyinlola-tech/zudo" },
    ],
    hue: 210,
    featured: true,
  },

  /* ================================================================== */
  {
    slug: "kolo",
    name: "Kolo",
    kind: "Cooperative savings & payments infrastructure",
    category: "Payments & fintech",
    year: "2026",
    role: "Backend engineer",
    summary:
      "Digital infrastructure for Ajo and Esusu savings groups — a double-entry ledger, HMAC-verified Nomba webhooks, and 14 background queues behind 32 repositories.",
    overview: [
      "Kolo digitises traditional African cooperative savings — Ajo, Esusu, thrift contributions — for the millions of people who run them today on notebooks, spreadsheets and WhatsApp.",
      "A Fastify 5 backend over PostgreSQL and Redis, with a React 19 frontend and Nomba as the payment rail. Eighteen controllers, thirty-plus services, thirty-two Prisma repositories, and fourteen BullMQ queues.",
      "The whole thing also ships an offline demo mode that simulates every dashboard with no backend at all, so the product can be shown to a savings group on a phone with no connection.",
    ],
    problem: [
      "A savings group is a ledger with social enforcement. Everyone contributes on a schedule, one member collects each round, and the entire thing runs on the members trusting the person holding the book. Digitising it means the software has to be more trustworthy than the notebook, not merely faster.",
      "That makes money movement the hard part. A contribution is not done when the payment provider says so — it is done when the group's wallet, the member's contribution record and the ledger all agree. Any path where those three can disagree is a path where somebody's savings quietly go missing.",
      "And payment webhooks are hostile input: they arrive out of order, arrive twice, and can be forged.",
    ],
    architecture: [
      {
        title: "Double-entry ledger",
        body: "Contributions, payouts and fees are ledger entries, not balance updates. A group wallet's balance is derived, so a disagreement between what a member paid and what the group holds is reconstructable rather than a mystery — the same reason banks do it this way.",
      },
      {
        title: "Webhook path, hardened",
        body: "Nomba posts a signed webhook. The signature is verified with HMAC before anything else happens, the raw event is persisted as a WebhookEvent, and only then is a verification job enqueued. The job independently calls back to verify the payment rather than trusting the payload.",
      },
      {
        title: "One transaction per settlement",
        body: "When verification confirms, a single Prisma $transaction updates the payment to SUCCESSFUL, atomically credits the group wallet, writes the ledger entries and marks the contribution PAID. Either all four land or none do.",
      },
      {
        title: "Fourteen queues",
        body: "BullMQ over Redis with ten-plus processors: webhook processing, payment verification, payout approval, notification fan-out, email delivery, scheduled contribution reminders. Anything slow or retryable is off the request path.",
      },
      {
        title: "Layered backend",
        body: "Route registry → middleware chain (CORS → Helmet → rate limit → auth → role → group) → 18 controllers → 30+ services → 32 Prisma repositories. Group membership is a middleware concern, so no service has to remember to check it.",
      },
      {
        title: "Three dashboards, three roles",
        body: "Members see their contributions and payout position. Group admins run plans, approvals and membership. Platform operators see the whole estate. Each is its own route tree under one SPA.",
      },
      {
        title: "Offline demo mode",
        body: "A complete simulation of every dashboard with realistic mock data and no backend — pick a role, sign in with a demo password, explore. It exists because the people this is for are not going to install anything to evaluate it.",
      },
    ],
    decisions: [
      {
        title: "Double-entry from the first commit",
        body: "Storing balances and adjusting them is faster to build and impossible to audit. On software that holds other people's savings, the ledger is not an accounting nicety — it is the reason anyone should believe the number on the screen.",
      },
      {
        title: "Verify the webhook, then verify the payment",
        body: "HMAC proves the message came from Nomba. It does not prove the payment succeeded. Persisting the event and re-verifying out of band means a replayed or malformed webhook cannot credit a wallet.",
      },
      {
        title: "Nomba over a global processor",
        body: "The rail has to work for a cooperative in Nigeria — local bank transfer, local settlement, local support. A gateway optimised for card payments in another market is the wrong tool however good its SDK is.",
      },
      {
        title: "Ship a demo that needs nothing",
        body: "The evaluation problem for this product is trust, and trust needs a hands-on look before any credentials exist. An offline demo is a feature of the sales process, not a developer convenience.",
      },
    ],
    metrics: [
      { value: "32", label: "Prisma repositories" },
      { value: "18", label: "Controllers" },
      { value: "14", label: "Background queues" },
      { value: "3", label: "Role dashboards" },
    ],
    stack: [
      "TypeScript",
      "Fastify 5",
      "Prisma",
      "PostgreSQL 15",
      "Redis 7",
      "BullMQ",
      "React 19",
      "Nomba",
      "Argon2",
      "JWT",
      "Nodemailer",
    ],
    links: [{ label: "Source", href: "https://github.com/oyinlola-tech/kolo-nomba" }],
    hue: 158,
    featured: true,
  },

  /* ================================================================== */
  {
    slug: "agentlab",
    name: "AgentLab",
    kind: "Agent execution & evaluation runtime",
    category: "AI & agents",
    year: "2026",
    role: "Author",
    summary:
      "A runtime that executes AI agents across browser, sandbox and desktop, captures evidence for every claim, recovers from tool failures and scores each run.",
    overview: [
      "AgentLab runs AI agents in real environments and keeps everything that happened. Every tool call, every intermediate result, every recovery from failure, and every source the final answer rests on is persisted as a run you can replay.",
      "It came out of a frustration with agent scripts: they produce an answer and throw away the reasoning. When the answer is wrong there is nothing to inspect, and when it is right there is no way to prove it.",
      "The result is closer to a lab notebook than a chatbot — a runtime, an evidence system, an evaluator and an explorer UI for reading runs back.",
    ],
    problem: [
      "A typical agent script loses tool calls after execution, returns an answer with no sources, terminates on the first tool failure, and gives you no way to compare one run against another. Debugging means reading logs and guessing.",
      "Three things had to be true instead: the trace must survive the process, answers must cite the evidence that produced them, and a failed tool call must be a recoverable event rather than the end of the run.",
    ],
    architecture: [
      {
        title: "Three environments behind one interface",
        body: "Browser (navigate, click, extract), sandbox (execute, python, git) and desktop (screenshot, type, click). Each has a mock implementation that runs offline and instantly, and a Solari implementation that executes in real cloud environments. Agent code is written once against the interface.",
      },
      {
        title: "Model routing with fallback",
        body: "A ModelRouter fronts the providers — Gemini as primary, Groq as fallback — so a provider outage degrades the run instead of ending it.",
      },
      {
        title: "Evidence system",
        body: 'Answers carry inline citations. "Cursor Pro is $16/mo [source:1]" links back to the exact browser page the figure was read from, so a claim can be checked rather than trusted.',
      },
      {
        title: "Recovery-aware loop",
        body: "Tool results branch: success feeds back into the model, failure routes into recovery and retries against the environment. Cascading failures are detected rather than silently absorbed.",
      },
      {
        title: "Five-dimension evaluation",
        body: "Every run is scored on completion (50%), efficiency (25% — tool success rate and step count), resilience (15% — tool diversity, no cascading failures), tool usage (10% — coverage and execution time), and recovery. The output is a single graded score with the components visible.",
      },
      {
        title: "Explorer UI",
        body: "A separate app renders the persisted run: execution timeline, evidence, evaluation breakdown, and the final answer with its citations resolved.",
      },
    ],
    decisions: [
      {
        title: "Mock-first environments",
        body: "Every environment has an offline implementation, so the whole system demos and tests in under a second with no API keys. Cloud execution is a swap, not a prerequisite.",
      },
      {
        title: "Runs as files, not a database",
        body: "A run serialises to a single JSON document. It can be committed, diffed, attached to an issue or replayed months later without standing up infrastructure.",
      },
      {
        title: "Evaluation as a weighted rubric, not an LLM judge",
        body: "Deterministic scoring across five dimensions means two runs are comparable and a regression is measurable. An LLM judge would have been faster to write and impossible to trust as a baseline.",
      },
    ],
    metrics: [
      { value: "3", label: "Execution environments" },
      { value: "5", label: "Scoring dimensions" },
      { value: "2", label: "Model providers, routed" },
      { value: "1", label: "Command to demo" },
    ],
    stack: ["TypeScript", "Node.js", "tsx", "Gemini", "Groq", "Solari"],
    links: [],
    hue: 150,
    featured: true,
  },

  /* ================================================================== */
  {
    slug: "powerwatch",
    name: "PowerWatch",
    kind: "Power-outage reporting platform",
    category: "Civic & infrastructure",
    year: "2026",
    role: "Backend engineer",
    summary:
      "Crowd-sourced electricity outage tracking for Nigeria — a six-level geographic hierarchy, map-based reporting, and outage tracking — the backend of a team project for the Orange internship programme.",
    overview: [
      "PowerWatch lets people report power outages where they live and see what is happening around them on a map. Reports open, join and close outages; outages roll up into daily, weekly and monthly summaries by area.",
      "It was a team project for the Orange internship programme 2026. I built the backend — Fastify and Prisma against MySQL, 62 endpoints across eight route groups — and a teammate built the React and MapLibre frontend.",
      "The interesting part is the geography. \"Is the power out?\" is a question about a neighbourhood, but outages are caused at substation and feeder level, which does not map onto any address a person would type.",
    ],
    problem: [
      "Nigerian grid supply is unreliable in ways that are locally obvious and nationally invisible. There is no shared record of who is off, for how long, or how often — so nobody can tell a bad week from a bad transformer.",
      "Crowd-sourcing that record has two hard parts. First, location: a report is only useful if it lands in the right area, and Nigerian addressing does not reliably resolve below a local government area. Second, aggregation: fifty people reporting the same blackout is one outage, not fifty, and deciding that automatically is the whole product.",
      "It also has to work on a phone, on mobile data, during a blackout — which rules out anything heavy.",
    ],
    architecture: [
      {
        title: "Six-level geographic hierarchy",
        body: "Country → State → LGA → City → Town → Neighborhood, modelled as first-class entities and seeded from Nigerian LGA datasets. A report attaches at the finest level the user can identify, and every summary rolls up through the chain, so the same data answers both \"is my street off\" and \"how did Ondo State do this month\".",
      },
      {
        title: "Reports, outages and the join between them",
        body: "Report is what a person submitted. Outage is the event. OutageReport joins them. An OFF report opens an outage for its neighbourhood if none is open, or joins the open one and increments its report count; an ON report closes it and records the duration in minutes — all inside one database transaction.",
      },
      {
        title: "Pre-aggregated summaries",
        body: "DailyReportSummary, WeeklyOutageSummary and MonthlyStatistic are materialised on demand through three admin endpoints rather than computed per request. Analytics over a growing report table is the thing that would have made the map slow.",
      },
      {
        title: "Layered Fastify backend",
        body: "routes → controllers → services → repositories → models, with services split into commands and queries across eleven areas, DTOs, validators, enums, errors and loaders as separate concerns, and Swagger generated from the route schemas. Twenty Prisma models over MySQL.",
      },
      {
        title: "Auth and delivery",
        body: "JWT with refresh tokens and device-bound sessions, OTP verification by email, rate limiting on the public routes, and Firebase Cloud Messaging for admin broadcasts and topic subscriptions, with every in-app notification stored in NotificationLog.",
      },
      {
        title: "Frontend, built by a teammate",
        body: "React 19 with MapLibre and react-map-gl for the heatmap and monitoring views, Tailwind for layout and Mixpanel for product analytics — built by a teammate against the backend's Swagger contract.",
      },
      {
        title: "Audit trail",
        body: "AuditLog and NotificationLog record who changed what and what was actually delivered. On a civic dataset that may be cited, being able to reconstruct the record matters more than saving the rows.",
      },
    ],
    decisions: [
      {
        title: "Geocode, then fall back offline",
        body: "GPS coordinates are resolved through OSM Nominatim's boundary data, falling back to a local LGA coordinate dataset when that fails, and mapped onto the seeded six-level hierarchy. A first version used LGA centre points, which put reports near a boundary in the wrong area.",
      },
      {
        title: "One open outage per neighbourhood",
        body: "Whether a report opens, joins or closes an outage is decided in the same transaction that stores the report. Fifty people reporting one blackout produce one outage with fifty reports, never fifty outages racing each other.",
      },
      {
        title: "Materialise the summaries",
        body: "The map and dashboards read from pre-aggregated tables. Live aggregation over reports would have been simpler until the first thousand rows, and then permanently slower.",
      },
    ],
    metrics: [
      { value: "20", label: "Prisma models" },
      { value: "6", label: "Geographic levels" },
      { value: "3", label: "Summary rollups" },
      { value: "62", label: "API endpoints" },
    ],
    stack: [
      "TypeScript",
      "Fastify",
      "Prisma",
      "MySQL",
      "React",
      "MapLibre",
      "Firebase Admin",
      "Mixpanel",
      "Swagger",
      "Zod",
      "Nodemailer",
    ],
    links: [{ label: "Source", href: "https://github.com/circorangeintern/Prism-circle" }],
    hue: 46,
    featured: true,
  },

  /* ================================================================== */
  {
    slug: "telente-cbt",
    name: "Telente CBT",
    kind: "Computer-based testing platform",
    category: "Education",
    year: "2026",
    role: "Lead engineer",
    status: "Private",
    summary:
      "A multi-tenant exam platform — 47 relational models, timed exams, question banks, instant results — with a service-key-isolated Python AI service for question generation.",
    overview: [
      "Telente CBT is a computer-based testing platform for schools, colleges and universities: secure exams, instant results, analytics, engagement mechanics, and AI-assisted question generation.",
      "It is a TypeScript/Fastify/Prisma/PostgreSQL backend owning authentication, users, courses, exams, billing and the database, plus a Python/FastAPI service owning the AI features. Forty-seven Prisma models cover the exam, school and billing domains.",
      "The part I care most about is the boundary between those two. Clients never reach the Python service. Every AI request goes client → TypeScript backend → Python service → provider, with the internal hop protected by a service key.",
    ],
    problem: [
      "Exam software has an unusually harsh failure profile. Two hundred students start a timed exam at the same second, a dropped connection cannot cost a candidate their answers, and a result that appears twice is worse than one that appears late.",
      "Layered on top: schools are tenants with their own classes, teachers and subject assignments, so every query is a permissions question before it is a data question.",
      "And AI question generation — genuinely useful for teachers — is a slow, failure-prone, expensive call sitting in the middle of an otherwise fast CRUD application. It could not be allowed to share a request path with the exam engine.",
    ],
    architecture: [
      {
        title: "TypeScript backend as the only public surface",
        body: "Fastify with Prisma over PostgreSQL 16 and Redis 7, behind an Nginx reverse proxy. It owns auth, users, courses, exams, billing and every write to the database. Internally it is layered — routes, controllers, services, repositories, providers, events, jobs — with DTOs and templates kept separate.",
      },
      {
        title: "Python AI service, internal only",
        body: "FastAPI handling question generation, question validation, AI chat, topic explanation and the practice question bank, calling Groq by default. Reachable only from the TypeScript backend, authenticated with a service key, never exposed to clients.",
      },
      {
        title: "Exam engine",
        body: "Timed exams with per-candidate question shuffling and immediate results, across MCQ, true/false, fill-in-the-blank and essay types, plus self-paced practice sessions with instant feedback.",
      },
      {
        title: "Multi-tenant school model",
        body: "Schools, classes and teacher–subject assignments as first-class entities, with role-based access control layered over every route.",
      },
      {
        title: "Engagement layer",
        body: "Achievements, leaderboards and streaks — the retention mechanics that separate a platform students use from one they are made to use.",
      },
      {
        title: "Operations",
        body: "Docker Compose for the full stack, a Makefile for the common paths, SMTP for transactional email, and payment-provider integration for institutional billing.",
      },
    ],
    decisions: [
      {
        title: "Two runtimes, one public API",
        body: "Keeping Python entirely internal means the AI surface can be rewritten, rate-limited, cached or removed without a single client change, and no untrusted request ever reaches the model layer directly.",
      },
      {
        title: "Prisma over raw SQL",
        body: "Forty-seven models is past the size where a human reliably remembers the schema. Generated types across the whole exam and school domain caught more bugs than the query-planner control I gave up.",
      },
      {
        title: "Redis for exam session state",
        body: "Exam timing and progress live in Redis, not Postgres. It keeps hot per-second writes off the primary and out of the transactional path the results depend on.",
      },
    ],
    metrics: [
      { value: "47", label: "Prisma models" },
      { value: "4", label: "Question types" },
      { value: "2", label: "Services (TS + Python)" },
      { value: "0", label: "Direct client → AI calls" },
    ],
    stack: [
      "TypeScript",
      "Fastify",
      "Prisma",
      "PostgreSQL 16",
      "Redis 7",
      "Python",
      "FastAPI",
      "Groq",
      "Docker",
      "Nginx",
    ],
    links: [],
    hue: 200,
    featured: true,
  },

  /* ================================================================== */
  {
    slug: "sentinelx",
    name: "SentinelX",
    kind: "Network intrusion detection & prevention",
    category: "Security",
    year: "2026",
    role: "Author",
    status: "Open source",
    summary:
      "A self-hosted intrusion detection and prevention platform in Python — 13 detectors, a bounded YAML rule language, explained 0–100 risk scores, and firewall enforcement that stays off until an administrator types a confirmation phrase.",
    overview: [
      "SentinelX captures network traffic, live or from PCAP files, decodes it, and detects scans, brute force, floods, DNS abuse and custom rule matches. Every detection carries its evidence, the thresholds it crossed and a risk score broken down by factor. Related detections are correlated into incidents, and, only when enabled, the attacker is blocked or rate-limited through the host firewall.",
      "It is built for people who look after one host or a small network: homelabs, small offices without a security team, training labs and analysts triaging captures. It is deliberately not a replacement for Suricata or Zeek on high-speed links, and the README says so.",
      "I designed and built it alone. The backend is a Python modular monolith of 119 source files, with a Next.js dashboard, a Typer CLI and a Docker Compose stack beside it.",
    ],
    problem: [
      "Most small networks have no intrusion detection at all, because the serious tools assume a security team to tune them and read a raw alert feed. An alert that says only \"port scan\" gives a generalist nothing to act on, and a tool that blocks addresses on its own can lock its operator out of the machine it is protecting.",
      "So the constraints were: every alert must explain itself, prevention must be off by default and hard to switch on by accident, and the tool must be honest about what the host it runs on can actually do, rather than failing silently when it lacks a privilege.",
    ],
    architecture: [
      {
        title: "One pipeline for live, replay, benchmark and test",
        body: "Capture → decoder → per-source feature extractor → detection engine → risk engine → correlation → response engine → safety guard → firewall. A single composition root wires it to storage, Redis and the event bus, and the API server, the CLI, the PCAP Lab and the benchmark harness all run the same assembly. A detection that fires on a replay went through the same code it would on the wire.",
      },
      {
        title: "Own decoder and capture backends",
        body: "struct-based decoders for Ethernet, Linux cooked capture, raw IP and loopback framing; IPv4, IPv6, ARP, TCP, UDP and ICMP; and DNS, HTTP request metadata and TLS ClientHello (SNI, ALPN). Capture uses AF_PACKET on Linux and libpcap through Scapy elsewhere, and SentinelX reads pcap and pcapng itself. Malformed packets are counted, never fatal.",
      },
      {
        title: "Detectors, rules and baselines",
        body: "Eleven behavioural detectors — vertical and horizontal port scans, UDP scans, brute force, SYN, connection-rate, ICMP and HTTP floods, DNS anomalies, denylisted sources and TCP flag anomalies — plus a statistical baseline detector and an optional Isolation Forest model. Custom rules are YAML, parsed by a bounded recursive-descent parser rather than evaluated as code, and each rule carries its own embedded tests.",
      },
      {
        title: "Explained risk and correlated incidents",
        body: "Each detection's score adds weighted contributions from severity, confidence, frequency, source history, correlation, threat intelligence and previous responses, capped to 0–100, with every contribution stored and shown. Seven kill-chain patterns — reconnaissance followed by a credential attack, reconnaissance with service disruption, possible exfiltration and others — group detections from one source into incidents.",
      },
      {
        title: "Guarded response",
        body: "Detect-only, manual-approval and automatic modes, with dry run on top. Firewall adapters exist for nftables, iptables, pf and Windows Firewall. A safety guard refuses to block loopback, allowlisted, management and host addresses, operators who signed in recently, and any prefix that contains a protected address.",
      },
      {
        title: "Platform around the core",
        body: "A FastAPI REST API of 65 HTTP routes plus a WebSocket event stream, SQLAlchemy over PostgreSQL (SQLite for evaluation) with Alembic migrations across 12 tables, Redis for shared state, Prometheus metrics, and a Next.js 16 dashboard. A Docker Compose stack runs postgres, redis, migrate, api, dashboard and an nginx proxy, with an optional host-network sensor profile.",
      },
    ],
    decisions: [
      {
        title: "Off by default, and loud about it",
        body: "A new installation runs detect-only, dry run on, with a null firewall backend. Turning prevention on at runtime requires typing ENABLE PREVENTION, and the change is audited. A missing or unusable firewall refuses every change rather than reporting it as done. The failure I most wanted to rule out was a security tool quietly doing something to traffic that nobody asked for.",
      },
      {
        title: "Probe the host instead of assuming it",
        body: "Capture and firewall support are decided by actually opening a raw socket, checking capability bits and running each firewall tool's read-only listing command. Each result comes with a reason and a remedy. A permission error or an invalid BPF filter is reported as it is, never hidden by quietly falling back to another backend.",
      },
      {
        title: "An additive score over a learned one",
        body: "Every point of a risk score traces to a named, re-weightable factor. It cannot model interactions between factors the way a learned model could, but an operator can see why a host scored 91, and that is what the tool is for.",
      },
      {
        title: "Test it against real attacks, not just fixtures",
        body: "A demo script attacks the Docker stack from four containers with nmap, hping3, DNS tunnelling queries and an HTTP flood. Earlier runs found real defects — targets blamed for their own replies, a SYN flood on an open port missed, SentinelX's own database traffic looking like brute force — and each fix has a regression test. On the final run the kernel's nftables counter recorded 3,084 dropped packets from the blocked attacker.",
      },
    ],
    metrics: [
      { value: "13", label: "Detectors" },
      { value: "1,876", label: "Tests collected" },
      { value: "4", label: "Firewall adapters" },
      { value: "14", label: "Synthetic attack scenarios" },
    ],
    stack: [
      "Python 3.12+",
      "FastAPI",
      "Pydantic",
      "SQLAlchemy + Alembic",
      "PostgreSQL",
      "SQLite",
      "Redis",
      "Scapy",
      "Typer",
      "Prometheus",
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind CSS",
      "Docker",
      "nginx",
      "nftables",
    ],
    links: [{ label: "Source", href: "https://github.com/oyinlola-tech/Sentinelx" }],
    hue: 330,
    featured: false,
  },

  /* ================================================================== */
  {
    slug: "scriptune",
    name: "Scriptune",
    kind: "Hymn and scripture recognition",
    category: "AI & agents",
    year: "2026",
    role: "Author",
    status: "Open source",
    summary:
      "Hear a hymn or a Bible verse and find out what it is: one TypeScript API behind a website, an iPhone app and an Android app, with Whisper speech recognition on a self-hosted server and on the phone itself.",
    overview: [
      "Scriptune listens to a hymn the choir has started or a verse the preacher has quoted, works out what it was, and opens the words: the full hymn with its number in the hymnal, or the verse in its chapter, with the passages and hymns connected to it.",
      "I built it on my own and released it under the MIT licence. It is a Zudojs modular-monolith API over PostgreSQL, a Next.js website that installs as a PWA, an Expo app for iOS and Android, and a Python service that runs OpenAI Whisper. Both clients import one shared, typed contracts package.",
      "The hard part is not the speech recognition. It is turning a noisy, half-heard transcript into the right verse among seven Bible translations, or the right hymn among 1,200, without asking the database for expensive fuzzy work it does not need.",
    ],
    problem: [
      "Churchgoers catch scripture and hymns in fragments. A verse is quoted mid-sermon without a reference; a hymn starts and the number is not on the board. Searching the web for a half-remembered line works badly when the line was sung, a word was misheard, or it was in Yoruba.",
      "I did not want church audio going to a commercial speech API by default. Transcription had to run on hardware the operator controls, and a recording had to be discarded once it had been turned into words.",
      "It also has to work in a pew, sometimes with no signal at all. That means the texts, the search and, ideally, the listening model have to live on the phone.",
    ],
    architecture: [
      {
        title: "One API, nine modules",
        body: "The API is a Zudojs modular monolith with nine modules: http, database, bible, hymns, search, transcription, recognition, identity and library. Each registers its own providers, command and query handlers and routes, and dependencies point strictly downward. It serves 51 routes, documented as OpenAPI at /docs, over 29 Prisma models.",
      },
      {
        title: "Three-stage search",
        body: "Verses and hymns are searched in the same three stages. First, every word present, as one GIN lookup against a generated tsvector. If that finds nothing, any pair of the stronger words, which is still an index lookup. If that also finds nothing and the phrase is at least 12 characters, pg_trgm word similarity, which rechecks thousands of rows. Candidates are then scored for confidence and the top five returned.",
      },
      {
        title: "Whisper behind an interface",
        body: "Speech-to-text sits behind a TranscriptionProvider interface with three implementations: the Whisper service, a fake for tests, and an unavailable provider that switches audio off deliberately. The Python service is FastAPI over openai-whisper. It runs one transcription at a time behind a semaphore, answers 503 with Retry-After when busy instead of queueing without limit, and checks each model download against its SHA-256 before loading it.",
      },
      {
        title: "Hymns and scripture linked by their words",
        body: "An import-time job finds where a hymn quotes the King James Version by looking for runs of four shared words, scored by how rare those words are in the Bible and discarded if the run appears in more than twelve verses. So \"the print of the nails\" counts and \"O Lord our God\" does not. A second job pairs each hymn with the hymns most like it, by rarity-weighted wording plus shared scripture.",
      },
      {
        title: "Offline on the phone",
        body: "The API exports a whole translation or hymnal as one response that clients may cache for a day. The Expo app stores it in SQLite with FTS5 tables, so reading, search and typed identification work with no connection. whisper.rn adds on-device transcription with a model downloaded on request rather than bundled, so native builds can listen offline too.",
      },
      {
        title: "Shared contracts",
        body: "@scriptune/contracts holds the DTO types, library keys, legal text and fetch client that both the Next.js site and the Expo app import. A change to a response shape fails both clients' typecheck in CI rather than one of them at runtime.",
      },
      {
        title: "CI and native builds",
        body: "GitHub Actions runs the API typecheck and tests against a PostgreSQL 17 service, the contracts typecheck, the web lint, typecheck and production build, and the mobile typecheck, lint and Android bundle. A second workflow builds the Android APK and the iOS app on GitHub's runners, on demand or from a mobile-v* tag.",
      },
    ],
    decisions: [
      {
        title: "Cheap stages first",
        body: "Each more expensive search stage runs only when the one before it found nothing. Trigram similarity is the stage that forgives a misheard word, and it is also the slow one, so it is the last resort rather than the default.",
      },
      {
        title: "Fold accents in the index, not the app",
        body: "Yoruba tone marks meant a query transcribed as \"Olorun\" never matched a verse stored as \"Ọlọ́run\", and fell through to the slow fuzzy stage. A Postgres function strips combining marks after NFKD normalisation, and both the stored search vectors and the incoming query pass through it, so Yoruba stays on the fast index path.",
      },
      {
        title: "Self-hosted speech, no stored audio",
        body: "Whisper runs on the operator's server or on the phone; no third-party speech service is involved. A recognition attempt records the transcript, candidates, timings and the audio's type and size, never the audio itself. If the transcriber is down, only the microphone flow fails; typed identification never touches it.",
      },
      {
        title: "Work out the connections ahead of time",
        body: "Scripture links and related hymns are computed by batch jobs and stored as rows. Comparing a hymnal's words against the whole Bible is batch work; serving the answer should be a few indexed reads.",
      },
    ],
    metrics: [
      { value: "51", label: "API routes" },
      { value: "29", label: "Prisma models" },
      { value: "7", label: "Bible translations" },
      { value: "3", label: "Search stages" },
    ],
    stack: [
      "TypeScript",
      "Zudojs",
      "Prisma 7",
      "PostgreSQL 17",
      "Redis 7",
      "Python",
      "FastAPI",
      "OpenAI Whisper",
      "Next.js 16",
      "React 19",
      "Tailwind 4",
      "Expo 57",
      "React Native",
      "SQLite",
      "whisper.rn",
      "Docker",
      "GitHub Actions",
    ],
    links: [{ label: "Source", href: "https://github.com/oyinlola-tech/scriptune" }],
    hue: 256,
    featured: false,
  },

  /* ================================================================== */
  {
    slug: "commitguard",
    name: "CommitGuard",
    kind: "Git commit provenance and policy engine",
    category: "Developer tooling",
    year: "2026",
    role: "Author",
    status: "Open source",
    summary:
      "A policy engine that blocks AI-agent attribution in Git commit metadata — in local hooks, a GitHub Action and a webhook-driven GitHub App — measured against 9,174 labelled cases with every failing run kept.",
    overview: [
      "CommitGuard reads what a commit says about its own origin — author, committer, message and trailers — and decides, according to a repository's policy, whether that commit is acceptable. The first policy is AI-agent attribution: a commit carrying an AI agent as co-author is blocked by default; one crediting a human co-author is not.",
      "I built it alone over six days in September 2026 — 132 commits — and published it to PyPI as commitguardian and to the GitHub Marketplace as a composite Action. It is pre-alpha. The same engine runs in three places: Git hooks on a developer's machine, a GitHub Actions check, and a GitHub App with a web dashboard for organisation-wide policy.",
      "The interesting part is that commit messages are attacker-controlled text. A check that matches strings is easy to evade with casing, look-alike letters or characters that render as nothing, so most of the work went into parsing hostile input and into measuring, in public, how often the parser got it wrong.",
    ],
    problem: [
      "AI coding agents increasingly write commits, and many record themselves in commit metadata. Some projects need to control that for contributor-agreement or licensing reasons, or simply to keep an accurate provenance record. Checking by hand does not scale.",
      "Naive string matching fails in both directions. It is easy to evade — a Cyrillic letter in an agent's name, a variation selector inside the trailer key, a symbol before \"Co-authored-by\" that hides the line from a parser but not from a reader. It is also prone to false positives: a human who shares an agent's name, or an employee of the vendor, is not an AI agent.",
      "And a local check is only advice. Anyone can pass --no-verify. A real boundary has to run server-side, and it has to be impossible for the pull request being judged to change the rules judging it.",
    ],
    architecture: [
      {
        title: "Detection separate from policy",
        body: "Four detectors — coauthor, identity, trailer and bot — report findings with rule, severity, confidence and evidence, and know nothing about configuration. A separate policy evaluator turns findings into allow, warn or block, with block > warn > allow regardless of detector order. Neither side has side effects, which is what lets detection accuracy be measured independently of any policy choice.",
      },
      {
        title: "Rules as data",
        body: "Four YAML files hold the rules: 15 AI agents, 11 vendor domains and 6 bots, plus trailer patterns. They ship inside the installed package and are never read from the repository being scanned. Matching is exact after normalisation — case, width and whitespace folded, every default-ignorable code point removed, Cyrillic and Greek look-alikes mapped to Latin. There is no substring matching, and a vendor domain on its own is never enough.",
      },
      {
        title: "A trailer parser with no regular expressions",
        body: "The trailer parser is an explicit linear scan with bounded key length, trailer count and prefix skipping. It never raises; instead it records named flags such as MISSING_SEPARATOR and LEADING_CHARACTERS that detectors can act on. Work stays linear in message size, and each bypass fix was a readable change to the scan rather than a new branch in an expression.",
      },
      {
        title: "Three enforcement layers",
        body: "Local hooks — pre-commit, commit-msg and pre-push — give immediate feedback and chain any existing hooks rather than replacing them. The composite Action scans every commit a pull request introduces, plus merge-queue entries and pushes, with SHA-pinned actions, hash-pinned dependencies and only contents: read. The GitHub App does the same from signed webhooks and publishes a Check Run. All three reach the same analyser.",
      },
      {
        title: "GitHub App on the standard library",
        body: "The App service is a WSGI server from Python's standard library over SQLite — 47 tables — with cryptography as its only extra dependency, for signing the App JWT. Webhooks are signature-checked and deduplicated by delivery ID. Installation tokens are scoped down to one repository per scan, and repositories are fetched as metadata-only mirrors, so repository code is never checked out or run.",
      },
      {
        title: "Dashboard and control plane",
        body: "React 19 and TypeScript over a /api/v1 served by the same process: 32 pages covering scans, violations, versioned organisation policy with audited rollback, scoped expiring exceptions, staged rollouts and policy simulation against recorded scans. Four roles — viewer, security manager, admin and owner — are granted in CommitGuard, and users see only repositories GitHub already lets them see.",
      },
      {
        title: "Reproducible evidence",
        body: "Four versioned datasets of labelled commits, the largest with 9,174 cases, are rebuilt and fingerprinted by one command, commitguard reproduce. Every benchmark result is written once to a timestamped file and never overwritten.",
      },
    ],
    decisions: [
      {
        title: "Read policy from the base commit",
        body: "If the check reads .commitguard.yaml from the pull request it is checking, the first commit of any pull request can be \"disable the check\". Server-side runs read policy from the base commit, and the workflow installs CommitGuard itself from that trusted commit. A pull request that tightens policy does not take effect until merged — that is the cost, and I accept it.",
      },
      {
        title: "Every failure path blocks",
        body: "A detector that raises, a finding with no matching policy, invalid configuration, a Git error — each becomes a block or an error, never an allow. The App publishes error, never success, and the dashboard shows UNKNOWN or STALE rather than a green tick. The only way to pass is a completed evaluation that found nothing.",
      },
      {
        title: "Keep the failing runs",
        body: "15 detection runs are committed, and four of them failed: one false negative, then two false positives introduced by the fix, then 11 and 15 misses found by property-based fuzzing. Each failing run was recorded before the fix. The final zero is only worth something because the runs that were not zero are sitting next to it.",
      },
      {
        title: "Publish as commitguardian",
        body: "commitguard and commitguard-cli on PyPI already belong to two unrelated projects. At one point the documentation told people to pip install commitguard, which would have installed someone else's code — a dependency-confusion problem of my own making. The distribution is commitguardian; the command is still commitguard.",
      },
    ],
    metrics: [
      { value: "9,174", label: "Labelled cases, none misjudged" },
      { value: "4 of 15", label: "Benchmark runs that failed, kept" },
      { value: "1,452", label: "Python tests" },
      { value: "15", label: "AI agents in rule data" },
    ],
    stack: [
      "Python 3.12",
      "Typer",
      "Pydantic",
      "PyYAML",
      "SQLite",
      "GitHub Apps",
      "GitHub Actions",
      "React 19",
      "TypeScript",
      "Vite",
      "TanStack Query",
      "pytest",
      "Hypothesis",
      "Playwright",
    ],
    links: [
      { label: "Source", href: "https://github.com/oyinlola-tech/commitguard" },
      { label: "PyPI", href: "https://pypi.org/project/commitguardian/" },
      {
        label: "Marketplace",
        href: "https://github.com/marketplace/actions/commitguard-ai-attribution-check",
      },
    ],
    hue: 180,
    featured: false,
  },

  /* ================================================================== */
  {
    slug: "betng",
    name: "BetNG",
    kind: "Virtual football platform",
    category: "Payments & fintech",
    year: "2026",
    role: "Author",
    status: "Open source",
    summary:
      "A virtual football platform where every match is simulated once and seen identically on five clients: twelve TypeScript and Python services, integer-kobo money, and fourteen invariants each tied to a named test.",
    overview: [
      "BetNG runs four simulated football leagues of 80 clubs, round after round on a real clock. The platform simulates every match once, and every viewer sees that same match: the same fixture, prices, timeline, result and settlement. That holds on the web, on a phone, on a shop television, at a cashier terminal and in the admin console. It uses play money only.",
      "I built it alone as a portfolio system. The gateway and seven TypeScript services run on Zudojs with Prisma. Four Python services handle simulation, odds, risk and analytics. Five clients share one set of wire contracts and one view-model layer.",
      "The hard part was trust, not features. When the house prices the bets and also plays the match, the only credible design is one where nobody can influence, predict or edit the result. The database has to enforce that and tests have to prove it. A README promise is not enough.",
    ],
    problem: [
      "A virtual sports product is a chain of authorities. A scheduler creates fixtures, an odds engine prices them, a risk engine decides how much it will accept, betting closes, a simulation plays the match and settlement pays out. Each link must be the only one allowed to make its decision, and none may see further along the chain than it needs to.",
      "The obvious failure is a result that bets can reach. The product is rigged, whether anyone means it or not, if any of three things is true: the simulation can see stakes, an admin can re-run a match, or the seed can be computed from public inputs.",
      "The quieter failure is five clients drifting apart. A phone that works out its own payout, or a TV that runs its own clock, will eventually show a number the platform never agreed to. So the clients had to display state and never produce it.",
    ],
    architecture: [
      {
        title: "Twelve services, one schema each",
        body: "There is a public gateway, seven TypeScript services (match, betting, wallet, settlement, identity, event, email) and four Python services (simulation, odds, risk, analytics). Each service that stores data owns one PostgreSQL schema and has a login that can write only that schema. A write to another service's data goes through that service's `POST /rpc` and needs an internal token. Redis holds locks, caches and rate-limit counters, and is never the source of truth.",
      },
      {
        title: "The gateway as a route table",
        body: "The public API is 187 routes declared as data: the path, the service that owns it and who may call it. The gateway checks the session, removes any incoming `x-betng-*` header and rebuilds the actor from the session, so a service never trusts a user id taken from a path or body. Rate limits on bets, deposits and withdrawals fail closed. No route sets a score or a winner.",
      },
      {
        title: "A fifteen-state match lifecycle",
        body: "A match moves from FIXTURE_CREATED through BETTING_CLOSED, SIMULATION_STARTED and MATCH_FINISHED to SETTLEMENT_COMPLETED. There are also failure states and VOIDED. Every transition is stored as a row. The scheduler ticks once a second behind a Redis lock, so only one instance ever drives it. With the default settings a match minute lasts two seconds.",
      },
      {
        title: "A simulation that cannot be steered",
        body: "Betting closes before kick-off. The simulation then plays the match once, minute by minute, from the match id and the two teams' strengths. Its request models reject every other field, so sending a stake is a validation error. The seed is an HMAC of the match under a server secret, so nobody can work out the result from the source code. Database triggers block UPDATE, DELETE and TRUNCATE on results and events. Events are shown only when the match clock reaches them.",
      },
      {
        title: "Pricing and risk",
        body: "The odds service prices six market types from the score distribution the simulation produces. Pricing uses the same minute-by-minute core that decides the score. The risk service answers ACCEPT, LIMIT or REJECT for every stake, based on exposure across all accounts. It freezes that exposure when betting closes and has no way to touch a price or a result.",
      },
      {
        title: "Money as integer kobo",
        body: "Every amount is a BIGINT in kobo, from the database all the way to the screen. Payouts are calculated with integer arithmetic only, using the odds stored on the bet when it was accepted. The wallet ledger is append-only. The operator ledger is kept apart from customer wallets. A unique key makes settlement idempotent, so settling a match twice pays nobody twice.",
      },
      {
        title: "Five clients, one match model",
        body: "The web, TV, shop and admin apps are React 19 on Vite and share one component library. The mobile app is Expo 54 and uses the same view models. Components never call fetch or import the SDK. They render view models from a data-source interface, and a platform adapter behind it talks to the gateway. Realtime signals over WebSocket or SSE tell TanStack Query which cached data to refresh.",
      },
    ],
    decisions: [
      {
        title: "Enforce invariants in the database, prove them in tests",
        body: "`docs/invariants.md` lists fourteen rules, such as one result per match, bets never reach the simulation, settlement pays on stored odds, and admin cannot pick a winner. Beside each rule it names what enforces it and the test that proves it. Where a rule could be a unique index, a CHECK or a trigger, I made it one, because application code can be bypassed and a constraint cannot.",
      },
      {
        title: "Close betting before the match is played",
        body: "The simulation runs at kick-off, after betting has closed and exposure is frozen. No bet can be accepted once the result exists, so there is nothing for a bet to influence. The result is created at kick-off and only revealed as the match plays out.",
      },
      {
        title: "TypeScript for the plumbing, Python for the maths",
        body: "The gateway, ledgers, identity and match lifecycle are TypeScript on Zudojs and Prisma. The probability model, pricing, risk and analytics are Python with FastAPI and psycopg. Both sides use the same camelCase wire format: Zod schemas in `packages/contracts`, with matching Pydantic models on the Python side. So changing language never means changing the contract.",
      },
      {
        title: "No stand-in backend for the clients",
        body: "There is no offline mock. Development, the browser test suites and production all run against the real platform. `pnpm verify` fails if a production bundle references a mock, a data-source switch or a demo credential. The clients take longer to start, but they cannot drift from the API.",
      },
    ],
    metrics: [
      { value: "12", label: "Backend services" },
      { value: "5", label: "Clients, one match model" },
      { value: "187", label: "Gateway routes" },
      { value: "14", label: "Invariants, each with a test" },
    ],
    stack: [
      "TypeScript",
      "Node.js 24",
      "Zudojs",
      "Prisma 7",
      "Python 3.14",
      "FastAPI",
      "PostgreSQL 17",
      "Redis 8",
      "React 19",
      "Vite",
      "Expo",
      "Tailwind CSS",
      "TanStack Query",
      "Zod",
      "Playwright",
      "Docker",
    ],
    links: [{ label: "Source", href: "https://github.com/oyinlola-tech/BetNg" }],
    hue: 80,
    featured: false,
  },

  /* ================================================================== */
  {
    slug: "church-cms",
    name: "Church Management System",
    kind: "Church records & public website",
    category: "Civic & infrastructure",
    year: "2026",
    role: "Author",
    status: "Open source",
    summary:
      "A records system and public website for a church in Okitipupa, Ondo State — members, households, attendance, finance and content behind four roles and 23 permissions, on Express and MySQL.",
    overview: [
      "The system gives a local church in Okitipupa, Ondo State, a public website and an admin dashboard over one database. The public side carries announcements, programmes, a gallery, a giving page and a contact form; the admin side holds members, households, attendance, income and expenses, and the content the public side shows.",
      "I built it alone: an Express 5 API over MySQL with 70 endpoints under /api/v1, and 28 static HTML pages styled with Tailwind and driven by shared scripts. There is no frontend build step.",
      "Most of the work went into who may do what. Member details and giving records are personal data, while announcements and the gallery are edited by whoever runs the church's media — so every admin endpoint asks for a named permission, and sessions can be revoked the moment someone's access changes.",
    ],
    problem: [
      "A church's records are small but sensitive. Contact details, household links, attendance and who gave what are personal; announcements and the weekly schedule are public. Both live in the same office and, here, in the same database.",
      "The people using the dashboard have different jobs. Someone who posts the weekly announcement should not be able to export the finance ledger, and nobody should be able to promote themselves or delete the last administrator.",
      "It also has to be simple to run: one Node process and a MySQL database, set up on first start without a migration tool or a frontend build.",
    ],
    architecture: [
      {
        title: "One Express app, two surfaces",
        body: "createApp builds the application from an injected database, rate limiters, mail and upload services. It serves 28 HTML pages — 14 public, five of them error states, and 14 admin, four of them auth pages — and 70 JSON endpoints across seven routers under /api/v1, with the same router also mounted at /api for older clients.",
      },
      {
        title: "Sixteen tables, created on first run",
        body: "db-init.js creates the database and 16 tables — users, password_resets, church_info, members, family_members, attendance, transactions, expense_categories, programs, weekly_schedule, announcements, gallery, contact_messages, contact_replies, external_links and activity_log — then seeds church details, the weekly schedule and a super_admin from the environment. Columns added after the first release are checked against information_schema before being applied, so the script is safe to re-run.",
      },
      {
        title: "Permission-gated routes",
        body: "Four roles in a hierarchy — super_admin, admin, editor, viewer — map to 23 permissions such as members:write and finance:export. All 53 admin endpoints call requirePermission; the role is read from the database once per request and cached, never taken from the client. A user cannot create, promote or delete an account at or above their own role, and the last active administrator cannot be deleted.",
      },
      {
        title: "Revocable sessions",
        body: "JWTs carry a purpose claim and a token version. Logging out, changing or resetting a password, or deactivating an account increments token_version, which invalidates every token issued before it, and a password-reset token cannot be used as a session. Password reset is a six-digit OTP by email, valid for ten minutes and usable once.",
      },
      {
        title: "Audit trail and rate limits",
        body: "Middleware wraps res.json on every write request and records each successful one in activity_log with the user, action, entity, IP address and request ID. Seventeen named rate-limit tiers run from 300 requests a minute across the API down to five password-reset attempts per ten minutes, keyed by email.",
      },
      {
        title: "Uploads and scheduled publishing",
        body: "Multer accepts images, then each file is re-checked against PNG, JPEG and WebP signatures once it is on disk, and anything that only claims to be an image is deleted. An interval scheduler publishes announcements whose scheduled time has passed, and stops cleanly on SIGTERM or SIGINT.",
      },
    ],
    decisions: [
      {
        title: "Permissions, not role checks",
        body: "Routes ask for members:write, not for admin. Changing what an editor may do is one edit to the permission table rather than a search through seven routers.",
      },
      {
        title: "Static pages, no build step",
        body: "The admin is forms and tables. Plain HTML with shared scripts runs anywhere Node runs, with nothing to compile. The cost is that Tailwind loads from a CDN, which the Content Security Policy names explicitly.",
      },
      {
        title: "No inline scripts, so the CSP can forbid them",
        body: "Pages declare a data-page attribute and js/page-init.js dispatches their behaviour, so script-src does not need 'unsafe-inline'. Announcement bodies are stored as plain text and rendered through text nodes, so stored markup cannot execute.",
      },
      {
        title: "Test the real stack against a double",
        body: "The API tests boot the real router stack from createApp against a database double, covering auth, RBAC and the public API. The frontend tests load each page with linkedom, run its real scripts, and check that selectors resolve and form payloads match the API contract. Forty tests, all passing.",
      },
    ],
    metrics: [
      { value: "16", label: "MySQL tables" },
      { value: "70", label: "API endpoints" },
      { value: "23", label: "RBAC permissions" },
      { value: "40", label: "Automated tests" },
    ],
    stack: [
      "Node.js",
      "Express 5",
      "MySQL",
      "mysql2",
      "JWT",
      "bcrypt",
      "Multer",
      "Nodemailer",
      "Tailwind CSS",
      "node:test",
      "linkedom",
    ],
    links: [{ label: "Source", href: "https://github.com/oyinlola-tech/cms" }],
    hue: 4,
    featured: false,
  },

  /* ================================================================== */
  {
    slug: "learnbridge",
    name: "LearnBridge",
    kind: "Learning management system",
    category: "Education",
    year: "2026",
    role: "Lead engineer",
    summary:
      "A full LMS with four distinct workspaces, realtime channels, Paystack billing, and externally verifiable certificates rendered to PDF and PNG.",
    overview: [
      "LearnBridge covers course discovery, lesson delivery, assignments, grading, mentorship, community learning, billing, admin operations and verifiable certificates.",
      "It is not only an API. The repository carries the Fastify/TypeScript backend, a vanilla HTML/CSS/JS frontend, four role-based workspaces, public marketing pages, certificate rendering and operational admin screens.",
      "Four audiences use it and none of them want the same thing: visitors browsing a catalogue, students learning, tutors teaching and getting paid, and admins keeping the platform honest.",
    ],
    problem: [
      "An LMS is really four applications sharing a database. Building four separate frontends duplicates auth, state and design; building one that branches on role produces an interface that serves nobody well.",
      "The harder problem is the certificate. A certificate that only exists inside the platform that issued it is worthless as proof. It has to survive being posted to LinkedIn, embedded in a portfolio, and checked by an employer who will never create an account.",
    ],
    architecture: [
      {
        title: "Four workspaces on one API",
        body: "Public website (landing, catalogue, learning paths, certifications, corporate training, blog, verification, legal). Student workspace (dashboard, progress, lessons, notes, bookmarks, wishlist, grades, assignments, submissions, certificates, mentorship, communities, timeline, messages). Tutor studio (course builder, assignments, submission review, students, analytics, earnings, office hours, portfolio). Admin and superadmin console (users, courses, enrolments, reports, warnings, email logs, support, financials, system logs, compliance, settings).",
      },
      {
        title: "Backend",
        body: "Node.js and TypeScript on Fastify, PostgreSQL with Sequelize models, JWT auth with Argon2 password hashing, role guards, rate limiting and Helmet.",
      },
      {
        title: "Realtime",
        body: "WebSocket channels carrying notifications, chat and discussion threads, so community and mentorship features are live rather than polled.",
      },
      {
        title: "Certificate pipeline",
        body: "Course completion issues a certificate with a unique ID. HTML templates render through Puppeteer to PDF and PNG, a QR code encodes the verification URL, and a public endpoint validates the ID with no account required.",
      },
      {
        title: "Jobs and cache",
        body: "Redis with BullMQ, optional by design — the platform runs without them and uses them when present for email, rendering and heavy report work.",
      },
      {
        title: "Payments",
        body: "A Paystack-oriented billing flow, chosen because it is what actually works for the Nigerian market this is built for.",
      },
    ],
    decisions: [
      {
        title: "Vanilla frontend, deliberately",
        body: "No build step for the client. Given four workspaces of largely form-and-table UI, a framework would have added a toolchain and a hydration story without changing what shipped. The tradeoff is more discipline required in the CSS.",
      },
      {
        title: "Public certificate verification",
        body: "The verification endpoint takes a certificate ID and needs no authentication. It is the single feature that makes the credential mean anything outside the platform.",
      },
      {
        title: "Argon2 over bcrypt",
        body: "Memory-hard by default and the current recommendation. On a platform holding minors' accounts, password hashing is not the place to follow habit.",
      },
      {
        title: "Optional Redis",
        body: "A small institution should be able to run this on one box. Queues and cache improve it; nothing requires them.",
      },
    ],
    metrics: [
      { value: "4", label: "Role workspaces" },
      { value: "3", label: "Realtime channel types" },
      { value: "2", label: "Certificate formats" },
      { value: "1", label: "Public verification endpoint" },
    ],
    stack: [
      "TypeScript",
      "Fastify",
      "PostgreSQL",
      "Sequelize",
      "WebSockets",
      "Redis",
      "BullMQ",
      "Puppeteer",
      "Argon2",
      "Paystack",
      "Docker",
    ],
    links: [{ label: "Source", href: "https://github.com/oyinlola-tech/LMS" }],
    hue: 268,
    featured: false,
  },

  /* ================================================================== */
  {
    slug: "utils-tool",
    name: "Utils-tool",
    kind: "Local-first media utility suite",
    category: "Developer tooling",
    year: "2026",
    role: "Author",
    status: "Live",
    summary:
      "28 image, PDF, file and developer tools in one codebase that runs fully local or serverless — no database, no accounts, no cloud uploads.",
    overview: [
      "Utils-tool is a suite of 28 tools for images, PDFs, files and developer assets: compression, background removal, format conversion, resizing, cropping, watermarking, PDF merge and split, favicon and SVG generation, QR and barcode generation, and more.",
      "One codebase runs two ways — locally with the full feature set, or on Vercel as a serverless app. No database, no Redis, no accounts, no cloud uploads.",
      "The design problem was that those two environments cannot do the same things. Ghostscript and rembg exist locally and do not exist in a serverless function.",
    ],
    problem: [
      "Online file tools ask you to upload private documents to a stranger's server. Local tools mean installing something. I wanted both from one codebase without maintaining two forks.",
      "But feature parity is impossible: heavy native binaries and ML models run locally and cannot run serverless. Shipping a tool that appears in the UI and then fails at runtime is worse than not shipping it.",
      "So the environment had to become something the code could reason about, rather than a deploy-time assumption.",
    ],
    architecture: [
      {
        title: "Capability system",
        body: "Every tool declares its runtime requirements. On boot the backend reports what the current environment actually supports, and the frontend shows, hides or disables each tool accordingly. A tool that cannot run is never offered.",
      },
      {
        title: "Layered FastAPI backend",
        body: "Routes → controllers (validation and HTTP) → services (the actual work) → repositories (persistence) → infrastructure adapters. All 28 tools follow the same path, so adding the twenty-ninth is mechanical.",
      },
      {
        title: "Pluggable storage",
        body: "A storage abstraction resolves to the local filesystem when running locally and to Vercel Blob when deployed. Nothing above it knows which.",
      },
      {
        title: "Infrastructure adapters",
        body: "rembg for background removal, Pillow for images, pikepdf and Ghostscript for PDFs, qrcode and python-barcode for generation, plus a ZIP adapter — each behind an interface, so an absent binary is a capability signal rather than a crash.",
      },
      {
        title: "Secure upload pipeline",
        body: "Magic-byte validation instead of trusting file extensions, hard size limits, and decompression-bomb protection — because the whole product is accepting arbitrary files from strangers.",
      },
      {
        title: "Batch queue",
        body: "Multi-file tools run through a shared queue with real per-file progress, not a spinner that resolves when everything finishes.",
      },
    ],
    decisions: [
      {
        title: "Capabilities as data, not configuration",
        body: "The alternative was environment flags in a config file, which drift the moment a dependency changes. Probing at runtime means the UI is never wrong about what the server can do.",
      },
      {
        title: "No database at all",
        body: "Files in, files out. Adding persistence would have meant accounts, retention policy and a privacy story. Statelessness is the feature.",
      },
      {
        title: "Static frontend",
        body: "Plain HTML, CSS and JS with a shared tool-kit module. Twenty-eight near-identical tool pages is exactly the case where a framework buys nothing and a template buys everything.",
      },
      {
        title: "Magic-byte validation",
        body: "Extension checks are trivially bypassed. Reading the header is a few lines and closes the entire class of upload-type confusion.",
      },
    ],
    metrics: [
      { value: "28", label: "Tools" },
      { value: "2", label: "Runtime environments" },
      { value: "0", label: "Databases" },
      { value: "0", label: "Accounts required" },
    ],
    stack: [
      "Python",
      "FastAPI",
      "Pillow",
      "pikepdf",
      "Ghostscript",
      "rembg",
      "Vercel Blob",
      "HTML/CSS/JS",
      "Ruff",
    ],
    links: [
      { label: "Live", href: "https://tools.oyinlola.site" },
      { label: "Source", href: "https://github.com/oyinlola-tech/utils-tools" },
    ],
    hue: 44,
    featured: true,
  },

  /* ================================================================== */
  {
    slug: "telente-store",
    name: "Telente Store",
    kind: "E-commerce platform",
    category: "Commerce & marketplace",
    year: "2026",
    role: "Author",
    summary:
      "A modular-monolith commerce platform: 24 hexagonal modules, 150+ routes, 31 relational models — storefront, admin dashboard and API in one process.",
    overview: [
      "Telente Store is a production e-commerce platform built as a modular monolith: 24 feature modules, each with a hexagonal ports-and-adapters layout, unified by a lightweight DI container and CQRS-style command and query buses.",
      "A single Node.js process serves a REST API with 150+ routes, a vanilla storefront with clean URLs, and a full admin dashboard for catalogue, orders, inventory, users, returns and support.",
      "It is the project where the modular-monolith pattern I later scaled up in Zudomart was worked out.",
    ],
    problem: [
      "Commerce has an unforgiving domain model. Inventory with variants, carts, orders, payments, shipping, returns, refunds, coupons, tax rules and reviews all touch each other, and getting any transition wrong costs real money.",
      "Most small commerce codebases collapse into a controllers folder and a services folder, at which point the order lifecycle is spread across a dozen files and nobody can say where a refund is authorised.",
      "The goal was a codebase where each part of the domain has one obvious home and the boundaries between them are enforced by structure rather than convention.",
    ],
    architecture: [
      {
        title: "24 hexagonal modules",
        body: "Each module owns its domain, ports and adapters. Nothing reaches across a boundary except through a declared port, so swapping a payment provider or an email transport touches one adapter.",
      },
      {
        title: "DI container and CQRS buses",
        body: "A lightweight container wires modules together; command and query buses separate writes from reads. Routes dispatch to the bus rather than calling services directly, which keeps HTTP concerns out of the domain.",
      },
      {
        title: "31 relational models",
        body: "Prisma over MySQL 8.4 covering catalogue, variant inventory, carts, orders, payments, shipping, returns, refunds, coupons, reviews, notifications and email delivery tracking.",
      },
      {
        title: "Storefront and admin from one process",
        body: "An editorial vanilla storefront (home, listing, product detail with gallery, cart, checkout with coupons/tax/shipping, account, wishlist, returns, public order tracking) and a full admin dashboard, both served with clean-URL routing by the same Fastify instance.",
      },
      {
        title: "Inventory as a ledger",
        body: "Stock is not a number that gets updated. Every movement is an entry, with low-stock thresholds computed over the ledger — so a discrepancy can be traced instead of discovered.",
      },
      {
        title: "Platform concerns",
        body: "Paystack payments with webhook handling, email delivery through Resend/SendByte with delivery-status tracking, OTP auth, rate limiting, Helmet, CORS hardening, branded HTML error pages, and a Dockerised MySQL + backend with health checks.",
      },
    ],
    decisions: [
      {
        title: "One process, 24 modules",
        body: "A store this size does not need a service mesh. It needs internal boundaries good enough that the twenty-fifth module does not make the previous twenty-four harder to change.",
      },
      {
        title: "TypeScript 5.9 strict, ESM, NodeNext",
        body: "Strictest reasonable settings from the first commit. Retrofitting strictness onto 24 modules and 31 models is a project of its own.",
      },
      {
        title: "Stock movements over stock counts",
        body: "Storing the ledger and deriving the level means overselling is a reconstructable event rather than a mystery.",
      },
      {
        title: "Vanilla storefront with a real design system",
        body: "No framework on the client, but a genuine editorial design system in CSS. Fast pages, no hydration, and full control over checkout — the one flow where a surprise is unacceptable.",
      },
    ],
    metrics: [
      { value: "24", label: "Feature modules" },
      { value: "150+", label: "API routes" },
      { value: "31", label: "Relational models" },
      { value: "1", label: "Deployable process" },
    ],
    stack: [
      "TypeScript 5.9",
      "Fastify 5",
      "Prisma",
      "MySQL 8.4",
      "Node.js 24",
      "Paystack",
      "Resend",
      "Docker",
      "Swagger",
    ],
    links: [{ label: "Source", href: "https://github.com/oyinlola-tech/Newdich-store" }],
    hue: 340,
    featured: false,
  },

  /* ================================================================== */
  {
    slug: "zudo-pos",
    name: "Zudo POS",
    kind: "Point-of-sale & retail back office",
    category: "Commerce & marketplace",
    year: "2026",
    role: "Author",
    summary:
      "A multi-tenant point-of-sale system — shifts, sales, suppliers, purchase orders, loyalty and crypto settlement — with four role-specific portals on one Fastify process.",
    overview: [
      "Zudo POS is the till and the back office for a small business: cashiers ring up sales inside a shift, managers handle stock and suppliers, owners see the numbers, and the platform operator administers the tenants above all of them.",
      "Nineteen Prisma models and twenty-seven route modules on Fastify, with libSQL as the datastore and four separate front-of-house portals — cashier, manager, admin and superadmin — plus an onboarding flow.",
      "It is deliberately the opposite of Telente Store. That one optimises for an online catalogue; this one optimises for someone standing at a counter with a queue behind them.",
    ],
    problem: [
      "A point-of-sale system is judged on the two seconds between scanning an item and the drawer opening. Anything that adds a round trip to that path is a design failure, whatever it does for the architecture.",
      "But the same data has to serve the back office, where the questions are entirely different — what did we sell, what do we owe suppliers, who was on shift when the till came up short, what is this month's tax position.",
      "And in the market this targets, \"payment\" is not one thing. It is cash, transfer, card and increasingly crypto, and the reconciliation story for each is different.",
    ],
    architecture: [
      {
        title: "Business as the tenant boundary",
        body: "Business and BusinessSetting sit at the root; every other model hangs off a business. Multi-tenancy is a data-model decision made once, not a filter remembered in every query.",
      },
      {
        title: "Shifts as the unit of accountability",
        body: "A Shift opens with a float and closes with a count. Sales, expenses and discounts attach to it, so a discrepancy has a person and a window attached rather than being a number that does not add up at month end.",
      },
      {
        title: "Twenty-seven route modules",
        body: "Separate routers for auth, sales, products, customers, staff, roles, shifts, suppliers, purchase orders, returns, expenses, taxes, discounts, loyalty, billing, billing plans, crypto, analytics, reports, notifications, mail, uploads, settings, audit log, admin, public and page serving.",
      },
      {
        title: "Crypto settlement as its own module",
        body: "BusinessCryptoWallet and CryptoPayment are modelled separately from the sale rather than as another payment method, because settlement is asynchronous and confirmation is probabilistic. A sale can be complete while its crypto payment is still pending.",
      },
      {
        title: "Four portals, one process",
        body: "public/cashier, public/manager, public/admin, public/superadmin and public/onboarding are separate static front-ends served by the same Fastify instance, each seeing only the routes its role can use.",
      },
      {
        title: "libSQL over a hosted Postgres",
        body: "Prisma with the libSQL adapter, so the same schema runs against a local SQLite file or a replicated Turso database. A shop with bad connectivity gets a local database; a chain gets replication.",
      },
      {
        title: "Purchase orders close the loop",
        body: "Supplier, PurchaseOrder and PurchaseOrderItem mean stock arrives against an order rather than appearing. Receiving is what updates inventory, which is what makes the numbers reconcilable.",
      },
    ],
    decisions: [
      {
        title: "Static per-role portals, not one app with guards",
        body: "A cashier's screen has perhaps six actions on it. Shipping them the manager's bundle and hiding it is slower to load, easier to get wrong, and a worse experience for the person who uses it eight hours a day.",
      },
      {
        title: "Crypto payments modelled as pending by default",
        body: "Treating an unconfirmed transaction as settled is how a POS system loses money. The sale records the intent; the payment record carries the confirmation state independently.",
      },
      {
        title: "Audit log from the first commit",
        body: "AuditLog and Session exist because cash-handling software gets disputed. Retrofitting an audit trail after the first disagreement is too late by definition.",
      },
    ],
    metrics: [
      { value: "19", label: "Prisma models" },
      { value: "27", label: "Route modules" },
      { value: "4", label: "Role portals" },
      { value: "1", label: "Fastify process" },
    ],
    stack: [
      "TypeScript",
      "Fastify",
      "Prisma",
      "libSQL / Turso",
      "Zod",
      "JWT",
      "bcrypt",
      "Nodemailer",
      "QR codes",
    ],
    links: [{ label: "Source", href: "https://github.com/oyinlola-tech/Zudo-POS" }],
    hue: 12,
    featured: false,
  },

  /* ================================================================== */
  {
    slug: "soft-beans-palace",
    name: "Soft Beans Palace",
    kind: "Ordering experience",
    category: "Product & interface",
    year: "2026",
    role: "Designer & engineer",
    status: "Live",
    summary:
      "A Next.js ordering flow for a Port Harcourt food business — meal configuration, persisted cart, and checkout that hands off to WhatsApp.",
    overview: [
      "Soft Beans Palace is a food business in Port Harcourt. This is its storefront: customers browse the menu, configure meals with sides and proteins, review the order and send it over WhatsApp.",
      "It is the smallest project here and the one with the tightest constraints. No payment gateway, no backend, no accounts — the business confirms payment manually from a transfer receipt.",
      "That made it purely an interface problem, which is why I like it. Everything the product does is in how it feels to use.",
    ],
    problem: [
      "The business already took orders on WhatsApp. Replacing that would have meant asking the owner to learn a dashboard and asking customers to trust a payment form. Both were the wrong trade.",
      "So the site had to do the hard part — browsing, configuring, pricing, capturing details — and then hand a clean, complete, unambiguous order into the channel that already worked.",
      "The configuration itself is deceptively awkward. A meal is a base dish plus any number of sides and proteins, each with its own quantity and its own instructions, and it has to stay legible on a phone.",
    ],
    architecture: [
      {
        title: "Next.js App Router",
        body: "TypeScript throughout, Tailwind for styling, shadcn/ui primitives on Base UI, Motion for animation that has a reason to exist, and Lucide for icons.",
      },
      {
        title: "Cart as persisted client state",
        body: "Zustand with localStorage persistence. A customer can configure four meals, close the tab, and come back to them.",
      },
      {
        title: "Focused configuration picker",
        body: "Sides and proteins open in a bottom sheet on mobile and a dialog on desktop — the same component, the right shape for the device. Each addition carries its own quantity.",
      },
      {
        title: "Single source of truth for the menu",
        body: "Dishes, descriptions, categories and numeric prices live in one data file. Prices flow to the menu, detail page, cart, checkout and the WhatsApp message through one currency formatter. No component ever hardcodes a formatted price.",
      },
      {
        title: "Validated checkout",
        body: "React Hook Form with Zod for customer, delivery and manual bank-transfer details, generating a unique reference per order — SBP-20260904-A82F7C — assigned once at submission.",
      },
      {
        title: "Configuration over hardcoding",
        body: "WhatsApp number, phone, socials, location, hours and bank details all read from environment variables through one site config, with Nigerian local-format numbers normalised into international format automatically.",
      },
    ],
    decisions: [
      {
        title: "WhatsApp as the checkout target",
        body: "Meeting the business and its customers where they already are beat introducing a payment gateway neither party had asked for. The site's job is to make the message perfect.",
      },
      {
        title: '"Price on request" instead of invented prices',
        body: "Prices were unconfirmed at build time, so the UI says so. Placeholder numbers on a live commerce site are a defect waiting for a customer to find.",
      },
      {
        title: "One order reference, generated once",
        body: "Generated at submission, not on render — so a re-render can never produce a second reference for the same order.",
      },
    ],
    metrics: [
      { value: "3", label: "Menu categories" },
      { value: "0", label: "Backend services" },
      { value: "1", label: "Source of truth for price" },
      { value: "100%", label: "Type-checked forms" },
    ],
    stack: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "shadcn/ui",
      "Zustand",
      "React Hook Form",
      "Zod",
      "Motion",
    ],
    links: [
      { label: "Live", href: "https://soft-beans.vercel.app" },
      { label: "Source", href: "https://github.com/oyinlola-tech/aunty" },
    ],
    hue: 96,
    featured: false,
  },

  /* ================================================================== */
  {
    slug: "newdich-technology",
    name: "Newdich Technology",
    kind: "Thirty-page static site",
    category: "Product & interface",
    year: "2026",
    role: "Designer & engineer",
    summary:
      "A thirty-page corporate site built by a Python generator — no framework, no npm, no build toolchain — governed by a written design specification the code must obey.",
    overview: [
      "Newdich Technology works across software engineering, IoT and robotics, cybersecurity, blockchain, AI, data science and game development, out of Abuja and Okitipupa. This is its website: thirty pages, plus the Newdich Technology Institute.",
      "There is no framework and no npm. A Python script assembles the pages; the output is plain HTML, one CSS file and one JS file, deployable to any static host.",
      "The unusual part is `design.md`. It is a versioned specification — named \"Field Instrument\" — that defines the palette, typography, spacing and component behaviour. It is the authority: if the code and that file disagree, the code is wrong.",
    ],
    problem: [
      "A thirty-page marketing site is the kind of project where a framework feels obviously right and then costs you for years: a toolchain to maintain, a dependency tree to patch, a build that breaks on a Node upgrade, for a site that ships no interactivity.",
      "But thirty hand-written HTML pages drift. The fifth page gets a slightly different header, the twentieth invents a new heading size, and by the thirtieth there is no design system left.",
      "The site also had to hold seven quite different service lines without becoming seven different sites.",
    ],
    architecture: [
      {
        title: "Python as the template engine",
        body: "`build.py` renders page modules from `src/pages/` — home, about, services, work, case studies, platforms, practice, process, institute, insights, articles, careers, contact, FAQ, legal and a 404 — into `public/`. `python3 build.py --serve` builds and serves. Python 3 is the only requirement; there is nothing to install.",
      },
      {
        title: "Routes as directories",
        body: "Every page is a directory containing `index.html`, so URLs carry no extension: `/faq`, `/work/smart-metering`. Only `index.html`, `robots.txt`, `sitemap.xml` and `404.html` sit at the root.",
      },
      {
        title: "design.md as the authority",
        body: "A versioned specification defining a three-colour system — black, white, blue, and no fourth hue exists — with exact tokens for background, surface, raised, line and three text weights, in both dark and light. Typography, spacing and motion are specified the same way.",
      },
      {
        title: "Numbered stylesheet layers",
        body: "Thirteen files from `01-tokens.css` through `13-motion.css` — tokens, base, type, layout, header, buttons, panel, index, instrument, content, forms, footer, motion — concatenated in order. The numbering is the cascade: a rule's file tells you its specificity budget.",
      },
      {
        title: "A running instrument per page",
        body: "Every system page opens with a live instrument panel for its own subject — metering, payments, examinations, queues, POS, ledgers. It is the one piece of interactivity, and it is what makes an engineering company's site read as an engineering company's site.",
      },
    ],
    decisions: [
      {
        title: "No npm, on purpose",
        body: "The site outlives the toolchain that would have built it. A Python script and a folder of CSS will still build in five years; a 2026 bundler configuration will not.",
      },
      {
        title: "Write the design system down first",
        body: "`design.md` was written before the CSS and outranks it. That is what keeps page thirty consistent with page one — and it is also what let an agent work on the site without inventing a fourth colour.",
      },
      {
        title: "Three colours only",
        body: "Black, white and one blue. A restriction that severe removes an entire category of decision from every page, and it is why the instrument panels read as instruments rather than as decoration.",
      },
    ],
    metrics: [
      { value: "30", label: "Pages" },
      { value: "13", label: "Stylesheet layers" },
      { value: "3", label: "Colours, total" },
      { value: "0", label: "npm dependencies" },
    ],
    stack: ["Python 3", "HTML", "CSS", "Vanilla JS", "Static hosting"],
    links: [],
    hue: 212,
    featured: false,
  },

  /* ================================================================== */
  {
    slug: "authenticator-lab",
    name: "Authenticator Lab",
    kind: "TOTP two-factor reference implementation",
    category: "Security",
    year: "2026",
    role: "Author",
    status: "Open source",
    summary:
      "A small, deliberately-layered TOTP enrolment and verification flow — QR provisioning, six-digit verification, and a repository seam where real persistence plugs in.",
    overview: [
      "A TypeScript and Fastify project for testing a time-based one-time password flow from a browser: generate a QR code, scan it with an authenticator app, enter the current six-digit code to verify enrolment, then use it to log in.",
      "It is small on purpose. Four routes, one service, one repository interface. The point is not the feature — it is the shape of the code around a security primitive most people paste in from a tutorial.",
      "It also comes with a warning in its own README, which is the part I would defend hardest.",
    ],
    problem: [
      "Two-factor authentication is where a lot of applications quietly get it wrong. The library call is four lines; everything around it is where the mistakes live — storing the secret in plaintext, treating an unverified secret as enrolled, leaving no seam to swap the store.",
      "Most example code makes this worse by collapsing the whole flow into one route handler, which is exactly the shape you cannot later harden.",
    ],
    architecture: [
      {
        title: "A layer per responsibility",
        body: "`server.ts` starts the HTTP server. `app.ts` is the composition root. `routes/` registers routes. The controller validates input and maps results to HTTP. The service owns QR generation and TOTP verification rules. The repository owns persistence. Each file has one reason to change.",
      },
      {
        title: "Four routes",
        body: "`GET /api/authenticator/register` creates a pending secret and a QR code. `POST .../register/verify` accepts a token and saves the secret only if it verifies. `POST .../login` checks a token against the saved secret. `GET .../status` reports whether the demo user is enrolled.",
      },
      {
        title: "Pending versus verified secrets",
        body: "A generated secret is pending until a valid code proves the user actually scanned it. Only then is it saved. Enrolling someone who never completed the scan locks them out of their own account.",
      },
      {
        title: "The repository seam",
        body: "`UserRepository` is an interface with an in-memory implementation. The secret disappears on restart, which is correct for a lab. Swapping in Postgres, SQLite or Prisma means implementing the interface and changing nothing else.",
      },
    ],
    decisions: [
      {
        title: "In-memory storage, and say so loudly",
        body: "The README states plainly that a TOTP secret must never be stored in plaintext in production without an encryption and key-management strategy. A demo that silently models bad practice teaches bad practice.",
      },
      {
        title: "Verify before you persist",
        body: "The two-step enrolment is the entire difference between a working 2FA implementation and a lockout generator.",
      },
      {
        title: "Layers, at this size, deliberately",
        body: "Four routes do not need five files. But the whole purpose is to show where the seams go — and a reference implementation that cuts corners is not a reference.",
      },
    ],
    metrics: [
      { value: "4", label: "API routes" },
      { value: "6", label: "Digit TOTP codes" },
      { value: "1", label: "Repository interface" },
      { value: "0", label: "Secrets stored unverified" },
    ],
    stack: ["TypeScript", "Fastify", "speakeasy", "qrcode", "Vanilla JS"],
    links: [{ label: "Source", href: "https://github.com/oyinlola-tech/oauth" }],
    hue: 172,
    featured: false,
  },

  /* ================================================================== */
  {
    slug: "solari-cookbook",
    name: "Solari Cookbook",
    kind: "SDK example collection",
    category: "Developer tooling",
    year: "2026",
    role: "Contributor",
    status: "Open source",
    summary:
      "Nine runnable examples for cloud browsers, sandboxes and desktops — one idea each, no framework, nothing to read past.",
    overview: [
      "Short, runnable examples for Solari — cloud browsers, sandboxes and desktops behind one API key. Every example is a complete program you can run in under a minute.",
      "Nine of them, across TypeScript and Python: browser quickstarts, stealth mode with residential proxy egress, reusable login profiles, session recording, sandbox quickstart, a stateful Python kernel for agent loops, public port previews, and computer use on a Linux desktop.",
      "It is documentation shaped as code, and the constraint that makes it work is the one that is hardest to hold.",
    ],
    problem: [
      "SDK examples usually fail in one of two directions. Either they are toy snippets that omit everything real — auth, cleanup, error handling — or they are a full application where the one idea you came for is buried under scaffolding.",
      "Both waste the reader's time in the same way: they cannot copy it and they cannot trust it.",
    ],
    architecture: [
      {
        title: "One idea per example",
        body: "Each directory demonstrates exactly one capability. Stealth and proxying is its own example; session reuse is its own example. Combining them is left to the reader, because that is the part they actually understand best.",
      },
      {
        title: "Self-contained directories",
        body: "Each example carries its own manifest and installs on its own — `npm install` or `pip install -r requirements.txt`, one environment variable, run. Nothing depends on repository-level scaffolding.",
      },
      {
        title: "Both languages, deliberately paired",
        body: "The browser and sandbox quickstarts exist in TypeScript and Python side by side, so a reader can see the same idea in the language they work in without translating.",
      },
      {
        title: "Three surfaces",
        body: "Browser (navigate, extract, stealth, profiles, recording), sandbox (commands, files, stateful kernels, port previews) and desktop (screenshot, click, type).",
      },
    ],
    decisions: [
      {
        title: "No shared framework across examples",
        body: "A shared helper module would have removed duplication and destroyed the property that makes the collection useful — that any single directory can be copied out whole.",
      },
      {
        title: "Runnable in under a minute, as an acceptance test",
        body: "That constraint is what keeps examples from growing. Anything that pushes past it gets cut rather than explained.",
      },
    ],
    metrics: [
      { value: "9", label: "Examples" },
      { value: "2", label: "Languages" },
      { value: "3", label: "Runtime surfaces" },
      { value: "1", label: "Minute to run one" },
    ],
    stack: ["TypeScript", "Python", "Solari SDK", "Playwright-style APIs"],
    links: [{ label: "Source", href: "https://github.com/solari-sdk/solari-cookbook" }],
    hue: 300,
    featured: false,
  },

  /* ================================================================== */
  {
    slug: "ch-rtv",
    name: "CH RTV",
    kind: "Carrier haulage visibility platform",
    category: "Logistics & tracking",
    year: "2026",
    role: "Lead engineer",
    status: "Private",
    summary:
      "Real-time GPS visibility for container haulage — a TCP gateway speaking the COBAN tracker protocol, geofence evaluation, and CMA-CGM integration behind five internal services.",
    overview: [
      "CH RTV is a Carrier Haulage Real-Time Visibility platform. Trucks moving containers carry COBAN GPS units; the platform ingests their positions, ties each device to a transport order, evaluates geofences around facilities, and reports movement upstream to CMA-CGM.",
      "The work that matters here is not the dashboard. It is the device gateway: COBAN trackers speak a terse binary-ish protocol over a raw TCP socket, log in with their own identifier, and expect commands back on the same connection. There is no REST API to call and no SDK to install — the connection is the interface.",
      "Five services divide the problem: device-gateway owns the TCP listener, device login and packet parsing; tracking-service ingests and stores positions and evaluates geofences; asset-service owns orders, facilities and assignments; integration-service shapes and delivers CMA-CGM payloads; admin-api handles authentication, aggregation, Swagger and hosting the dashboard.",
    ],
    problem: [
      "Container haulage visibility fails at the seam between hardware and business process. The tracker knows where it is but not which order it is serving. The order system knows the job but not where the truck is. Joining them is the product.",
      "A tracker's TCP session is long-lived, unreliable and unauthenticated in any modern sense. Devices reconnect, replay, drop mid-packet, and send positions out of order. Treating that stream as if it were an HTTP endpoint produces a system that looks fine in testing and loses trucks in production.",
      "Carrier integration adds a second constraint: CMA-CGM expects a specific payload shape on a specific cadence, and a platform that cannot prove what it sent, and when, has no answer during a dispute.",
    ],
    architecture: [
      {
        title: "device-gateway",
        body: "A raw TCP listener handling COBAN device login, packet parsing and outbound command dispatch. Kept deliberately separate from everything else, because the one component that must never block is the one holding thousands of open sockets.",
      },
      {
        title: "tracking-service",
        body: "Position ingest and storage, geofence evaluation against facility boundaries, and event forwarding when a vehicle enters or leaves one. Geofencing is where a raw position stream becomes an operational signal.",
      },
      {
        title: "asset-service",
        body: "Transport orders, facilities, device-to-order assignments and the supporting lookups. This is the layer that answers 'which truck is on which job', which is the join the rest of the system exists to make.",
      },
      {
        title: "integration-service",
        body: "CMA-CGM-facing configuration, payload shaping and delivery paths. Option 1 is implemented; Option 2 is a stub with no S3PWEB integration behind it, and is documented as a stub rather than described as support.",
      },
      {
        title: "admin-api and dashboard",
        body: "JWT admin authentication with username-or-email login and SMTP-delivered OTP password reset, rate limiting, request validation, internal service isolation, Swagger, and a Tailwind dashboard covering tracking, alerts, reports and integration mode.",
      },
    ],
    decisions: [
      {
        title: "The TCP gateway is its own service",
        body: "Device ingestion has a completely different failure profile from a CRUD API: thousands of idle sockets, partial frames, reconnect storms. Folding it into the admin API would mean one slow database query stalls packet parsing for every tracker on the network.",
      },
      {
        title: "Documenting the stub as a stub",
        body: "Integration Option 2 is a non-functional path. It would have been easy to describe it as supported and quietly return success. The README, the audit report and this case study all say it is a stub, because the cost of discovering that during a carrier onboarding is far higher than the cost of saying so now.",
      },
      {
        title: "Vanilla dashboard, no framework",
        body: "The operator console is HTML, Tailwind and plain JavaScript served by admin-api. It is a handful of screens watched on a warehouse monitor; a build pipeline and a component framework would have added dependencies and deployment steps without adding anything a dispatcher can see.",
      },
      {
        title: "Proprietary, and explicit about it",
        body: "The repository carries a licence, a notice and a contribution policy stating it is not open source. Ambiguous licensing on client work is a liability, not a neutral default.",
      },
    ],
    metrics: [
      { value: "5", label: "Internal services" },
      { value: "16", label: "Route modules" },
      { value: "11", label: "Service modules" },
      { value: "TCP", label: "Device protocol" },
    ],
    stack: ["Node.js", "MySQL", "TCP sockets", "COBAN protocol", "JWT", "Tailwind CSS", "Swagger"],
    links: [{ label: "Source", href: "https://github.com/oyinlola-tech/chrtv" }],
    hue: 232,
    featured: false,
  },

  /* ================================================================== */
  {
    slug: "rivvo",
    name: "Rivvo",
    kind: "Messaging & calling platform",
    category: "Communication & real-time",
    year: "2026",
    role: "Author",
    summary:
      "A full-stack messaging platform — direct and group chat, status posts, WebRTC voice and video, group key rotation, and a moderation console — over Express, MySQL and Socket.IO.",
    overview: [
      "Rivvo is a messaging platform built to see how much of a real chat product one person can carry end to end: registration and OTP verification, direct and group conversations, status posts, voice and video calls, contact graphs, reports and an admin moderation console.",
      "The backend is Express over MySQL with Socket.IO for presence, typing and call signalling; the frontend is React 18 and Vite. In production the backend serves the built frontend, so the whole thing deploys as one process.",
      "Seventeen route groups and sixteen controllers on the backend, twenty-one pages on the frontend. The interesting parts are not the message list — they are key distribution, moderation and the call layer.",
    ],
    problem: [
      "A chat app is the classic example of a project that looks small and is not. Sending a message is an afternoon. Everything around it — delivery state, read receipts, edits, view-once, blocking, group membership changes, key rotation when someone leaves, reporting, and an admin who can act on a report — is the actual system.",
      "Group encryption metadata is where most hobby chat projects quietly give up. If a member leaves a group and the keys do not rotate, they can still read what follows. If keys rotate but are not redistributed, everyone else loses the conversation.",
      "Moderation is the other half. A platform that accepts user-generated content without a report queue, a moderator role and an audit trail is not a product; it is a liability with a login page.",
    ],
    architecture: [
      {
        title: "Transport split by shape",
        body: "REST under /api for anything with a request and a response; Socket.IO for presence, typing indicators and WebRTC signalling. Calls themselves are peer-to-peer WebRTC — the server brokers the handshake and then gets out of the media path.",
      },
      {
        title: "Group keys and rotation",
        body: "Users carry public keys; groups distribute member keys and rotate them on membership change. The server stores key material and distribution state rather than plaintext, so leaving a group actually ends access rather than merely hiding the UI.",
      },
      {
        title: "Message semantics beyond send",
        body: "Edits, deletes, view-once, read receipts, pinning and muting, plus attachments validated by file signature rather than by extension — the same magic-bytes rule the rest of my work uses, because a renamed .exe is the oldest upload trick there is.",
      },
      {
        title: "Moderation and admin",
        body: "User and message reports, moderator assignment and resolution, verification badges and pricing, admin analytics, and audit logging that covers refresh-token events as well as admin actions.",
      },
      {
        title: "Groups and communities",
        body: "Public and private groups, invites and join requests, and three roles — owner, admin, member — with avatars and banners passing the same file checks as attachments.",
      },
    ],
    decisions: [
      {
        title: "One deployable, two applications",
        body: "The Express backend serves the Vite build in production. For a project at this stage a second static host and a CORS surface would be operational overhead bought with nothing.",
      },
      {
        title: "WebRTC peer-to-peer, server only for signalling",
        body: "Relaying media through the server would mean paying for bandwidth proportional to call minutes. Presence-based signalling over Socket.IO and then a direct peer connection keeps the server's cost proportional to users, not to how long they talk.",
      },
      {
        title: "Audit refresh tokens, not just admin actions",
        body: "Refresh-token events are the earliest visible signal of a stolen session. Logging them alongside admin actions means the audit trail can answer 'when did this account start behaving differently', not only 'who deleted what'.",
      },
      {
        title: "Shipped honestly as unfinished",
        body: "The repository description says it is still being built and learned from. Overselling an in-progress system is how a portfolio loses the benefit of the doubt on the projects that are finished.",
      },
    ],
    metrics: [
      { value: "17", label: "Route groups" },
      { value: "21", label: "Frontend pages" },
      { value: "16", label: "Controllers" },
      { value: "P2P", label: "WebRTC calls" },
    ],
    stack: ["React 18", "Vite", "TypeScript", "Node.js", "Express", "MySQL", "Socket.IO", "WebRTC", "JWT"],
    links: [{ label: "Source", href: "https://github.com/oyinlola-tech/rivvo" }],
    hue: 320,
    featured: false,
  },

  /* ================================================================== */
  {
    slug: "revive-roots",
    name: "Revive Roots Essentials",
    kind: "E-commerce platform",
    category: "Commerce & marketplace",
    year: "2026",
    role: "Author",
    summary:
      "A full-stack storefront and back office for hair and skincare — catalogue, cart, checkout, Flutterwave payments, currency-aware pricing, and eight admin panels over eighteen Sequelize models.",
    overview: [
      "Revive Roots Essentials is an e-commerce platform for premium hair and skincare products: a React storefront over an Express and Sequelize backend on MySQL, with Flutterwave for payments and NodeMailer for the transactional mail the order lifecycle generates.",
      "Eighteen Sequelize models, seventeen controllers, thirty-two frontend pages. The storefront is the visible half; the other half is the back office, which covers products, orders, contacts, shipping fees, inventory, users, coupons and audit logs.",
      "The parts that took the real work were the ones customers only notice when they break: currency-aware pricing, shipping fee quoting, and an order lifecycle that emails the right thing at the right moment — placed, paid, failed, status changed, refunded.",
    ],
    problem: [
      "Storefronts are easy to start and hard to finish. A product grid and a cart are a weekend. Coupons that interact correctly with shipping quotes, inventory that does not oversell, refunds that reconcile, and an audit log that can answer what an admin changed last Tuesday are the reason e-commerce projects stall at eighty percent.",
      "Selling into Nigeria adds constraints a generic template does not carry: local payment rails rather than card-first checkout, currency-aware pricing, and shipping fees that vary by destination rather than a flat national rate.",
      "Payment failure is the case that matters most and gets tested least. A customer whose payment fails and hears nothing assumes the order succeeded, and the first anyone learns otherwise is a support message.",
    ],
    architecture: [
      {
        title: "Catalogue and inventory",
        body: "Products, categories, featured selections and inventory support, with currency-aware pricing so the displayed price is correct for the buyer rather than converted at the last step.",
      },
      {
        title: "Cart to order",
        body: "Cart, wishlist, checkout, shipping fee quoting and order history — one path from browsing to a placed order, with the fee resolved before payment rather than surprising the customer at the end.",
      },
      {
        title: "Payments via Flutterwave",
        body: "Flutterwave handles collection, which is what a Nigerian storefront actually needs — local cards, transfers and the rails customers already trust — instead of a card-only checkout that fails for most of the market.",
      },
      {
        title: "Order lifecycle email",
        body: "Five distinct transactional mails: order placed, payment receipt, payment failed, status update and refund update. The failure mail is the one most storefronts omit and the one that prevents the most support load.",
      },
      {
        title: "Back office",
        body: "Admin panels for products, orders, contacts, shipping fees, inventory, users, coupons and audit logs, plus contact-form persistence with alerts — so a customer enquiry lands in the system rather than in an inbox.",
      },
    ],
    decisions: [
      {
        title: "Sequelize over a hand-rolled data layer",
        body: "Eighteen models with real relationships — orders to items to products to inventory — is past the point where hand-written SQL per query stays consistent. Migrations and associations were worth the abstraction here in a way they are not on a three-table service.",
      },
      {
        title: "Flutterwave rather than card-first",
        body: "Optimising for the payment method the customer actually holds matters more than optimising for the integration with the best documentation.",
      },
      {
        title: "Email the failure, not only the success",
        body: "A payment-failed receipt is an unusual thing to build and a cheap one. It converts a silent failure into a customer who knows to try again.",
      },
      {
        title: "Audit logs from the start",
        body: "Admin panels that mutate price, stock and orders need a record of who changed what before the first dispute, not after it.",
      },
    ],
    metrics: [
      { value: "18", label: "Sequelize models" },
      { value: "32", label: "Frontend pages" },
      { value: "17", label: "Controllers" },
      { value: "5", label: "Lifecycle emails" },
    ],
    stack: ["React", "Vite", "Tailwind CSS", "Node.js", "Express", "Sequelize", "MySQL", "Flutterwave", "NodeMailer"],
    links: [{ label: "Source", href: "https://github.com/oyinlola-tech/revive-root-essentials" }],
    hue: 124,
    featured: false,
  },

  /* ================================================================== */
  {
    slug: "ikale",
    name: "IKALE",
    kind: "Community membership platform",
    category: "Civic & infrastructure",
    year: "2026",
    role: "Backend engineer",
    status: "Private",
    summary:
      "A Fastify and Prisma backend for community membership, built around account recovery that never reveals whether an account exists — OTPs hashed at rest, delivery moved off the response path.",
    overview: [
      "IKALE is a membership backend built at Newdich Technology for an Ikale community register. Its data model is the clearest statement of what it is for: alongside the usual account fields, a member carries a family name, an ancestral location — ward, town, local government, state — and, separately, a current residential address, state and country.",
      "That separation is the product. A community register that collapses where someone is from into where someone lives cannot answer the question it exists to answer.",
      "The engineering weight sits in authentication and account recovery, which is where I spent most of 357 commits. Fastify 5, Prisma 7 against PostgreSQL, Zod for validation, bcrypt for passwords, JWT for sessions, nodemailer for delivery, and a layered structure — routes, controllers, services, repositories, DTOs, validators, jobs, loaders — kept strict enough that three people could work in it without collisions.",
      "Every endpoint I built is documented in the repository with its request shape, response shape and failure modes, in a per-engineer workspace under docs/.",
    ],
    problem: [
      "Password recovery is the most attacked endpoint on any application, and the one most often built as a happy path. The standard implementation leaks: send a code to a known address and it returns quickly, send to an unknown one and it returns quickly too — but not quite as quickly, because one of them did real work.",
      "That timing difference is an account enumeration oracle. Given a list of email addresses, an attacker learns which belong to members of a community register. For a register tied to a specific ethnic community and to ancestral locations, that is not an abstract privacy concern.",
      "The second problem is storage. A recovery code sitting in the database in plaintext turns a read-only breach into full account takeover across every account with a live code.",
    ],
    architecture: [
      {
        title: "Recovery that reveals nothing",
        body: "Initiating recovery generates a six-digit OTP, hashes it, stores the hash, and returns the same success response whether or not the address belongs to an account. Delivery runs in the background after the response is sent, so response time is a constant that carries no information about account existence.",
      },
      {
        title: "OTPs hashed at rest",
        body: "The database stores a hash, never the code. A dump of PasswordRecoveryToken yields nothing usable, and verification compares hashes rather than reading a secret back out.",
      },
      {
        title: "Delivery that cleans up after itself",
        body: "Email is the default channel; SMS is attempted only where a member has a phone number and has explicitly opted in. If every channel fails, the token is deleted rather than left live, and the failure is logged — a code nobody received should not remain valid.",
      },
      {
        title: "Layered by responsibility",
        body: "Routes, controllers, services, repositories, DTOs, validators, middlewares, jobs, loaders, errors and configs as separate directories. Verbose for a small service, but it is what let three engineers work in parallel and what makes the boundary between HTTP concerns and domain logic non-negotiable.",
      },
      {
        title: "Documented per endpoint",
        body: "Each endpoint has a markdown document covering overview, method and path, authentication, request, responses and failure modes, kept in the repository beside the code rather than in a wiki that drifts.",
      },
    ],
    decisions: [
      {
        title: "Constant-time responses over fast ones",
        body: "Moving delivery off the response path costs the ability to tell a caller that sending failed. That is the correct trade: the caller is often an attacker, and the legitimate user finds out by not receiving a code.",
      },
      {
        title: "Two token types, not one",
        body: "Password reset and password recovery are separate flows with separate tables and lifetimes. Reusing one token type for both would mean one expiry policy, one revocation rule and one blast radius for two different threat models.",
      },
      {
        title: "Citext for email",
        body: "Email is stored as a case-insensitive column at the database level rather than lowercased in application code. Normalisation that lives in one service is normalisation that a second service will eventually forget.",
      },
      {
        title: "bcrypt here, Argon2 elsewhere",
        body: "Argon2 is the better choice and what I reach for by default. This service inherited bcrypt from an existing deployment, and a hash migration mid-project would have been a larger risk than the difference between two sound algorithms.",
      },
    ],
    metrics: [
      { value: "357", label: "Commits" },
      { value: "74", label: "TypeScript files" },
      { value: "5", label: "Route groups" },
      { value: "0", label: "Plaintext OTPs stored" },
    ],
    stack: ["TypeScript", "Fastify", "Prisma", "PostgreSQL", "Zod", "JWT", "bcrypt", "Nodemailer"],
    links: [],
    hue: 66,
    featured: false,
  },

  /* ================================================================== */
  {
    slug: "aisle-commerce",
    name: "Aisle Commerce",
    kind: "Multi-tenant commerce SaaS",
    category: "Commerce & marketplace",
    year: "2026",
    role: "Author",
    status: "Private",
    summary:
      "A multi-tenant storefront platform — twelve bounded-context services behind a host-resolving gateway that signs every internal request, with an event bus that fails loudly rather than dropping payments.",
    overview: [
      "Aisle Commerce is a SaaS platform where each merchant gets their own storefront on their own domain. It is a Node monorepo: an Express SSR web app, an API gateway, twelve domain services, and a shared runtime package the services all build on.",
      "The gateway is the interesting component. A request arrives and it decides whether the host is a platform host or a storefront host, asks store-service to resolve the domain, verifies the caller's token, then builds signed internal headers carrying request, actor and store context before proxying to the right service. Every downstream service validates that HMAC signature before it trusts any of it.",
      "Services split by bounded context and each own their persistence: user, store, compliance, customer, product, cart, order, payment, billing, support, chat and notification, on ports 4101 through 4112.",
    ],
    problem: [
      "Multi-tenancy is where commerce platforms leak. Every query, every cache key and every file path has to carry a tenant, and the moment one service trusts a tenant identifier that arrived in a header from the internet, one merchant can read another's orders.",
      "The usual answer is to pass a tenant ID between services and hope nothing forges it. That works until a service is exposed directly, or an internal network stops being trustworthy, and then the tenant boundary was never real.",
      "The second problem is events. Order confirmation depends on payment success arriving. A bus that silently drops a PAYMENT_SUCCEEDED event produces paid orders that never confirm and inventory that stays reserved forever — a failure nobody notices until reconciliation.",
    ],
    architecture: [
      {
        title: "Gateway as the only trusted boundary",
        body: "Host resolution, token verification and internal header signing all happen in one place. Services never parse a client token; they verify an HMAC signature from the gateway. Tenant context becomes something a service can prove rather than something it has to trust.",
      },
      {
        title: "Twelve services, one shared runtime",
        body: "packages/shared carries environment loading, database bootstrap, internal auth signing, JWT handling, HTTP helpers, logging and event delivery. Each service owns its domain and its data; none of them reimplements the plumbing.",
      },
      {
        title: "Events that refuse to disappear",
        body: "RabbitMQ is optional. Without it the shared bus falls back to a Redis-backed durable queue with retry and dead-letter handling. If neither can accept an event, publishing fails loudly rather than dropping it — the correct behaviour when the event is PAYMENT_SUCCEEDED.",
      },
      {
        title: "The flows that matter are event-driven",
        body: "USER_REGISTERED provisions a trial subscription in billing-service. PAYMENT_SUCCEEDED confirms the order and commits reserved inventory; PAYMENT_FAILED marks it failed and releases the reservation. Inventory is reserved at checkout and only committed on payment, so a failed card does not sell stock that is still on the shelf.",
      },
      {
        title: "Compliance as its own context",
        body: "KYC, KYB, document handling and the review workflow live in compliance-service rather than being scattered through onboarding. A merchant's verification state is one service's answer, not a boolean copied into four tables.",
      },
    ],
    decisions: [
      {
        title: "Sign internal requests, do not trust the network",
        body: "Signed internal headers cost a verification on every hop and remove an entire class of tenant-confusion bug. Given that the thing being isolated is one merchant's revenue from another's, that is a trade worth making before it is needed rather than after.",
      },
      {
        title: "SSR rather than a single-page storefront",
        body: "Storefronts live or die on how fast the first product page paints and how well it indexes. Express SSR gives both without shipping a client framework to a shopper on a phone.",
      },
      {
        title: "Optional broker, mandatory delivery",
        body: "Requiring RabbitMQ locally would make the platform painful to run; dropping events when it is absent would make it dangerous in production. A Redis fallback with dead-lettering keeps development easy and keeps production honest.",
      },
      {
        title: "Documented gaps",
        body: "The repository carries a gap document alongside the architecture and API docs, and the service inventory marks status per component. Knowing which consumers are still reserved for future use is part of knowing what the system does.",
      },
    ],
    metrics: [
      { value: "12", label: "Domain services" },
      { value: "8", label: "Domain events" },
      { value: "HMAC", label: "Internal request auth" },
      { value: "SSR", label: "Storefront rendering" },
    ],
    stack: ["Node.js", "Express", "MySQL", "Redis", "RabbitMQ", "Socket.IO", "JWT", "HMAC"],
    links: [{ label: "Source", href: "https://github.com/oyinlola-tech/e-commmerce-saas" }],
    hue: 18,
    featured: false,
  },

  /* ================================================================== */
  {
    slug: "gly-vtu",
    name: "GLY VTU",
    kind: "Wallet & bill payments platform",
    category: "Payments & fintech",
    year: "2026",
    role: "Author",
    status: "Private",
    summary:
      "A virtual top-up platform — wallet, transfers, airtime and bills through VTpass, Flutterwave virtual cards, KYC tiers, and admin tooling for anomalies and audit.",
    overview: [
      "GLY VTU is a virtual top-up platform: users fund a wallet, pay bills, buy airtime and data, transfer to each other, and issue virtual cards. Behind it sits an Express API on MySQL and a React storefront, with VTpass handling bills and Flutterwave handling cards.",
      "VTU is the most common software product in Nigeria and the one most often built badly, because it looks like CRUD and behaves like a ledger. Money enters from a payment gateway, sits in a wallet, and leaves through a third-party biller that may succeed slowly, fail after charging, or answer twice.",
      "The parts I care about are the ones that protect the balance: KYC tiers with limits, admin review tooling, anomaly dashboards, retention jobs, and an audit trail that can reconstruct what happened to a transaction.",
    ],
    problem: [
      "A biller integration is not a function call. VTpass can accept a request, take the money, and time out before answering — leaving the platform unsure whether to debit the user, retry, or refund. Getting that wrong in either direction costs real money: retry and you have paid twice, refund and you have paid once for nothing.",
      "Wallets invite the second failure. Two concurrent requests reading the same balance and both deciding it is sufficient will both spend it. A wallet without serialisation is an overdraft waiting for traffic.",
      "The third is regulatory rather than technical. Moving money without identity tiers and limits is not a product you can operate, regardless of whether the code works.",
    ],
    architecture: [
      {
        title: "Wallet and transaction history",
        body: "Wallet operations, transfers and a transaction history that is the source of truth rather than a view over one. Balance is something derived and reconcilable, not a number edited in place.",
      },
      {
        title: "Bills through VTpass",
        body: "Airtime, data and utility payments go through VTpass. The integration is treated as unreliable by default — a request that does not answer cleanly leaves the transaction in a state that is resolvable rather than assumed.",
      },
      {
        title: "Virtual cards through Flutterwave",
        body: "Card issuance is Flutterwave exclusively. One provider for one capability, rather than an abstraction over two providers neither of which is fully supported.",
      },
      {
        title: "KYC tiers and limits",
        body: "Verification level determines transaction limits, with admin review tooling for documents. Limits are enforced server-side against the tier, not surfaced as a UI hint.",
      },
      {
        title: "Admin surface built for incidents",
        body: "Dashboards for users, bills, transactions, finance, anomalies and audit. The anomaly view exists because the question during an incident is never 'show me all transactions' — it is 'show me the ones that do not look right'.",
      },
      {
        title: "Hardened by default",
        body: "Rate limiting, CSRF, a CORS allowlist, hardened headers, retention jobs and Swagger docs that disable themselves in environments where they should not exist.",
      },
    ],
    decisions: [
      {
        title: "Device verification in the onboarding flow",
        body: "VTU accounts are attacked with credential stuffing because the balance is immediately spendable. Binding sessions to verified devices raises the cost of a stolen password from instant to inconvenient.",
      },
      {
        title: "Retention jobs rather than infinite logs",
        body: "A fintech audit trail grows without bound and contains exactly the data you least want to keep forever. Scheduled retention is a privacy control as much as a storage one.",
      },
      {
        title: "One provider per capability",
        body: "VTpass for bills, Flutterwave for cards, and no abstraction pretending either is swappable. A provider interface with one real implementation is indirection without benefit.",
      },
      {
        title: "Generated audit reports",
        body: "Operational scripts produce PDF audit reports rather than leaving the state of the system to be described from memory during a review.",
      },
    ],
    metrics: [
      { value: "25", label: "Route modules" },
      { value: "69", label: "Frontend pages" },
      { value: "2", label: "Money providers" },
      { value: "KYC", label: "Tiered limits" },
    ],
    stack: ["Node.js", "Express", "MySQL", "React", "Vite", "Tailwind CSS", "VTpass", "Flutterwave"],
    links: [{ label: "Source", href: "https://github.com/oyinlola-tech/gly-vtu" }],
    hue: 140,
    featured: false,
  },

  /* ================================================================== */
  {
    slug: "medexplain-ai",
    name: "MedExplain AI",
    kind: "Medical intelligence platform",
    category: "AI & agents",
    year: "2026",
    role: "Author",
    status: "Private",
    summary:
      "A healthcare workspace that explains medical reports with Gemini grounded in MedlinePlus and PubMed, then routes users to verified doctors — with consent, audit and privacy controls as first-class features.",
    overview: [
      "MedExplain AI takes a medical report a patient does not understand and explains it, then keeps the conversation going with thread-aware follow-ups, and connects them to a verified doctor when the answer needs one.",
      "Three roles share the system. Patients upload reports, read analyses, chat and manage subscriptions. Doctors apply, get verified, and work appointments from their own dashboard. Admins manage users, doctors, reports, subscriptions, payments, coupons, analytics and audit logs.",
      "The AI is deliberately constrained: Gemini is reached only through backend services, never from the browser, and answers are grounded with retrieval over imported MedlinePlus and PubMed content rather than left to the model's own recall.",
    ],
    problem: [
      "A model that confidently explains a blood panel is useful. A model that confidently invents one is dangerous, and from the patient's side the two are indistinguishable — which makes ungrounded generation the wrong tool for this domain no matter how good the prose is.",
      "Putting an AI key in a frontend is the second failure. Any client-side call means the key is extractable and the prompt is editable, so the safety constraints exist only as long as nobody opens developer tools.",
      "Health data raises the stakes on everything else. Consent, retention, export and deletion are not settings to add later; a platform holding uploaded medical reports without them should not be accepting uploads.",
    ],
    architecture: [
      {
        title: "RAG over trusted sources",
        body: "Medical knowledge is imported from MedlinePlus and PubMed and retrieved to ground answers. The model explains retrieved material rather than recalling it, which is the difference between a summary and a guess.",
      },
      {
        title: "AI behind the backend only",
        body: "Gemini is called from backend services. The browser never holds a key, never sees the system prompt, and cannot bypass the trusted-source context the answer is built on.",
      },
      {
        title: "Report pipeline",
        body: "Upload, validation, analysis, history and detail views — with upload validation on the way in, because a file-accepting endpoint on a health platform is the highest-value target in the system.",
      },
      {
        title: "Doctor marketplace",
        body: "Applications or admin-created accounts, a verification step, a doctor workspace, appointments and notifications. Verification is a state in the system, not a badge in a profile.",
      },
      {
        title: "Consent and privacy as features",
        body: "Consent records, privacy settings, notification preferences and billing-address controls are user-facing surfaces rather than implicit defaults buried in a terms page.",
      },
      {
        title: "Payments with a safe simulator",
        body: "OPay handles subscriptions, with a development simulator so the billing path can be exercised end to end without moving real money or depending on a sandbox being up.",
      },
    ],
    decisions: [
      {
        title: "Ground it or do not ship it",
        body: "Retrieval over MedlinePlus and PubMed costs an import pipeline and a retrieval step on every answer. In a medical context that is not optimisation — it is the reason the feature is defensible at all.",
      },
      {
        title: "Audit logs beside RBAC",
        body: "Role-based access controls who can reach a report. Audit logs record who did. On health data, the second question gets asked more often than the first.",
      },
      {
        title: "Strict refresh cookies",
        body: "Access tokens as bearers, refresh tokens in strict cookies. A stolen access token expires; a stolen refresh token in localStorage is an account.",
      },
      {
        title: "Accessible motion, not decorative motion",
        body: "Page entry, cards, dropdowns, toasts, loading and chat states all animate, but the motion communicates state on a platform used by anxious people reading bad news. It is timed to reassure rather than to impress.",
      },
    ],
    metrics: [
      { value: "3", label: "User roles" },
      { value: "20", label: "Service modules" },
      { value: "22", label: "Migrations" },
      { value: "RAG", label: "Grounded answers" },
    ],
    stack: ["Node.js", "Express", "MySQL", "Gemini API", "Socket.IO", "JWT", "RBAC", "OPay"],
    links: [{ label: "Source", href: "https://github.com/oyinlola-tech/health-ai" }],
    hue: 108,
    featured: false,
  },

  /* ================================================================== */
  {
    slug: "glossy-store",
    name: "Glossy Store",
    kind: "E-commerce platform",
    category: "Commerce & marketplace",
    year: "2026",
    role: "Author",
    status: "Private",
    summary:
      "A full-stack storefront where every admin and superadmin login requires OTP — 28 Sequelize models, role-separated dashboards, and support chat with private attachment handling.",
    overview: [
      "Glossy Store is a React and Vite storefront over an Express and Sequelize backend on MySQL: catalogue, categories, cart, checkout, wishlist and orders, with separate admin and superadmin dashboards behind role-based access.",
      "Twenty-eight Sequelize models, thirteen controllers, thirty frontend pages, twenty-two migrations. The database bootstraps itself on backend startup, so a fresh clone runs without a manual migration step.",
      "The decision that shapes the security posture is small and unusual: OTP is mandatory on every admin and superadmin login attempt, not just on unrecognised devices.",
    ],
    problem: [
      "Storefront admin accounts are the real target. A customer account buys something; an admin account edits prices, reads every order, and exports a customer list. Most e-commerce builds protect both with the same password form.",
      "Optional two-factor solves this only for the people who opt in, which is never the account that gets compromised. Risk-based prompts help, but they fail exactly when an attacker logs in from a plausible device.",
      "Support is the other soft edge. A support thread carries order details and often an attachment, and serving those from a public uploads directory means a guessable URL is a data leak.",
    ],
    architecture: [
      {
        title: "Mandatory OTP for privileged roles",
        body: "Every admin and superadmin login goes through a dedicated /otp page with resend support. Customers get a normal login; anyone who can change a price does not.",
      },
      {
        title: "Two admin tiers",
        body: "Admin and superadmin are separate roles with separate dashboards rather than one dashboard with hidden buttons. Authorisation is enforced on the route, not on the render.",
      },
      {
        title: "Commerce core",
        body: "Products, categories, cart, checkout, wishlist and orders across 28 models — enough relational structure that the migrations and associations earn their keep.",
      },
      {
        title: "Support chat with private attachments",
        body: "Attachments in support threads are access-checked rather than served statically, so a file's URL is not its authorisation.",
      },
      {
        title: "Self-bootstrapping database",
        body: "The backend provisions its own schema on startup. For a project handed between machines, a clone that runs is worth more than a clone that documents how to make it run.",
      },
    ],
    decisions: [
      {
        title: "OTP always, for staff",
        body: "Mandatory second factor adds friction to a login that happens a few times a day for a handful of people, and removes the single-credential compromise that would expose every customer record. The friction is real and the trade is obvious.",
      },
      {
        title: "Sequelize with real migrations",
        body: "Twenty-two migrations against 28 models — a schema history that can move forward on a live database, rather than a sync that is only safe on an empty one.",
      },
      {
        title: "Roles as routes, not as UI",
        body: "Superadmin capability is separated at the API. Hiding a button is a presentation choice; refusing the request is an access control.",
      },
    ],
    metrics: [
      { value: "28", label: "Sequelize models" },
      { value: "30", label: "Frontend pages" },
      { value: "22", label: "Migrations" },
      { value: "100%", label: "Staff logins with OTP" },
    ],
    stack: ["React", "Vite", "TypeScript", "Node.js", "Express", "Sequelize", "MySQL"],
    links: [{ label: "Source", href: "https://github.com/oyinlola-tech/Glossy-Store" }],
    hue: 286,
    featured: false,
  },

  /* ================================================================== */
  {
    slug: "telente-technologies",
    name: "Telente Technologies",
    kind: "Agency site & admin platform",
    category: "Product & interface",
    year: "2026",
    role: "Author",
    status: "Live",
    summary:
      "The public site and content platform for a software agency — a React front end over an Express and MySQL admin backend managing services, projects, blogs, team, careers and testimonials.",
    overview: [
      "Telente Technologies is a software engineering agency in Okitipupa, Nigeria. This is its website and the admin platform behind it: a React and Vite front end for the public site, and a Node, Express and MySQL backend that powers every piece of content on it.",
      "Nothing on the public site is hardcoded. Services, projects, blog posts, team profiles, careers, testimonials and contact submissions are all managed through a secure admin portal, which is what separates a company website from a company brochure.",
      "It runs in production: the site at telente.site, the API and uploads on their own subdomain.",
    ],
    problem: [
      "Agency sites decay. The team page lists someone who left a year ago, the careers page advertises a closed role, and the case studies stop at whatever was shipped when the site was built — because every change requires a developer and a deploy.",
      "The usual fix is a hosted CMS, which trades the deploy problem for a vendor, a monthly cost and a content model that never quite fits.",
      "The second requirement is discovery. An agency site that does not rank for what the agency does is an expensive business card, so SEO could not be an afterthought bolted on at the end.",
    ],
    architecture: [
      {
        title: "Content as data",
        body: "Services, projects, blogs, team, careers, testimonials and contact submissions each have a model and an admin surface. Publishing is a database write, not a pull request.",
      },
      {
        title: "Separate API and uploads origin",
        body: "The API and uploaded media are served from their own subdomain rather than from the site, keeping the static front end independently deployable.",
      },
      {
        title: "Secure admin portal",
        body: "Authenticated content management with nine controllers covering the editable surfaces, kept behind its own auth boundary rather than mixed into the public routes.",
      },
      {
        title: "Configuration through environment",
        body: "Every deployment-specific value is an environment variable, so the same build runs locally and in production without code changes or committed secrets.",
      },
    ],
    decisions: [
      {
        title: "Own the CMS rather than rent one",
        body: "The content model is small and specific — an agency's services, work and people. Building it directly costs less than fitting it into a general-purpose CMS and removes a recurring bill and a vendor from the critical path of the company's own website.",
      },
      {
        title: "SEO as a project goal, not a checklist",
        body: "The site was structured around what the agency needs to be found for. Treating discovery as an architectural requirement rather than a set of meta tags added late is the difference between ranking and merely being indexed.",
      },
      {
        title: "Contact submissions persisted, not emailed",
        body: "An enquiry that only exists as an email is an enquiry that gets lost. Storing them means the agency can see what it has not answered.",
      },
    ],
    metrics: [
      { value: "7", label: "Managed content types" },
      { value: "9", label: "Admin controllers" },
      { value: "12", label: "Public pages" },
      { value: "Live", label: "In production" },
    ],
    stack: ["React", "Vite", "TypeScript", "Node.js", "Express", "MySQL"],
    links: [
      { label: "Live site", href: "https://www.telente.site" },
      { label: "Source", href: "https://github.com/oyinlola-tech/telente-agency" },
    ],
    hue: 196,
    featured: false,
  },

  /* ================================================================== */
  {
    slug: "telente-logistics",
    name: "Telente Logistics",
    kind: "Logistics platform",
    category: "Logistics & tracking",
    year: "2026",
    role: "Author",
    status: "Private",
    summary:
      "A logistics platform with public package tracking, careers and applications, newsletter capture, and an admin dashboard behind OTP-secured authentication.",
    overview: [
      "Telente Logistics is a full-stack platform covering the public side of a logistics business — marketing pages, package tracking, contact and newsletter capture, careers and job applications — and the admin dashboard that operates it.",
      "Package tracking is the piece customers actually use, and it is the one that has to work without an account: a tracking number typed into a public page, resolving to a status without exposing anything about the shipment beyond what the person holding the number should see.",
      "Admin access is protected by OTP alongside a full credential lifecycle: forgot, reset and change password.",
    ],
    problem: [
      "Public tracking endpoints are enumeration targets. Sequential tracking numbers plus an unauthenticated lookup is a way to walk every shipment a company has ever handled, including names and addresses.",
      "Careers pages are the other overlooked surface — they accept file uploads from anonymous users, which is the same threat model as an upload form with none of the attention.",
      "And a logistics admin dashboard controls where things go. Password-only access on a panel that can redirect a shipment is not proportionate to what it can do.",
    ],
    architecture: [
      {
        title: "Public tracking",
        body: "Tracking resolves a number to a status for an unauthenticated caller, kept deliberately narrow in what it returns.",
      },
      {
        title: "OTP-secured admin",
        body: "Admin authentication requires a second factor, with forgot, reset and change password flows built as first-class paths rather than as an afterthought.",
      },
      {
        title: "Careers and applications",
        body: "Job listings with an application pipeline, so submissions land in the system where they can be reviewed rather than in an inbox.",
      },
      {
        title: "Capture surfaces",
        body: "Contact and newsletter capture persisted alongside the rest of the operational data.",
      },
    ],
    decisions: [
      {
        title: "Second factor on the operations panel",
        body: "The dashboard can change where a package goes. That is a physical-world consequence, and it justifies friction that a content admin would not need.",
      },
      {
        title: "Explicitly proprietary",
        body: "The repository states in the README, the licence and the security policy that it is not free to use. Client work with an ambiguous licence is a problem deferred, not avoided.",
      },
      {
        title: "Password lifecycle built up front",
        body: "Forgot, reset and change are the flows that get retrofitted badly under pressure after someone is locked out. Building all three at once means one consistent token model instead of three improvised ones.",
      },
    ],
    metrics: [
      { value: "13", label: "Public pages" },
      { value: "6", label: "Data models" },
      { value: "OTP", label: "Admin second factor" },
      { value: "3", label: "Password flows" },
    ],
    stack: ["React", "Vite", "TypeScript", "Node.js", "Express", "MySQL"],
    links: [{ label: "Source", href: "https://github.com/oyinlola-tech/Telente-logistic-Webapp" }],
    hue: 246,
    featured: false,
  },

  /* ================================================================== */
  {
    slug: "telente-school",
    name: "Telente School Management",
    kind: "School management system",
    category: "Education",
    year: "2026",
    role: "Author",
    status: "Private",
    summary:
      "A school operations system covering admissions, attendance, timetables, results, fees and staff — with role-based access separating what students, teachers and administrators can reach.",
    overview: [
      "Telente School Management handles the operational side of running a school: student admission and registration, attendance, class management, timetables, results and reporting, fee and payment tracking, staff records, announcements and system administration.",
      "The users are not one audience. Students, teachers, administrators and finance staff share the same data and need very different slices of it, which makes role-based access the organising constraint rather than a feature.",
      "It also carries the unglamorous parts schools actually depend on: email notifications, permissions, settings and system backups.",
    ],
    problem: [
      "School software fails on the calendar. Terms, sessions and classes all move, and a schema that treats a student's class as a column rather than as an enrolment in a term cannot answer what a student took two years ago.",
      "Results are the second trap. A grade is not a single value — it is components, weights and a computed total, and a system that stores only the total cannot explain or correct it.",
      "The third is access. Attendance, results and fees are visible to overlapping but different groups, and getting that wrong means a parent seeing another child's record.",
    ],
    architecture: [
      {
        title: "Student lifecycle",
        body: "Admission, registration, attendance and progress tracking as connected stages rather than as separate screens over the same table.",
      },
      {
        title: "Academic operations",
        body: "Class management, timetabling, results and reporting — the recurring machinery of a term.",
      },
      {
        title: "Finance",
        body: "Payment tracking, billing and financial reporting kept beside the student record it belongs to.",
      },
      {
        title: "Roles and permissions",
        body: "Staff and administrator management with role-based access, so what a teacher can reach and what a bursar can reach are defined once and enforced centrally.",
      },
      {
        title: "Operations",
        body: "Email notifications, announcements, system settings and backups — the features that decide whether a school can actually run on the system.",
      },
    ],
    decisions: [
      {
        title: "Backups as a product feature",
        body: "A school's records are not recoverable from anywhere else. Making backup a function of the system rather than an operational assumption is the difference between an incident and a catastrophe.",
      },
      {
        title: "Role-based access as the foundation",
        body: "With four audiences over one dataset, retrofitting authorisation means auditing every query. Defining roles first makes every later feature inherit the boundary.",
      },
      {
        title: "Notifications in the system",
        body: "Announcements and email notifications built in, because the alternative is a parallel WhatsApp group that becomes the real source of truth.",
      },
    ],
    metrics: [
      { value: "10", label: "Route modules" },
      { value: "9", label: "Controllers" },
      { value: "4", label: "User audiences" },
      { value: "6", label: "Operational domains" },
    ],
    stack: ["Node.js", "Express", "MySQL", "JavaScript", "RBAC"],
    links: [],
    hue: 58,
    featured: false,
  },
];

/**
 * The case-study count, spelled out.
 *
 * Lives here, beside the array, because the /work headline hardcoded it and
 * was wrong twice — it read "Thirteen" at fifteen entries, then "Fifteen" at
 * nineteen. A headline that counts its own list cannot drift from it.
 */
const ONES = [
  "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight",
  "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
  "Sixteen", "Seventeen", "Eighteen", "Nineteen",
];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

/** Spells a count up to 99; beyond that the numeral is clearer anyway. */
function spell(n: number): string {
  if (n < 20) return ONES[n];
  if (n > 99) return String(n);
  const [t, o] = [Math.floor(n / 10), n % 10];
  return o === 0 ? TENS[t] : `${TENS[t]}-${ONES[o].toLowerCase()}`;
}

export const workCount = work.length;
export const workCountWord = spell(work.length);

export const workBySlug = Object.fromEntries(work.map((w) => [w.slug, w]));

/**
 * Display order: featured first, then the rest, each in array order.
 *
 * The Work index paints the featured rows above the long tail, so it numbered
 * down that painted order, while a case study numbered itself from where it
 * sat in `work`. Two schemes over one list, and they disagreed the moment a
 * featured entry was not also early in the array — utils-tool showed as 07 on
 * the index and 09 on its own page. Both now take the number from here, so
 * flipping `featured` renumbers the index and the case study together.
 */
export const workOrdered: CaseStudy[] = [
  ...work.filter((w) => w.featured),
  ...work.filter((w) => !w.featured),
];

/** Zero-based position in display order, by slug. */
export const workPosition: Record<string, number> = Object.fromEntries(
  workOrdered.map((w, i) => [w.slug, i]),
);

export const categories = [...new Set(work.map((w) => w.category))];

/* ------------------------------------------------------------------ *
 * Everything else worth linking. Every href below returned 200.
 * ------------------------------------------------------------------ */

export type Repo = {
  name: string;
  description: string;
  language: string;
  href: string;
  live?: string;
};

export const openSource: Repo[] = [
  {
    name: "chrtv",
    description:
      "Logistics visibility platform — realtime GPS tracking, alerts, geofencing and fleet management.",
    language: "JavaScript",
    href: "https://github.com/oyinlola-tech/chrtv",
  },
  {
    name: "revive-root-essentials",
    description: "E-commerce software built for a wellness brand.",
    language: "TypeScript",
    href: "https://github.com/oyinlola-tech/revive-root-essentials",
  },
  {
    name: "rivvo",
    description: "Safe chatting system — an experiment in moderated realtime messaging.",
    language: "TypeScript",
    href: "https://github.com/oyinlola-tech/rivvo",
  },
  {
    name: "gly-vtu",
    description: "Virtual top-up platform for airtime and data.",
    language: "TypeScript",
    href: "https://github.com/oyinlola-tech/gly-vtu",
  },
  {
    name: "health-ai",
    description: "AI-assisted health triage prototype.",
    language: "JavaScript",
    href: "https://github.com/oyinlola-tech/health-ai",
  },
  {
    name: "telente-chamber",
    description: "Law-firm practice management prototype — my first real product build.",
    language: "HTML",
    href: "https://github.com/oyinlola-tech/telente-chamber",
  },
  {
    name: "telente-logistic-webapp",
    description: "Logistics booking and tracking web application.",
    language: "TypeScript",
    href: "https://github.com/oyinlola-tech/Telente-logistic-Webapp",
    live: "https://telente-logistic-webapp.vercel.app",
  },
  {
    name: "BrightLearn",
    description: "Learning platform front-end for a tutoring brand.",
    language: "HTML",
    href: "https://github.com/oyinlola-tech/BrightLearn",
    live: "https://brightlearn-ten.vercel.app",
  },
  {
    name: "portfolio.io",
    description: "The hand-coded portfolio this site replaces.",
    language: "TypeScript",
    href: "https://github.com/oyinlola-tech/portfolio.io",
    live: "https://portfolio-io-ashen.vercel.app",
  },
];
