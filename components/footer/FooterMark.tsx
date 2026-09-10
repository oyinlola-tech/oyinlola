"use client";

import { useEffect, useRef } from "react";

/**
 * The colossal wordmark that closes the page — the footer's answer to the
 * hero's ghost lettering, run to the full width of the measure and cropped a
 * little below the baseline so it bleeds off the bottom of the document.
 *
 * It is SVG rather than styled text because `textLength` makes the fit exact:
 * the browser distributes the difference into the tracking, so the name spans
 * the measure whatever it says and whether or not the display face has loaded
 * yet. Sizing it with a font-size guessed from the character count would
 * under-fill or overflow every time either of those changed.
 *
 * Two identical layers sit on top of each other: a near-invisible base, and a
 * warm copy masked to a soft disc that follows the pointer, so the letters are
 * lit rather than merely hovered. Coarse pointers and reduced motion never arm
 * it — the base layer is the whole design without it.
 */

/* Type metrics, in the SVG's own user units. Inter Tight's cap height is
   ~0.727em, so caps set at 200 stand 145 tall; the baseline sits at 150 and
   the box stops 10 short of it, which is the bleed. */
const BOX_W = 1000;
const BOX_H = 140;
const BASELINE = 150;
const SIZE = 200;

export default function FooterMark({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let frame = 0;
    let x = 0;
    let y = 0;

    // The write is deferred to a frame: pointermove can fire several times per
    // frame, and every custom-property write invalidates the mask.
    const flush = () => {
      frame = 0;
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
    };

    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      x = e.clientX - r.left;
      y = e.clientY - r.top;
      if (!frame) frame = requestAnimationFrame(flush);
    };

    const enter = () => el.setAttribute("data-lit", "true");
    const leave = () => el.setAttribute("data-lit", "false");

    el.addEventListener("pointermove", move);
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  const layer = (className: string) => (
    <svg
      className={className}
      viewBox={`0 0 ${BOX_W} ${BOX_H}`}
      preserveAspectRatio="xMidYMax meet"
      focusable="false"
    >
      <text x="0" y={BASELINE} fontSize={SIZE} textLength={BOX_W} lengthAdjust="spacing">
        {text.toUpperCase()}
      </text>
    </svg>
  );

  return (
    <div ref={ref} className="footer-mark" aria-hidden="true">
      {layer("footer-mark__base")}
      {layer("footer-mark__lit")}
    </div>
  );
}
