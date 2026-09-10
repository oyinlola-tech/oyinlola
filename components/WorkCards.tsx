import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CaseStudy } from "@/content/work";
import ProjectSigil from "./ProjectSigil";
import Reveal from "./Reveal";

export function StatusChip({ status }: { status: CaseStudy["status"] }) {
  if (!status) return null;
  const live = status === "Live";
  return (
    <span
      className={[
        "label inline-flex items-center gap-1.5 text-[0.6rem]",
        live ? "text-signal" : "text-muted",
      ].join(" ")}
    >
      {live ? <span className="size-1.5 rounded-full bg-signal" /> : null}
      {status}
    </span>
  );
}

/** Full-width row — used for the projects that carry the most weight. */
export function FeatureRow({
  project,
  index,
  flip,
}: {
  project: CaseStudy;
  index: number;
  flip?: boolean;
}) {
  return (
    <Reveal delay={Math.min(index, 4) * 60}>
      <Link
        href={`/work/${project.slug}`}
        className="group relative grid overflow-hidden rounded-2xl border border-line bg-stage-2/60 transition-colors duration-500 hover:border-line-2 lg:grid-cols-12"
      >
        <div
          className={[
            "relative h-44 overflow-hidden bg-stage-3/40 sm:h-56 lg:col-span-5 lg:h-auto lg:min-h-[19rem]",
            flip ? "lg:order-2" : "",
          ].join(" ")}
        >
          <ProjectSigil
            slug={project.slug}
            hue={project.hue}
            className="absolute inset-0 size-full scale-110 opacity-80 transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.18]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stage-2/90 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-stage-2/80" />
          <span className="label absolute left-5 top-5 text-[0.6rem] text-ink-dim">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <div
          className={[
            "flex flex-col justify-between gap-8 p-6 sm:p-8 lg:col-span-7 lg:p-10",
            flip ? "lg:order-1" : "",
          ].join(" ")}
        >
          <div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="label text-accent">{project.kind}</span>
              <span className="label">{project.year}</span>
              <StatusChip status={project.status} />
            </div>

            <h3 className="display mt-4 flex items-center gap-3 text-[clamp(1.75rem,3.4vw,2.6rem)] text-ink">
              {project.name}
              <ArrowUpRight className="size-5 shrink-0 text-faint transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
            </h3>

            <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-ink-dim">
              {project.summary}
            </p>
          </div>

          <div className="space-y-6">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
              {project.metrics.map((m) => (
                <div key={m.label}>
                  <dd className="font-display text-xl font-medium tracking-tight text-ink">
                    {m.value}
                  </dd>
                  <dt className="label mt-1 text-[0.575rem] leading-tight">{m.label}</dt>
                </div>
              ))}
            </dl>

            <ul className="flex flex-wrap gap-1.5">
              {project.stack.slice(0, 7).map((tech) => (
                <li
                  key={tech}
                  className="rounded-full border border-line px-2.5 py-1 font-mono text-[0.65rem] text-muted"
                >
                  {tech}
                </li>
              ))}
              {project.stack.length > 7 ? (
                <li className="rounded-full px-2 py-1 font-mono text-[0.65rem] text-faint">
                  +{project.stack.length - 7}
                </li>
              ) : null}
            </ul>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}

/** Compact card — for the long tail on the Work index. */
export function CompactCard({ project, index }: { project: CaseStudy; index: number }) {
  return (
    <Reveal as="li" delay={(index % 3) * 70}>
      <Link
        href={`/work/${project.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-stage-2/60 transition-colors duration-500 hover:border-line-2"
      >
        <div className="relative h-28 overflow-hidden bg-stage-3/40">
          <ProjectSigil
            slug={project.slug}
            hue={project.hue}
            dense
            className="absolute inset-0 size-full scale-110 opacity-70 transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.18]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stage-2 via-stage-2/30 to-transparent" />
          <span className="label absolute left-5 top-4 text-[0.6rem] text-ink-dim">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="label text-accent">{project.kind}</span>
            <StatusChip status={project.status} />
          </div>

          <h3 className="display mt-3 flex items-center gap-2 text-2xl text-ink">
            {project.name}
            <ArrowUpRight className="size-4 shrink-0 text-faint transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
          </h3>

          <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{project.summary}</p>

          <ul className="mt-5 flex flex-wrap gap-1.5">
            {project.stack.slice(0, 4).map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-line px-2.5 py-1 font-mono text-[0.65rem] text-muted"
              >
                {tech}
              </li>
            ))}
          </ul>
        </div>
      </Link>
    </Reveal>
  );
}
