"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * The portrait as a carved object rather than a photograph.
 *
 * The stylising is baked, not derived here: `scripts/bake-portraits.py`
 * produces a light-ink line drawing, a cel-shaded cartoon, and a depth map
 * from each source photo. This component's job is only the third dimension —
 * it displaces a mesh by the depth map, lights the resulting relief, and
 * cross-fades the two treatments.
 *
 * Doing the stylising offline is why it looks like a drawing: a real-time
 * shader cannot afford the repeated median passes and adaptive-palette
 * quantisation that stop cel shading going blotchy.
 *
 * The toggle picks the base treatment. The pointer carries a torch that
 * reveals the other one underneath it.
 */

const VERT = /* glsl */ `
  precision highp float;

  uniform sampler2D uDepth;
  uniform float uBulge;
  uniform float uRelief;
  uniform vec2  uAspect;

  varying vec2  vUv;
  varying float vMask;

  /* Hemispherical medallion, zero at the rim, so the plate has no hard edge. */
  float bulgeAt(vec2 uv) {
    vec2 p = (uv - 0.5) * uAspect;
    float r = clamp(length(p) / 0.62, 0.0, 1.0);
    return sqrt(max(1.0 - r * r, 0.0));
  }

  void main() {
    vUv = uv;
    float bulge = bulgeAt(uv);

    /* The dome shapes the surface; this only takes the hard edge off the
       plate. It has to be a rounded RECTANGLE — a circular mask on a 3:4
       plate cuts most of the top and bottom away. */
    vec2 e = abs(uv - 0.5) * 2.0;
    float box = max(e.x, e.y);
    vMask = 1.0 - smoothstep(0.90, 1.0, box);

    float d = texture2D(uDepth, uv).r;
    float h = bulge * uBulge + (d - 0.45) * uRelief * bulge;

    vec3 pos = position;
    pos.z += h;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;

  uniform sampler2D uSketch;
  uniform sampler2D uCartoon;
  uniform sampler2D uDepth;
  uniform vec2  uAspect;
  uniform vec2  uTexel;
  uniform float uMode;      // 0 = sketch, 1 = cartoon
  uniform vec2  uPointer;
  uniform float uTorch;
  uniform float uReveal;
  uniform vec3  uAccent;
  uniform float uRelief;

  varying vec2  vUv;
  varying float vMask;

  /* Normal of the carved surface: analytic medallion, perturbed by the
     gradient of the depth map. Four taps. */
  vec3 normalAt(vec2 uv) {
    vec2 p = (uv - 0.5) * uAspect;
    float r = clamp(length(p) / 0.62, 0.0, 1.0);
    vec3 n = normalize(vec3(p / 0.62, sqrt(max(1.0 - r * r, 0.05))));

    float dx = texture2D(uDepth, uv + vec2(uTexel.x, 0.0)).r
             - texture2D(uDepth, uv - vec2(uTexel.x, 0.0)).r;
    float dy = texture2D(uDepth, uv + vec2(0.0, uTexel.y)).r
             - texture2D(uDepth, uv - vec2(0.0, uTexel.y)).r;
    n += vec3(-dx, -dy, 0.0) * uRelief * 3.0;
    return normalize(n);
  }

  void main() {
    vec2 uv = vUv;

    vec4 sk = texture2D(uSketch, uv);
    vec3 ct = texture2D(uCartoon, uv).rgb;
    vec3 n = normalAt(uv);

    /* The relief is lit from upper left, the way a drawing on a raised
       surface would be. Kept shallow — this is a carving, not a bust. */
    vec3 L = normalize(vec3(-0.42, 0.62, 0.66));
    float diff = 0.90 + dot(n, L) * 0.24;
    float rim = pow(1.0 - clamp(n.z, 0.0, 1.0), 3.2);

    vec3 sketchCol  = sk.rgb * diff + uAccent * rim * 0.16;
    vec3 cartoonCol = ct * diff + uAccent * rim * 0.10;

    /* Toggle sets the base; the torch reveals the other treatment. */
    float d = distance((uv - 0.5) * uAspect, (uPointer - 0.5) * uAspect);
    float torch = smoothstep(0.32, 0.06, d) * uTorch;
    float m = mix(uMode, 1.0 - uMode, torch);

    vec3 col = mix(sketchCol, cartoonCol, m);

    /* Sketch keeps its ink alpha so it floats on the page; cartoon is a
       solid card. Between them the alpha crossfades with the mix. */
    float alpha = mix(sk.a, 1.0, m) * vMask * uReveal;

    /* A ring on the torch boundary, so the reveal has a visible edge. */
    float ring = smoothstep(0.05, 0.0, abs(d - 0.27)) * uTorch;
    col += uAccent * ring * 0.28;
    alpha = max(alpha, ring * 0.32 * vMask);

    if (alpha < 0.004) discard;
    gl_FragColor = vec4(col, alpha);
  }
`;

export type PortraitMode = "sketch" | "cartoon";

export default function PortraitCanvas({
  slug = "portrait",
  mode = "sketch",
  className = "",
  onReady,
}: {
  slug?: string;
  mode?: PortraitMode;
  className?: string;
  onReady?: (ok: boolean) => void;
}) {
  const hostRef = useRef<HTMLDivElement | null>(null);

  /* Both live in refs so the effect never re-runs on a toggle or a parent
     re-render — rebuilding the scene to change one uniform would drop the
     textures and replay the entrance. */
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

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    /* The assets are already in perceptual space, so nothing is transformed
       on the way out — what the shader writes is what is displayed. */
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    renderer.domElement.style.cssText =
      "position:absolute;inset:0;width:100%;height:100%;display:block;";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 0.75, 0.1, 20);
    camera.position.set(0, 0, 4.1);

    const uniforms = {
      uSketch: { value: null as THREE.Texture | null },
      uCartoon: { value: null as THREE.Texture | null },
      uDepth: { value: null as THREE.Texture | null },
      uAspect: { value: new THREE.Vector2(1, 1.333) },
      uTexel: { value: new THREE.Vector2(1 / 405, 1 / 540) },
      uBulge: { value: 0.17 },
      uRelief: { value: 0.22 },
      uMode: { value: mode === "cartoon" ? 1 : 0 },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uTorch: { value: 0 },
      uReveal: { value: 0 },
      uAccent: { value: new THREE.Color(0xffb067) },
    };

    const geometry = new THREE.PlaneGeometry(1, 1.333, 160, 210);
    const material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.setScalar(1.62);
    scene.add(mesh);

    let disposed = false;
    let pending = 3;
    let loaded = false;

    const loader = new THREE.TextureLoader();
    const grab = (
      url: string,
      key: "uSketch" | "uCartoon" | "uDepth",
      after?: (t: THREE.Texture) => void,
    ) =>
      loader.load(
        url,
        (tex) => {
          if (disposed) {
            tex.dispose();
            return;
          }
          tex.colorSpace = THREE.NoColorSpace;
          tex.minFilter = THREE.LinearMipmapLinearFilter;
          tex.magFilter = THREE.LinearFilter;
          tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
          tex.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
          uniforms[key].value = tex;
          after?.(tex);
          if (--pending === 0) {
            loaded = true;
            readyRef.current?.(true);
          }
        },
        undefined,
        () => readyRef.current?.(false),
      );

    grab(`/${slug}-sketch.png`, "uSketch");
    grab(`/${slug}-cartoon.webp`, "uCartoon");
    grab(`/${slug}-depth.png`, "uDepth", (t) => {
      const img = t.image as { width: number; height: number };
      uniforms.uTexel.value.set(1 / img.width, 1 / img.height);
    });

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

    /* ---- pointer: torch, and a small tilt --------------------------- */
    const target = { x: 0.5, y: 0.5, torch: 0, tiltX: 0, tiltY: 0 };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = host.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      target.x = x;
      target.y = 1 - y;
      target.torch = x > -0.2 && x < 1.2 && y > -0.2 && y < 1.2 ? 1 : 0;
      target.tiltY = (x - 0.5) * 0.38;
      target.tiltX = (y - 0.5) * 0.26;
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
    let bornAt = 0;
    let onScreen = true;
    let visible = true;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!loaded) return;
      if (!bornAt) bornAt = now;

      uniforms.uReveal.value = Math.min(1, (now - bornAt) / 900);
      uniforms.uTorch.value = THREE.MathUtils.damp(uniforms.uTorch.value, target.torch, 4, dt);
      uniforms.uPointer.value.x = THREE.MathUtils.damp(uniforms.uPointer.value.x, target.x, 6, dt);
      uniforms.uPointer.value.y = THREE.MathUtils.damp(uniforms.uPointer.value.y, target.y, 6, dt);
      /* Fast enough to settle in a handful of frames, because a weak GPU
         gets few of them and a half-finished crossfade reads as a haze of
         the other treatment rather than as a transition. */
      const want = modeRef.current === "cartoon" ? 1 : 0;
      uniforms.uMode.value = THREE.MathUtils.damp(uniforms.uMode.value, want, 9, dt);
      if (Math.abs(want - uniforms.uMode.value) < 0.01) uniforms.uMode.value = want;

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
      /* One settled frame, once the textures land. */
      const paint = window.setInterval(() => {
        if (!loaded) return;
        uniforms.uReveal.value = 1;
        renderer.render(scene, camera);
        window.clearInterval(paint);
      }, 80);
      window.setTimeout(() => window.clearInterval(paint), 8000);
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
      uniforms.uSketch.value?.dispose();
      uniforms.uCartoon.value?.dispose();
      uniforms.uDepth.value?.dispose();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [slug]);

  return <div ref={hostRef} className={`absolute inset-0 ${className}`} aria-hidden="true" />;
}
