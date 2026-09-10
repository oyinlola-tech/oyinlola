"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ConstellationCanvas = dynamic(() => import("./ConstellationCanvas"), {
  ssr: false,
});

/**
 * Holds the constellation back until the browser has nothing better to do.
 *
 * three.js is a 536KB chunk — by a distance the largest thing the site ships,
 * and larger than every other route's JavaScript put together. Loading it
 * through a bare `dynamic()` still queues it during hydration, where it
 * competes with the very paint it is decorating. An idle callback moves it
 * behind first paint, so the hero's headline and the CSS wash underneath the
 * canvas carry the opening moment and the WebGL layer arrives into it.
 *
 * The 2.5s timeout is the backstop for a main thread that never goes idle.
 *
 * Save-Data is honoured outright. This site's own stated principle is to
 * build "for thin margins and slow networks"; sending half a megabyte of
 * decoration to someone who has explicitly asked for less would be at odds
 * with the page it is decorating. Those visitors keep the gradient wash,
 * which is what a machine without WebGL already falls back to.
 */
type Connection = { saveData?: boolean };

export default function DeferredConstellation() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: Connection }).connection;
    if (conn?.saveData) return;

    if (typeof window.requestIdleCallback !== "function") {
      const t = window.setTimeout(() => setShow(true), 400);
      return () => window.clearTimeout(t);
    }

    const id = window.requestIdleCallback(() => setShow(true), { timeout: 2500 });
    return () => window.cancelIdleCallback(id);
  }, []);

  return show ? <ConstellationCanvas /> : null;
}
