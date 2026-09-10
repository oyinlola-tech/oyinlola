import type { MetadataRoute } from "next";
import { site } from "@/content/site";

/**
 * Web app manifest. Lighthouse's installability checks and Android's
 * add-to-home-screen both look for this; without it the site gets a
 * screenshot of the page as its icon.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — ${site.role}`,
    short_name: site.short,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#07080b",
    theme_color: "#07080b",
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/apple-icon", type: "image/png", sizes: "180x180" },
    ],
  };
}
