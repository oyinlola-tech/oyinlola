import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { site, links, telemetry, focus } from "@/content/site";
import { work, type CaseStudy } from "@/content/work";
import DeferredConstellation from "./DeferredConstellation";

const HEADLINE = ["Systems that", "hold their shape."];

const zudomart = work.find((w) => w.slug === "zudomart")!;
const zudojs = work.find((w) => w.slug === "zudojs")!;

/**
 * The hero stage.
 *
 * Composition after ThreeUI's Sylva hero: an absolutely positioned 1600×880
 * stage measured in design units, column guides, a ghost wordmark, and
 * pointer parallax where every layer declares its own depth. Below `lg` the
 * stage is replaced by an ordinary flow layout — an absolute composition has
 * nowhere to go on a phone.
 */
export default function Hero() {
  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden">
      {/* The stage and the narrow layout each draw the headline, and only one
          of them is ever displayed — so the real <h1> lives here, once, and
          both visual copies are hidden from the accessibility tree. */}
      <h1 className="sr-only">Systems that hold their shape.</h1>

      {/* Ground ----------------------------------------------------- */}
      <div
        className="absolute inset-0 -z-20"
        style={{
          background: [
            "radial-gradient(62% 52% at 26% 18%, rgba(255,176,103,0.055) 0%, rgba(255,176,103,0) 70%)",
            "radial-gradient(70% 62% at 78% 76%, rgba(70,110,255,0.10) 0%, rgba(70,110,255,0) 68%)",
            "#07080b",
          ].join(", "),
        }}
      />

      {/* Constellation ---------------------------------------------- */}
      <div className="absolute inset-0 -z-10">
        <DeferredConstellation />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(122% 86% at 50% 50%, transparent 44%, rgba(7,8,11,0.40) 82%, rgba(7,8,11,0.86) 100%)",
          }}
        />
        {/* The copy sits left; the constellation is allowed the right. */}
        <div
          className="pointer-events-none absolute inset-0 hidden lg:block"
          style={{
            background:
              "linear-gradient(96deg, rgba(7,8,11,0.95) 0%, rgba(7,8,11,0.80) 22%, rgba(7,8,11,0.44) 40%, rgba(7,8,11,0.08) 60%, rgba(7,8,11,0) 74%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 lg:hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(7,8,11,0.94) 0%, rgba(7,8,11,0.88) 44%, rgba(7,8,11,0.62) 66%, rgba(7,8,11,0.74) 100%)",
          }}
        />
      </div>

      {/* ── DESKTOP STAGE ─────────────────────────────────────────── */}
      <div className="hidden h-[100svh] min-h-[calc(880*var(--u))] lg:block">
        <div className="stage">
          <div
            className="guides fade"
            style={{ "--d": "900ms" } as React.CSSProperties}
            aria-hidden="true"
          >
            <i style={{ left: "calc(405 * var(--u))" }} />
            <i style={{ left: "calc(748 * var(--u))" }} />
            <i style={{ left: "calc(1091 * var(--u))" }} />
          </div>

          <div
            className="ghost fade"
            style={{ "--d": "1150ms" } as React.CSSProperties}
            aria-hidden="true"
          >
            OYINLOLA
          </div>

          {/* Eyebrow */}
          <div
            className="par mask absolute z-[4] flex items-center gap-[calc(16*var(--u))]"
            style={
              {
                left: "calc(46 * var(--u))",
                top: "calc(200 * var(--u))",
                "--d": "200ms",
                "--pd": 20,
              } as React.CSSProperties
            }
          >
            <span className="label flex items-center gap-[calc(7*var(--u))] text-[calc(10*var(--u))] text-ink-dim">
              <span className="animate-pulse-dot size-[calc(6*var(--u))] rounded-full bg-signal" />
              Available for work
            </span>
            <span className="label text-[calc(10*var(--u))]">{site.location}</span>
          </div>

          {/* Headline */}
          <p
            aria-hidden="true"
            className="headline par absolute z-[4] font-display font-medium text-ink"
            style={
              {
                left: "calc(46 * var(--u))",
                top: "calc(242 * var(--u))",
                fontSize: "calc(88 * var(--u))",
                lineHeight: "calc(86 * var(--u))",
                letterSpacing: "calc(-3.2 * var(--u))",
                "--pd": 18,
                "--pr": 1.2,
              } as React.CSSProperties
            }
          >
            {HEADLINE.map((line, i) => (
              <span key={line} className="block">
                <i
                  className="inline-block not-italic"
                  style={{ "--d": `${260 + i * 100}ms` } as React.CSSProperties}
                >
                  {line}
                </i>
              </span>
            ))}
          </p>

          {/* Lede */}
          <p
            className="par mask absolute z-[4] font-light text-ink-dim"
            style={
              {
                left: "calc(46 * var(--u))",
                top: "calc(438 * var(--u))",
                width: "calc(392 * var(--u))",
                fontSize: "calc(16.5 * var(--u))",
                lineHeight: "calc(25 * var(--u))",
                "--d": "480ms",
                "--pd": 14,
                "--pr": 1,
              } as React.CSSProperties
            }
          >
            I&rsquo;m {site.name}, a software engineer in Nigeria. I build backend APIs, data
            pipelines and developer tools — and the architecture that holds them together.
          </p>

          {/* Current focus — the four things the work is actually pointed at. */}
          <ul
            className="par mask absolute z-[4] flex flex-wrap gap-[calc(7*var(--u))]"
            style={
              {
                left: "calc(46 * var(--u))",
                top: "calc(516 * var(--u))",
                width: "calc(430 * var(--u))",
                "--d": "540ms",
                "--pd": 14,
                "--mr": "calc(20 * var(--u))",
              } as React.CSSProperties
            }
          >
            {focus.map((f) => (
              <li
                key={f}
                className="rounded-full border border-line px-[calc(11*var(--u))] py-[calc(5*var(--u))] font-mono text-[calc(9.5*var(--u))] uppercase tracking-[0.1em] text-muted"
              >
                {f}
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div
            className="par mask absolute z-[4] flex items-center gap-[calc(10*var(--u))]"
            style={
              {
                left: "calc(46 * var(--u))",
                top: "calc(596 * var(--u))",
                "--d": "640ms",
                "--pd": 15,
                "--pr": 1.4,
                "--mr": "calc(24 * var(--u))",
              } as React.CSSProperties
            }
          >
            <Link
              href="/work"
              className="group inline-flex items-center gap-[calc(9*var(--u))] rounded-full bg-ink px-[calc(22*var(--u))] py-[calc(12*var(--u))] text-[calc(13*var(--u))] font-medium text-stage transition-colors duration-300 hover:bg-accent"
            >
              Selected work
              <ArrowRight className="size-[calc(15*var(--u))] transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
            <a
              href={links.github}
              target="_blank"
              rel="noreferrer noopener"
              className="group inline-flex items-center gap-[calc(9*var(--u))] rounded-full border border-line-2 px-[calc(22*var(--u))] py-[calc(12*var(--u))] text-[calc(13*var(--u))] text-ink-dim transition-colors duration-300 hover:border-ink/30 hover:text-ink"
            >
              GitHub
              <ArrowUpRight className="size-[calc(15*var(--u))] transition-transform duration-300 group-hover:-translate-y-px group-hover:translate-x-px" />
            </a>
          </div>

          {/* Telemetry */}
          <dl
            className="par mask absolute z-[4] flex gap-[calc(44*var(--u))]"
            style={
              {
                left: "calc(46 * var(--u))",
                top: "calc(686 * var(--u))",
                "--d": "720ms",
                "--pd": 12,
              } as React.CSSProperties
            }
          >
            {telemetry.map((t) => (
              <div key={t.label}>
                <dd className="font-display text-[calc(30*var(--u))] font-medium leading-none tracking-tight text-ink">
                  {t.value}
                </dd>
                <dt className="label mt-[calc(9*var(--u))] text-[calc(9.5*var(--u))]">{t.label}</dt>
              </div>
            ))}
          </dl>

          {/* Cards */}
          <StageCard
            project={zudomart}
            label="Flagship"
            left={1158}
            top={140}
            delay={760}
            depth={10}
          />
          <StageCard
            project={zudojs}
            label="Open source"
            left={1074}
            top={512}
            delay={880}
            depth={22}
          />

          {/* Scroll cue */}
          <div
            className="par mask absolute z-[4]"
            style={
              {
                left: "calc(852 * var(--u))",
                top: "calc(700 * var(--u))",
                "--d": "1040ms",
                "--pd": 9,
              } as React.CSSProperties
            }
          >
            <span className="scroll-cue">
              Scroll
              <span className="track" />
            </span>
          </div>
        </div>
      </div>

      {/* ── NARROW LAYOUT ─────────────────────────────────────────────
          One phone screen, composed rather than stacked. The parts are
          grouped — statement, actions, telemetry, foot — and the column is
          `justify-between`, so leftover height is spread across the three
          seams instead of collecting as one dead band above the scroll cue.
          The gaps and the type are keyed to svh and vw, which is what keeps
          the same four groups inside a 640-tall phone and filling a 930. The
          top pad never drops below the dock's own foot — 30u down plus its
          52px floor — or a landscape phone starts its copy behind it. */}
      <div className="shell relative flex min-h-[100svh] flex-col justify-between gap-[clamp(0.7rem,2.2svh,1.4rem)] pb-[clamp(1.1rem,2.6svh,1.75rem)] pt-[max(clamp(4.4rem,10.5svh,6.5rem),calc(30*var(--u)+52px+0.75rem))] lg:hidden">
        {/* Statement ------------------------------------------------- */}
        <div className="flex flex-col gap-[clamp(0.65rem,1.8svh,1.1rem)]">
          <div className="animate-fade flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="label flex items-center gap-2 text-ink-dim">
              <span className="animate-pulse-dot size-1.5 rounded-full bg-signal" />
              Available for work
            </span>
            <span className="label">{site.location}</span>
          </div>

          <p
            aria-hidden="true"
            className="display text-[clamp(2.3rem,min(10.4vw,5.6svh),3.5rem)] text-ink"
          >
            Systems that hold their shape.
          </p>

          <p
            className="animate-rise max-w-md text-[clamp(0.88rem,3.7vw,1rem)] leading-[1.55] text-ink-dim"
            style={{ animationDelay: "300ms" }}
          >
            I&rsquo;m {site.name}, a software engineer in Nigeria. I build backend APIs, data
            pipelines and developer tools — and the architecture that holds them together.
          </p>
        </div>

        {/* Focus and actions ----------------------------------------- */}
        <div className="flex flex-col gap-[clamp(0.65rem,1.8svh,1.1rem)]">
          {/* Sized so the four terms always fall as two even rows: at any
              phone width two of them fit a line, and a lone chip on a row
              of its own is what made this read as a list rather than a
              band. */}
          <ul className="animate-rise flex flex-wrap gap-1.5" style={{ animationDelay: "360ms" }}>
            {focus.map((f) => (
              <li
                key={f}
                className="rounded-full border border-line px-2 py-[0.32rem] font-mono text-[clamp(0.5rem,2.4vw,0.62rem)] uppercase leading-none tracking-[0.07em] text-muted"
              >
                {f}
              </li>
            ))}
          </ul>

          <div className="animate-rise flex flex-wrap gap-2.5" style={{ animationDelay: "420ms" }}>
            <Link
              href="/work"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-stage"
            >
              Selected work
              <ArrowRight className="size-4" />
            </Link>
            <a
              href={links.github}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-full border border-line-2 px-5 py-2.5 text-sm text-ink-dim"
            >
              GitHub
              <ArrowUpRight className="size-4" />
            </a>
          </div>
        </div>

        {/* Telemetry — four figures in one hairline panel. It sheds as the
            screen gets shorter: the detail line first, then the second row,
            since the number and its label are what the block is for. */}
        <dl
          className="animate-rise grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line [@media(max-height:520px)]:grid-cols-4"
          style={{ animationDelay: "540ms" }}
        >
          {telemetry.map((t) => (
            <div key={t.label} className="glass border-0 px-4 py-[clamp(0.6rem,1.7svh,0.95rem)]">
              <dt className="label text-[0.58rem]">{t.label}</dt>
              <dd className="font-display mt-1.5 text-[clamp(1.5rem,7.2vw,2rem)] font-medium leading-none tracking-tight text-ink">
                {t.value}
              </dd>
              <p className="mt-1 hidden truncate text-[0.68rem] text-muted [@media(min-height:700px)]:block">
                {t.detail}
              </p>
            </div>
          ))}
        </dl>

        {/* Foot ------------------------------------------------------- */}
        <div className="flex items-end justify-between gap-4 border-t border-line pt-[clamp(0.8rem,2.2svh,1.4rem)]">
          <Link
            href="/lab"
            className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-muted transition-colors hover:text-accent"
          >
            $ open lab →
          </Link>
          {/* A vertical cue costs ~60px of column, which a short phone
              would rather spend on the composition — `is-optional` drops it
              under 700px of viewport height. */}
          <span className="scroll-cue is-optional text-[0.6rem]" aria-hidden="true">
            Scroll
            <span className="track" />
          </span>
        </div>
      </div>
    </section>
  );
}

function StageCard({
  project,
  label,
  left,
  top,
  delay,
  depth,
}: {
  project: CaseStudy;
  label: string;
  left: number;
  top: number;
  delay: number;
  depth: number;
}) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="par mask group absolute z-[4] block w-[calc(396*var(--u))] overflow-hidden rounded-[calc(26*var(--u))] border border-line bg-stage-2/78 p-[calc(26*var(--u))] backdrop-blur-xl transition-colors duration-500 hover:border-line-2"
      style={
        {
          left: `calc(${left} * var(--u))`,
          top: `calc(${top} * var(--u))`,
          "--d": `${delay}ms`,
          "--pd": depth,
          "--pr": 2.2,
          "--mr": "calc(26 * var(--u))",
        } as React.CSSProperties
      }
    >
      <div className="flex items-center justify-between">
        <span className="label text-[calc(9.5*var(--u))] text-accent">{label}</span>
        <ArrowUpRight className="size-[calc(16*var(--u))] text-faint transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
      </div>

      <h2 className="mt-[calc(14*var(--u))] font-display text-[calc(30*var(--u))] font-medium leading-none tracking-tight text-ink">
        {project.name}
      </h2>
      <p className="mt-[calc(12*var(--u))] text-[calc(13.5*var(--u))] leading-[calc(20*var(--u))] text-ink-dim">
        {project.summary}
      </p>

      <dl className="mt-[calc(20*var(--u))] flex gap-[calc(26*var(--u))]">
        {project.metrics.slice(0, 3).map((m) => (
          <div key={m.label}>
            <dd className="font-display text-[calc(19*var(--u))] font-medium leading-none tracking-tight text-ink">
              {m.value}
            </dd>
            <dt className="label mt-[calc(7*var(--u))] text-[calc(8.5*var(--u))] leading-tight">
              {m.label}
            </dt>
          </div>
        ))}
      </dl>
    </Link>
  );
}
