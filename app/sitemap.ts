import type { MetadataRoute } from "next";
import { work } from "@/content/work";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = ["", "/work", "/engineering", "/lab", "/about", "/cv", "/contact"];
  return [
    ...pages.map((p) => ({
      url: `${site.url}${p}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: p === "" ? 1 : 0.9,
    })),
    ...work.map((w) => ({
      url: `${site.url}/work/${w.slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
  ];
}
