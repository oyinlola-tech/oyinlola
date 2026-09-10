"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The oversized status code, lit by the pointer.
 *
 * Three stacked copies of the same glyphs: a base that is barely there, an
 * accent copy revealed inside a disc that follows the pointer, and a green
 * slice that tears across on a long cycle. The pointer position is written
 * to CSS custom properties once per frame rather than to React state — this
 * runs on every mousemove, and re-rendering a tree for it would be wasteful.
 *
 * The glyphs are aria-hidden: the code is already announced by the real text
 * beside them, and a screen reader reading "404" three times is noise.
 */
export default function ErrorCode({ code }: { code: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [lit, setLit] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let frame = 0;
    let x = 0;
    let y = 0;

    const write = () => {
      frame = 0;
      el.style.setProperty("--ex", `${x}px`);
      el.style.setProperty("--ey", `${y}px`);
    };

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      x = e.clientX - r.left;
      y = e.clientY - r.top;
      if (!frame) frame = requestAnimationFrame(write);
    };

    const onEnter = () => setLit(true);
    const onLeave = () => setLit(false);

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={ref} className="err-code" data-lit={lit} aria-hidden="true">
      <span className="err-code__base">{code}</span>
      <span className="err-code__lit">{code}</span>
      <span className="err-code__tear">{code}</span>
    </div>
  );
}
