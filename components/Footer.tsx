import Link from "next/link";
import { ArrowUpRight, ArrowUp } from "lucide-react";
import { site, links, nav, focus } from "@/content/site";
import FooterMark from "./footer/FooterMark";
import LocalClock from "./footer/LocalClock";

/**
 * The closing statement of the site rather than a sitemap with a copyright
 * line under it: an oversized invitation, the address written large enough to
 * read as the point of the page, a thin index rail of everything else, and the
 * name set at full bleed underneath it all.
 */

const elsewhere = [
  { label: "GitHub", href: links.github, handle: "oyinlola-tech" },
  { label: "LinkedIn", href: links.linkedin, handle: "oluwayemioyinlola" },
  { label: "X", href: links.twitter, handle: "@oyinlola141" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative isolate overflow-clip border-t border-line">
      {/* A warm bloom rising out of the wordmark, so the page closes on a
          colour rather than fading into the same flat black it opened on. */}
      <div className="footer-bloom" aria-hidden="true" />

      {/* ── the invitation ─────────────────────────────────────────── */}
      <div className="shell relative z-10 pt-20 lg:pt-28">
        <p className="label flex flex-wrap items-center gap-x-3 gap-y-2">
          {site.available ? (
            <>
              <span className="animate-pulse-dot size-1.5 rounded-full bg-signal" />
              <span className="text-ink-dim">Available</span>
              <span className="hidden h-px w-8 bg-line-2 sm:block" />
              {site.availableFor}
            </>
          ) : (
            <>
              <span className="size-1.5 rounded-full bg-muted" />
              <span className="text-ink-dim">Not currently available</span>
            </>
          )}
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
          <h2 className="display col-span-full max-w-[13ch] text-[clamp(2.4rem,6.6vw,5rem)] text-ink lg:col-span-8">
            Let&apos;s build something worth maintaining.
          </h2>

          <div className="lg:col-span-4 lg:pb-3 lg:text-right">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2.5 rounded-full bg-ink px-6 py-3 text-sm font-medium text-stage transition-colors duration-300 hover:bg-accent"
            >
              Start a conversation
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-px group-hover:translate-x-px" />
            </Link>
          </div>
        </div>

        {/* The address, at headline scale. It is the only thing in the footer
            anyone actually needs. */}
        <a
          href={`mailto:${site.email}`}
          className="footer-mail group mt-12 flex items-baseline gap-[0.35em] border-t border-line pb-4 pt-8 lg:mt-16"
        >
          <span className="footer-mail__text">{site.email}</span>
          <ArrowUpRight className="size-[0.42em] shrink-0 self-center text-faint transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent" />
        </a>
      </div>

      {/* ── the index rail ─────────────────────────────────────────── */}
      <div className="shell relative z-10 mt-14 grid gap-10 border-t border-line py-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-12">
        <nav className="lg:col-span-4" aria-label="Footer pages">
          <p className="label">Index</p>
          <ul className="mt-5 space-y-3">
            {nav.map((item, i) => (
              <li key={item.href}>
                <Link href={item.href} className="footer-row group">
                  <span className="footer-row__i">{String(i + 1).padStart(2, "0")}</span>
                  <span className="link-wipe text-[0.95rem] text-ink-dim transition-colors group-hover:text-ink">
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="lg:col-span-4" aria-label="Footer elsewhere">
          <p className="label">Elsewhere</p>
          <ul className="mt-5 space-y-3">
            {elsewhere.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="footer-row group"
                >
                  <span className="link-wipe text-[0.95rem] text-ink-dim transition-colors group-hover:text-ink">
                    {item.label}
                  </span>
                  <span className="footer-row__meta">{item.handle}</span>
                  <ArrowUpRight className="size-3.5 text-faint transition-all duration-300 group-hover:-translate-y-px group-hover:translate-x-px group-hover:text-accent" />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-4">
          <p className="label">Signal</p>
          <dl className="mt-5 space-y-3 font-mono text-[0.8125rem] text-ink-dim">
            <div className="flex items-baseline justify-between gap-4 sm:justify-start sm:gap-6">
              <dt className="text-faint">Local</dt>
              <dd>
                <LocalClock />
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 sm:justify-start sm:gap-6">
              <dt className="text-faint">Based</dt>
              <dd>{site.location}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 sm:justify-start sm:gap-6">
              <dt className="text-faint">Role</dt>
              <dd>{site.role}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* ── the ticker ─────────────────────────────────────────────── */}
      <div className="footer-ticker relative z-10 border-y border-line" aria-hidden="true">
        <div className="footer-ticker__track">
          {[0, 1].map((copy) => (
            <div key={copy} className="footer-ticker__run">
              {focus.map((item) => (
                <span key={item} className="footer-ticker__item">
                  {item}
                  <i />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── the name ───────────────────────────────────────────────── */}
      <div className="shell relative z-10 pt-10">
        <FooterMark text={site.short} />
      </div>

      {/* ── fine print ─────────────────────────────────────────────── */}
      <div className="shell relative z-10 flex flex-col gap-3 border-t border-line py-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="label normal-case tracking-normal">
          © {year} {site.name}
        </p>
        <p className="label normal-case tracking-normal">
          Built with Next.js, Three.js and Tailwind.
        </p>
        <a
          href="#main"
          className="label group inline-flex items-center gap-2 normal-case tracking-normal transition-colors hover:text-ink"
        >
          <ArrowUp className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" />
          Back to top
        </a>
      </div>
    </footer>
  );
}
