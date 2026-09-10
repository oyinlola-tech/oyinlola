"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import type { PortraitMode } from "./PortraitCanvas";

const PortraitCanvas = dynamic(() => import("./PortraitCanvas"), { ssr: false });

/**
 * The interactive portrait, with the baked sketch underneath it.
 *
 * The still is a real <Image>, always rendered, and the canvas paints on top
 * once its three textures have loaded. If WebGL is unavailable or a texture
 * fails, nothing is swapped out and the drawing simply stays still — the
 * fallback is the default state rather than an error path.
 */
export default function Portrait({
  slug = "portrait",
  alt,
  className = "",
  showToggle = true,
}: {
  slug?: string;
  alt: string;
  className?: string;
  showToggle?: boolean;
}) {
  const [mode, setMode] = useState<PortraitMode>("sketch");
  const [live, setLive] = useState(false);

  const onReady = useCallback((ok: boolean) => setLive(ok), []);

  return (
    <figure className={className}>
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-line bg-stage-2">
        <Image
          src={`/${slug}-${mode === "cartoon" ? "cartoon" : "sketch"}.png`}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 70vw, 22rem"
          priority={false}
          className={`object-cover transition-opacity duration-700 ${
            live ? "opacity-0" : "opacity-100"
          }`}
        />
        <PortraitCanvas slug={slug} mode={mode} onReady={onReady} />

        {/* Corner registration marks — it is a plate, so it gets plate marks. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-3 rounded-xl border border-white/[0.06]"
        />
      </div>

      {showToggle ? (
        <figcaption className="mt-4 flex items-center justify-between gap-4">
          <div
            className="flex gap-1 rounded-full border border-line p-1"
            role="group"
            aria-label="Portrait treatment"
          >
            {(["sketch", "cartoon"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                aria-pressed={mode === m}
                className={[
                  "rounded-full px-3.5 py-1.5 font-mono text-[0.66rem] uppercase tracking-[0.12em] transition-colors duration-200",
                  mode === m
                    ? "bg-accent text-[#17110a]"
                    : "text-muted hover:bg-white/[0.05] hover:text-ink",
                ].join(" ")}
              >
                {m}
              </button>
            ))}
          </div>
          <p className="hidden font-mono text-[0.62rem] text-faint sm:block">
            {live ? "hover to reveal the other" : "still"}
          </p>
        </figcaption>
      ) : null}
    </figure>
  );
}
