import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import DownloadButton from "@/components/cv/DownloadButton";
import Reveal from "@/components/Reveal";
import { site, links, disciplines, navIndex } from "@/content/site";
import { workBySlug, workCount } from "@/content/work";
import {
  cvMeta,
  summary,
  skills,
  softSkills,
  roles,
  projects,
  cvEducation,
  certifications,
  development,
  philosophy,
} from "@/content/cv";

export const metadata: Metadata = pageMeta({
  // Absolute, because the browser's PDF writer takes the document title as
  // the file's title — and an ATS reads that field.
  title: `${site.name} — CV`,
  absoluteTitle: true,
  description:
    `Curriculum vitae for ${site.name} — software engineer and backend developer in ${site.location}. Go, Python and TypeScript; distributed systems, data engineering and application security.`,
  path: "/cv",
});

/** "https://www.github.com/x" → "github.com/x": what a reader would type. */
const bare = (href: string) => href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

/**
 * Contact lines, each with a visible label. An ATS pulls the email, phone and
 * profile URLs out by pattern, so they are printed in full as text, never
 * hidden behind an icon or a word like "GitHub".
 */
const contact: { label: string; value: string; href?: string }[] = [
  { label: "Location", value: `${site.location} · ${site.timezone}` },
  { label: "Email", value: site.email, href: `mailto:${site.email}` },
  { label: "Phone", value: site.phone, href: `tel:${site.phone.replace(/\s/g, "")}` },
  { label: "Portfolio", value: bare(links.site), href: links.site },
  { label: "GitHub", value: bare(links.github), href: links.github },
  { label: "LinkedIn", value: bare(links.linkedin), href: links.linkedin },
];

/*
 * Section heads use the names an applicant-tracking system looks for
 * ("Professional Experience", "Education", "Skills"). The number is
 * decoration for the screen and is dropped on paper.
 */
function Head({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="cv-rule mb-7 flex items-baseline gap-4 border-b border-line pb-3">
      <span className="cv-num label shrink-0 text-accent" aria-hidden="true">
        {n}
      </span>
      <h2 className="label text-ink">{children}</h2>
    </div>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="cv-bullets mt-4 space-y-2">
      {items.map((p) => (
        <li
          key={p}
          className="relative pl-5 text-[0.92rem] leading-relaxed text-ink-dim before:absolute before:left-0 before:top-[0.62em] before:size-1 before:rounded-full before:bg-accent/70"
        >
          {p}
        </li>
      ))}
    </ul>
  );
}

export default function CvPage() {
  return (
    <div className="shell cv-doc pb-24 pt-36 sm:pt-44 lg:pb-32 lg:pt-52">
      {/* ── Paper masthead ───────────────────────────────────────────
          Only exists on the PDF: a dark band carrying the photograph and
          every contact line, so the page reads as designed rather than as
          a screen printed out. */}
      <header className="cv-phead hidden">
        <div className="cv-phead__photo">
          <Image src="/cv-headshot.webp" alt={`Photograph of ${site.name}`} width={560} height={700} priority />
        </div>
        <div className="cv-phead__body">
          <h1 className="cv-phead__name">{site.name}</h1>
          <p className="cv-phead__title">{cvMeta.title}</p>
          <p className="cv-phead__sub">{cvMeta.subtitle}</p>
          <ul className="cv-phead__contact">
            {contact.map((c) => (
              <li key={c.label}>
                <span className="cv-phead__label">{c.label}:</span>{" "}
                {c.href ? <a href={c.href}>{c.value}</a> : c.value}
              </li>
            ))}
          </ul>
        </div>
      </header>

      {/* ── Screen masthead ──────────────────────────────────────── */}
      <header className="cv-block print-hide relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <Reveal>
            <p className="label flex items-center gap-3">
              <span className="text-accent">{navIndex("/cv")}</span>
              <span className="h-px w-8 bg-line-2" />
              Curriculum vitae
            </p>
          </Reveal>

          <Reveal delay={60}>
            <h1 className="display mt-8 text-[clamp(2.4rem,6.5vw,4.6rem)] text-ink">{site.name}</h1>
          </Reveal>

          <Reveal delay={100}>
            <p className="mt-4 text-[1.05rem] text-accent">{cvMeta.title}</p>
            <p className="mt-1 text-sm text-muted">{cvMeta.subtitle}</p>
          </Reveal>

          <Reveal delay={140}>
            <dl className="mt-7 grid max-w-3xl gap-x-8 gap-y-2.5 font-mono text-[0.74rem] sm:grid-cols-2">
              {contact.map((c) => (
                <div key={c.label} className="flex gap-3">
                  <dt className="w-20 shrink-0 text-faint">{c.label}</dt>
                  <dd className="min-w-0 break-words text-ink-dim">
                    {c.href ? (
                      <a href={c.href} className="link-wipe hover:text-accent">
                        {c.value}
                      </a>
                    ) : (
                      c.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={180}>
            <div className="mt-10 flex flex-wrap gap-3">
              <DownloadButton />
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
            <p className="mt-4 font-mono text-[0.68rem] text-faint">
              A4 PDF · single-column and ATS-readable · text stays selectable, links stay live.
            </p>
          </Reveal>
        </div>

        <Reveal delay={120} className="order-first lg:order-none">
          <div className="relative w-36 overflow-hidden rounded-[1.75rem] border border-line-2 bg-[radial-gradient(120%_90%_at_50%_0%,rgba(255,176,103,0.22),rgba(23,27,36,0.9)_62%)] sm:w-44 lg:w-60">
            <Image
              src="/cv-headshot.webp"
              alt={`Photograph of ${site.name}`}
              width={560}
              height={700}
              sizes="(min-width: 1024px) 15rem, 13rem"
              priority
              className="h-auto w-full"
            />
          </div>
        </Reveal>
      </header>

      {/* ── Summary ──────────────────────────────────────────────── */}
      <section className="cv-section mt-20">
        <Head n="01">Professional summary</Head>
        <div className="max-w-4xl space-y-4">
          {summary.map((p, i) => (
            <p
              key={i}
              className={
                i === 0
                  ? "cv-lede text-[1.08rem] leading-relaxed text-ink"
                  : "text-[0.98rem] leading-relaxed text-ink-dim"
              }
            >
              {p}
            </p>
          ))}
        </div>
      </section>

      {/* ── Competencies (screen only — the skills list below carries the
            same keywords on paper without repeating them) ────────── */}
      <section className="cv-section print-hide mt-20">
        <Head n="02">Core competencies</Head>
        <div className="grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
          {disciplines.map((d) => (
            <div key={d.id} className="cv-block">
              <h3 className="font-display text-base font-medium tracking-tight text-ink">{d.title}</h3>
              <p className="mt-1.5 text-[0.82rem] leading-relaxed text-muted">{d.items.join(" · ")}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Skills ───────────────────────────────────────────────── */}
      <section className="cv-section mt-20">
        <Head n="03">Technical skills</Head>
        <dl className="cv-skills grid gap-x-10 gap-y-4 sm:grid-cols-2">
          {skills.map((s) => (
            <div key={s.label} className="cv-block grid grid-cols-12 gap-3">
              <dt className="label col-span-4 pt-1">{s.label}</dt>
              <dd className="col-span-8 text-[0.86rem] leading-relaxed text-ink-dim">{s.items}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ── Soft skills ──────────────────────────────────────────── */}
      <section className="cv-section mt-20">
        <Head n="04">Soft skills</Head>
        <dl className="cv-skills grid gap-x-10 gap-y-5 sm:grid-cols-2">
          {softSkills.map((s) => (
            <div key={s.label} className="cv-block grid grid-cols-12 gap-3">
              <dt className="col-span-4 pt-0.5 font-display text-[0.92rem] font-medium tracking-tight text-ink">
                {s.label}
              </dt>
              <dd className="col-span-8 text-[0.86rem] leading-relaxed text-ink-dim">{s.detail}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ── Experience ───────────────────────────────────────────── */}
      <section className="cv-section mt-20">
        <Head n="05">Professional experience</Head>
        <div className="space-y-12">
          {roles.map((r) => (
            <article key={r.org} className="cv-block cv-entry grid gap-4 md:grid-cols-12 md:gap-8">
              <div className="md:col-span-3">
                <p className="cv-period label">{r.period}</p>
              </div>
              <div className="md:col-span-9">
                <h3 className="font-display text-xl font-medium tracking-tight text-ink">{r.title}</h3>
                <p className="cv-org mt-1 text-sm text-accent">
                  {r.org}
                  {r.location ? ` · ${r.location}` : ""}
                </p>
                <p className="cv-blurb mt-3 max-w-3xl text-[0.92rem] leading-relaxed text-muted">{r.blurb}</p>
                <Bullets items={r.points} />
                <p className="cv-tech mt-4 font-mono text-[0.7rem] leading-relaxed text-faint">
                  <span className="cv-tech__label">Stack: </span>
                  {r.tech}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Projects ─────────────────────────────────────────────── */}
      <section className="cv-section mt-20">
        <Head n="06">Selected projects</Head>
        <div className="space-y-11">
          {projects.map((p) => {
            const refs = p.slug ? (workBySlug[p.slug]?.links ?? []) : [];
            return (
              <article
                key={p.name}
                className={`cv-block cv-entry grid gap-4 md:grid-cols-12 md:gap-8${p.paper === false ? " print-hide" : ""}`}
              >
                <div className="md:col-span-3">
                  <p className="cv-period label normal-case tracking-normal">{p.role}</p>
                </div>
                <div className="md:col-span-9">
                  <h3 className="font-display text-lg font-medium tracking-tight text-ink">
                    {p.slug ? (
                      <Link href={`/work/${p.slug}`} className="hover:text-accent">
                        {p.name}
                      </Link>
                    ) : (
                      p.name
                    )}
                  </h3>
                  <p className="cv-line mt-2 text-[0.95rem] leading-relaxed text-ink">{p.line}</p>
                  <Bullets items={p.points} />
                  <p className="cv-tech mt-4 font-mono text-[0.7rem] leading-relaxed text-faint">
                    <span className="cv-tech__label">Stack: </span>
                    {p.tech}
                  </p>
                  {refs.length ? (
                    <p className="cv-links mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[0.7rem] text-muted">
                      {refs.map((l) => (
                        <span key={l.href}>
                          {l.label}:{" "}
                          <a href={l.href} className="link-wipe text-ink-dim hover:text-accent">
                            {bare(l.href)}
                          </a>
                        </span>
                      ))}
                    </p>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
        <p className="cv-more hidden">
          All {workCount} case studies, with architecture and trade-offs:{" "}
          <a href={`${links.site}/work`}>{bare(links.site)}/work</a>
        </p>
      </section>

      {/* ── Education & certifications ───────────────────────────── */}
      <section className="cv-section mt-20 grid gap-14 md:grid-cols-2 md:gap-16">
        <div>
          <Head n="07">Education</Head>
          <dl className="space-y-6">
            {cvEducation.map((e) => (
              <div key={e.title + e.org} className="cv-block">
                <dt className="font-display text-base font-medium tracking-tight text-ink">{e.title}</dt>
                <dd className="cv-org mt-1 text-sm text-accent">
                  {e.org} · <span className="text-muted">{e.period}</span>
                </dd>
                {e.note ? (
                  <dd className="cv-blurb mt-2 text-[0.86rem] leading-relaxed text-muted">{e.note}</dd>
                ) : null}
              </div>
            ))}
          </dl>
        </div>

        <div>
          <Head n="08">Certifications</Head>
          <dl className="cv-certs space-y-6">
            {certifications.map((c) => (
              <div key={c.title} className="cv-block">
                <dt className="font-display text-base font-medium tracking-tight text-ink">{c.title}</dt>
                <dd className="cv-org mt-1 text-sm text-accent">{c.org}</dd>
                <dd className="cv-blurb mt-2 text-[0.86rem] leading-relaxed text-muted">{c.note}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Ongoing development (screen only — the summary's last
            paragraph says the same on paper) ───────────────────────── */}
      <section className="cv-section print-hide mt-20">
        <Head n="09">Professional development</Head>
        <ul className="cv-dev grid gap-x-10 gap-y-3 sm:grid-cols-2">
          {development.map((d) => (
            <li
              key={d}
              className="relative pl-5 text-[0.9rem] leading-relaxed text-ink-dim before:absolute before:left-0 before:top-[0.62em] before:size-1 before:rounded-full before:bg-accent/70"
            >
              {d}
            </li>
          ))}
        </ul>
      </section>

      {/* ── Philosophy (screen only — on paper the summary already says
            this, and a CV is judged partly on its length) ──────────── */}
      <section className="cv-section print-hide mt-20">
        <Head n="10">Engineering philosophy</Head>
        <div className="max-w-4xl space-y-4">
          {philosophy.map((p, i) => (
            <p key={i} className="text-[0.98rem] leading-relaxed text-ink-dim">
              {p}
            </p>
          ))}
        </div>
      </section>

      <div className="print-hide mt-20 flex flex-wrap gap-3 border-t border-line pt-10">
        <DownloadButton />
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
