import type { MetadataRoute } from "next";
import { work } from "@/content/work";
import { site } from "@/content/site";

/**
 * No `lastModified` here, deliberately.
 *
 * It used to be `new Date()`, which stamped every URL with the build time —
 * so every deploy told Search Console that all 22 pages had just changed.
 * Google's guidance is to omit lastmod rather than supply one it will learn
 * to distrust, and `changeFrequency`/`priority` are ignored outright.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/work", "/engineering", "/lab", "/about", "/cv", "/contact"];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}` })),
    ...work.map((w) => ({ url: `${site.url}/work/${w.slug}` })),
  ];
}
