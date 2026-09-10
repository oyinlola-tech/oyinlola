import { ImageResponse } from "next/og";
import { site, telemetry } from "@/content/site";

/**
 * The social card.
 *
 * Generated rather than drawn, so it can never drift out of sync with the
 * facts on the page — the telemetry row below is the same array the hero
 * reads from. Rendered at build time into a static PNG.
 *
 * No custom font is loaded on purpose: a TTF large enough to carry Inter
 * Tight would eat most of the 500KB budget this route is allowed, and the
 * card's recognisability comes from the stage, the accent and the mark
 * rather than from the exact typeface.
 */
export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#07080b",
          padding: "72px 80px",
          position: "relative",
        }}
      >
        {/* The warm bloom the site closes on, top-right this time. */}
        <div
          style={{
            position: "absolute",
            top: -220,
            right: -160,
            width: 700,
            height: 700,
            borderRadius: 700,
            background: "radial-gradient(circle, rgba(255,176,103,0.20) 0%, rgba(255,176,103,0) 70%)",
          }}
        />

        {/* ── mark + wordmark ─────────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="56" height="56" viewBox="0 0 32 32">
            <rect width="32" height="32" rx="7" fill="#0b0d12" />
            <g fill="none" stroke="#FFB067" strokeWidth="1.9" strokeLinecap="round">
              <path d="M6 20c4-8 7.5-8 11 0s7 8 9 0" opacity=".95" />
              <path d="M6 13c4-8 7.5-8 11 0s7 8 9 0" opacity=".42" />
            </g>
          </svg>
          <div
            style={{
              fontSize: 20,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "#808795",
            }}
          >
            {site.url.replace("https://", "")}
          </div>
        </div>

        {/* ── the claim ───────────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 74,
              lineHeight: 1.02,
              letterSpacing: -2.5,
              color: "#f4f5f7",
              maxWidth: 940,
            }}
          >
            {site.name}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              marginTop: 26,
            }}
          >
            <div style={{ width: 44, height: 3, background: "#ffb067" }} />
            <div style={{ fontSize: 30, color: "#a7adb8" }}>
              {`${site.role} · Go, Python & TypeScript`}
            </div>
          </div>
        </div>

        {/* ── telemetry ───────────────────────────────────────────── */}
        <div style={{ display: "flex", gap: 64 }}>
          {telemetry.map((t) => (
            <div key={t.label} style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 40, color: "#f4f5f7" }}>{t.value}</div>
              <div
                style={{
                  fontSize: 18,
                  marginTop: 6,
                  letterSpacing: 1.6,
                  textTransform: "uppercase",
                  color: "#808795",
                }}
              >
                {t.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
