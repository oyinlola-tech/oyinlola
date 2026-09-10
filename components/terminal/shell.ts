/**
 * The shell behind the terminal playground.
 *
 * Pure logic: a virtual filesystem built from the same `content/` modules the
 * rest of the site renders, plus the command table. Nothing here touches the
 * DOM, so the terminal component stays about input and painting.
 *
 * The filesystem is generated, not written out — add a case study to
 * `content/work.ts` and it appears under /work with no change here.
 */

import { site, links, focus, stack, disciplines, education } from "@/content/site";
import { work } from "@/content/work";

export type Tone = "out" | "dim" | "ok" | "err" | "accent" | "blue" | "head";

export type Line = {
  text: string;
  tone?: Tone;
  /** Renders the line as a link into the real site. */
  href?: string;
};

export type Result = {
  lines: Line[];
  cwd?: string;
  clear?: boolean;
  navigate?: string;
};

type File = { kind: "file"; body: () => Line[] };
type Dir = { kind: "dir"; children: Record<string, Node> };
type Node = File | Dir;

const L = (text: string, tone?: Tone, href?: string): Line => ({ text, tone, href });
const BLANK = L("");

/* ------------------------------------------------------------------ *
 *  Filesystem
 * ------------------------------------------------------------------ */

function kv(pairs: [string, string][], pad = 10): Line[] {
  return pairs.map(([k, v]) => L(`${k.padEnd(pad)} ${v}`, "out"));
}

function projectFile(slug: string): File {
  return {
    kind: "file",
    body: () => {
      const p = work.find((w) => w.slug === slug)!;
      const out: Line[] = [
        L(p.name, "head"),
        L(`${p.kind} · ${p.year} · ${p.status}`, "dim"),
        BLANK,
        ...wrap(p.summary, 74).map((t) => L(t, "out")),
        BLANK,
        L("METRICS", "accent"),
        ...p.metrics.map((m) => L(`  ${m.value.padEnd(8)} ${m.label}`, "out")),
        BLANK,
        L("STACK", "accent"),
        ...wrap(p.stack.join(" · "), 74).map((t) => L(`  ${t}`, "dim")),
      ];
      if (p.links.length) {
        out.push(BLANK, L("LINKS", "accent"));
        for (const l of p.links) out.push(L(`  ${l.label}: ${l.href}`, "blue"));
      }
      out.push(
        BLANK,
        L(`Read the full case study → open ${slug}`, "ok", `/work/${slug}`),
      );
      return out;
    },
  };
}

function disciplineFile(id: string): File {
  return {
    kind: "file",
    body: () => {
      const d = disciplines.find((x) => x.id === id)!;
      return [
        L(d.title, "head"),
        L(d.lede, "dim"),
        BLANK,
        ...wrap(d.body, 74).map((t) => L(t, "out")),
        BLANK,
        L("TOOLS", "accent"),
        ...wrap(d.items.join(" · "), 74).map((t) => L(`  ${t}`, "dim")),
        BLANK,
        L("EVIDENCE", "accent"),
        ...d.evidence.map((s) => {
          const p = work.find((w) => w.slug === s);
          return L(`  ${p ? p.name : s}`, "blue", `/work/${s}`);
        }),
      ];
    },
  };
}

const ROOT: Dir = {
  kind: "dir",
  children: {
    "about.txt": {
      kind: "file",
      body: () => [
        L(site.name, "head"),
        L(site.role, "accent"),
        BLANK,
        ...wrap(site.positioning, 74).map((t) => L(t, "out")),
        BLANK,
        ...kv([
          ["location", site.location],
          ["timezone", site.timezone],
          ["languages", "Go · Python · TypeScript"],
          ["studying", "BSc Computer Science, University of the People"],
        ]),
        BLANK,
        L("More → open about", "ok", "/about"),
      ],
    },
    "focus.txt": {
      kind: "file",
      body: () => [
        L("Currently pointed at", "head"),
        BLANK,
        ...focus.map((f) => L(`  → ${f}`, "out")),
      ],
    },
    "contact.txt": {
      kind: "file",
      body: () => [
        L("Get in touch", "head"),
        BLANK,
        ...kv(
          [
            ["email", site.email],
            ["phone", site.phone],
            ["github", links.github],
            ["linkedin", links.linkedin],
            ["site", links.site],
          ],
          9,
        ),
        BLANK,
        L(`Open to ${site.availableFor.toLowerCase()}.`, "dim"),
        L("Send a message → open contact", "ok", "/contact"),
      ],
    },
    "education.txt": {
      kind: "file",
      body: () => [
        L("Education", "head"),
        BLANK,
        ...education.flatMap((e) => [
          L(`${e.title}`, "out"),
          L(`  ${e.org} — ${e.period}`, "dim"),
        ]),
      ],
    },
    engineering: {
      kind: "dir",
      children: Object.fromEntries(
        disciplines.map((d) => [`${d.id}.txt`, disciplineFile(d.id)]),
      ),
    },
    work: {
      kind: "dir",
      children: Object.fromEntries(work.map((w) => [`${w.slug}.md`, projectFile(w.slug)])),
    },
  },
};

/* ------------------------------------------------------------------ *
 *  Path helpers
 * ------------------------------------------------------------------ */

function normalise(cwd: string, target?: string): string {
  if (!target || target === "." || target === "~") return target === "~" ? "/" : cwd;
  const base = target.startsWith("/") || target.startsWith("~") ? [] : cwd.split("/").filter(Boolean);
  const parts = target.replace(/^~\/?/, "/").split("/").filter(Boolean);
  for (const part of parts) {
    if (part === ".") continue;
    if (part === "..") base.pop();
    else base.push(part);
  }
  return "/" + base.join("/");
}

function resolve(path: string): Node | null {
  const parts = path.split("/").filter(Boolean);
  let node: Node = ROOT;
  for (const part of parts) {
    if (node.kind !== "dir") return null;
    const next: Node | undefined = node.children[part];
    if (!next) return null;
    node = next;
  }
  return node;
}

export function display(path: string): string {
  return path === "/" ? "~" : `~${path}`;
}

/** Soft-wrap prose to a column so long paragraphs stay readable. */
function wrap(text: string, width: number): string[] {
  const words = text.split(/\s+/);
  const out: string[] = [];
  let line = "";
  for (const w of words) {
    if (line.length + w.length + 1 > width) {
      out.push(line);
      line = w;
    } else line = line ? `${line} ${w}` : w;
  }
  if (line) out.push(line);
  return out;
}

/* ------------------------------------------------------------------ *
 *  Commands
 * ------------------------------------------------------------------ */

/**
 * Boundaries inside boundaries — a modular monolith, drawn.
 * Full-block characters only: box-drawing glyphs are not reliably
 * single-advance across monospace faces and the art skews.
 */
const LOGO = [
  "████████████████",
  "██            ██",
  "██  ████████  ██",
  "██  ██    ██  ██",
  "██  ████████  ██",
  "██            ██",
  "████████████████",
];

type Command = {
  name: string;
  args?: string;
  help: string;
  hidden?: boolean;
  run: (args: string[], cwd: string) => Result;
};

const COMMANDS: Command[] = [
  {
    name: "help",
    help: "everything this shell knows",
    run: () => ({
      lines: [
        L("Available commands", "head"),
        BLANK,
        ...COMMANDS.filter((c) => !c.hidden).map((c) =>
          L(`  ${(c.name + (c.args ? " " + c.args : "")).padEnd(16)} ${c.help}`, "out"),
        ),
        BLANK,
        L("  ↑ ↓ history · Tab completion · Ctrl+L clear", "dim"),
      ],
    }),
  },
  {
    name: "whoami",
    help: "one line",
    run: () => ({
      lines: [
        L(`${site.name} — ${site.role}`, "head"),
        L(site.positioning, "dim"),
      ],
    }),
  },
  {
    name: "about",
    help: "the longer version",
    run: () => ({ lines: (resolve("/about.txt") as File).body() }),
  },
  {
    name: "focus",
    help: "what the work is pointed at",
    run: () => ({ lines: (resolve("/focus.txt") as File).body() }),
  },
  {
    name: "ls",
    args: "[dir]",
    help: "list a directory",
    run: (args, cwd) => {
      const path = normalise(cwd, args[0]);
      const node = resolve(path);
      if (!node) return { lines: [L(`ls: ${args[0]}: no such file or directory`, "err")] };
      if (node.kind === "file") return { lines: [L(args[0] ?? path, "out")] };
      const names = Object.keys(node.children);
      if (!names.length) return { lines: [L("(empty)", "dim")] };
      return {
        lines: names.map((n) => {
          const child = node.children[n];
          return child.kind === "dir" ? L(`${n}/`, "blue") : L(n, "out");
        }),
      };
    },
  },
  {
    name: "cd",
    args: "<dir>",
    help: "change directory",
    run: (args, cwd) => {
      const path = normalise(cwd, args[0] ?? "/");
      const node = resolve(path);
      if (!node) return { lines: [L(`cd: ${args[0]}: no such file or directory`, "err")] };
      if (node.kind !== "dir") return { lines: [L(`cd: ${args[0]}: not a directory`, "err")] };
      return { lines: [], cwd: path };
    },
  },
  {
    name: "pwd",
    help: "where you are",
    run: (_a, cwd) => ({ lines: [L(display(cwd), "out")] }),
  },
  {
    name: "cat",
    args: "<file>",
    help: "read a file",
    run: (args, cwd) => {
      if (!args[0]) return { lines: [L("cat: missing file", "err")] };
      const node = resolve(normalise(cwd, args[0]));
      if (!node) return { lines: [L(`cat: ${args[0]}: no such file or directory`, "err")] };
      if (node.kind !== "file") return { lines: [L(`cat: ${args[0]}: is a directory`, "err")] };
      return { lines: node.body() };
    },
  },
  {
    name: "tree",
    help: "the whole thing at once",
    run: () => {
      const lines: Line[] = [L("~", "blue")];
      const walk = (dir: Dir, prefix: string) => {
        const names = Object.keys(dir.children);
        names.forEach((n, i) => {
          const last = i === names.length - 1;
          const child = dir.children[n];
          lines.push(
            L(
              `${prefix}${last ? "└── " : "├── "}${n}${child.kind === "dir" ? "/" : ""}`,
              child.kind === "dir" ? "blue" : "out",
            ),
          );
          if (child.kind === "dir") walk(child, prefix + (last ? "    " : "│   "));
        });
      };
      walk(ROOT, "");
      return { lines };
    },
  },
  {
    name: "work",
    help: "list every case study",
    run: () => ({
      lines: [
        L(`${work.length} case studies`, "head"),
        BLANK,
        ...work.map((p) =>
          L(`  ${p.slug.padEnd(20)} ${p.kind}`, "out", `/work/${p.slug}`),
        ),
        BLANK,
        L("  cat work/<slug>.md  ·  open <slug>", "dim"),
      ],
    }),
  },
  {
    name: "open",
    args: "<name>",
    help: "open a case study or page",
    run: (args) => {
      const q = (args[0] ?? "").toLowerCase().replace(/\.md$/, "");
      if (!q) return { lines: [L("open: what?", "err")] };
      const pages: Record<string, string> = {
        home: "/",
        index: "/",
        work: "/work",
        engineering: "/engineering",
        lab: "/lab",
        about: "/about",
        cv: "/cv",
        resume: "/cv",
        contact: "/contact",
      };
      if (pages[q]) return { lines: [L(`Opening ${q}…`, "ok")], navigate: pages[q] };
      const p = work.find((w) => w.slug === q || w.name.toLowerCase() === q);
      if (!p) return { lines: [L(`open: ${args[0]}: not found. Try 'work'.`, "err")] };
      return { lines: [L(`Opening ${p.name}…`, "ok")], navigate: `/work/${p.slug}` };
    },
  },
  {
    name: "stack",
    help: "the toolkit, grouped",
    run: () => ({
      lines: [
        L("Stack", "head"),
        BLANK,
        ...stack.flatMap((g) => [
          L(`  ${g.title}`, "accent"),
          ...wrap(g.items.join(" · "), 66).map((t) => L(`    ${t}`, "out")),
        ]),
      ],
    }),
  },
  { name: "skills", hidden: true, help: "alias for stack", run: () => runCommand("stack", "/") },
  {
    name: "edu",
    help: "education",
    run: () => ({ lines: (resolve("/education.txt") as File).body() }),
  },
  {
    name: "cv",
    help: "the CV, and a PDF of it",
    run: () => ({
      lines: [
        L("Curriculum vitae", "head"),
        L("Full history, skills, projects, education — with a PDF export.", "dim"),
        BLANK,
        L("Opening /cv…", "ok"),
      ],
      navigate: "/cv",
    }),
  },
  {
    name: "contact",
    help: "how to reach me",
    run: () => ({ lines: (resolve("/contact.txt") as File).body() }),
  },
  {
    name: "neofetch",
    help: "system info",
    run: () => {
      const info: [string, string][] = [
        ["", `${site.name.split(" ")[1].toLowerCase()}@portfolio`],
        ["", "─".repeat(28)],
        ["OS", "Linux"],
        ["Shell", "bash · zsh"],
        ["Role", site.role],
        ["Focus", "Backend · Data · Distributed"],
        ["Lang", "Go · Python · TypeScript"],
        ["DB", "PostgreSQL · Redis · MariaDB"],
        ["Infra", "Docker · Linux · CI/CD"],
        ["Study", "CS, University of the People"],
        ["Loc", site.location],
        ["Mail", site.email],
      ];
      const rows = Math.max(LOGO.length, info.length);
      const lines: Line[] = [];
      for (let i = 0; i < rows; i++) {
        const art = (LOGO[i] ?? "").padEnd(18) + "  ";
        const pair = info[i];
        if (!pair) {
          lines.push(L(art, "accent"));
          continue;
        }
        const [k, v] = pair;
        lines.push(L(`${art}${k.padEnd(8)} ${v}`, i < 2 ? "head" : "out"));
      }
      return { lines };
    },
  },
  {
    name: "date",
    help: "time in Lagos",
    run: () => ({
      lines: [
        L(
          new Intl.DateTimeFormat("en-GB", {
            dateStyle: "full",
            timeStyle: "short",
            timeZone: "Africa/Lagos",
          }).format(new Date()) + " (WAT)",
          "out",
        ),
      ],
    }),
  },
  {
    name: "clear",
    help: "clear the screen",
    run: () => ({ lines: [], clear: true }),
  },
  /* ---- easter eggs ---- */
  {
    name: "uname",
    hidden: true,
    help: "",
    run: () => ({ lines: [L("Linux portfolio 6.x x86_64 GNU/Linux", "out")] }),
  },
  {
    name: "sudo",
    hidden: true,
    help: "",
    run: (args) => ({
      lines: [
        L(`[sudo] password for guest:`, "dim"),
        L(
          args.length
            ? `guest is not in the sudoers file. This incident has been reported.`
            : "usage: sudo <command>",
          "err",
        ),
      ],
    }),
  },
  {
    name: "echo",
    hidden: true,
    help: "",
    run: (args) => ({ lines: [L(args.join(" "), "out")] }),
  },
  {
    name: "exit",
    hidden: true,
    help: "",
    run: () => ({
      lines: [L("There is no exit. Try 'open home'.", "dim")],
    }),
  },
  {
    name: "rm",
    hidden: true,
    help: "",
    run: (args) => ({
      lines: [
        args.includes("-rf")
          ? L("Nice try. This filesystem is generated from content/, and content/ is in git.", "err")
          : L(`rm: ${args[0] ?? ""}: permission denied`, "err"),
      ],
    }),
  },
];

export const COMMAND_NAMES = COMMANDS.filter((c) => !c.hidden).map((c) => c.name);

/** Chips shown above the input — the commands worth tapping on a phone. */
export const QUICK = ["neofetch", "whoami", "work", "stack", "tree", "focus", "contact", "help"];

export function runCommand(input: string, cwd: string): Result {
  const trimmed = input.trim();
  if (!trimmed) return { lines: [] };
  const [name, ...args] = trimmed.split(/\s+/);
  const cmd = COMMANDS.find((c) => c.name === name.toLowerCase());
  if (!cmd) {
    return {
      lines: [
        L(`${name}: command not found`, "err"),
        L("Type 'help' for what this shell knows.", "dim"),
      ],
    };
  }
  return cmd.run(args, cwd);
}

/** Tab completion: commands at position 0, paths and slugs after. */
export function complete(input: string, cwd: string): string | null {
  const parts = input.split(/\s+/);
  if (parts.length <= 1) {
    const hits = COMMAND_NAMES.filter((c) => c.startsWith(parts[0] ?? ""));
    return hits.length === 1 ? hits[0] + " " : null;
  }

  const cmd = parts[0].toLowerCase();
  const frag = parts[parts.length - 1];

  let pool: string[] = [];
  if (cmd === "open") {
    pool = [
      ...work.map((w) => w.slug),
      "home", "work", "engineering", "lab", "about", "cv", "contact",
    ];
  } else {
    const slash = frag.lastIndexOf("/");
    const dirPart = slash >= 0 ? frag.slice(0, slash + 1) : "";
    const node = resolve(normalise(cwd, dirPart || "."));
    if (!node || node.kind !== "dir") return null;
    const leaf = slash >= 0 ? frag.slice(slash + 1) : frag;
    const hits = Object.keys(node.children).filter((n) => n.startsWith(leaf));
    if (hits.length !== 1) return null;
    const child = node.children[hits[0]];
    return [...parts.slice(0, -1), dirPart + hits[0] + (child.kind === "dir" ? "/" : "")].join(" ");
  }

  const hits = pool.filter((c) => c.startsWith(frag));
  return hits.length === 1 ? [...parts.slice(0, -1), hits[0]].join(" ") + " " : null;
}

export const BOOT: Line[] = [
  L(`${site.short.toLowerCase()}@portfolio — interactive shell`, "head"),
  L(`${work.length} case studies mounted at /work · ${disciplines.length} disciplines at /engineering`, "dim"),
  L("Type 'help' to begin, or 'neofetch' if you're in a hurry.", "dim"),
];
