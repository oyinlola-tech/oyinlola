import type { Metadata } from "next";
import Link from "next/link";
import Portrait from "@/components/portrait/Portrait";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import {
  site,
  links,
  experience,
  principles,
  education,
  aboutBody,
} from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Oluwayemi Oyinlola Michael — software engineer in Nigeria. Backend systems, developer tools and data engineering. Background, education and how I work.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        index="02"
        label="About"
        title="I build the parts you don't see."
        lede={<>{site.positioning}</>}
      />

      <section className="shell pb-24 lg:pb-32">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Portrait + facts */}
          <Reveal className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <Portrait
                slug="portrait"
                alt="Oluwayemi Oyinlola Michael, drawn as a line study"
                className="w-full max-w-[22rem]"
              />

              <dl className="mt-8 max-w-[22rem] divide-y divide-line border-y border-line">
                {[
                  ["Based in", site.location],
                  ["Timezone", site.timezone],
                  ["Open to", site.availableFor],
                  ["Email", site.email],
                  ["Phone", site.phone],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-4 py-3">
                    <dt className="label w-20 shrink-0 pt-0.5">{k}</dt>
                    <dd className="break-words text-sm leading-relaxed text-ink-dim">{v}</dd>
                  </div>
                ))}
              </dl>

              <Link
                href="/cv"
                className="group mt-6 inline-flex items-center gap-2 rounded-full border border-line-2 px-5 py-2.5 text-sm text-ink-dim transition-colors hover:border-ink/30 hover:text-ink"
              >
                Full CV
                <ArrowRight className="size-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </Reveal>

          {/* Narrative */}
          <div className="lg:col-span-8">
            <Reveal>
              <div className="space-y-6 text-[1.0625rem] leading-relaxed text-ink-dim">
                {aboutBody.map((para, i) => (
                  <p key={i} className={i === 0 ? "text-[1.25rem] leading-relaxed text-ink" : ""}>
                    {para}
                  </p>
                ))}
              </div>
            </Reveal>

            {/* Experience */}
            <Reveal delay={80}>
              <h2 className="display mt-16 text-[clamp(1.7rem,3.6vw,2.4rem)] text-ink">
                Experience
              </h2>
            </Reveal>

            <ol className="mt-8 border-l border-line">
              {experience.map((role, i) => (
                <Reveal key={role.org} as="li" delay={i * 70}>
                  <div className="relative pb-10 pl-8">
                    <span
                      className={[
                        "absolute -left-[4.5px] top-1.5 size-2 rounded-full",
                        role.current ? "bg-accent" : "bg-stage-4 ring-1 ring-line-2",
                      ].join(" ")}
                    />
                    <p className="label">{role.period}</p>
                    <h3 className="font-display mt-2 text-xl font-medium tracking-tight text-ink">
                      {role.title}
                    </h3>
                    <p className="mt-1 text-sm text-accent">{role.org}</p>
                    <ul className="mt-4 space-y-2">
                      {role.points.map((p) => (
                        <li
                          key={p}
                          className="relative pl-4 text-sm leading-relaxed text-muted before:absolute before:left-0 before:top-[0.6em] before:size-1 before:rounded-full before:bg-faint"
                        >
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </ol>

            {/* Education */}
            <Reveal delay={80}>
              <h2 className="display mt-4 text-[clamp(1.7rem,3.6vw,2.4rem)] text-ink">Education</h2>
            </Reveal>

            <dl className="mt-8 divide-y divide-line border-y border-line">
              {education.map((e, i) => (
                <Reveal key={e.title + e.org} delay={i * 60}>
                  <div className="grid gap-2 py-5 sm:grid-cols-12 sm:gap-6">
                    <dt className="label sm:col-span-3 sm:pt-1">{e.period}</dt>
                    <dd className="sm:col-span-9">
                      <p className="font-display text-lg font-medium tracking-tight text-ink">
                        {e.title}
                      </p>
                      <p className="mt-1 text-sm text-accent">{e.org}</p>
                      {e.note ? (
                        <p className="mt-2 text-sm leading-relaxed text-muted">{e.note}</p>
                      ) : null}
                    </dd>
                  </div>
                </Reveal>
              ))}
            </dl>

            {/* Principles */}
            <Reveal delay={80}>
              <h2 className="display mt-8 text-[clamp(1.7rem,3.6vw,2.4rem)] text-ink">
                How I work
              </h2>
            </Reveal>

            <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
              {principles.map((p, i) => (
                <Reveal key={p.title} delay={(i % 2) * 60}>
                  <div className="h-full bg-stage-2/70 p-7">
                    <span className="label text-accent">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="font-display mt-3 text-lg font-medium leading-snug tracking-tight text-ink">
                      {p.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{p.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={100}>
              <Link
                href="/work"
                className="group mt-12 inline-flex items-center gap-2 rounded-full border border-line-2 px-6 py-3 text-sm text-ink-dim transition-colors hover:border-ink/30 hover:text-ink"
              >
                See the work
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
