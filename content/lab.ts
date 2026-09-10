/**
 * The Lab — things built to answer a question rather than to ship.
 * Each entry says what the question was, because that is the interesting part.
 */

export type Experiment = {
  title: string;
  question: string;
  body: string;
  tags: string[];
  status: "Running" | "Shipped" | "Parked";
  href?: string;
};

export const experiments: Experiment[] = [
  {
    title: "Zudojs — framework research",
    question: "How should a framework structure an application, rather than just serve HTTP?",
    body: "Thirty-nine packages testing one idea: that dependency injection, lifecycle, configuration, events, CQRS, transactions and tenancy can be independent contracts instead of a runtime you have to adopt whole. Explicit tokens over decorator reflection, a lifecycle that is a real state machine, and no package assuming another is installed.",
    tags: ["TypeScript", "DI", "Lifecycle", "CQRS"],
    status: "Running",
    href: "/work/zudojs",
  },
  {
    title: "CLI as a framework surface",
    question: "Can a developer drive a whole framework from a numbered menu?",
    body: "Terminal interfaces where scaffolding, module generation and inspection happen through numbered menus and commands rather than remembering flags. Most developer tools assume you already know the vocabulary; this assumes you don't yet.",
    tags: ["CLI", "DX", "Node.js"],
    status: "Running",
  },
  {
    title: "AgentLab — evidence for agents",
    question: "Can an agent's answer be checked rather than trusted?",
    body: "A runtime that executes agents across browser, sandbox and desktop, keeps the whole trace, makes every claim cite the page it came from, and scores the run on five deterministic dimensions instead of asking another model whether it went well.",
    tags: ["Agents", "Evaluation", "TypeScript"],
    status: "Running",
    href: "/work/agentlab",
  },
  {
    title: "The capability system",
    question: "How does one codebase know what the machine it landed on can do?",
    body: "Utils-tool runs locally with Ghostscript and rembg, or serverless without them. Rather than two forks or a config flag that drifts, every tool declares its runtime needs and the server probes what it actually has — so the UI is never wrong about what will work.",
    tags: ["Python", "FastAPI", "Runtime"],
    status: "Shipped",
    href: "/work/utils-tool",
  },
  {
    title: "design.md as the authority",
    question: "Can a written specification outrank the code that implements it?",
    body: "The Newdich site carries a versioned design document that defines a three-colour system down to the token. If the CSS and that file disagree, the CSS is wrong. It keeps page thirty consistent with page one, and it is also what lets an agent work on the site without inventing a fourth colour.",
    tags: ["Design systems", "Python", "Spec-first"],
    status: "Shipped",
    href: "/work/newdich-technology",
  },
  {
    title: "This terminal",
    question: "Can a portfolio be navigated the way I actually work?",
    body: "A real shell over a virtual filesystem generated from the same content modules the pages render — so `cat work/kolo.md` cannot go stale, and `open kolo` moves the router. Command history, tab completion, Ctrl+L, and a tap-to-run row so it survives a phone.",
    tags: ["React", "DX", "Shell"],
    status: "Shipped",
  },
  {
    title: "Architecture as a picture",
    question: "What does a 74-module system look like?",
    body: "The hero draws Zudomart's real shape: five clusters sized by domain, wired internally and joined by an event spine carrying travelling pulses. Two draw calls, one Points and one LineSegments, with the reveal driven by an expanding wavefront rather than a fade.",
    tags: ["Three.js", "GLSL", "WebGL"],
    status: "Shipped",
  },
];
