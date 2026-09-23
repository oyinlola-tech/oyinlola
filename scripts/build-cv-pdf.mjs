#!/usr/bin/env node
/**
 * Print /cv to the PDF the "Download PDF" button serves.
 *
 * The page's @media print rules are the PDF's design; this only drives
 * headless Chromium through them so every visitor downloads the same A4
 * file, instead of whatever their own browser's print dialog produces.
 *
 *   npm run build && npm run cv:pdf          start `next start`, print, stop
 *   npm run cv:pdf -- --url http://localhost:3000/cv   print a running server
 *
 * Re-run it whenever content/cv.ts or content/site.ts changes — the PDF is a
 * committed file and does not rebuild itself.
 *
 * Chromium is found on PATH (chromium, chromium-browser, google-chrome) or
 * taken from $CHROME_BIN.
 */

import { spawn, spawnSync } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "Oluwayemi-Oyinlola-Michael-CV.pdf");
const PORT = 3107;

const argUrl = (() => {
  const i = process.argv.indexOf("--url");
  return i === -1 ? null : process.argv[i + 1];
})();

function findChrome() {
  if (process.env.CHROME_BIN) return process.env.CHROME_BIN;
  for (const bin of ["chromium", "chromium-browser", "google-chrome", "google-chrome-stable"]) {
    if (spawnSync("which", [bin]).status === 0) return bin;
  }
  throw new Error("No Chromium found. Install one or set CHROME_BIN.");
}

async function waitFor(url, ms = 30_000) {
  const until = Date.now() + ms;
  while (Date.now() < until) {
    try {
      if ((await fetch(url)).ok) return;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error(`${url} did not come up within ${ms / 1000}s`);
}

async function main() {
  let server = null;
  let url = argUrl;

  if (!url) {
    if (!existsSync(join(ROOT, ".next", "BUILD_ID"))) {
      throw new Error("No production build. Run `npm run build` first, or pass --url.");
    }
    // The binary directly rather than through npx, so killing it stops the
    // server instead of orphaning it behind a wrapper process.
    server = spawn(join(ROOT, "node_modules", ".bin", "next"), ["start", "-p", String(PORT)], {
      cwd: ROOT,
      stdio: "ignore",
    });
    url = `http://localhost:${PORT}/cv`;
  }

  try {
    await waitFor(url);
    const chrome = findChrome();
    const res = spawnSync(
      chrome,
      [
        "--headless=new",
        "--no-sandbox",
        "--disable-gpu",
        "--hide-scrollbars",
        "--no-pdf-header-footer",
        // Enough virtual time for web fonts and the photograph to land
        // before the page is committed to paper.
        "--virtual-time-budget=15000",
        "--run-all-compositor-stages-before-draw",
        `--print-to-pdf=${OUT}`,
        url,
      ],
      { stdio: ["ignore", "ignore", "pipe"] },
    );
    if (res.status !== 0 || !existsSync(OUT)) {
      throw new Error(`Chromium failed (${res.status}): ${res.stderr?.toString().slice(-600)}`);
    }
    console.log(`Wrote ${OUT} (${Math.round(statSync(OUT).size / 1024)} KB) from ${url}`);
  } finally {
    server?.kill();
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
