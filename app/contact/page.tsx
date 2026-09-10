import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import { site, links } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.name} — ${site.email}. Open to backend, platform and software engineering roles.`,
};

const channels = [
  { label: "Email", value: site.email, href: `mailto:${site.email}` },
  { label: "Phone", value: site.phone, href: `tel:${site.phone.replace(/\s/g, "")}` },
  { label: "GitHub", value: "oyinlola-tech", href: links.github },
  { label: "LinkedIn", value: "oluwayemioyinlola", href: links.linkedin },
  { label: "X", value: "@oyinlola141", href: links.twitter },
  { label: "CV", value: "Read & download", href: "/cv" },
];

const goodFits = [
  "A backend that has outgrown its first architecture and needs real module boundaries.",
  "A product that needs shipping end to end — API, dashboard, payments, emails, deploy.",
  "Commerce, marketplace or fintech work where escrow, ledgers and trust flows matter.",
  "A Nigerian or pan-African market where local payment rails and thin margins are the constraint.",
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        index="05"
        label="Contact"
        title="Tell me what you're building."
        lede={
          <>
            Open to {site.availableFor.toLowerCase()} — full-time or contract, remote or hybrid.
            Messages go straight to my inbox and I reply to all of them.
          </>
        }
      />

      <section className="relative overflow-hidden pb-24 lg:pb-36">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(70% 55% at 30% 0%, rgba(255,176,103,0.08) 0%, transparent 62%)",
          }}
        />

        <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <ContactForm />
          </Reveal>

          <div className="lg:col-span-5">
            <Reveal delay={80}>
              <dl className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-1">
                {channels.map((c) => (
                  <a
                    key={c.label}
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel={c.href.startsWith("http") ? "noreferrer noopener" : undefined}
                    className="group flex items-baseline justify-between gap-4 bg-stage-2/70 px-5 py-4 transition-colors duration-500 hover:bg-stage-3/70"
                  >
                    <dt className="label shrink-0">{c.label}</dt>
                    <dd className="flex min-w-0 items-center gap-1.5 text-sm text-ink">
                      <span className="truncate">{c.value}</span>
                      <ArrowUpRight className="size-3.5 shrink-0 text-faint transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                    </dd>
                  </a>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={110}>
              <figure className="mt-8 overflow-hidden rounded-2xl border border-line bg-stage-2/40">
                <div className="relative aspect-[4/3]">
                  <Image
                    src="/street-cartoon.webp"
                    alt="Oluwayemi on a street in Nigeria, drawn as a cel-shaded scene"
                    fill
                    sizes="(max-width: 1024px) 92vw, 26rem"
                    className="object-cover"
                  />
                </div>
                <figcaption className="label border-t border-line px-5 py-3 normal-case tracking-normal">
                  Ondo State — where most of this gets built.
                </figcaption>
              </figure>
            </Reveal>

            <Reveal delay={160}>
              <div className="mt-8 rounded-2xl border border-line bg-stage-2/40 p-6">
                <p className="label">Where I&rsquo;m most useful</p>
                <ul className="mt-5 space-y-4">
                  {goodFits.map((g) => (
                    <li
                      key={g}
                      className="relative pl-5 text-sm leading-relaxed text-ink-dim before:absolute before:left-0 before:top-[0.62em] before:size-1.5 before:rounded-full before:bg-accent/60"
                    >
                      {g}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 border-t border-line pt-5 text-xs leading-relaxed text-muted">
                  Based in {site.location} — {site.timezone}. I work comfortably across European and
                  US-Eastern hours.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
