"use client";

import { usePathname } from "next/navigation";
import RequestTrace from "./RequestTrace";

/**
 * The 404's trace. Shows the address that actually failed, which is the one
 * piece of information a visitor on a dead link does not already have — it
 * tells them whether they mistyped it or whether something linked them here
 * wrongly.
 */
export default function PathTrace() {
  const path = usePathname();
  return (
    <RequestTrace
      rows={[
        { k: "GET", v: path ?? "/" },
        { k: "←  ", v: "404 Not Found", tone: "bad" },
        { k: "via", v: "router · no matching route segment" },
        { k: "hint", v: "the address may have moved, or never existed" },
      ]}
    />
  );
}
