import { NextResponse } from "next/server";
import { site } from "@/content/site";

/**
 * Contact endpoint.
 *
 * The form posts here and this calls Resend's REST API directly — no SDK, so
 * there is no dependency to keep patched for one fetch call.
 *
 * If RESEND_API_KEY is absent the route answers 503 with `not_configured`,
 * and the form falls back to showing the email address rather than pretending
 * a message was sent. A contact form that silently swallows messages is worse
 * than no contact form.
 */

export const runtime = "nodejs";

const MAX_PER_WINDOW = 5;
const WINDOW_MS = 60 * 60 * 1000;
const MIN_FILL_MS = 2_000;

/** Per-instance rate limit. Enough to stop a script; not a security boundary. */
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5_000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
const clean = (v: unknown) => (typeof v === "string" ? v.trim() : "");

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "rate_limited", message: "Too many messages. Try again later." },
      { status: 429 },
    );
  }

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }

  const name = clean(payload.name);
  const email = clean(payload.email);
  const subject = clean(payload.subject);
  const message = clean(payload.message);
  const honeypot = clean(payload.company);
  const startedAt = Number(payload.startedAt) || 0;

  // Bots fill every field and submit instantly. Accept both silently so the
  // sender learns nothing about why it failed.
  if (honeypot || (startedAt && Date.now() - startedAt < MIN_FILL_MS)) {
    return NextResponse.json({ ok: true });
  }

  const fieldErrors: Record<string, string> = {};
  if (name.length < 2) fieldErrors.name = "Tell me your name.";
  if (!isEmail(email)) fieldErrors.email = "That email address doesn't look right.";
  if (message.length < 20) fieldErrors.message = "A little more detail — at least 20 characters.";
  if (message.length > 5_000) fieldErrors.message = "That's over 5,000 characters.";
  if (Object.keys(fieldErrors).length) {
    return NextResponse.json({ error: "invalid", fieldErrors }, { status: 422 });
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? site.email;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!key || !from) {
    return NextResponse.json(
      { error: "not_configured", message: "Email delivery isn't set up yet." },
      { status: 503 },
    );
  }

  const escape = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const heading = subject || "New message from oyinlola.site";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `[oyinlola.site] ${heading}`,
        text: `From: ${name} <${email}>\nSubject: ${heading}\n\n${message}\n\n— sent from the contact form`,
        html: `
          <div style="font-family:ui-sans-serif,system-ui,sans-serif;line-height:1.6;color:#111">
            <p style="margin:0 0 4px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#888">
              oyinlola.site — contact form
            </p>
            <h2 style="margin:0 0 16px;font-size:18px">${escape(heading)}</h2>
            <p style="margin:0 0 16px;font-size:14px;color:#555">
              <strong>${escape(name)}</strong> &lt;${escape(email)}&gt;
            </p>
            <div style="white-space:pre-wrap;border-left:3px solid #ffb067;padding-left:14px;font-size:15px">
${escape(message)}
            </div>
          </div>`,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("resend failed", res.status, detail);
      return NextResponse.json({ error: "send_failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("resend threw", err);
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }
}
