import localFont from "next/font/local";
import { IBM_Plex_Mono } from "next/font/google";
import { site, links } from "@/content/site";
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
} from "@/content/cv";

/*
 * The paper CV. It exists only in print, and the downloadable PDF is this
 * component printed by Chromium (scripts/build-cv-pdf.mjs).
 *
 * It is modelled on an engineer's computation pad: pale green gridded
 * sheets with a ruled title block at the top of the first one and a sheet
 * count on every page. Styles live under "CV paper" in globals.css.
 *
 * ATS rules it keeps: one column in reading order, standard section names,
 * every contact detail and URL as plain text, no letter-spacing (PDF text
 * extraction turns tracking into spaces) and nothing a parser needs inside
 * an image.
 */

/*
 * Static instances cut from the Archivo and IBM Plex Sans variable fonts
 * (see fonts/README.md). Chromium embeds a variable font in a PDF as Type 3
 * glyphs, which some older ATS parsers cannot read; a static font embeds
 * as ordinary TrueType.
 */
const nameFace = localFont({
  src: "./fonts/archivo-700-68.woff2",
  variable: "--cvp-name",
  display: "block",
});
const display = localFont({
  src: "./fonts/archivo-700-80.woff2",
  variable: "--cvp-display",
  display: "block",
});
const text = localFont({
  src: [
    { path: "./fonts/plexsans-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/plexsans-600.woff2", weight: "600", style: "normal" },
  ],
  variable: "--cvp-text",
  display: "block",
});
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--cvp-mono",
  display: "block",
});

/** The A4 page area inside the @page margins, in millimetres. */
const GRID_W = 185;
const GRID_H = 270;

const bare = (href: string) => href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

const contact: { label: string; value: string; href?: string }[] = [
  { label: "Location", value: `${site.location} (WAT, UTC+1)` },
  { label: "Email", value: site.email, href: `mailto:${site.email}` },
  { label: "Phone", value: site.phone, href: `tel:${site.phone.replace(/\s/g, "")}` },
  { label: "Portfolio", value: bare(links.site), href: links.site },
  { label: "GitHub", value: bare(links.github), href: links.github },
  { label: "LinkedIn", value: bare(links.linkedin), href: links.linkedin },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="cvp-sec">
      <h2 className="cvp-h">{title}</h2>
      {children}
    </section>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="cvp-list">
      {items.map((p) => (
        <li key={p}>{p}</li>
      ))}
    </ul>
  );
}

export default function CvPaper() {
  const onPaper = projects.filter((p) => p.paper !== false);

  return (
    <div className={`cvp ${nameFace.variable} ${display.variable} ${text.variable} ${mono.variable}`}>
      {/* The grid. Fixed, so Chromium repeats it on every sheet, and clipped
          to the page area, which leaves a plain margin like a real pad.
          Drawn as SVG lines because Chromium rasterises CSS gradients in a
          PDF, which prints the grid soft. */}
      <svg className="cvp-grid" aria-hidden="true" viewBox={`0 0 ${GRID_W} ${GRID_H}`} preserveAspectRatio="xMinYMin slice">
        {Array.from({ length: GRID_W / 5 + 1 }, (_, i) => (
          <line key={`v${i}`} x1={i * 5} y1={0} x2={i * 5} y2={GRID_H} />
        ))}
        {Array.from({ length: GRID_H / 5 + 1 }, (_, i) => (
          <line key={`h${i}`} x1={0} y1={i * 5} x2={GRID_W} y2={i * 5} />
        ))}
      </svg>

      <header className="cvp-tb">
        <div className="cvp-tb__photo">
          {/* A plain img: next/image would lazy-load it, and a lazy image
              inside a print-only block never loads before the page prints. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/cv-headshot.webp" alt={`Photograph of ${site.name}`} width={560} height={700} />
        </div>
        <div className="cvp-tb__id">
          <h1 className="cvp-name">{site.name}</h1>
          <p className="cvp-role">{cvMeta.title}</p>
          <p className="cvp-focus">{cvMeta.subtitle}</p>
        </div>
        <dl className="cvp-tb__cells">
          {contact.map((c) => (
            <div key={c.label} className="cvp-cell">
              <dt>{c.label}</dt>
              <dd>{c.href ? <a href={c.href}>{c.value}</a> : c.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <Section title="Professional Summary">
        {summary.map((p) => (
          <p key={p} className="cvp-p">
            {p}
          </p>
        ))}
      </Section>

      <Section title="Technical Skills">
        <dl className="cvp-rows">
          {skills.map((s) => (
            <div key={s.label}>
              <dt>{s.label}</dt>
              <dd>{s.items}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section title="Soft Skills">
        <dl className="cvp-rows">
          {softSkills.map((s) => (
            <div key={s.label}>
              <dt>{s.label}</dt>
              <dd>{s.detail}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section title="Professional Experience">
        {roles.map((r) => (
          <article key={r.org} className="cvp-entry">
            <div className="cvp-entry__head">
              <h3>
                {r.title}, <span className="cvp-org">{r.org}</span>
              </h3>
              <p className="cvp-when">{r.period}</p>
            </div>
            <p className="cvp-note">{r.blurb}</p>
            <List items={r.points} />
            <p className="cvp-tech">{r.tech}</p>
          </article>
        ))}
      </Section>

      <Section title="Projects">
        {onPaper.map((p) => {
          const link = p.slug ? workBySlug[p.slug]?.links[0] : undefined;
          return (
            <article key={p.name} className="cvp-entry">
              <div className="cvp-entry__head">
                <h3>
                  {p.name} <span className="cvp-org cvp-org--quiet">{p.role}</span>
                </h3>
                {link ? (
                  <p className="cvp-when">
                    <a href={link.href}>{bare(link.href)}</a>
                  </p>
                ) : null}
              </div>
              <p className="cvp-note cvp-note--lead">{p.line}</p>
              <List items={p.points} />
              <p className="cvp-tech">{p.tech}</p>
            </article>
          );
        })}
        <p className="cvp-more">
          {workCount} case studies with architecture notes: <a href={`${links.site}/work`}>{bare(links.site)}/work</a>
        </p>
      </Section>

      <Section title="Education">
        {cvEducation.map((e) => (
          <div key={e.title} className="cvp-entry cvp-entry--flat">
            <div className="cvp-entry__head">
              <h3>
                {e.title}, <span className="cvp-org">{e.org}</span>
              </h3>
              <p className="cvp-when">{e.period}</p>
            </div>
            {e.note ? <p className="cvp-note">{e.note}</p> : null}
          </div>
        ))}
      </Section>

      <Section title="Certifications">
        <dl className="cvp-rows cvp-rows--wide">
          {certifications.map((c) => (
            <div key={c.title}>
              <dt>{c.title}</dt>
              <dd>
                {c.org}
                {c.note ? `. ${c.note}` : ""}
              </dd>
            </div>
          ))}
        </dl>
      </Section>
    </div>
  );
}
