import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { ArrowUpRight } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { FeatureRow, CompactCard } from "@/components/WorkCards";
import { work, categories, openSource, workCount, workCountWord } from "@/content/work";
import { links } from "@/content/site";

export const metadata: Metadata = pageMeta({
  title: "Work",
  description:
    `${workCount} case studies — commerce, logistics, communication, learning, security and developer tooling — with the architecture and trade-offs behind each.`,
  path: "/work",
});

const LANG_DOT: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f0db4f",
  Python: "#3776ab",
  Go: "#00add8",
  HTML: "#e34c26",
  CSS: "#563d7c",
};

export default function WorkPage() {
  const featured = work.filter((w) => w.featured);
  const rest = work.filter((w) => !w.featured);

  return (
    <>
      <PageHeader
        index="01"
        label="Work"
        title={`${workCountWord} systems, in full.`}
        lede={
          <>
            Every project here has a case study — the constraint that shaped it, the architecture it
            produced, and the decisions I would defend in a review. Counts are read out of the
            repositories, and a link only appears if it resolves.
          </>
        }
        aside={
          <div className="mt-8 flex flex-wrap gap-2">
            {categories.map((c) => (
              <span
                key={c}
                className="rounded-full border border-line px-3.5 py-1.5 font-mono text-[0.7rem] text-muted"
              >
                {c}
              </span>
            ))}
          </div>
        }
      />

      <section className="shell pb-24 lg:pb-32">
        {/* The list is obvious to the eye but was invisible to the outline:
            the card headings followed the page h1 with nothing between. */}
        <h2 className="sr-only">Case studies</h2>
        <div className="space-y-4 lg:space-y-6">
          {featured.map((project, i) => (
            <FeatureRow key={project.slug} project={project} index={i} flip={i % 2 === 1} />
          ))}
        </div>

        <ul className="mt-4 grid gap-4 md:grid-cols-2 lg:mt-6 lg:grid-cols-3 lg:gap-6">
          {rest.map((project, i) => (
            <CompactCard key={project.slug} project={project} index={featured.length + i} />
          ))}
        </ul>
      </section>

      {/* Long tail ------------------------------------------------------ */}
      <section className="shell border-t border-line py-20 lg:py-28">
        <Reveal>
          <p className="label flex items-center gap-3">
            <span className="text-accent">02</span>
            <span className="h-px w-8 bg-line-2" />
            Also on GitHub
          </p>
        </Reveal>
        <Reveal delay={60}>
          <h2 className="display mt-8 text-[clamp(2rem,5vw,3.2rem)] text-ink">
            The rest of the shelf.
          </h2>
        </Reveal>
        <Reveal delay={110}>
          <p className="mt-6 max-w-2xl text-[1.0625rem] leading-relaxed text-ink-dim">
            Fifty-four public repositories — prototypes, client work, tools and things built to
            understand something. A selection worth opening.
          </p>
        </Reveal>

        <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
          {openSource.map((repo, i) => (
            <Reveal key={repo.name} as="li" delay={(i % 2) * 60}>
              <div className="flex h-full flex-col justify-between gap-5 bg-stage-2/70 p-6 transition-colors duration-500 hover:bg-stage-3/70 sm:p-7">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span
                      className="size-2 shrink-0 rounded-full"
                      style={{ background: LANG_DOT[repo.language] ?? "#8b919c" }}
                      aria-hidden="true"
                    />
                    <h3 className="font-mono text-sm text-ink">{repo.name}</h3>
                    <span className="label text-[0.6rem] text-muted">{repo.language}</span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{repo.description}</p>
                </div>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                  <a
                    href={repo.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="link-wipe inline-flex items-center gap-1 whitespace-nowrap text-xs text-ink-dim hover:text-ink"
                  >
                    Source <ArrowUpRight className="size-3 shrink-0" />
                  </a>
                  {repo.live ? (
                    <a
                      href={repo.live}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="link-wipe inline-flex items-center gap-1 whitespace-nowrap text-xs text-accent"
                    >
                      Live <ArrowUpRight className="size-3 shrink-0" />
                    </a>
                  ) : null}
                </div>
              </div>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={120}>
          <a
            href={links.github}
            target="_blank"
            rel="noreferrer noopener"
            className="link-wipe mt-10 inline-flex items-center gap-1.5 whitespace-nowrap text-sm text-accent"
          >
            github.com/oyinlola-tech
            <ArrowUpRight className="size-3.5 shrink-0" />
          </a>
        </Reveal>
      </section>
    </>
  );
}
