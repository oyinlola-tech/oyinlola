import { ImageResponse } from "next/og";

/**
 * iOS ignores SVG favicons and will screenshot the page instead, so the
 * touch icon has to be a raster. Generated from the same two strokes as
 * icon.svg rather than kept as a second binary that can fall out of step.
 */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#07080b",
        }}
      >
        <svg width="136" height="136" viewBox="0 0 32 32">
          <g fill="none" stroke="#FFB067" strokeWidth="1.9" strokeLinecap="round">
            <path d="M6 20c4-8 7.5-8 11 0s7 8 9 0" opacity=".95" />
            <path d="M6 13c4-8 7.5-8 11 0s7 8 9 0" opacity=".42" />
          </g>
        </svg>
      </div>
    ),
    size,
  );
}
