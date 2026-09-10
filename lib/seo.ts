import type { Metadata } from "next";
import { site, links } from "@/content/site";

/** Derived rather than retyped, so the handle lives in one place. */
export const TWITTER_HANDLE = `@${links.twitter.split("/").pop()}`;

/**
 * The generated card, addressed absolutely.
 *
 * The `opengraph-image` file convention only reaches a page that does not
 * declare `openGraph.images` itself — and declaring `openGraph` at all (which
 * per-page OG titles require) counts. Naming the route here is what puts an
 * image back on every page rather than only the home page. Absolute because
 * scrapers do not resolve relative URLs.
 */
const OG_IMAGE = `${site.url}/opengraph-image`;

type PageMeta = {
  /** Page title, without the site suffix — the layout template adds that. */
  title: string;
  description: string;
  /** Route path, leading slash, no trailing slash (the home page is "/"). */
  path: string;
  /** Set for the home page, whose title is the whole wordmark already. */
  absoluteTitle?: boolean;
  /** Case studies are articles; everything else is a website. */
  type?: "website" | "article";
};

/**
 * Per-page metadata.
 *
 * Exists because `openGraph` and `twitter` are replaced wholesale rather than
 * deep-merged when a page declares them — so a page that sets only an OG
 * title silently drops the site name, locale and type it inherited. Building
 * the whole object here is the only way to get per-page OG titles without
 * repeating those four fields on every route.
 *
 * It also guarantees the thing Search Console complains loudest about: every
 * indexable page declaring its own canonical.
 */
export function pageMeta({
  title,
  description,
  path,
  absoluteTitle,
  type = "website",
}: PageMeta): Metadata {
  const url = `${site.url}${path === "/" ? "" : path}`;
  const social = absoluteTitle ? title : `${title} — ${site.short}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      locale: "en_GB",
      siteName: site.name,
      url,
      title: social,
      description,
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: `${site.name} — ${site.role}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: social,
      description,
      creator: TWITTER_HANDLE,
      images: [OG_IMAGE],
    },
  };
}
