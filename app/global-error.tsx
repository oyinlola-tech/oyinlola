"use client";

/**
 * The last resort: the root layout itself threw.
 *
 * This file replaces the root layout when active, which per the Next docs
 * means it receives none of it — no globals.css, no next/font variables, no
 * dock, no footer. So everything here is inlined and leans on a system font
 * stack. It is deliberately the plainest page on the site: if the layout is
 * broken, the recovery screen must not depend on anything that could also be
 * broken.
 *
 * `metadata` is unavailable in a Client Component, so the title is set with
 * React's own <title>.
 */
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="en">
      <head>
        <title>Something went wrong — Oyinlola</title>
        <meta name="robots" content="noindex" />
      </head>
      <body
        style={{
          margin: 0,
          minHeight: "100svh",
          display: "grid",
          placeContent: "center",
          gap: "1.5rem",
          padding: "2rem 1.5rem",
          background: "#07080b",
          color: "#f4f5f7",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          WebkitFontSmoothing: "antialiased",
        }}
      >
        <main style={{ maxWidth: "34rem" }}>
          <p
            style={{
              margin: 0,
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: "0.6875rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#ffb067",
            }}
          >
            Status · 500
          </p>

          <h1
            style={{
              margin: "1.25rem 0 0",
              fontSize: "clamp(1.9rem, 6vw, 3rem)",
              fontWeight: 500,
              letterSpacing: "-0.035em",
              lineHeight: 1.05,
            }}
          >
            The page could not be built.
          </h1>

          <p
            style={{
              margin: "1.25rem 0 0",
              lineHeight: 1.6,
              color: "#a7adb8",
            }}
          >
            An error reached the root of the application, so even the layout is
            gone. Reloading usually clears it.
          </p>

          {error.digest ? (
            <p
              style={{
                margin: "1.5rem 0 0",
                paddingLeft: "1rem",
                borderLeft: "1px solid rgba(255,255,255,0.14)",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                fontSize: "0.775rem",
                color: "#808795",
              }}
            >
              ref {error.digest}
            </p>
          ) : null}

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.75rem",
              marginTop: "2.25rem",
            }}
          >
            <button
              type="button"
              onClick={() => retry()}
              style={{
                font: "inherit",
                fontSize: "0.875rem",
                fontWeight: 500,
                cursor: "pointer",
                padding: "0.65rem 1.25rem",
                borderRadius: "999px",
                border: "1px solid #ffb067",
                background: "#ffb067",
                color: "#07080b",
              }}
            >
              Try again
            </button>
            {/* A plain anchor, not next/link: the router is part of what may
                have failed, so this has to be a real navigation. */}
            <a
              href="/"
              style={{
                font: "inherit",
                fontSize: "0.875rem",
                textDecoration: "none",
                padding: "0.65rem 1.25rem",
                borderRadius: "999px",
                border: "1px solid rgba(255,255,255,0.14)",
                color: "#a7adb8",
              }}
            >
              Back home
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
