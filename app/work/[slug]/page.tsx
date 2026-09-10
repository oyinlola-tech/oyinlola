import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { work, workBySlug, type CaseStudy } from "@/content/work";
import { pageMeta } from "@/lib/seo";
import ProjectSigil from "@/components/ProjectSigil";
import Reveal from "@/components/Reveal";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return work.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = workBySlug[slug];
  if (!project) return {};

  return pageMeta({
    title: `${project.name} — ${project.kind}`,
    description: project.summary,
    path: `/work/${project.slug}`,
    type: "article",
  });
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const project = workBySlug[slug];
  if (!project) notFound();

  const idx = work.findIndex((w) => w.slug === slug);
  const next = work[(idx + 1) % work.length];

  /* The rail paints its dividers with a background showing through 1px
     gaps, so an unfilled track reads as an empty box rather than as
     nothing. Projects that carry no status get a three-column rail
     instead of a four-column one with a hole in it. */
  const meta: [string, string][] = [
    ["Role", project.role],
    ["Year", project.year],
    ...(project.status ? ([["Status", project.status]] as [string, string][]) : []),
    ["Type", project.kind],
  ];

  return (
    <article>
      <Banner project={project} index={idx} />

      <div className="shell">
        {/* Meta rail ---------------------------------------------------- */}
        <Reveal>
          <dl
            className={`grid gap-px overflow-hidden rounded-2xl border border-line bg-line ${
              meta.length === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-3"
            }`}
          >
            {meta.map(([k, v]) => (
              <div key={k} className="bg-stage-2/70 px-6 py-5">
                <dt className="label">{k}</dt>
                <dd className="mt-2 text-sm text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        {project.links.length ? (
          <Reveal delay={60}>
            <div className="mt-6 flex flex-wrap gap-3">
              {project.links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group inline-flex items-center gap-2 rounded-full border border-line-2 px-5 py-2.5 text-sm text-ink-dim transition-colors duration-300 hover:border-ink/30 hover:text-ink"
                >
                  {l.label}
                  <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              ))}
            </div>
          </Reveal>
        ) : null}

        {/* Overview ------------------------------------------------------ */}
        <Section index="01" label="Overview">
          <div className="space-y-6">
            {project.overview.map((p, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? "text-[1.25rem] leading-relaxed text-ink"
                    : "text-[1.0625rem] leading-relaxed text-ink-dim"
                }
              >
                {p}
              </p>
            ))}
          </div>
        </Section>

        {/* Problem ------------------------------------------------------- */}
        <Section index="02" label="The problem">
          <div className="space-y-6">
            {project.problem.map((p, i) => (
              <p key={i} className="text-[1.0625rem] leading-relaxed text-ink-dim">
                {p}
              </p>
            ))}
          </div>
        </Section>

        {/* Architecture -------------------------------------------------- */}
        <Section index="03" label="Architecture">
          <ol className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line">
            {project.architecture.map((block, i) => (
              <Reveal key={block.title} as="li" delay={Math.min(i, 4) * 50}>
                <div className="grid gap-4 bg-stage-2/70 p-7 transition-colors duration-500 hover:bg-stage-3/70 md:grid-cols-12 md:gap-8 lg:p-9">
                  <div className="flex items-baseline gap-3 md:col-span-4">
                    <span className="label text-accent">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="font-display text-lg font-medium leading-snug tracking-tight text-ink">
                      {block.title}
                    </h3>
                  </div>
                  <p className="text-[0.95rem] leading-relaxed text-ink-dim md:col-span-8">
                    {block.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </Section>

        {/* Decisions ----------------------------------------------------- */}
        <Section index="04" label="Key decisions">
          <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2">
            {project.decisions.map((d, i) => (
              <Reveal key={d.title} as="div" delay={(i % 2) * 60}>
                <div className="h-full bg-stage-2/70 p-7 lg:p-8">
                  <span className="label text-accent">Decision {String(i + 1).padStart(2, "0")}</span>
                  <h3 className="font-display mt-3 text-lg font-medium leading-snug tracking-tight text-ink">
                    {d.title}
                  </h3>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{d.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* Stack --------------------------------------------------------- */}
        <Section index="05" label="Stack">
          <ul className="flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-line px-4 py-2 font-mono text-[0.78rem] text-ink-dim transition-colors duration-300 hover:border-line-2 hover:text-ink"
              >
                {tech}
              </li>
            ))}
          </ul>
        </Section>
      </div>

      {/* Next --------------------------------------------------------- */}
      <div className="shell pb-28 pt-20 lg:pb-36">
        <Link
          href={`/work/${next.slug}`}
          className="group relative flex flex-col gap-6 overflow-hidden rounded-2xl border border-line bg-stage-2/60 p-8 transition-colors duration-500 hover:border-line-2 sm:flex-row sm:items-end sm:justify-between lg:p-12"
        >
          <ProjectSigil
            slug={next.slug}
            hue={next.hue}
            dense
            className="pointer-events-none absolute inset-0 size-full opacity-25 transition-opacity duration-700 group-hover:opacity-40"
          />
          <div className="relative">
            <span className="label">Next case study</span>
            <p className="display mt-3 text-[clamp(1.9rem,4.5vw,3rem)] text-ink">{next.name}</p>
            <p className="label mt-3 text-accent">{next.kind}</p>
          </div>
          <ArrowRight className="relative size-7 shrink-0 text-faint transition-all duration-500 group-hover:translate-x-1 group-hover:text-accent" />
        </Link>
      </div>
    </article>
  );
}

function Banner({ project, index }: { project: CaseStudy; index: number }) {
  return (
    <header className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <ProjectSigil
          slug={project.slug}
          hue={project.hue}
          variant="banner"
          className="absolute inset-0 size-full opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stage via-stage/80 to-stage/40" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-stage to-transparent" />
      </div>

      <div className="shell pb-16 pt-32 sm:pt-40 lg:pb-24 lg:pt-48">
        <Link
          href="/work"
          className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
          All work
        </Link>

        <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="label text-accent">{String(index + 1).padStart(2, "0")}</span>
          <span className="label">{project.kind}</span>
          <span className="label">{project.year}</span>
        </div>

        <h1 className="display mt-5 text-[clamp(2.8rem,9vw,7rem)] text-ink">{project.name}</h1>

        <p className="mt-8 max-w-3xl text-pretty text-[1.0625rem] leading-relaxed text-ink-dim sm:text-[1.15rem]">
          {project.summary}
        </p>

        <dl className="mt-12 flex flex-wrap gap-x-12 gap-y-6">
          {project.metrics.map((m) => (
            <div key={m.label}>
              <dd className="font-display text-[2rem] font-medium leading-none tracking-tight text-ink">
                {m.value}
              </dd>
              <dt className="label mt-2">{m.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </header>
  );
}

function Section({
  index,
  label,
  children,
}: {
  index: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid gap-8 border-t border-line py-16 md:grid-cols-12 md:gap-10 lg:py-20">
      <Reveal className="md:col-span-3">
        <h2 className="label flex items-center gap-3 md:sticky md:top-28">
          <span className="text-accent">{index}</span>
          <span className="h-px w-6 bg-line-2" />
          {label}
        </h2>
      </Reveal>
      <Reveal delay={60} className="md:col-span-9">
        {children}
      </Reveal>
    </section>
  );
}
