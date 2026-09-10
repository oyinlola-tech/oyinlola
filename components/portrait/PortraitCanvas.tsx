"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/**
 * The portrait, as a carved object rather than a photograph.
 *
 * The source is the real photo, but it is never shown as one. It drives a
 * displaced surface that is then shaded two ways:
 *
 *   sketch   — light ink hatching whose stroke direction follows the surface
 *              normal, so the lines wrap the form the way a drawing does,
 *              plus contour ink from a Sobel edge pass.
 *   cartoon  — posterised colour in cel bands, a warm rim light, and a dark
 *              outline where the tone or the normal breaks.
 *
 * The toggle picks the base treatment; the pointer carries a torch that
 * reveals the other one underneath it.
 *
 * Note on the relief: a plain luminance height-map is wrong for a studio
 * portrait — the white shirt is the brightest thing in frame and would come
 * forward while the face sank. Height instead comes from a medallion bulge
 * plus local detail energy (a high-pass), which lifts the features and edges
 * and leaves the smooth backdrop flat.
 */

const VERT = /* glsl */ `
  precision highp float;

  uniform sampler2D uMap;
  uniform float uBulge;
  uniform float uRelief;
  uniform vec2  uAspect;

  varying vec2  vUv;
  varying float vBulge;

  float lum(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

  /* Hemispherical medallion, zero at the rim so the plate has soft edges. */
  float bulgeAt(vec2 uv) {
    vec2 p = (uv - 0.5) * uAspect;
    float r = clamp(length(p) / 0.60, 0.0, 1.0);
    return sqrt(max(1.0 - r * r, 0.0));
  }

  /* Local detail energy — high on features, collar and hair, ~0 on the
     smooth studio backdrop. This is what makes the face read as carved. */
  float detailAt(vec2 uv) {
    float c = lum(texture2D(uMap, uv).rgb);
    float a = lum(texture2D(uMap, uv + vec2( 0.013, 0.0)).rgb);
    float b = lum(texture2D(uMap, uv + vec2(-0.013, 0.0)).rgb);
    float d = lum(texture2D(uMap, uv + vec2(0.0,  0.013)).rgb);
    float e = lum(texture2D(uMap, uv + vec2(0.0, -0.013)).rgb);
    return abs(c - (a + b + d + e) * 0.25);
  }

  void main() {
    vUv = uv;
    float bulge = bulgeAt(uv);
    vBulge = bulge;

    float h = bulge * uBulge + detailAt(uv) * uRelief * bulge;

    vec3 pos = position;
    pos.z += h;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;

  uniform sampler2D uMap;
  uniform vec2  uAspect;
  uniform vec2  uTexel;
  uniform float uMode;      // 0 = sketch, 1 = cartoon
  uniform vec2  uPointer;   // uv space
  uniform float uTorch;     // 0..1
  uniform float uReveal;    // entrance
  uniform vec3  uInk;
  uniform vec3  uPaper;
  uniform vec3  uAccent;

  varying vec2  vUv;
  varying float vBulge;

  float lum(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

  /* Surface normal: the bulge is analytic, the luminance gradient perturbs
     it. Four taps, not the twenty a full re-evaluation of height would cost. */
  vec3 normalAt(vec2 uv) {
    vec2 p = (uv - 0.5) * uAspect;
    float r = clamp(length(p) / 0.60, 0.0, 1.0);
    vec3 n = normalize(vec3(p / 0.60, sqrt(max(1.0 - r * r, 0.04))));

    float l = lum(texture2D(uMap, uv + vec2(uTexel.x, 0.0)).rgb)
            - lum(texture2D(uMap, uv - vec2(uTexel.x, 0.0)).rgb);
    float m = lum(texture2D(uMap, uv + vec2(0.0, uTexel.y)).rgb)
            - lum(texture2D(uMap, uv - vec2(0.0, uTexel.y)).rgb);
    n += vec3(-l, -m, 0.0) * 2.2;
    return normalize(n);
  }

  /* Sobel over luminance — the contour the drawing is hung on. */
  float edgeAt(vec2 uv) {
    vec2 t = uTexel * 1.35;
    float tl = lum(texture2D(uMap, uv + vec2(-t.x,  t.y)).rgb);
    float tc = lum(texture2D(uMap, uv + vec2( 0.0,  t.y)).rgb);
    float tr = lum(texture2D(uMap, uv + vec2( t.x,  t.y)).rgb);
    float ml = lum(texture2D(uMap, uv + vec2(-t.x,  0.0)).rgb);
    float mr = lum(texture2D(uMap, uv + vec2( t.x,  0.0)).rgb);
    float bl = lum(texture2D(uMap, uv + vec2(-t.x, -t.y)).rgb);
    float bc = lum(texture2D(uMap, uv + vec2( 0.0, -t.y)).rgb);
    float br = lum(texture2D(uMap, uv + vec2( t.x, -t.y)).rgb);
    float gx = (tr + 2.0 * mr + br) - (tl + 2.0 * ml + bl);
    float gy = (tl + 2.0 * tc + tr) - (bl + 2.0 * bc + br);
    return length(vec2(gx, gy));
  }

  /* One layer of hatching, rotated into the surface's own frame so the
     strokes bend around the form instead of lying flat across it. */
  float hatch(vec2 p, vec3 n, float angle, float freq, float weight) {
    float a = angle + n.x * 0.9 - n.y * 0.6;
    vec2 dir = vec2(cos(a), sin(a));
    float s = sin(dot(p, dir) * freq);
    return smoothstep(1.0 - weight, 1.0 - weight * 0.35, abs(s));
  }

  vec3 sketch(vec2 uv, vec3 n, float tone, float edge) {
    /* Light ink on a dark ground, so density has to follow brightness:
       the lit shirt takes the most strokes, the backdrop takes none. */
    vec2 p = uv * uAspect * 900.0;

    float ink = 0.0;
    if (tone > 0.20) ink = max(ink, hatch(p, n, 0.70, 0.085, 0.42) * 0.55);
    if (tone > 0.38) ink = max(ink, hatch(p, n, -0.65, 0.105, 0.46) * 0.72);
    if (tone > 0.56) ink = max(ink, hatch(p, n, 1.85, 0.125, 0.50) * 0.88);
    if (tone > 0.74) ink = max(ink, hatch(p, n, 0.15, 0.150, 0.54));

    /* Contour, drawn hard — this is what makes it read as a drawing. */
    float contour = smoothstep(0.22, 0.85, edge);
    ink = max(ink, contour);

    ink *= smoothstep(0.02, 0.22, vBulge);

    vec3 col = mix(uPaper, uInk, clamp(ink, 0.0, 1.0));
    /* A little accent where the light would catch the raised edge. */
    col += uAccent * contour * 0.30 * smoothstep(0.2, 0.9, n.x + 0.5);
    return col;
  }

  vec3 cartoon(vec2 uv, vec3 n, float tone, float edge) {
    vec3 src = texture2D(uMap, uv).rgb;

    /* Posterise, then push saturation so it reads as drawn colour. */
    float bands = 5.0;
    vec3 q = floor(src * bands + 0.5) / bands;
    float g = lum(q);
    q = mix(vec3(g), q, 1.35);

    /* Warm it into the site's palette rather than leaving it studio-neutral. */
    q = mix(q, q * vec3(1.10, 0.98, 0.86), 0.55);

    /* Cel light in three steps. */
    vec3 L = normalize(vec3(-0.45, 0.60, 0.66));
    float d = dot(n, L) * 0.5 + 0.5;
    float step3 = d > 0.68 ? 1.06 : d > 0.46 ? 0.84 : 0.60;
    vec3 col = q * step3;

    /* Rim, in the accent. */
    float rim = pow(1.0 - clamp(n.z, 0.0, 1.0), 2.6);
    col += uAccent * rim * 0.55 * smoothstep(0.05, 0.5, vBulge);

    /* Outline. */
    float outline = smoothstep(0.30, 0.95, edge);
    col = mix(col, uPaper * 0.35, outline * 0.85);

    col = mix(uPaper, col, smoothstep(0.01, 0.20, vBulge));
    return col;
  }

  void main() {
    float alpha = smoothstep(0.0, 0.10, vBulge) * uReveal;
    if (alpha < 0.004) discard;

    vec2 uv = vUv;
    vec3 n = normalAt(uv);
    float tone = lum(texture2D(uMap, uv).rgb);
    float edge = edgeAt(uv);

    vec3 a = sketch(uv, n, tone, edge);
    vec3 b = cartoon(uv, n, tone, edge);

    /* The toggle sets the base; the pointer's torch reveals the other. */
    float base = uMode;
    float d = distance((uv - 0.5) * uAspect, (uPointer - 0.5) * uAspect);
    float torch = smoothstep(0.30, 0.05, d) * uTorch;
    float m = mix(base, 1.0 - base, torch);

    vec3 col = mix(a, b, m);

    /* Ring on the torch edge, so the reveal has a visible boundary. */
    col += uAccent * smoothstep(0.055, 0.0, abs(d - 0.26)) * uTorch * 0.35;

    gl_FragColor = vec4(col, alpha);
  }
`;

export type PortraitMode = "sketch" | "cartoon";

export default function PortraitCanvas({
  src = "/avatar.jpg",
  mode = "sketch",
  className = "",
  onReady,
}: {
  src?: string;
  mode?: PortraitMode;
  className?: string;
  onReady?: (ok: boolean) => void;
}) {
  const hostRef = useRef<HTMLDivElement | null>(null);

  /* Both live in refs so the effect never re-runs on a toggle or on a parent
     re-render — rebuilding the whole WebGL scene to change one uniform would
     drop the texture and replay the entrance. */
  const modeRef = useRef(mode);
  modeRef.current = mode;
  const readyRef = useRef(onReady);
  readyRef.current = onReady;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      readyRef.current?.(false);
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);
    /* Stylisation wants perceptual values, so nothing is transformed on the
       way out — what the shader writes is what is displayed. */
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    renderer.domElement.style.cssText =
      "position:absolute;inset:0;width:100%;height:100%;display:block;";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 0.8, 0.1, 20);
    camera.position.set(0, 0, 4.15);

    const ASPECT = new THREE.Vector2(1, 1.25);

    const uniforms = {
      uMap: { value: null as THREE.Texture | null },
      uAspect: { value: ASPECT },
      uTexel: { value: new THREE.Vector2(1 / 460, 1 / 460) },
      uBulge: { value: 0.30 },
      uRelief: { value: 2.6 },
      uMode: { value: mode === "cartoon" ? 1 : 0 },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uTorch: { value: 0 },
      uReveal: { value: 0 },
      uInk: { value: new THREE.Color(0xf2f4f8) },
      uPaper: { value: new THREE.Color(0x0b0d12) },
      uAccent: { value: new THREE.Color(0xffb067) },
    };

    const geometry = new THREE.PlaneGeometry(1, 1.25, 150, 188);
    const material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms,
      transparent: true,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.setScalar(1.72);
    scene.add(mesh);

    let disposed = false;
    let loaded = false;

    new THREE.TextureLoader().load(
      src,
      (tex) => {
        if (disposed) {
          tex.dispose();
          return;
        }
        tex.colorSpace = THREE.NoColorSpace;
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
        uniforms.uMap.value = tex;
        uniforms.uTexel.value.set(1 / tex.image.width, 1 / tex.image.height);
        loaded = true;
        readyRef.current?.(true);
      },
      undefined,
      () => readyRef.current?.(false),
    );

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = host;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    /* ---- pointer: torch position, and a small tilt ------------------ */
    const target = { x: 0.5, y: 0.5, torch: 0, tiltX: 0, tiltY: 0 };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = host.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      target.x = x;
      target.y = 1 - y;
      const inside = x > -0.15 && x < 1.15 && y > -0.15 && y < 1.15;
      target.torch = inside ? 1 : 0;
      target.tiltY = (x - 0.5) * 0.42;
      target.tiltX = (y - 0.5) * 0.30;
    };
    const onLeave = () => {
      target.torch = 0;
      target.tiltX = target.tiltY = 0;
    };
    if (!coarse) {
      window.addEventListener("pointermove", onMove, { passive: true });
      host.addEventListener("pointerleave", onLeave);
    }

    /* ---- loop -------------------------------------------------------- */
    let raf = 0;
    let last = performance.now();
    const born = last;
    let onScreen = true;
    let visible = true;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      if (!loaded) return;

      uniforms.uReveal.value = Math.min(1, (now - born) / 1000 / 0.9);
      uniforms.uTorch.value = THREE.MathUtils.damp(uniforms.uTorch.value, target.torch, 4, dt);
      uniforms.uPointer.value.x = THREE.MathUtils.damp(uniforms.uPointer.value.x, target.x, 6, dt);
      uniforms.uPointer.value.y = THREE.MathUtils.damp(uniforms.uPointer.value.y, target.y, 6, dt);
      uniforms.uMode.value = THREE.MathUtils.damp(
        uniforms.uMode.value,
        modeRef.current === "cartoon" ? 1 : 0,
        5,
        dt,
      );

      mesh.rotation.y = THREE.MathUtils.damp(mesh.rotation.y, target.tiltY, 3, dt);
      mesh.rotation.x = THREE.MathUtils.damp(mesh.rotation.x, target.tiltX, 3, dt);

      renderer.render(scene, camera);
    };

    const start = () => {
      if (raf || !visible || !onScreen) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const onVis = () => {
      visible = document.visibilityState === "visible";
      visible ? start() : stop();
    };
    document.addEventListener("visibilitychange", onVis);

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        onScreen ? start() : stop();
      },
      { threshold: 0 },
    );
    io.observe(host);

    if (reduced) {
      /* One settled frame, once the texture arrives. */
      const paint = window.setInterval(() => {
        if (!loaded) return;
        uniforms.uReveal.value = 1;
        renderer.render(scene, camera);
        window.clearInterval(paint);
      }, 60);
    } else {
      start();
    }

    return () => {
      disposed = true;
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      uniforms.uMap.value?.dispose();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [src]);

  return <div ref={hostRef} className={`absolute inset-0 ${className}`} aria-hidden="true" />;
}
