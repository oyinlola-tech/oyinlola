import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import Terminal from "@/components/terminal/Terminal";
import { experiments } from "@/content/lab";

export const metadata: Metadata = pageMeta({
  title: "Lab",
  description:
    "An interactive shell over the whole portfolio, plus the experiments — framework research, CLI tooling, agent evaluation and rendering.",
  path: "/lab",
});

const STATUS_TONE: Record<string, string> = {
  Running: "text-signal",
  Shipped: "text-ink-dim",
  Parked: "text-faint",
};

export default function LabPage() {
  return (
    <>
      <PageHeader
        index="03"
        label="Lab"
        title="A shell, and the things it was built to answer."
        lede={
          <>
            Most of what I do starts in a terminal, so the portfolio has one. It is a real shell
            over a filesystem generated from this site&rsquo;s own content — <code className="rounded bg-stage-3 px-1.5 py-0.5 font-mono text-[0.85em] text-accent">cat work/kolo.md</code>{" "}
            reads the case study, <code className="rounded bg-stage-3 px-1.5 py-0.5 font-mono text-[0.85em] text-accent">open kolo</code> takes you to it.
          </>
        }
      />

      <section className="shell pb-24 lg:pb-32">
        <Reveal>
          <Terminal />
        </Reveal>
        <Reveal delay={80}>
          <p className="mt-4 font-mono text-[0.7rem] text-faint">
            ↑ ↓ history · Tab completion · Ctrl+L clear · try{" "}
            <span className="text-muted">neofetch</span>,{" "}
            <span className="text-muted">tree</span>,{" "}
            <span className="text-muted">sudo rm -rf /</span>
          </p>
        </Reveal>
      </section>

      {/* Experiments -------------------------------------------------- */}
      <section className="shell border-t border-line py-20 lg:py-28">
        <Reveal>
          <p className="label flex items-center gap-3">
            <span className="text-accent">04</span>
            <span className="h-px w-8 bg-line-2" />
            Experiments
          </p>
        </Reveal>
        <Reveal delay={60}>
          <h2 className="display mt-8 max-w-[18ch] text-[clamp(2rem,5vw,3.2rem)] text-ink">
            Built to answer a question.
          </h2>
        </Reveal>

        <ul className="mt-14 space-y-4 lg:space-y-5">
          {experiments.map((x, i) => (
            <Reveal key={x.title} as="li" delay={Math.min(i, 4) * 50}>
              <article className="group grid gap-6 rounded-2xl border border-line bg-stage-2/60 p-7 transition-colors duration-500 hover:border-line-2 md:grid-cols-12 md:gap-10 lg:p-9">
                <div className="md:col-span-4">
                  <div className="flex items-center gap-3">
                    <span className={`label text-[0.6rem] ${STATUS_TONE[x.status]}`}>
                      {x.status === "Running" ? (
                        <span className="mr-1.5 inline-block size-1.5 rounded-full bg-signal align-middle" />
                      ) : null}
                      {x.status}
                    </span>
                  </div>
                  <h3 className="font-display mt-3 text-xl font-medium leading-snug tracking-tight text-ink">
                    {x.href ? (
                      <Link href={x.href} className="inline-flex items-start gap-2 hover:text-accent">
                        {x.title}
                        <ArrowUpRight className="mt-1 size-4 shrink-0 text-faint transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                      </Link>
                    ) : (
                      x.title
                    )}
                  </h3>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {x.tags.map((t) => (
                      <li
                        key={t}
                        className="rounded-full border border-line px-2.5 py-1 font-mono text-[0.65rem] text-muted"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="md:col-span-8">
                  <p className="border-l-2 border-accent/40 pl-4 text-[1rem] italic leading-relaxed text-ink">
                    {x.question}
                  </p>
                  <p className="mt-5 text-[0.95rem] leading-relaxed text-ink-dim">{x.body}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      </section>
    </>
  );
}
