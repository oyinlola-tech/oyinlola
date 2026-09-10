import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";
import { site, links } from "@/content/site";
import Dock from "@/components/Dock";
import Intro from "@/components/Intro";
import Footer from "@/components/Footer";
import "./globals.css";

const display = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600"],
  display: "swap",
});

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.role}`, template: `%s — ${site.short}` },
  description: site.description,
  keywords: [
    "software engineer",
    "full stack developer",
    "platform engineer",
    "Go",
    "TypeScript",
    "Nigeria",
    "Oluwayemi Oyinlola Michael",
    "ZudoMart",
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.role}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.role}`,
    description: site.description,
    creator: "@oyinlola141",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#07080b",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  alternateName: site.short,
  jobTitle: site.role,
  url: site.url,
  email: site.email,
  telephone: site.phone,
  description: site.description,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Okitipupa",
    addressRegion: "Ondo State",
    addressCountry: "NG",
  },
  sameAs: [links.github, links.linkedin, links.twitter],
  knowsAbout: [
    "Go",
    "TypeScript",
    "Distributed systems",
    "E-commerce",
    "Platform engineering",
    "API security",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <head>
        {/* Set before first paint so the pre-intro clip-paths apply and the
            entrance actually has somewhere to animate from. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.className += " js";`,
          }}
        />
      </head>
      <body className="grain antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-stage"
        >
          Skip to content
        </a>
        <Intro />
        <Dock />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
