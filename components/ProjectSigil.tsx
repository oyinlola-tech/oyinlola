/**
 * A deterministic lattice "sigil" for each project — the hero field, frozen
 * and tinted. Derived from the slug, so a project always renders the same
 * pattern, and no screenshots or image assets are needed.
 */

function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Small deterministic PRNG seeded from the hash. */
function rng(seed: number) {
  let s = seed || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 100000) / 100000;
  };
}

/**
 * Lattice resolution per surface. The SVG scales uniformly, so a wide banner
 * needs more, smaller dots to avoid rendering as polka dots.
 */
const GRID = {
  banner: { cols: 84, rows: 34, r: 0.34, h: 46 },
  feature: { cols: 30, rows: 16, r: 1, h: 62 },
  compact: { cols: 22, rows: 12, r: 0.85, h: 54 },
} as const;

export default function ProjectSigil({
  slug,
  hue,
  dense = false,
  variant,
  className = "",
}: {
  slug: string;
  hue: number;
  dense?: boolean;
  variant?: keyof typeof GRID;
  className?: string;
}) {
  const key = variant ?? (dense ? "compact" : "feature");
  const { cols, rows, r: rScale, h: gridH } = GRID[key];
  const next = rng(hash(slug));

  // Two smooth wave fields, phase-offset per project, sampled on the lattice.
  const ax = next() * 6.28;
  const ay = next() * 6.28;
  const fx = 0.35 + next() * 0.5;
  const fy = 0.3 + next() * 0.45;
  const tilt = next() * 0.6 - 0.3;

  const w = 100;
  const h = gridH;
  const dots: { x: number; y: number; r: number; o: number; hot: boolean }[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const u = c / (cols - 1);
      const v = r / (rows - 1);

      const field =
        Math.sin(u * cols * fx + ax + v * tilt * 6) * 0.5 +
        Math.sin(v * rows * fy + ay) * 0.35 +
        Math.sin((u + v) * 4.2 + ax * 0.5) * 0.2;

      const lift = (field + 1) / 2; // 0..1
      const y = v * h + (0.5 - lift) * (h * 0.13);
      const depth = 1 - v * 0.55; // far rows sit back

      dots.push({
        x: u * w,
        y,
        r: (0.32 + lift * 0.72) * depth * rScale,
        o: (0.16 + lift * 0.78) * depth,
        hot: lift > 0.84,
      });
    }
  }

  const base = `hsl(${hue} 62% 62%)`;
  const hot = `hsl(${hue} 90% 86%)`;
  const id = `sig-${slug}`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
      role="presentation"
    >
      <defs>
        <radialGradient id={`${id}-glow`} cx="50%" cy="88%" r="72%">
          <stop offset="0%" stopColor={base} stopOpacity="0.34" />
          <stop offset="60%" stopColor={base} stopOpacity="0.07" />
          <stop offset="100%" stopColor={base} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-fade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="34%" stopColor="#fff" stopOpacity="1" />
          <stop offset="100%" stopColor="#fff" stopOpacity="1" />
        </linearGradient>
        <mask id={`${id}-mask`}>
          <rect width={w} height={h} fill={`url(#${id}-fade)`} />
        </mask>
      </defs>

      <rect width={w} height={h} fill={`url(#${id}-glow)`} />

      <g mask={`url(#${id}-mask)`}>
        {dots.map((d, i) => (
          <circle
            key={i}
            cx={d.x}
            cy={d.y}
            r={d.r}
            fill={d.hot ? hot : base}
            opacity={d.o}
          />
        ))}
      </g>
    </svg>
  );
}
