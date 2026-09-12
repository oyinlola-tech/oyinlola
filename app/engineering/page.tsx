import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { disciplines, navIndex } from "@/content/site";
import { work } from "@/content/work";

export const metadata: Metadata = pageMeta({
  title: "Engineering",
  description:
    "Backend, architecture, data, security and infrastructure — the five layers the work sits in, with the projects that prove each one.",
  path: "/engineering",
});

export default function EngineeringPage() {
  return (
    <>
      <PageHeader
        index={navIndex("/engineering")}
        label="Engineering"
        title="Five layers, one problem."
        lede={
          <>
            Software engineering, databases, distributed systems, data and security are not five
            careers — they are one problem viewed from five angles. This is where the work sits in
            each, and which project is the evidence.
          </>
        }
      />

      <section className="shell pb-24 lg:pb-32">
        <div className="space-y-4 lg:space-y-6">
          {disciplines.map((d, i) => (
            <Reveal key={d.id} delay={Math.min(i, 4) * 60}>
              <article
                id={d.id}
                className="scroll-mt-32 rounded-2xl border border-line bg-stage-2/60 p-7 transition-colors duration-500 hover:border-line-2 lg:p-10"
              >
                <div className="grid gap-8 md:grid-cols-12 md:gap-10">
                  <div className="md:col-span-4">
                    <p className="label text-accent">{d.lede}</p>
                    <h2 className="font-display mt-3 text-[clamp(1.6rem,3.2vw,2.2rem)] font-medium tracking-tight text-ink">
                      {d.title}
                    </h2>

                    <div className="mt-6">
                      <p className="label text-[0.6rem]">Evidence</p>
                      <ul className="mt-3 space-y-1.5">
                        {d.evidence.map((slug) => {
                          const p = work.find((w) => w.slug === slug);
                          if (!p) return null;
                          return (
                            <li key={slug}>
                              <Link
                                href={`/work/${slug}`}
                                className="link-wipe text-sm text-ink-dim transition-colors hover:text-accent"
                              >
                                {p.name}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>

                  <div className="md:col-span-8">
                    <p className="text-[1.0625rem] leading-relaxed text-ink-dim">{d.body}</p>
                    <ul className="mt-7 flex flex-wrap gap-2">
                      {d.items.map((item) => (
                        <li
                          key={item}
                          className="rounded-full border border-line px-3.5 py-2 font-mono text-[0.75rem] text-ink-dim transition-colors duration-300 hover:border-line-2 hover:text-ink"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={100}>
          <div className="mt-12 flex flex-wrap gap-3">
            <Link
              href="/work"
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[0.95rem] font-medium text-stage transition-colors duration-300 hover:bg-accent"
            >
              See it applied
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/lab"
              className="inline-flex items-center gap-2 rounded-full border border-line-2 px-6 py-3.5 text-[0.95rem] text-ink-dim transition-colors duration-300 hover:border-ink/30 hover:text-ink"
            >
              Open the lab
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
