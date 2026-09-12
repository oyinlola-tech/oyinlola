#!/usr/bin/env node
/**
 * Verify every external URL in the content layer still resolves.
 *
 * content/work.ts opens with a promise: "every URL in this file returned
 * HTTP 200 when checked". That was a promise kept by hand, which means it
 * was a promise with a shelf life — a case study links to a deployment that
 * goes down and the page keeps advertising it.
 *
 * Reads the .ts sources as text rather than importing them, so this runs on
 * plain node with no TypeScript loader and no dependencies.
 *
 *   node scripts/check-links.mjs          check every URL
 *   node scripts/check-links.mjs --json   machine-readable output
 */

import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = join(ROOT, "content");
const JSON_OUT = process.argv.includes("--json");

/** Hosts that answer a bot with a challenge rather than the page. */
const HEAD_UNFRIENDLY = [/linkedin\.com/i, /twitter\.com/i, /x\.com/i];

function collect() {
  const found = new Map(); // url -> Set of "file:line"
  for (const file of readdirSync(CONTENT).filter((f) => f.endsWith(".ts"))) {
    const lines = readFileSync(join(CONTENT, file), "utf8").split("\n");
    lines.forEach((line, i) => {
      for (const m of line.matchAll(/https?:\/\/[^\s"'`)]+/g)) {
        const url = m[0].replace(/[.,;]+$/, "");
        if (!found.has(url)) found.set(url, new Set());
        found.get(url).add(`${file}:${i + 1}`);
      }
    });
  }
  return found;
}

async function check(url, attempt = 1) {
  const method = HEAD_UNFRIENDLY.some((re) => re.test(url)) ? "GET" : "HEAD";
  try {
    const res = await fetch(url, {
      method,
      redirect: "follow",
      signal: AbortSignal.timeout(20_000),
      headers: { "user-agent": "oyinlola.site link check (+https://oyinlola.site)" },
    });
    // Some hosts refuse HEAD outright; fall back once before believing it.
    if (res.status === 405 && method === "HEAD") {
      const get = await fetch(url, {
        redirect: "follow",
        signal: AbortSignal.timeout(20_000),
      });
      return { status: get.status, ok: get.ok };
    }
    return { status: res.status, ok: res.ok };
  } catch (err) {
    // A refused connection is usually rate limiting, not a dead link — this
    // whole script hitting github.com in a loop is exactly what triggers it.
    if (attempt < 3) {
      await new Promise((r) => setTimeout(r, attempt * 2500));
      return check(url, attempt + 1);
    }
    return { status: 0, ok: false, error: err.name === "TimeoutError" ? "timeout" : err.message };
  }
}

const urls = [...collect()].sort(([a], [b]) => a.localeCompare(b));
const results = [];

for (const [url, where] of urls) {
  const r = await check(url);
  results.push({ url, where: [...where], ...r });
  if (!JSON_OUT) {
    const mark = r.ok ? "ok  " : "FAIL";
    console.log(`  ${mark} ${String(r.status).padStart(3)}  ${url}`);
    if (!r.ok) console.log(`         ${[...where].join(", ")}${r.error ? `  (${r.error})` : ""}`);
  }
  await new Promise((r) => setTimeout(r, 400)); // be a polite crawler
}

const broken = results.filter((r) => !r.ok);

if (JSON_OUT) {
  console.log(JSON.stringify({ checked: results.length, broken }, null, 2));
} else {
  console.log(`\n  ${results.length} checked, ${broken.length} broken`);
  if (broken.length) {
    console.log("\n  content/work.ts states that every URL in it returned 200.");
    console.log("  Remove the link or fix it — a dead link is worse than none.\n");
  }
}

process.exit(broken.length ? 1 : 0);
