import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, TerminalSquare } from "lucide-react";
import ErrorCode from "@/components/error/ErrorCode";
import PathTrace from "@/components/error/PathTrace";
import NearestRoutes, { type RouteEntry } from "@/components/error/NearestRoutes";
import { nav } from "@/content/site";
import { work } from "@/content/work";

export const metadata: Metadata = {
  title: "Not found",
  description: "That address does not resolve.",
  // No `robots` here on purpose: Next already emits <meta name="robots"
  // content="noindex"> for a not-found render, and declaring it again only
  // produced a duplicate tag.
};

/**
 * The route table the matcher guesses against: every section, plus every
 * case study, so a half-remembered project slug still lands somewhere.
 */
const routes: RouteEntry[] = [
  ...nav.map((n) => ({
    href: n.href,
    label: n.label,
    note: n.href,
  })),
  ...work.map((w) => ({
    href: `/work/${w.slug}`,
    label: w.name,
    note: w.kind,
  })),
];

export default function NotFound() {
  return (
    <section className="err-stage shell grid min-h-[84svh] content-center gap-14 py-28 lg:grid-cols-[1.05fr_0.9fr] lg:gap-20">
      <div className="err-bloom" aria-hidden="true" />

      <div className="relative">
        <p className="label text-accent">Status · 404</p>

        <ErrorCode code="404" />

        <h1 className="display mt-8 text-[clamp(1.9rem,4.2vw,3rem)] text-ink">
          Nothing resolves at this address.
        </h1>
        <p className="mt-5 max-w-md text-ink-dim">
          The route table has no entry for it. Either it moved, or it was never
          here — and the trace below says which of those is more likely.
        </p>

        <div className="mt-9">
          <PathTrace />
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/"
            className="group inline-flex w-fit items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-stage transition-colors hover:bg-accent-2"
          >
            <ArrowLeft
              className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
            Back home
          </Link>
          <Link
            href="/lab"
            className="group inline-flex w-fit items-center gap-2 rounded-full border border-line-2 px-5 py-2.5 text-sm text-ink-dim transition-colors hover:border-ink/30 hover:text-ink"
          >
            <TerminalSquare className="size-4" aria-hidden="true" />
            Find it from the terminal
          </Link>
        </div>
      </div>

      {/* Centred against the tall left column rather than pinned to the top,
          which left the two halves visibly unbalanced. */}
      <div className="relative lg:self-center">
        <NearestRoutes routes={routes} />
      </div>
    </section>
  );
}
