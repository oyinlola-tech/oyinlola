"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * The system constellation.
 *
 * Zudomart is 74 modules across five bounded domains, and this draws exactly
 * that: five clusters, sized 29 / 17 / 8 / 23 / 17, wired within themselves
 * and joined across by an event spine. It is a picture of the architecture
 * the rest of the page talks about, not decoration that happens to be blue.
 *
 * Two draw calls — one THREE.Points for the modules and their file haze, one
 * THREE.LineSegments for the wiring. Everything else is shader work.
 *
 * The entrance is the survey pulse from ThreeUI's Sylva hero: a wavefront
 * expands from the lower left and nothing renders until the front has passed
 * over it, so the system draws itself in rather than fading up.
 */

/* Domain sizes, from internals/ in the Zudomart repository. */
const DOMAINS = [
  { name: "commerce", count: 29, color: 0xffb067 },
  { name: "platform", count: 23, color: 0x56d6c0 },
  { name: "social", count: 17, color: 0x6e92ff },
  { name: "core", count: 17, color: 0xd8e2ff },
  { name: "creator", count: 8, color: 0x9b8cff },
];

const SCAN_DURATION = 3.2;

/* Deterministic PRNG — the same constellation on every load. */
function makeRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 1_000_000) / 1_000_000;
  };
}

const NODE_VERT = /* glsl */ `
  precision highp float;

  attribute vec3  aColor;
  attribute float aSeed;
  attribute float aSize;
  attribute float aRank;   // 1 = module, 0 = file haze

  uniform float uTime;
  uniform float uDpr;
  uniform vec3  uPointer;
  uniform float uPointerOn;

  varying vec3  vColor;
  varying float vRank;
  varying float vHeat;
  varying vec3  vWorld;

  void main() {
    vec3 p = position;

    // Slow independent drift, so the lattice breathes without a noise call.
    float t = uTime * 0.22 + aSeed * 6.2831;
    p += vec3(sin(t), sin(t * 1.31 + 1.7), sin(t * 0.87 + 3.1)) * 0.055 * (0.4 + aRank);

    vec4 world = modelMatrix * vec4(p, 1.0);
    vWorld = world.xyz;

    // The pointer pushes nodes away and lights them.
    float heat = 0.0;
    if (uPointerOn > 0.001) {
      vec3 away = world.xyz - uPointer;
      float d = length(away);
      heat = exp(-d * d * 0.55) * uPointerOn;
      world.xyz += normalize(away + vec3(1e-5)) * heat * 0.42;
    }
    vHeat = heat;

    vec4 mv = viewMatrix * world;
    vColor = aColor;
    vRank = aRank;

    gl_Position  = projectionMatrix * mv;
    gl_PointSize = aSize * uDpr * (1.0 + heat * 1.4) * (46.0 / -mv.z);
  }
`;

const NODE_FRAG = /* glsl */ `
  precision highp float;

  uniform float uOpacity;
  uniform vec3  uScanOrigin;
  uniform float uScanR;
  uniform float uScanOn;
  uniform vec3  uHot;

  varying vec3  vColor;
  varying float vRank;
  varying float vHeat;
  varying vec3  vWorld;

  void main() {
    // Survey pulse: nothing exists ahead of the wavefront.
    if (uScanOn > 0.5 && distance(vWorld, uScanOrigin) > uScanR) discard;

    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;

    float halo = smoothstep(0.5, 0.03, d);
    float core = smoothstep(0.26, 0.0, d);

    // Modules carry a hot centre; the file haze behind them is only halo.
    float cover = mix(halo * 0.58, halo * 0.62 + core * 1.2, vRank);
    vec3  emit  = mix(vColor * 0.7, vColor * (1.0 + core * 1.5), vRank);
    emit = mix(emit, uHot, clamp(vHeat * 0.8, 0.0, 0.8));

    cover *= uOpacity * mix(0.40, 1.0, vRank);
    gl_FragColor = vec4(emit * cover, cover);
  }
`;

const EDGE_VERT = /* glsl */ `
  precision highp float;

  attribute vec3  aColor;
  attribute float aAlong;   // 0..1 along the edge
  attribute float aSeed;
  attribute float aSpine;   // 1 = crosses domains

  varying vec3  vColor;
  varying float vAlong;
  varying float vSeed;
  varying float vSpine;
  varying vec3  vWorld;

  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    vColor = aColor;
    vAlong = aAlong;
    vSeed  = aSeed;
    vSpine = aSpine;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const EDGE_FRAG = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uOpacity;
  uniform vec3  uScanOrigin;
  uniform float uScanR;
  uniform float uScanOn;

  varying vec3  vColor;
  varying float vAlong;
  varying float vSeed;
  varying float vSpine;
  varying vec3  vWorld;

  void main() {
    if (uScanOn > 0.5 && distance(vWorld, uScanOrigin) > uScanR) discard;

    // A message travelling the wire. Spine edges — the cross-domain event
    // bus — run brighter and slower, because that is the traffic that matters.
    float speed = mix(0.55, 0.30, vSpine);
    float head  = fract(uTime * speed + vSeed);
    float dist  = abs(vAlong - head);
    dist = min(dist, 1.0 - dist);
    float pulse = exp(-pow(dist * 14.0, 2.0));

    float base = mix(0.07, 0.13, vSpine);
    float a = (base + pulse * mix(0.55, 0.95, vSpine)) * uOpacity;

    gl_FragColor = vec4(vColor * a * (1.0 + pulse * 2.2), a);
  }
`;

export default function ConstellationCanvas({ className = "" }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const narrow = window.innerWidth < 900;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      return; // No WebGL — the CSS wash underneath stands in.
    }

    const dpr = Math.min(window.devicePixelRatio || 1, narrow ? 2 : 1.75);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.cssText =
      "position:absolute;inset:0;width:100%;height:100%;display:block;";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 120);
    camera.position.set(0, 0.4, 15.5);
    camera.lookAt(0, 0, 0);

    const group = new THREE.Group();
    scene.add(group);

    /* ---- build the constellation ---------------------------------- */
    const rng = makeRng(0x5eed1a);
    const HAZE_PER_MODULE = narrow ? 5 : 11;

    type Node = { p: THREE.Vector3; domain: number };
    const modules: Node[] = [];
    const nodePos: number[] = [];
    const nodeCol: number[] = [];
    const nodeSeed: number[] = [];
    const nodeSize: number[] = [];
    const nodeRank: number[] = [];

    const centres: THREE.Vector3[] = [];
    const tmpColor = new THREE.Color();

    DOMAINS.forEach((domain, di) => {
      // Clusters ride a tilted ring, with the biggest domain nearest the lens.
      const a = (di / DOMAINS.length) * Math.PI * 2 + 0.55;
      const ringR = 3.55;
      const centre = new THREE.Vector3(
        Math.cos(a) * ringR * 1.26,
        Math.sin(a) * ringR * 0.52 + (di === 0 ? -0.35 : 0.2),
        Math.sin(a * 1.7) * 1.5 + (di === 0 ? 1.4 : -0.3),
      );
      centres.push(centre);

      const spread = 0.62 + Math.sqrt(domain.count) * 0.235;
      tmpColor.setHex(domain.color);

      for (let i = 0; i < domain.count; i++) {
        // Fibonacci sphere, so modules distribute evenly rather than clumping.
        const k = i + 0.5;
        const phi = Math.acos(1 - (2 * k) / domain.count);
        const theta = Math.PI * (1 + Math.sqrt(5)) * k;
        const r = spread * (0.55 + 0.45 * Math.cbrt(rng()));
        const p = new THREE.Vector3(
          centre.x + r * Math.sin(phi) * Math.cos(theta),
          centre.y + r * Math.sin(phi) * Math.sin(theta) * 0.78,
          centre.z + r * Math.cos(phi),
        );

        modules.push({ p, domain: di });
        nodePos.push(p.x, p.y, p.z);
        nodeCol.push(tmpColor.r, tmpColor.g, tmpColor.b);
        nodeSeed.push(rng());
        nodeSize.push(2.6 + rng() * 1.5);
        nodeRank.push(1);

        // A haze of source files around each module.
        for (let h = 0; h < HAZE_PER_MODULE; h++) {
          const hr = 0.16 + rng() * 0.42;
          const ha = rng() * Math.PI * 2;
          const hb = Math.acos(2 * rng() - 1);
          nodePos.push(
            p.x + hr * Math.sin(hb) * Math.cos(ha),
            p.y + hr * Math.sin(hb) * Math.sin(ha),
            p.z + hr * Math.cos(hb),
          );
          nodeCol.push(tmpColor.r, tmpColor.g, tmpColor.b);
          nodeSeed.push(rng());
          nodeSize.push(0.9 + rng() * 0.9);
          nodeRank.push(0);
        }
      }
    });

    /* ---- wiring ---------------------------------------------------- */
    const edgePos: number[] = [];
    const edgeCol: number[] = [];
    const edgeAlong: number[] = [];
    const edgeSeed: number[] = [];
    const edgeSpine: number[] = [];

    const pushEdge = (a: THREE.Vector3, b: THREE.Vector3, c: THREE.Color, spine: number) => {
      const seed = rng();
      edgePos.push(a.x, a.y, a.z, b.x, b.y, b.z);
      edgeCol.push(c.r, c.g, c.b, c.r, c.g, c.b);
      edgeAlong.push(0, 1);
      edgeSeed.push(seed, seed);
      edgeSpine.push(spine, spine);
    };

    // Within a domain: join each module to its two nearest neighbours.
    DOMAINS.forEach((domain, di) => {
      const mine = modules.filter((m) => m.domain === di);
      tmpColor.setHex(domain.color);
      for (const m of mine) {
        const near = mine
          .filter((o) => o !== m)
          .map((o) => ({ o, d: m.p.distanceToSquared(o.p) }))
          .sort((x, y) => x.d - y.d)
          .slice(0, 2);
        for (const n of near) pushEdge(m.p, n.o.p, tmpColor, 0);
      }
    });

    // Across domains: the event spine. Each pair of adjacent clusters gets a
    // few links between their closest modules.
    const spineColor = new THREE.Color(0xdfe8ff);
    for (let i = 0; i < DOMAINS.length; i++) {
      const j = (i + 1) % DOMAINS.length;
      const from = modules.filter((m) => m.domain === i);
      const to = modules.filter((m) => m.domain === j);
      const pairs: { a: THREE.Vector3; b: THREE.Vector3; d: number }[] = [];
      for (const a of from)
        for (const b of to) pairs.push({ a: a.p, b: b.p, d: a.p.distanceToSquared(b.p) });
      pairs.sort((x, y) => x.d - y.d);
      for (const pr of pairs.slice(0, 4)) pushEdge(pr.a, pr.b, spineColor, 1);
    }

    /* ---- geometry -------------------------------------------------- */
    const f32 = (a: number[]) => new Float32Array(a);

    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute("position", new THREE.BufferAttribute(f32(nodePos), 3));
    nodeGeo.setAttribute("aColor", new THREE.BufferAttribute(f32(nodeCol), 3));
    nodeGeo.setAttribute("aSeed", new THREE.BufferAttribute(f32(nodeSeed), 1));
    nodeGeo.setAttribute("aSize", new THREE.BufferAttribute(f32(nodeSize), 1));
    nodeGeo.setAttribute("aRank", new THREE.BufferAttribute(f32(nodeRank), 1));

    const edgeGeo = new THREE.BufferGeometry();
    edgeGeo.setAttribute("position", new THREE.BufferAttribute(f32(edgePos), 3));
    edgeGeo.setAttribute("aColor", new THREE.BufferAttribute(f32(edgeCol), 3));
    edgeGeo.setAttribute("aAlong", new THREE.BufferAttribute(f32(edgeAlong), 1));
    edgeGeo.setAttribute("aSeed", new THREE.BufferAttribute(f32(edgeSeed), 1));
    edgeGeo.setAttribute("aSpine", new THREE.BufferAttribute(f32(edgeSpine), 1));

    const shared = {
      uTime: { value: 0 },
      uOpacity: { value: 1 },
      uScanOrigin: { value: new THREE.Vector3(-11, -5.5, 5) },
      uScanR: { value: 0 },
      uScanOn: { value: reduced ? 0 : 1 },
    };

    const nodeMat = new THREE.ShaderMaterial({
      vertexShader: NODE_VERT,
      fragmentShader: NODE_FRAG,
      uniforms: {
        ...shared,
        uDpr: { value: dpr },
        uPointer: { value: new THREE.Vector3(999, 999, 999) },
        uPointerOn: { value: 0 },
        uHot: { value: new THREE.Color(0xfff2e0) },
      },
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.CustomBlending,
      blendEquation: THREE.AddEquation,
      blendSrc: THREE.OneFactor,
      blendDst: THREE.OneFactor,
      blendSrcAlpha: THREE.OneFactor,
      blendDstAlpha: THREE.OneFactor,
    });

    const edgeMat = new THREE.ShaderMaterial({
      vertexShader: EDGE_VERT,
      fragmentShader: EDGE_FRAG,
      uniforms: shared,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.CustomBlending,
      blendEquation: THREE.AddEquation,
      blendSrc: THREE.OneFactor,
      blendDst: THREE.OneFactor,
      blendSrcAlpha: THREE.OneFactor,
      blendDstAlpha: THREE.OneFactor,
    });

    const points = new THREE.Points(nodeGeo, nodeMat);
    const lines = new THREE.LineSegments(edgeGeo, edgeMat);
    points.frustumCulled = lines.frustumCulled = false;
    group.add(lines, points);

    /* ---- sizing ---------------------------------------------------- */
    const resize = () => {
      const { clientWidth: w, clientHeight: h } = host;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.fov = camera.aspect < 1 ? 62 : 42;
      camera.updateProjectionMatrix();
      // The copy owns the left of a wide frame, so the constellation moves
      // right to sit under the cards instead of behind the headline.
      const wide = camera.aspect >= 1;
      group.scale.setScalar(wide ? 1 : 0.72);
      group.position.x = wide ? 2.6 : 0;
      group.position.y = wide ? 0.15 : 0;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    /* ---- pointer --------------------------------------------------- */
    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const ndc = new THREE.Vector2();
    const hit = new THREE.Vector3();
    const pointerTarget = new THREE.Vector3(999, 999, 999);
    let pointerOn = 0;
    const parallax = { x: 0, y: 0, tx: 0, ty: 0 };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = host.getBoundingClientRect();
      parallax.tx = ((e.clientX - r.left) / r.width) * 2 - 1;
      parallax.ty = -(((e.clientY - r.top) / r.height) * 2 - 1);
      ndc.set(parallax.tx, parallax.ty);
      raycaster.setFromCamera(ndc, camera);
      if (raycaster.ray.intersectPlane(plane, hit)) {
        pointerTarget.copy(hit);
        pointerOn = 1;
      }
    };
    const onLeave = () => {
      pointerOn = 0;
      parallax.tx = parallax.ty = 0;
    };
    if (!coarse) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerleave", onLeave);
    }

    /* ---- loop ------------------------------------------------------ */
    let raf = 0;
    let last = performance.now();
    const born = last;
    let visible = true;
    let onScreen = true;
    let scanning = !reduced;

    const scanMax = 34;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const elapsed = (now - born) / 1000;

      shared.uTime.value += dt;

      // Wall-clock, not frame-count: a slow GPU still reveals on schedule.
      if (scanning) {
        const e = Math.min(1, elapsed / SCAN_DURATION);
        shared.uScanR.value = (1 - Math.pow(1 - e, 1.5)) * scanMax;
        if (e >= 1) {
          scanning = false;
          shared.uScanOn.value = 0;
        }
      }
      shared.uOpacity.value = Math.min(1, elapsed / 0.7);

      const u = nodeMat.uniforms;
      u.uPointerOn.value = THREE.MathUtils.damp(u.uPointerOn.value, pointerOn, 3.4, dt);
      (u.uPointer.value as THREE.Vector3).lerp(pointerTarget, 1 - Math.pow(0.002, dt));

      parallax.x = THREE.MathUtils.damp(parallax.x, parallax.tx, 2.4, dt);
      parallax.y = THREE.MathUtils.damp(parallax.y, parallax.ty, 2.4, dt);

      group.rotation.y = shared.uTime.value * 0.035 + parallax.x * 0.30;
      group.rotation.x = Math.sin(shared.uTime.value * 0.14) * 0.05 - parallax.y * 0.16;

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

    const onVisibility = () => {
      visible = document.visibilityState === "visible";
      if (visible) start();
      else stop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen) start();
        else stop();
      },
      { threshold: 0 },
    );
    io.observe(host);

    if (reduced) {
      shared.uTime.value = 9;
      shared.uOpacity.value = 1;
      shared.uScanOn.value = 0;
      renderer.render(scene, camera);
    } else {
      start();
    }

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      nodeGeo.dispose();
      edgeGeo.dispose();
      nodeMat.dispose();
      edgeMat.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div ref={hostRef} aria-hidden="true" className={`absolute inset-0 overflow-hidden ${className}`} />
  );
}
