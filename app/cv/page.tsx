import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import PrintButton from "@/components/cv/PrintButton";
import Reveal from "@/components/Reveal";
import { site, links, disciplines, navIndex } from "@/content/site";
import {
  cvMeta,
  summary,
  skills,
  roles,
  projects,
  cvEducation,
  certifications,
  development,
  philosophy,
} from "@/content/cv";

export const metadata: Metadata = pageMeta({
  title: "CV",
  description:
    `Curriculum vitae for ${site.name} — software engineer and backend developer. Go, Python and TypeScript; distributed systems, data engineering and application security.`,
  path: "/cv",
});

/* A section head that reads the same on screen and on paper. */
function Head({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="cv-rule mb-7 flex items-baseline gap-4 border-b border-line pb-3 print:mb-2.5 print:pb-1.5">
      <span className="label shrink-0 text-accent print:text-black">{n}</span>
      <h2 className="label text-ink print:text-black">{children}</h2>
    </div>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 space-y-2 print:mt-1.5 print:space-y-0.5">
      {items.map((p) => (
        <li
          key={p}
          className="relative pl-5 text-[0.92rem] leading-relaxed text-ink-dim before:absolute before:left-0 before:top-[0.62em] before:size-1 before:rounded-full before:bg-accent/70 print:text-[9.4pt] print:before:bg-black"
        >
          {p}
        </li>
      ))}
    </ul>
  );
}

export default function CvPage() {
  return (
    <div className="shell cv-doc pb-24 pt-36 sm:pt-44 lg:pb-32 lg:pt-52 print:pb-0 print:pt-0">
      {/* ── Masthead ─────────────────────────────────────────────── */}
      <header className="cv-block relative">
        {/* The drawing has two ink polarities: light for the screen, dark for
            paper — the same alpha, a different colour. */}
        <div className="pointer-events-none absolute right-0 top-32 hidden w-[9rem] lg:block print:top-0 print:block print:w-[26mm]">
          <div className="relative aspect-[3/4] w-full">
            <Image
              src="/portrait-sketch.webp"
              alt=""
              fill
              sizes="9rem"
              className="object-cover opacity-80 print:hidden"
            />
            <Image
              src="/portrait-sketch-ink.webp"
              alt=""
              fill
              sizes="26mm"
              className="hidden object-cover print:block"
            />
          </div>
        </div>

        <Reveal>
          <p className="label print-hide flex items-center gap-3">
            <span className="text-accent">{navIndex("/cv")}</span>
            <span className="h-px w-8 bg-line-2" />
            Curriculum vitae
          </p>
        </Reveal>

        <Reveal delay={60}>
          <h1 className="display mt-8 text-[clamp(2.4rem,6.5vw,4.6rem)] text-ink print:mt-0">
            {site.name}
          </h1>
        </Reveal>

        <Reveal delay={100}>
          <p className="mt-4 text-[1.05rem] text-accent print:mt-1 print:text-[11pt] print:text-black">
            {cvMeta.title}
          </p>
          <p className="cv-muted mt-1 text-sm text-muted print:text-[9pt]">{cvMeta.subtitle}</p>
        </Reveal>

        <Reveal delay={140}>
          <ul className="cv-muted mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[0.72rem] text-muted print:mt-3 print:text-[8.4pt]">
            <li>{site.location}</li>
            <li aria-hidden="true" className="text-faint">·</li>
            <li>
              <a href={`mailto:${site.email}`} className="link-wipe hover:text-accent">
                {site.email}
              </a>
            </li>
            <li aria-hidden="true" className="text-faint">·</li>
            <li>
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="link-wipe hover:text-accent">
                {site.phone}
              </a>
            </li>
            <li aria-hidden="true" className="text-faint">·</li>
            <li>
              <a href={links.site} className="link-wipe hover:text-accent">
                oyinlola.site
              </a>
            </li>
            <li aria-hidden="true" className="text-faint">·</li>
            <li>
              <a href={links.github} className="link-wipe hover:text-accent">
                github.com/oyinlola-tech
              </a>
            </li>
            <li aria-hidden="true" className="text-faint">·</li>
            <li>
              <a href={links.linkedin} className="link-wipe hover:text-accent">
                linkedin.com/in/oluwayemioyinlola
              </a>
            </li>
          </ul>
        </Reveal>

        <Reveal delay={180}>
          <div className="print-hide mt-10 flex flex-wrap gap-3">
            <PrintButton />
            <Link
              href="/work"
              className="inline-flex items-center gap-2 rounded-full border border-line-2 px-6 py-3.5 text-[0.95rem] text-ink-dim transition-colors duration-300 hover:border-ink/30 hover:text-ink"
            >
              Case studies
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-line-2 px-6 py-3.5 text-[0.95rem] text-ink-dim transition-colors duration-300 hover:border-ink/30 hover:text-ink"
            >
              Get in touch
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
          <p className="print-hide mt-4 font-mono text-[0.68rem] text-faint">
            Opens your print dialog — choose “Save as PDF”. Text stays selectable.
          </p>
        </Reveal>
      </header>

      {/* ── Summary ──────────────────────────────────────────────── */}
      <section className="cv-section mt-20 print:mt-5">
        <Head n="01">Profile</Head>
        <div className="max-w-4xl space-y-4">
          {summary.map((p, i) => (
            <p
              key={i}
              className={
                i === 0
                  ? "text-[1.08rem] leading-relaxed text-ink print:text-[10pt]"
                  : "text-[0.98rem] leading-relaxed text-ink-dim print:text-[9.4pt]"
              }
            >
              {p}
            </p>
          ))}
        </div>
      </section>

      {/* ── Competencies ─────────────────────────────────────────── */}
      <section className="cv-section mt-20 print:mt-5">
        <Head n="02">Core competencies</Head>
        <div className="grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-3 print:grid-cols-3 print:gap-y-2.5">
          {disciplines.map((d) => (
            <div key={d.id} className="cv-block">
              <h3 className="font-display text-base font-medium tracking-tight text-ink print:text-[10pt]">
                {d.title}
              </h3>
              <p className="cv-muted mt-1.5 text-[0.82rem] leading-relaxed text-muted print:text-[8.6pt]">
                {d.items.join(" · ")}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Skills ───────────────────────────────────────────────── */}
      <section className="cv-section mt-20 print:mt-5">
        <Head n="03">Technical skills</Head>
        <dl className="grid gap-x-10 gap-y-4 sm:grid-cols-2 print:gap-y-1">
          {skills.map((s) => (
            <div key={s.label} className="cv-block grid grid-cols-12 gap-3">
              <dt className="label col-span-4 pt-1 print:text-[8pt]">{s.label}</dt>
              <dd className="col-span-8 text-[0.86rem] leading-relaxed text-ink-dim print:text-[8.8pt]">
                {s.items}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ── Experience ───────────────────────────────────────────── */}
      <section className="cv-section mt-20 print:mt-5">
        <Head n="04">Experience</Head>
        <div className="space-y-12 print:space-y-3.5">
          {roles.map((r) => (
            <article key={r.org} className="cv-block grid gap-4 md:grid-cols-12 md:gap-8 print:gap-2">
              <div className="md:col-span-3">
                <p className="label print:text-[8pt]">{r.period}</p>
              </div>
              <div className="md:col-span-9">
                <h3 className="font-display text-xl font-medium tracking-tight text-ink print:text-[11pt]">
                  {r.title}
                </h3>
                <p className="mt-1 text-sm text-accent print:text-[9.4pt] print:text-black print:font-medium">
                  {r.org}
                </p>
                <p className="cv-muted mt-3 max-w-3xl text-[0.92rem] leading-relaxed text-muted print:text-[9pt]">
                  {r.blurb}
                </p>
                <Bullets items={r.points} />
                <p className="cv-muted mt-4 font-mono text-[0.7rem] leading-relaxed text-faint print:mt-2 print:text-[8pt]">
                  {r.tech}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Projects ─────────────────────────────────────────────── */}
      <section className="cv-section mt-20 print:mt-5">
        <Head n="05">Selected projects</Head>
        <div className="space-y-11 print:space-y-3">
          {projects.map((p) => (
            <article key={p.name} className="cv-block grid gap-4 md:grid-cols-12 md:gap-8 print:gap-2">
              <div className="md:col-span-3">
                <h3 className="font-display text-lg font-medium tracking-tight text-ink print:text-[10.5pt]">
                  {p.slug ? (
                    <Link href={`/work/${p.slug}`} className="cv-nolink hover:text-accent">
                      {p.name}
                    </Link>
                  ) : (
                    p.name
                  )}
                </h3>
                <p className="label mt-1.5 normal-case tracking-normal print:text-[8pt]">
                  {p.role}
                </p>
              </div>
              <div className="md:col-span-9">
                <p className="text-[0.95rem] leading-relaxed text-ink print:text-[9.2pt]">
                  {p.line}
                </p>
                <Bullets items={p.points} />
                <p className="cv-muted mt-4 font-mono text-[0.7rem] leading-relaxed text-faint print:mt-2 print:text-[8pt]">
                  {p.tech}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Education & certifications ───────────────────────────── */}
      <section className="cv-section mt-20 grid gap-14 md:grid-cols-2 md:gap-16 print:mt-5 print:gap-8">
        <div>
          <Head n="06">Education</Head>
          <dl className="space-y-6 print:space-y-2.5">
            {cvEducation.map((e) => (
              <div key={e.title + e.org} className="cv-block">
                <dt className="font-display text-base font-medium tracking-tight text-ink print:text-[10pt]">
                  {e.title}
                </dt>
                <dd className="mt-1 text-sm text-accent print:text-[9pt] print:text-black">
                  {e.org} · <span className="cv-muted text-muted">{e.period}</span>
                </dd>
                {e.note ? (
                  <dd className="cv-muted mt-2 text-[0.86rem] leading-relaxed text-muted print:text-[8.6pt]">
                    {e.note}
                  </dd>
                ) : null}
              </div>
            ))}
          </dl>
        </div>

        <div>
          <Head n="07">Certifications</Head>
          <dl className="space-y-6 print:space-y-2.5">
            {certifications.map((c) => (
              <div key={c.title} className="cv-block">
                <dt className="font-display text-base font-medium tracking-tight text-ink print:text-[10pt]">
                  {c.title}
                </dt>
                <dd className="mt-1 text-sm text-accent print:text-[9pt] print:text-black">
                  {c.org}
                </dd>
                <dd className="cv-muted mt-2 text-[0.86rem] leading-relaxed text-muted print:text-[8.6pt]">
                  {c.note}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Ongoing development ──────────────────────────────────── */}
      <section className="cv-section mt-20 print:mt-5">
        <Head n="08">Ongoing development</Head>
        <ul className="grid gap-x-10 gap-y-3 sm:grid-cols-2 print:grid-cols-2 print:gap-y-1.5">
          {development.map((d) => (
            <li
              key={d}
              className="relative pl-5 text-[0.9rem] leading-relaxed text-ink-dim before:absolute before:left-0 before:top-[0.62em] before:size-1 before:rounded-full before:bg-accent/70 print:text-[8.8pt] print:before:bg-black"
            >
              {d}
            </li>
          ))}
        </ul>
      </section>

      {/* ── Philosophy ───────────────────────────────────────────── */}
      <section className="cv-section mt-20 print:mt-5">
        <Head n="09">Engineering philosophy</Head>
        <div className="max-w-4xl space-y-4">
          {philosophy.map((p, i) => (
            <p
              key={i}
              className="text-[0.98rem] leading-relaxed text-ink-dim print:text-[9.2pt]"
            >
              {p}
            </p>
          ))}
        </div>
      </section>

      {/* Print-only footer */}
      <p className="cv-muted mt-16 hidden border-t border-line pt-3 font-mono text-[7.6pt] text-faint print:block">
        {site.name} · {site.email} · {site.phone} · oyinlola.site — updated {cvMeta.updated}
      </p>

      <div className="print-hide mt-20 flex flex-wrap gap-3 border-t border-line pt-10">
        <PrintButton />
        <a
          href={`mailto:${site.email}`}
          className="inline-flex items-center gap-2 rounded-full border border-line-2 px-6 py-3.5 text-[0.95rem] text-ink-dim transition-colors duration-300 hover:border-ink/30 hover:text-ink"
        >
          {site.email}
        </a>
      </div>
    </div>
  );
}
