import Link from "next/link";
import { site, links, nav } from "@/content/site";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line">
      <div className="shell grid gap-10 py-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="font-display text-base font-medium tracking-tight text-ink">{site.name}</p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">
            {site.role} · {site.location}
          </p>
          <a
            href={`mailto:${site.email}`}
            className="link-wipe mt-4 inline-block break-all text-sm text-accent"
          >
            {site.email}
          </a>
        </div>

        <nav className="md:col-span-3" aria-label="Footer pages">
          <p className="label">Pages</p>
          <ul className="mt-4 space-y-2">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="link-wipe text-sm text-ink-dim transition-colors hover:text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="md:col-span-4" aria-label="Footer elsewhere">
          <p className="label">Elsewhere</p>
          <ul className="mt-4 space-y-2">
            {[
              ["GitHub", links.github],
              ["LinkedIn", links.linkedin],
              ["X", links.twitter],
            ].map(([label, href]) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="link-wipe text-sm text-ink-dim transition-colors hover:text-ink"
                >
                  {label}
                </a>
              </li>
            ))}
            <li>
              <Link
                href="/cv"
                className="link-wipe text-sm text-ink-dim transition-colors hover:text-ink"
              >
                CV
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="shell flex flex-col gap-2 border-t border-line py-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="label normal-case tracking-normal">© {year} {site.name}</p>
        <p className="label normal-case tracking-normal">
          Built with Next.js, Three.js and Tailwind.
        </p>
      </div>
    </footer>
  );
}
