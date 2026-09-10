"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowLeft, RotateCw } from "lucide-react";
import ErrorCode from "@/components/error/ErrorCode";
import RequestTrace from "@/components/error/RequestTrace";

/**
 * The route-level error boundary.
 *
 * Sibling to not-found.tsx in voice and layout — same oversized code, same
 * trace — because a visitor who hits both should not feel like they left the
 * site. The difference is the affordance: a 404 cannot be retried, this can.
 *
 * `retry()` (stable as of Next 16.3; `reset()` was the older, weaker form)
 * re-fetches and re-renders the segment, so a transient failure clears
 * without a full reload.
 */
export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="err-stage shell flex min-h-[88svh] flex-col justify-center py-32">
      <div className="err-bloom" aria-hidden="true" />

      <div className="relative max-w-2xl">
        <p className="label text-accent">Status · 500</p>

        <ErrorCode code="500" />

        <h1 className="display mt-8 text-[clamp(1.9rem,4.2vw,3rem)] text-ink">
          This page failed on the way out.
        </h1>
        <p className="mt-5 max-w-md text-ink-dim">
          Something threw while rendering. It may be transient — retrying
          re-runs just this segment rather than reloading the whole site.
        </p>

        <div className="mt-9">
          <RequestTrace
            rows={[
              { k: "←  ", v: "500 Internal Server Error", tone: "bad" },
              {
                k: "ref",
                // The digest is the only handle that ties what the visitor saw
                // to what the server logged. Production deliberately withholds
                // the message; this is what remains, so it is worth surfacing.
                v: error.digest ?? "not available in this environment",
              },
              { k: "next", v: "retry the segment, or head back to safe ground" },
            ]}
          />
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => retry()}
            className="group inline-flex w-fit items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-stage transition-colors hover:bg-accent-2"
          >
            <RotateCw
              className="size-4 transition-transform duration-500 group-hover:rotate-180"
              aria-hidden="true"
            />
            Try again
          </button>
          <Link
            href="/"
            className="group inline-flex w-fit items-center gap-2 rounded-full border border-line-2 px-5 py-2.5 text-sm text-ink-dim transition-colors hover:border-ink/30 hover:text-ink"
          >
            <ArrowLeft
              className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
            Back home
          </Link>
        </div>
      </div>
    </section>
  );
}
