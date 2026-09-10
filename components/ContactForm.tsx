"use client";

import { useRef, useState } from "react";
import { ArrowUpRight, Check, Loader2 } from "lucide-react";
import { site } from "@/content/site";

/**
 * Contact form.
 *
 * Posts to /api/contact, which relays through Resend. Two failure modes are
 * handled honestly rather than hidden: field validation comes back from the
 * server and renders inline, and if delivery is not configured the form says
 * so and hands over the email address instead of claiming success.
 */

type Status = "idle" | "sending" | "sent" | "error";
type Errors = Partial<Record<"name" | "email" | "message", string>>;

const SUBJECTS = [
  "Role or contract",
  "Project enquiry",
  "Collaboration",
  "Something else",
];

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [notice, setNotice] = useState("");
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const startedAt = useRef(Date.now());

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    const form = e.currentTarget;
    const data = new FormData(form);

    setStatus("sending");
    setErrors({});
    setNotice("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          subject,
          message: data.get("message"),
          company: data.get("company"),
          startedAt: startedAt.current,
        }),
      });

      const body = await res.json().catch(() => ({}));

      if (res.ok) {
        setStatus("sent");
        form.reset();
        return;
      }

      if (res.status === 422 && body.fieldErrors) {
        setErrors(body.fieldErrors);
        setStatus("idle");
        return;
      }

      setStatus("error");
      setNotice(
        body.error === "not_configured"
          ? "Email delivery isn't switched on yet."
          : body.error === "rate_limited"
            ? "That's a few messages in a short time. Try again later."
            : "The message didn't get through.",
      );
    } catch {
      setStatus("error");
      setNotice("The message didn't get through — you may be offline.");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-signal/25 bg-signal/[0.06] p-8 sm:p-10">
        <span className="inline-flex size-10 items-center justify-center rounded-full bg-signal/15 text-signal">
          <Check className="size-5" />
        </span>
        <h3 className="font-display mt-5 text-2xl font-medium tracking-tight text-ink">
          Message sent.
        </h3>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-dim">
          It lands in my inbox directly and I reply to everything — usually within a day or two.
        </p>
        <button
          type="button"
          onClick={() => {
            startedAt.current = Date.now();
            setStatus("idle");
          }}
          className="link-wipe mt-6 text-sm text-accent"
        >
          Send another
        </button>
      </div>
    );
  }

  const field =
    "w-full rounded-xl border border-line bg-stage-2/70 px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-faint focus:border-accent/50 focus:bg-stage-3/70";

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {/* Honeypot — visually and semantically out of the way. */}
      <div className="absolute left-[-9999px] top-0" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="label block">
            Name
          </label>
          <input
            id="name"
            name="name"
            required
            autoComplete="name"
            placeholder="Your name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={`mt-2.5 ${field} ${errors.name ? "border-[#ff7a7a]/60" : ""}`}
          />
          {errors.name ? (
            <p id="name-error" className="mt-2 text-xs text-[#ff7a7a]">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="email" className="label block">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={`mt-2.5 ${field} ${errors.email ? "border-[#ff7a7a]/60" : ""}`}
          />
          {errors.email ? (
            <p id="email-error" className="mt-2 text-xs text-[#ff7a7a]">
              {errors.email}
            </p>
          ) : null}
        </div>
      </div>

      <fieldset>
        <legend className="label">What's this about</legend>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {SUBJECTS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSubject(s)}
              aria-pressed={subject === s}
              className={[
                "rounded-full border px-4 py-2 text-xs transition-colors duration-200",
                subject === s
                  ? "border-accent bg-accent text-[#17110a]"
                  : "border-line text-ink-dim hover:border-line-2 hover:text-ink",
              ].join(" ")}
            >
              {s}
            </button>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="message" className="label block">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="What are you building, and where does it need help?"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={`mt-2.5 resize-y ${field} ${errors.message ? "border-[#ff7a7a]/60" : ""}`}
        />
        {errors.message ? (
          <p id="message-error" className="mt-2 text-xs text-[#ff7a7a]">
            {errors.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <button
          type="submit"
          disabled={status === "sending"}
          className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[0.95rem] font-medium text-stage transition-colors duration-300 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "sending" ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Sending
            </>
          ) : (
            <>
              Send message
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </>
          )}
        </button>

        <p className="text-xs text-muted">
          Or email{" "}
          <a href={`mailto:${site.email}`} className="link-wipe text-accent">
            {site.email}
          </a>
        </p>
      </div>

      <p aria-live="polite" className="min-h-5 text-sm text-[#ff7a7a]">
        {status === "error" ? (
          <>
            {notice}{" "}
            <a href={`mailto:${site.email}`} className="link-wipe text-accent">
              Email me instead
            </a>
            .
          </>
        ) : null}
      </p>
    </form>
  );
}
