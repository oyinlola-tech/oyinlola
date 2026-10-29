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
  const urls = [
    ...pages.map((p) => `${site.url}${p}`),
    ...work.map((w) => `${site.url}/work/${w.slug}`),
  ];

  if (new Set(urls).size !== urls.length) {
    throw new Error("Sitemap contains duplicate URLs");
  }

  return urls.map((url) => ({ url }));
}
