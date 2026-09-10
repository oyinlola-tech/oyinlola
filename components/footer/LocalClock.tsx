"use client";

import { useEffect, useState } from "react";

/**
 * Live local time in Lagos. Rendered empty on the server and on first paint —
 * the clock is the one thing on the page that is genuinely different between
 * the server render and the client, so it is mounted rather than hydrated.
 */
export default function LocalClock() {
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Africa/Lagos",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    const tick = () => setNow(fmt.format(new Date()));
    tick();

    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className="tabular-nums">
      {now ?? "--:--:--"}
      <span className="ml-2 text-faint">WAT</span>
    </span>
  );
}
