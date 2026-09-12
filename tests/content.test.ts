import { describe, expect, it } from "vitest";
import { readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { work, workCount, workCountWord, categories } from "@/content/work";
import { disciplines, telemetry, nav } from "@/content/site";
import { experiments } from "@/content/lab";

/**
 * Invariants for the content layer.
 *
 * The site is a static render of content/*.ts, so anything wrong in those
 * files is wrong in production with nothing between to catch it. Every
 * assertion here corresponds to a mistake that has actually been made in
 * this repository rather than to a hypothetical one:
 *
 *   - the /work headline hardcoded a count and was wrong twice
 *   - two case studies were given the same hue, which the sigils render from
 *   - the telemetry count on the home page drifted from the case-study list
 *   - a status value was reintroduced after being deliberately removed
 *
 * The shape of the data is TypeScript's job. This file checks the things a
 * type cannot: uniqueness, cross-references, and agreement between two
 * places that state the same fact.
 */

const ROOT = join(import.meta.dirname, "..");

describe("case studies", () => {
  it("has at least one featured entry", () => {
    expect(work.filter((w) => w.featured).length).toBeGreaterThan(0);
  });

  it("gives every case study a unique slug", () => {
    const seen = new Map<string, number>();
    for (const w of work) seen.set(w.slug, (seen.get(w.slug) ?? 0) + 1);
    const dupes = [...seen].filter(([, n]) => n > 1).map(([s]) => s);
    expect(dupes).toEqual([]);
  });

  it("uses URL-safe slugs", () => {
    const bad = work.filter((w) => !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(w.slug));
    expect(bad.map((w) => w.slug)).toEqual([]);
  });

  it("gives every case study a distinct hue", () => {
    // The project sigil is generated from `hue`. Two entries sharing one
    // makes two different projects render as the same colour.
    const seen = new Map<number, string[]>();
    for (const w of work) seen.set(w.hue, [...(seen.get(w.hue) ?? []), w.slug]);
    const clashes = [...seen].filter(([, s]) => s.length > 1);
    expect(clashes.map(([hue, slugs]) => `${hue}: ${slugs.join(" + ")}`)).toEqual([]);
  });

  it("keeps hues inside the colour wheel", () => {
    expect(work.filter((w) => w.hue < 0 || w.hue > 360).map((w) => w.slug)).toEqual([]);
  });

  it("fills every required field", () => {
    const missing: string[] = [];
    for (const w of work) {
      for (const key of ["name", "kind", "category", "year", "role", "summary"] as const) {
        if (!w[key]?.trim()) missing.push(`${w.slug}.${key}`);
      }
      for (const key of ["overview", "problem", "architecture", "decisions", "metrics", "stack"] as const) {
        if (!w[key]?.length) missing.push(`${w.slug}.${key} is empty`);
      }
    }
    expect(missing).toEqual([]);
  });

  it("writes complete architecture and decision entries", () => {
    const bad: string[] = [];
    for (const w of work) {
      for (const [i, a] of w.architecture.entries()) {
        if (!a.title?.trim() || !a.body?.trim()) bad.push(`${w.slug}.architecture[${i}]`);
      }
      for (const [i, d] of w.decisions.entries()) {
        if (!d.title?.trim() || !d.body?.trim()) bad.push(`${w.slug}.decisions[${i}]`);
      }
      for (const [i, m] of w.metrics.entries()) {
        if (!m.value?.trim() || !m.label?.trim()) bad.push(`${w.slug}.metrics[${i}]`);
      }
    }
    expect(bad).toEqual([]);
  });

  it("only links somewhere a browser can go", () => {
    // content/work.ts promises every href returned 200. That promise is
    // checked for real by scripts/check-links.mjs; this only rules out the
    // shapes that can never work.
    const bad: string[] = [];
    for (const w of work) {
      for (const l of w.links) {
        if (!l.label?.trim()) bad.push(`${w.slug}: link with no label`);
        if (!/^(https:\/\/|\/)/.test(l.href)) bad.push(`${w.slug}: ${l.href}`);
      }
    }
    expect(bad).toEqual([]);
  });
});

describe("counts that are stated twice", () => {
  it("spells the headline count from the array it counts", () => {
    expect(workCount).toBe(work.length);
    expect(workCountWord).toBeTruthy();
    expect(workCountWord).not.toBe("undefined");
  });

  it("keeps the home-page telemetry in step with the case studies", () => {
    // site.ts holds this as a literal on purpose: it is imported by the OG
    // image route, which has a 500KB budget, and importing the whole
    // case-study file to count it would spend most of that on prose. The
    // cost of that decision is this assertion.
    const stated = telemetry.find((t) => t.label === "Case studies");
    expect(stated, "telemetry has no 'Case studies' entry").toBeDefined();
    expect(Number(stated!.value)).toBe(work.length);
  });
});

describe("cross-references", () => {
  it("points discipline evidence at real case studies", () => {
    const slugs = new Set(work.map((w) => w.slug));
    const dangling = disciplines.flatMap((d) =>
      d.evidence.filter((e) => !slugs.has(e)).map((e) => `${d.id} → ${e}`),
    );
    expect(dangling).toEqual([]);
  });

  it("points lab links at real routes", () => {
    const slugs = new Set(work.map((w) => w.slug));
    const dangling: string[] = [];
    for (const x of experiments) {
      for (const href of JSON.stringify(x).match(/\/work\/[a-z0-9-]+/g) ?? []) {
        const slug = href.replace("/work/", "");
        if (!slugs.has(slug)) dangling.push(`${x.title} → ${href}`);
      }
    }
    expect(dangling).toEqual([]);
  });

  it("derives categories from the case studies themselves", () => {
    expect(categories.length).toBeGreaterThan(0);
    expect(new Set(categories).size).toBe(categories.length);
  });
});

describe("routes", () => {
  const pageExists = (route: string) =>
    existsSync(join(ROOT, "app", route, "page.tsx"));

  it("gives every nav item a page", () => {
    const missing = nav
      .filter((n) => !pageExists(n.href.replace(/^\//, "")))
      .map((n) => n.href);
    expect(missing).toEqual([]);
  });

  it("only lists routes in the sitemap that exist", () => {
    // A sitemap entry that 404s is a Search Console error, and the sitemap
    // is written by hand for the static pages.
    const statics = ["", "/work", "/engineering", "/lab", "/about", "/cv", "/contact"];
    const missing = statics.filter(
      (p) => !existsSync(join(ROOT, "app", p.replace(/^\//, ""), "page.tsx")),
    );
    expect(missing).toEqual([]);
  });

  it("has a case-study route for the dynamic segment", () => {
    expect(existsSync(join(ROOT, "app", "work", "[slug]", "page.tsx"))).toBe(true);
  });

  it("keeps the error and not-found boundaries in place", () => {
    for (const f of ["not-found.tsx", "error.tsx", "global-error.tsx"]) {
      expect(existsSync(join(ROOT, "app", f)), `app/${f} is missing`).toBe(true);
    }
  });

  it("does not ship a stray test route", () => {
    // A throwing route was added once to photograph the error boundary.
    const strays = readdirSync(join(ROOT, "app"), { withFileTypes: true })
      .filter((d) => d.isDirectory() && /boom|test|tmp|scratch/i.test(d.name))
      .map((d) => d.name);
    expect(strays).toEqual([]);
  });
});
