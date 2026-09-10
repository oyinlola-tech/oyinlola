/**
 * A request trace, rendered the way a log line is.
 *
 * Presentational and server-renderable on purpose — the 404 feeds it a
 * pathname from the client, the 500 feeds it a digest from its props, and
 * neither needs this file to ship JavaScript.
 */
export type TraceRow = { k: string; v: string; tone?: "out" | "bad" | "good" };

const TONE: Record<string, string> = {
  out: "text-ink-dim",
  bad: "text-[#ff7a7a]",
  good: "text-signal",
};

export default function RequestTrace({ rows }: { rows: TraceRow[] }) {
  return (
    <div className="err-trace">
      {rows.map((r, i) => (
        <p
          key={r.k}
          className="err-trace__row"
          style={{ "--d": `${120 + i * 90}ms` } as React.CSSProperties}
        >
          <span className="err-trace__k">{r.k}</span>
          <span className={TONE[r.tone ?? "out"]}>{r.v}</span>
        </p>
      ))}
    </div>
  );
}
