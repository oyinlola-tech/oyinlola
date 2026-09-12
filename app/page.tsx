import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Hero from "@/components/hero/Hero";
import SectionHead from "@/components/SectionHead";
import Reveal from "@/components/Reveal";
import { FeatureRow } from "@/components/WorkCards";
import { work, workPosition } from "@/content/work";
import { disciplines, principles, site } from "@/content/site";
import Terminal from "@/components/terminal/Terminal";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: `${site.name} — ${site.role}`,
  description: site.description,
  path: "/",
  absoluteTitle: true,
});

const featured = work.filter((w) => w.featured);

export default function Home() {
  return (
    <>
      <Hero />

      {/* Selected work ------------------------------------------------ */}
      <section className="shell py-24 lg:py-36">
        <SectionHead
          index="01"
          label="Selected work"
          title={
            <>
              {featured.length} systems, and the
              <br className="hidden sm:block" /> decisions behind them.
            </>
          }
          lede="Each case study covers the constraint that shaped the architecture, the structure it produced, and the trade-offs I would defend in a review. Numbers come from the repositories themselves."
        />

        <div className="space-y-4 lg:space-y-6">
          {featured.map((project, i) => (
            <FeatureRow
              key={project.slug}
              project={project}
              index={workPosition[project.slug]}
              flip={i % 2 === 1}
            />
          ))}
        </div>

        <Reveal delay={120}>
          <Link
            href="/work"
            className="group mt-10 inline-flex items-center gap-2 rounded-full border border-line-2 px-6 py-3 text-sm text-ink-dim transition-colors duration-300 hover:border-ink/30 hover:text-ink"
          >
            All {work.length} case studies
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
      </section>

      {/* Practice ------------------------------------------------------ */}
      <section className="shell py-24 lg:py-36">
        <SectionHead
          index="02"
          label="How I work"
          title="Opinions I can defend."
          lede="Not preferences — positions I have paid for, in projects that are still running."
        />

        <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
          {principles.map((p, i) => (
            <Reveal key={p.title} delay={(i % 3) * 70}>
              <div className="h-full bg-stage-2/70 p-7 transition-colors duration-500 hover:bg-stage-3/70 lg:p-8">
                <span className="label text-accent">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-display mt-3 text-lg font-medium leading-snug tracking-tight text-ink">
                  {p.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Engineering ---------------------------------------------- */}
      <section className="shell py-24 lg:py-36">
        <SectionHead
          index="03"
          label="Engineering"
          title="Five layers, one problem."
          lede="Software engineering, databases, distributed systems, data and security are not five careers — they are one problem viewed from five angles."
        />

        <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
          {disciplines.map((d, i) => (
            <Reveal key={d.id} delay={(i % 3) * 70}>
              <Link
                href={`/engineering#${d.id}`}
                className="group flex h-full flex-col bg-stage-2/70 p-7 transition-colors duration-500 hover:bg-stage-3/70"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-lg font-medium tracking-tight text-ink">
                    {d.title}
                  </h3>
                  <ArrowUpRight className="size-4 shrink-0 text-faint transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                </div>
                <p className="label mt-2 normal-case tracking-normal text-accent">{d.lede}</p>
                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {d.items.slice(0, 6).map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-line px-2.5 py-1 font-mono text-[0.68rem] text-ink-dim"
                    >
                      {item}
                    </li>
                  ))}
                  {d.items.length > 6 ? (
                    <li className="px-2 py-1 font-mono text-[0.68rem] text-faint">
                      +{d.items.length - 6}
                    </li>
                  ) : null}
                </ul>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Terminal --------------------------------------------------- */}
      <section className="shell py-24 lg:py-36">
        <SectionHead
          index="04"
          label="Lab"
          title="Or just ask the shell."
          lede="Most of what I do starts in a terminal, so the portfolio has one. It runs over a filesystem generated from this site's own content — cat a case study, then open it."
        />
        <Reveal>
          <Terminal />
        </Reveal>
        <Reveal delay={80}>
          <Link
            href="/lab"
            className="group mt-10 inline-flex items-center gap-2 rounded-full border border-line-2 px-6 py-3 text-sm text-ink-dim transition-colors duration-300 hover:border-ink/30 hover:text-ink"
          >
            Full screen, and the experiments behind it
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
      </section>

      {/* CTA ----------------------------------------------------------- */}
      <section className="relative overflow-hidden py-24 lg:py-36">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(90% 62% at 50% 100%, rgba(255,176,103,0.10) 0%, transparent 66%)",
          }}
        />
        <div className="shell border-t border-line pt-10">
          <Reveal>
            <h2 className="display max-w-[15ch] text-[clamp(2.2rem,6vw,4.4rem)] text-ink">
              Let&rsquo;s build something that lasts.
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="mt-7 max-w-xl text-[1.0625rem] leading-relaxed text-ink-dim">
              Open to {site.availableFor.toLowerCase()} — full-time or contract, remote or hybrid.
            </p>
          </Reveal>
          <Reveal delay={140}>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[0.95rem] font-medium text-stage transition-colors duration-300 hover:bg-accent"
              >
                Get in touch
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-full border border-line-2 px-6 py-3.5 text-[0.95rem] text-ink-dim transition-colors duration-300 hover:border-ink/30 hover:text-ink"
              >
                More about me
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
