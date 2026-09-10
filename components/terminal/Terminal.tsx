"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BOOT, QUICK, complete, display, runCommand, type Line } from "./shell";

/**
 * An interactive shell, not a typing animation.
 *
 * It runs against a virtual filesystem generated from the same `content/`
 * modules the rest of the site renders, and `open <slug>` navigates the real
 * router — so the playground is a way through the site rather than a toy in
 * a box beside it.
 *
 * The input is a real <input>, which is what makes it work on a phone (the
 * OS keyboard opens) and with a screen reader. The caret is the browser's;
 * only its colour is ours.
 */

const TONE: Record<string, string> = {
  out: "text-[#c3c9d4]",
  dim: "text-[#6a7180]",
  ok: "text-[#5ee2a0]",
  err: "text-[#ff7a7a]",
  accent: "text-[#ffb067]",
  blue: "text-[#7fa2ff]",
  head: "text-[#f4f5f7] font-medium",
};

type Block = { prompt?: string; input?: string; lines: Line[] };

export default function Terminal({ className = "" }: { className?: string }) {
  const router = useRouter();
  const [cwd, setCwd] = useState("/");
  const [blocks, setBlocks] = useState<Block[]>([{ lines: BOOT }]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1);
  const [focused, setFocused] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  /* Keep the newest output in view without yanking the whole page around —
     scroll the log, never scrollIntoView, which would drag the document. */
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [blocks]);

  const submit = useCallback(
    (raw: string) => {
      const line = raw.trim();
      const prompt = display(cwd);

      if (!line) {
        setBlocks((b) => [...b, { prompt, input: "", lines: [] }]);
        return;
      }

      const result = runCommand(line, cwd);
      setHistory((h) => (h[h.length - 1] === line ? h : [...h, line]));
      setCursor(-1);

      if (result.clear) {
        setBlocks([]);
      } else {
        setBlocks((b) => [...b, { prompt, input: line, lines: result.lines }]);
      }
      if (result.cwd) setCwd(result.cwd);
      if (result.navigate) {
        const to = result.navigate;
        window.setTimeout(() => router.push(to), 380);
      }
    },
    [cwd, router],
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit(value);
      setValue("");
      return;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      const filled = complete(value, cwd);
      if (filled) setValue(filled);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const next = cursor < 0 ? history.length - 1 : Math.max(0, cursor - 1);
      setCursor(next);
      setValue(history[next]);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (cursor < 0) return;
      const next = cursor + 1;
      if (next >= history.length) {
        setCursor(-1);
        setValue("");
      } else {
        setCursor(next);
        setValue(history[next]);
      }
      return;
    }
    if (e.key === "l" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      setBlocks([]);
      return;
    }
    if (e.key === "c" && e.ctrlKey) {
      e.preventDefault();
      setBlocks((b) => [...b, { prompt: display(cwd), input: value + "^C", lines: [] }]);
      setValue("");
    }
  };

  const runQuick = (cmd: string) => {
    setValue("");
    submit(cmd);
    inputRef.current?.focus();
  };

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-line bg-[#090b10] shadow-[0_40px_90px_-50px_rgba(0,0,0,0.95)] ${className}`}
    >
      {/* Chrome */}
      <div className="flex items-center gap-3 border-b border-line bg-[#0f1218] px-4 py-3">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-[#ff5f57]/70" />
          <span className="size-2.5 rounded-full bg-[#febc2e]/70" />
          <span className="size-2.5 rounded-full bg-[#28c840]/70" />
        </span>
        <p className="truncate font-mono text-[0.7rem] tracking-wide text-muted">
          oyinlola@portfolio: <span className="text-[#7fa2ff]">{display(cwd)}</span>
        </p>
        <span className="ml-auto hidden font-mono text-[0.62rem] uppercase tracking-[0.14em] text-faint sm:inline">
          {focused ? "connected" : "click to type"}
        </span>
      </div>

      {/* Log */}
      {/* `tabIndex={0}` is not decoration: a region with its own scrollbar has
          to be reachable by keyboard, or the log can only be read with a
          mouse. `role="log"` with a polite live region means a command's
          output is announced when it arrives, which is the whole point of a
          terminal you can only operate by typing. */}
      <div
        ref={scrollRef}
        onClick={() => inputRef.current?.focus()}
        tabIndex={0}
        role="log"
        aria-live="polite"
        aria-label="Terminal output"
        className="h-[min(62svh,30rem)] overflow-y-auto px-4 py-4 font-mono text-[0.78rem] leading-[1.72] sm:h-[min(64svh,34rem)] sm:px-6 sm:text-[0.82rem]"
      >
        {blocks.map((b, i) => (
          <div key={i} className={i ? "mt-3" : ""}>
            {b.prompt !== undefined ? (
              <p className="flex gap-2">
                <span className="shrink-0 text-[#ffb067]">{b.prompt}</span>
                <span className="shrink-0 text-faint">❯</span>
                <span className="break-all text-ink">{b.input}</span>
              </p>
            ) : null}
            {b.lines.map((l, j) =>
              l.href ? (
                <p key={j}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(l.href!);
                    }}
                    className={`whitespace-pre-wrap break-words text-left underline decoration-dotted underline-offset-4 transition-colors hover:text-ink ${TONE[l.tone ?? "out"]}`}
                  >
                    {l.text}
                  </button>
                </p>
              ) : (
                <p
                  key={j}
                  className={`whitespace-pre-wrap break-words ${TONE[l.tone ?? "out"]}`}
                >
                  {l.text || " "}
                </p>
              ),
            )}
          </div>
        ))}

        {/* Live line */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="shrink-0 text-[#ffb067]">{display(cwd)}</span>
          <span
            className={`shrink-0 transition-colors ${focused ? "text-[#ffb067]" : "text-faint"}`}
          >
            ❯
          </span>
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            aria-label="Terminal input. Type help and press Enter."
            className="term-input min-w-0 flex-1 bg-transparent font-mono text-[0.78rem] text-ink caret-[#ffb067] outline-none placeholder:text-faint focus-visible:outline-none sm:text-[0.82rem]"
            placeholder={blocks.length <= 1 ? "help" : ""}
          />
        </div>
        <div ref={endRef} />
      </div>

      {/* Quick commands — the whole reason this is usable on a phone. */}
      <div className="border-t border-line bg-[#0f1218]">
        <div
          className="flex gap-2 overflow-x-auto px-4 py-3 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="group"
          aria-label="Quick commands"
        >
          {QUICK.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => runQuick(c)}
              className="shrink-0 rounded-full border border-line px-3 py-1.5 font-mono text-[0.68rem] text-ink-dim transition-colors duration-200 hover:border-line-2 hover:bg-white/[0.05] hover:text-ink"
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
