"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

export type RouteEntry = { href: string; label: string; note: string };

/** Levenshtein distance, iterative single-row. Short strings only. */
function distance(a: string, b: string) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  const row: number[] = Array.from({ length: b.length + 1 }, () => 0);

  for (let i = 1; i <= a.length; i++) {
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      row[j] = Math.min(row[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    prev = row.slice();
  }
  return prev[b.length];
}

/** 0…1, where 1 is identical. */
function similarity(a: string, b: string) {
  const longest = Math.max(a.length, b.length);
  return longest === 0 ? 1 : 1 - distance(a, b) / longest;
}

const words = (s: string) => s.toLowerCase().split(/[^a-z0-9]+/i).filter(Boolean);

/**
 * Score one candidate route against the address that failed.
 *
 * Three signals, because a mistyped URL fails in three different ways:
 * a typo in the slug ("/wrok"), a remembered-but-wrong name ("/projects"),
 * and a truncated path ("/work/zudo"). Edit distance catches the first,
 * shared words the second, prefix containment the third.
 */
function score(entry: RouteEntry, failed: string) {
  const tail = failed.split("/").filter(Boolean).pop() ?? "";
  const target = entry.href.split("/").filter(Boolean).pop() ?? "";
  if (!tail) return 0;

  const edit = similarity(tail, target);

  const failedWords = new Set(words(failed));
  const entryWords = words(`${entry.label} ${entry.note} ${entry.href}`);
  const overlap = entryWords.length
    ? entryWords.filter((w) => failedWords.has(w)).length / entryWords.length
    : 0;

  const contains =
    tail.length >= 3 && (target.startsWith(tail) || tail.startsWith(target)) ? 1 : 0;

  return Math.max(edit, overlap, contains * 0.9);
}

/**
 * The way out.
 *
 * Every 404 gallery entry that is actually *useful* rather than just pretty
 * does this: it guesses. Scoring the failed address against the real route
 * table turns "nothing here" into "you probably wanted this", which is worth
 * more than any amount of illustration.
 *
 * Matching runs on the client because only the client knows the pathname;
 * the route table itself is passed down from the server so the content stays
 * in one place.
 */
export default function NearestRoutes({ routes }: { routes: RouteEntry[] }) {
  const path = usePathname() ?? "/";

  const { shown, guessed } = useMemo(() => {
    const ranked = routes
      .map((r) => ({ r, s: score(r, path) }))
      .sort((a, b) => b.s - a.s);

    // A confident guess is worth showing as a guess. Otherwise this is just
    // the site index, and calling it a "best match" would be a lie.
    const strong = ranked.filter((x) => x.s >= 0.42).slice(0, 4);
    return strong.length >= 1
      ? { shown: strong.map((x) => x.r), guessed: true }
      : { shown: routes.slice(0, 6), guessed: false };
  }, [routes, path]);

  return (
    <div>
      <h2 className="label mb-1">
        {guessed ? "Nearest matches" : "Everywhere else"}
      </h2>
      <ul className="mt-4">
        {shown.map((r, i) => (
          <li key={r.href}>
            <Link href={r.href} className="err-route group">
              <span className="err-route__i">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[0.95rem] text-ink">{r.label}</span>
              <span className="hidden font-mono text-[0.7rem] text-faint sm:inline">
                {r.note}
              </span>
              <ArrowUpRight className="err-route__arrow size-4" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
