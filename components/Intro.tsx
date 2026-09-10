"use client";

import { useEffect } from "react";

/**
 * Entrance choreography and pointer parallax, after Sylva.
 *
 * `.js` is set on <html> by an inline script in the document head, so the
 * pre-intro clip-paths apply before first paint. This component then flips
 * `.is-ready` to run them, and `.intro-done` afterwards to drop the clips —
 * a live clip-path opens a stacking context and would trap children under
 * the canvas.
 *
 * --px / --py are written on <body> once per frame (-1…1). Layers opt in with
 * `.par` and declare their own depth through --pd and --pr.
 */
export default function Intro() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const body = document.body;

    /* The pre-intro styles come from .js on <html>, set while the head was
       parsing. Force a recalc, or the browser computes once, sees the
       finished state, and skips every transition. */
    void body.offsetHeight;
    body.classList.add("is-ready");

    const done = window.setTimeout(
      () => body.classList.add("intro-done"),
      reduced ? 0 : 2600,
    );

    if (reduced || window.matchMedia("(pointer: coarse)").matches) {
      return () => window.clearTimeout(done);
    }

    let raf = 0;
    const target = { x: 0, y: 0 };
    const smooth = { x: 0, y: 0 };
    let lastX: number | null = null;
    let lastY: number | null = null;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onLeave = () => {
      target.x = target.y = 0;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);

    const loop = () => {
      raf = requestAnimationFrame(loop);
      smooth.x += (target.x - smooth.x) * 0.055;
      smooth.y += (target.y - smooth.y) * 0.055;
      /* Three decimals is finer than a pixel of travel, and rounding lets the
         writes stop entirely once the pointer settles — no style invalidation
         on an idle page. */
      const nx = Math.round(smooth.x * 1000) / 1000;
      const ny = Math.round(smooth.y * 1000) / 1000;
      if (nx !== lastX || ny !== lastY) {
        lastX = nx;
        lastY = ny;
        body.style.setProperty("--px", String(nx));
        body.style.setProperty("--py", String(ny));
      }
    };
    raf = requestAnimationFrame(loop);

    return () => {
      window.clearTimeout(done);
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return null;
}
