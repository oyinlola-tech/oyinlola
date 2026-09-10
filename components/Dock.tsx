"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { nav, site } from "@/content/site";

/**
 * A floating dock, after ThreeUI's Sylva hero: pills magnify as the pointer
 * nears them, over a rim highlight that points back at the pointer.
 *
 * Both are springs, both run off one rAF, and both switch off for a coarse
 * pointer — a dock that magnifies on touch reads as broken, because there is
 * no hover to anticipate the tap.
 *
 * Every layout read happens inside the frame, never in the pointer handler:
 * the items resize as they grow, so their rects must be re-read, and doing
 * that per pointermove forces a synchronous layout several times a frame.
 */

type ItemState = {
  el: HTMLElement;
  w: number;
  h: number;
  v: number;
  vel: number;
  target: number;
  mark: boolean;
};

type SpecState = {
  el: HTMLElement;
  ang: number;
  tAng: number;
  br: number;
  tBr: number;
  focused: boolean;
  reach: number;
};

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

export default function Dock() {
  const pathname = usePathname();
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const fineHover = () =>
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    let items: ItemState[] = [];
    let specs: SpecState[] = [];
    let on = fineHover();
    let live = false;
    let keyDriven = false;
    let dirty = false;
    let specDirty = false;
    let u = 1;

    let aimX = 0;
    let aimY = 0;
    let aimSeen = false;
    let aimMoved = false;

    const measure = () => {
      on = fineHover();
      u = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--u")) || 1;

      for (const st of items) {
        st.el.style.width = st.el.style.height = st.el.style.transform = "";
        st.el.dataset.near = "false";
        st.v = st.vel = st.target = 0;
      }
      for (const st of items) {
        const r = st.el.getBoundingClientRect();
        st.w = r.width;
        st.h = r.height;
      }
      live = false;
      dirty = true;
      aimMoved = aimSeen;
    };

    const rest = () => {
      live = false;
      dirty = true;
      for (const st of items) {
        st.target = 0;
        st.el.dataset.near = "false";
      }
    };

    const collect = () => {
      items = Array.from(root.querySelectorAll<HTMLElement>("[data-dock]")).map((el) => ({
        el,
        w: 0,
        h: 0,
        v: 0,
        vel: 0,
        target: 0,
        mark: el.classList.contains("dock-mark"),
      }));
      specs = Array.from(document.querySelectorAll<HTMLElement>("[data-spec]")).map((el) => ({
        el,
        ang: 2.4,
        tAng: 2.4,
        br: 0,
        tBr: 0,
        focused: false,
        reach: el.classList.contains("dock") ? 250 : 185,
      }));
    };

    collect();
    measure();
    document.fonts?.ready.then(measure).catch(() => {});
    window.addEventListener("resize", measure);

    /* ---- dock spring ---------------------------------------------- */
    const stepDock = (dt: number) => {
      if (!on) return;

      /* Targets are only recomputed when the pointer actually MOVES.
         Re-deriving them every frame from a stale position oscillates: the
         capsule is centred, so a growing pill shifts the bar sideways, which
         slides a different pill under a stationary cursor, which grows
         instead, which shifts it back. */
      if (aimSeen && aimMoved && !keyDriven) {
        const rr = root.getBoundingClientRect();
        /* The catch box reaches well below the bar, because that is where the
           pills grow to and the pointer has to be able to follow them. */
        if (
          aimX > rr.left - 48 &&
          aimX < rr.right + 48 &&
          aimY > rr.top - 44 &&
          aimY < rr.bottom + 104
        ) {
          for (const st of items) {
            const r = st.el.getBoundingClientRect();
            const prox = clamp01(1 - Math.abs(aimX - (r.left + r.width * 0.5)) / (128 * u));
            st.target = prox * prox * (3 - 2 * prox);
            st.el.dataset.near = st.target > 0.08 ? "true" : "false";
          }
          live = true;
          dirty = true;
        } else if (live) rest();
      }

      if (!dirty) return;
      let moving = false;
      for (const st of items) {
        st.vel += (st.target - st.v) * 190 * dt;
        st.vel *= Math.exp(-23 * dt);
        st.v += st.vel * dt;
        if (Math.abs(st.target - st.v) < 0.001 && Math.abs(st.vel) < 0.004) {
          st.v = st.target;
          st.vel = 0;
        } else moving = true;

        const v = Math.min(Math.max(st.v, 0), 1.08);
        const ew = st.mark ? 14 * u : Math.min(18 * u, st.w * 0.24);
        const eh = st.mark ? 14 * u : 16 * u;
        st.el.style.width = `${(st.w + ew * v).toFixed(2)}px`;
        st.el.style.height = `${(st.h + eh * v).toFixed(2)}px`;
        st.el.style.transform = `translateY(${(v * 3.5 * u).toFixed(2)}px)`;
      }
      if (!moving) dirty = false;
    };

    /* ---- specular rim --------------------------------------------- */
    const stepSpec = (dt: number) => {
      if (!on) return;

      if (aimSeen && aimMoved) {
        for (const st of specs) {
          const r = st.el.getBoundingClientRect();
          const cx = r.left + r.width * 0.5;
          const cy = r.top + r.height * 0.5;
          const dx = Math.max(r.left - aimX, 0, aimX - r.right);
          const dy = Math.max(r.top - aimY, 0, aimY - r.bottom);
          const d = Math.hypot(dx, dy);
          /* Inside the box there is no direction to point at, so bias off the
             corner and let the offset from centre steer it. */
          st.tAng =
            d === 0
              ? Math.atan2(2 / Math.max(r.height, 1), -2 / Math.max(r.width, 1)) +
                ((aimX - cx) / Math.max(r.width * 0.5, 1)) * 0.3 +
                ((cy - aimY) / Math.max(r.height * 0.5, 1)) * 0.15
              : Math.atan2(cy - aimY, aimX - cx);
          const raw = clamp01(1 - d / (st.reach * u));
          st.tBr = Math.max(raw * raw * (3 - 2 * raw), st.focused ? 0.9 : 0);
        }
        specDirty = true;
      }

      if (!specDirty) return;
      let moving = false;
      for (const st of specs) {
        const diff = ((st.tAng - st.ang + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
        st.ang += diff * (1 - Math.exp(-dt * 8));
        st.br += (st.tBr - st.br) * (1 - Math.exp(-dt * 9));
        if (Math.abs(diff) < 0.001 && Math.abs(st.tBr - st.br) < 0.002) {
          st.ang = st.tAng;
          st.br = st.tBr;
        } else moving = true;
        st.el.style.setProperty("--spec-angle", `${st.ang.toFixed(4)}rad`);
        st.el.style.setProperty("--spec-bright", (clamp01(st.br) * 0.92).toFixed(3));
      }
      if (!moving) specDirty = false;
    };

    /* ---- input ----------------------------------------------------- */
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      aimX = e.clientX;
      aimY = e.clientY;
      aimSeen = true;
      aimMoved = true;
      keyDriven = false;
      dirty = specDirty = true;
    };
    const onLeave = () => {
      aimSeen = false;
      rest();
      for (const st of specs) st.tBr = st.focused ? 0.9 : 0;
      specDirty = true;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);

    /* Keyboard gets the same magnification, centred on the focused pill. */
    const onFocusIn = (e: FocusEvent) => {
      const item = (e.target as HTMLElement)?.closest<HTMLElement>("[data-dock]");
      if (!item || !on) return;
      const idx = items.findIndex((st) => st.el === item);
      items.forEach((st, i) => {
        st.target = i === idx ? 1 : Math.abs(i - idx) === 1 ? 0.24 : 0;
        st.el.dataset.near = st.target > 0.08 ? "true" : "false";
      });
      live = false;
      keyDriven = true;
      dirty = true;
    };
    const onFocusOut = () => {
      requestAnimationFrame(() => {
        if (!root.contains(document.activeElement)) {
          keyDriven = false;
          rest();
        }
      });
    };
    root.addEventListener("focusin", onFocusIn);
    root.addEventListener("focusout", onFocusOut);

    const specListeners = specs.map((st) => {
      const fin = () => {
        st.focused = true;
        specDirty = true;
      };
      const fout = () => {
        st.focused = false;
        specDirty = true;
      };
      st.el.addEventListener("focusin", fin);
      st.el.addEventListener("focusout", fout);
      return { st, fin, fout };
    });

    /* ---- loop ------------------------------------------------------ */
    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      stepDock(dt);
      stepSpec(dt);
      aimMoved = false;
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      root.removeEventListener("focusin", onFocusIn);
      root.removeEventListener("focusout", onFocusOut);
      for (const { st, fin, fout } of specListeners) {
        st.el.removeEventListener("focusin", fin);
        st.el.removeEventListener("focusout", fout);
      }
    };
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <div className="dock-wrap">
      <nav ref={rootRef} className="dock" data-spec aria-label="Primary">
        <Link
          href="/"
          className="dock-item dock-mark"
          data-dock
          data-spec
          style={{ "--d": "120ms" } as React.CSSProperties}
          aria-label={`${site.short} — home`}
        >
          <Glyph name="mark" />
        </Link>

        {nav.map((item, i) => (
          <Link
            key={item.href}
            href={item.href}
            data-dock
            data-spec
            className={[
              "dock-item",
              isActive(item.href) ? "is-active" : "",
              item.cta ? "dock-item--cta" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            style={{ "--d": `${180 + i * 50}ms` } as React.CSSProperties}
            aria-current={isActive(item.href) ? "page" : undefined}
          >
            <span className="glyph" aria-hidden="true">
              <Glyph name={item.glyph} />
            </span>
            <span className="hidden md:inline">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}

function Glyph({ name }: { name: string }) {
  switch (name) {
    case "mark":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <g fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
            <path d="M3 15c3.4-7 6.2-7 9 0s5.6 7 9 0" />
            <path d="M3 9.5c3.4-7 6.2-7 9 0s5.6 7 9 0" opacity=".4" />
          </g>
        </svg>
      );
    case "home":
      return (
        <svg viewBox="0 0 16 16">
          <path d="M2.4 7 8 2.6 13.6 7v6.2a.8.8 0 0 1-.8.8H3.2a.8.8 0 0 1-.8-.8Z" />
          <path d="M6.3 14V9.4h3.4V14" />
        </svg>
      );
    case "work":
      return (
        <svg viewBox="0 0 16 16">
          <rect x="2.2" y="4.6" width="11.6" height="8.8" rx="1.2" />
          <path d="M5.8 4.6V3.4a1 1 0 0 1 1-1h2.4a1 1 0 0 1 1 1v1.2" />
          <path d="M2.2 8.4h11.6" />
        </svg>
      );
    case "about":
      return (
        <svg viewBox="0 0 16 16">
          <circle cx="8" cy="5.6" r="2.6" />
          <path d="M2.9 13.4a5.1 5.1 0 0 1 10.2 0" />
        </svg>
      );
    case "stack":
      return (
        <svg viewBox="0 0 16 16">
          <path d="M8 2.2 14 5.4 8 8.6 2 5.4Z" />
          <path d="m2 8.6 6 3.2 6-3.2" />
          <path d="m2 11.6 6 3.2 6-3.2" opacity=".55" />
        </svg>
      );
    case "cv":
      return (
        <svg viewBox="0 0 16 16">
          <path d="M3.6 2.4h5.6L12.4 5.6v8a1 1 0 0 1-1 1H4.6a1 1 0 0 1-1-1V3.4a1 1 0 0 1 1-1Z" />
          <path d="M9 2.4v3.2h3.4" />
          <path d="M5.8 8.6h4.4M5.8 11h3" />
        </svg>
      );
    case "lab":
      return (
        <svg viewBox="0 0 16 16">
          <path d="M6.4 2.2v4.1L2.9 12a1.1 1.1 0 0 0 .95 1.7h8.3A1.1 1.1 0 0 0 13.1 12L9.6 6.3V2.2" />
          <path d="M5.4 2.2h5.2" />
          <path d="M4.9 9.2h6.2" />
        </svg>
      );
    case "contact":
      return (
        <svg viewBox="0 0 16 16">
          <path d="M6.6 2.6h5.1a1 1 0 0 1 1 1v8.8a1 1 0 0 1-1 1H6.6" />
          <path d="M2.6 8h6.6" />
          <path d="m7 5.6 2.4 2.4L7 10.4" />
        </svg>
      );
    default:
      return null;
  }
}
