# oyinlola.site

Portfolio of **Oluwayemi Oyinlola Michael** — software engineer, backend developer.

Seven pages, fifteen long-form case studies, an interactive shell, a
printable CV, and a procedural WebGL hero. Everything is prerendered except
the contact endpoint.

---

## Pages

| Route | What it is |
| --- | --- |
| `/` | Hero, featured case studies, principles, the five engineering layers, the terminal |
| `/work` | All fifteen case studies, plus the GitHub long tail |
| `/work/[slug]` | One case study — overview, problem, architecture, decisions, stack |
| `/engineering` | Backend, architecture, data, security, infrastructure — with the evidence for each |
| `/lab` | The interactive shell, and the experiments behind it |
| `/about` | Story, experience timeline, education, how I work |
| `/cv` | Full CV, with print-to-PDF |
| `/contact` | Contact form (Resend) and channels |
| `/api/contact` | The only dynamic route |

28 routes. The dock's mark links home, so there is no "Index" item duplicating it.

---

## Rules this repo keeps

**Every number is countable.** 74 Go modules, 39 packages, 47 Prisma models,
31 relational models, 150+ routes, 28 tools, 20 models, 27 route modules —
each was read out of the corresponding repository, not estimated. If you can't
count it in the source, don't put it in `content/work.ts`.

**Every link is checked.** All thirty external URLs the site renders returned
HTTP 200 (LinkedIn returns 999 to bots — that's expected, and it comes from
the CV). Projects whose repositories are private, or whose deployments have
gone down, carry **no link** rather than a broken one. That is why Zudomart,
Telente CBT, AgentLab, PowerWatch and the Newdich site have no source link,
and why several `*.telente.site` and `*.vercel.app` deployments that no longer
resolve are absent.

Before adding a link:

```bash
curl -sL -o /dev/null -w "%{http_code}\n" -A "Mozilla/5.0" "<url>"
```

**Facts come from the source.** Profile, bio, CV history, email and phone are
from oyinlola.site. Project facts are from each repository's README, Prisma
schema, route table and package manifest.

---

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # prerenders all 23 routes
npm start
npm run typecheck
```

Node 20+. The build fetches Inter, Inter Tight and JetBrains Mono once through
`next/font/google` and self-hosts them, so the deployed site makes no
third-party font request — but the *build machine* needs network access.

---

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js (App Router), React, TypeScript strict |
| Styling | Tailwind CSS v4 — tokens in `app/globals.css` under `@theme` |
| Hero | Three.js, hand-written GLSL, two draw calls |
| Icons | lucide-react |
| Motion | CSS transitions, clip-path, IntersectionObserver — no animation library |
| Email | Resend REST API, called with `fetch` — no SDK dependency |

---

## Layout

```
app/
  layout.tsx            Fonts, metadata, JSON-LD Person, dock, intro, footer
  page.tsx              Home
  work/page.tsx         Work index
  work/[slug]/page.tsx  Case study template (SSG)
  about/ stack/ contact/
  globals.css           Tokens, the --u design-unit system, dock, entrance
  icon.svg sitemap.ts robots.ts not-found.tsx

components/
  Dock.tsx              Magnifying nav with a pointer-tracking specular rim
  Intro.tsx             Entrance choreography + pointer parallax publisher
  hero/Hero.tsx         The 1600×880 stage composition
  hero/ConstellationCanvas.tsx   The WebGL centrepiece
  PageHeader.tsx SectionHead.tsx Reveal.tsx WorkCards.tsx ProjectSigil.tsx Footer.tsx

content/
  site.ts   Profile, nav, telemetry, capabilities, CV, principles
  work.ts   The thirteen case studies + the open-source index
```

**All copy lives in `content/`.** Editing a case study never means touching a
component.

---

## The hero

Composition and interaction idioms are adapted from
[ThreeUI's Sylva hero](https://threeui.com/hero/sylva) — the piece this was
modelled on:

- **A design-unit stage.** `--u` is 1px on a 1600-wide reference frame, so the
  whole composition is laid out in absolute coordinates and scales to any
  viewport. Below `lg` the stage is dropped for ordinary flow — an absolute
  composition has nowhere to go on a phone.
- **The floating dock.** Pills magnify as the pointer nears them, over a conic
  gradient masked to the border whose start angle points back at the pointer.
  Both are springs on one rAF. Targets are only recomputed when the pointer
  actually *moves* — a centred capsule whose pills grow will otherwise
  oscillate under a stationary cursor.
- **Clip-path entrances.** Transform is reserved for the parallax, so reveals
  are clips. `.intro-done` drops them afterwards, because a live clip-path
  opens a stacking context.
- **Per-layer parallax.** `--px`/`--py` are written on `<body>` once a frame;
  each layer declares its own `--pd` (travel) and `--pr` (rotation).
- **The survey pulse.** A wavefront expands from the lower left and nothing
  renders until it has passed, so the system draws itself in.

### The constellation

`components/hero/ConstellationCanvas.tsx` draws Zudomart's actual
architecture: five clusters sized 29 / 23 / 17 / 17 / 8, wired within
themselves and joined across by an event spine that carries travelling
pulses. Two draw calls — one `THREE.Points` for modules and their file haze,
one `THREE.LineSegments` for the wiring.

It behaves under pressure:

- `prefers-reduced-motion` renders one settled frame and never starts a loop.
- Off-screen or hidden tab stops the loop (IntersectionObserver + `visibilitychange`).
- Slow GPUs still reveal on schedule — the pulse and fade are driven by
  wall-clock time, not frame count.
- No WebGL falls back to the CSS wash; construction is wrapped in try/catch.
- Coarse pointers skip pointer tracking entirely.
- Blending is an explicit `ONE / ONE` add with colour pre-multiplied in the
  shader, so the falloff is identical regardless of what `premultipliedAlpha`
  the context reports.

Knobs: `DOMAINS` (cluster sizes and hues), `ringR` and `spread` (layout),
`SCAN_DURATION`, and the `base` / `cover` terms in the two fragment shaders.

---

## Case studies

Each entry in `content/work.ts` is typed as `CaseStudy`: overview, problem,
architecture, decisions, metrics, stack, links. The template renders whatever
is there, so adding a fourteenth project is a data change.

`featured: true` promotes a project to a full-width row; everything else is a
compact card. `hue` drives that project's generated lattice sigil
(`ProjectSigil.tsx`) — a deterministic pattern seeded from the slug, which is
why the site needs no screenshots.

---

## Accessibility & performance

- Skip link, focus-visible rings, labelled landmarks, `aria-current` on the dock, `aria-hidden` on decorative canvas and SVG.
- One `h1` per page; all images have alt text.
- Body text meets AA against the stage; the faintest tone is reserved for icons and index numerals.
- No horizontal overflow at 414px, 1600px, or anywhere between.
- Zero console errors across all 23 routes.

---

## Deploy

```bash
npx vercel
```

No environment variables — there are none.

---

## The terminal

`/lab` (and the home page) carry a real interactive shell, not a typing
animation. `components/terminal/shell.ts` is pure logic — a virtual
filesystem generated from the same `content/` modules the pages render — and
`Terminal.tsx` is only input and painting.

```
~ ❯ ls
about.txt  focus.txt  contact.txt  education.txt  engineering/  work/

~ ❯ cat work/kolo.md          # reads the case study
~ ❯ open kolo                 # navigates the real router
~ ❯ neofetch                  # you know what this does
```

Commands: `help whoami about focus ls cd pwd cat tree work open stack edu cv
contact neofetch date clear`, plus a few that are not in `help`.

- **History** on ↑ / ↓, **Tab** completion for commands, paths and slugs,
  **Ctrl+L** clear, **Ctrl+C** cancel.
- The input is a real `<input>` — which is what makes the OS keyboard open on
  a phone and what makes it work with a screen reader. Only the caret colour
  is ours.
- Its focus is shown by the caret and the prompt chevron lighting, not by the
  global focus ring: a full-width ring across a shell prompt reads as
  breakage. That's the one deliberate exception, scoped to `.term-input`.
- A tap-to-run chip row sits under the log, because nobody types `neofetch`
  on a phone.

Because the filesystem is generated, adding a case study to `content/work.ts`
makes it appear under `/work` with no change to the shell.

---

## The CV and its PDF

`/cv` is a normal page on screen and an A4 document on paper. **Download PDF**
calls `window.print()`.

That is a deliberate choice over `jsPDF`/`html2canvas`: the browser's own PDF
writer keeps the text selectable and searchable, keeps hyperlinks live, and
stays crisp at any zoom. A canvas-rasterising library produces a picture of a
CV. The cost is the `@media print` block in `globals.css`, which re-sets the
dark screen document as monochrome A4:

- `@page { size: A4 }` with 13/14mm margins
- dock, footer, grain and `.print-hide` elements removed
- `.cv-block` marked `break-inside: avoid`, so a role or project never splits
  across a page
- external link destinations printed after the link text, because a PDF is
  often read on paper

It currently comes out at six well-filled pages. Content lives in
`content/cv.ts`; the same rule applies as everywhere else — **if a number
appears, it is countable in a repository.**

---

## The contact form

`components/ContactForm.tsx` posts to `app/api/contact/route.ts`, which calls
the Resend REST API directly with `fetch`. No SDK, so there is no dependency
to keep patched for one HTTP call.

Set these to switch delivery on (see `.env.example`):

```
RESEND_API_KEY=re_...
CONTACT_FROM_EMAIL="Portfolio <contact@oyinlola.site>"   # verified domain
CONTACT_TO_EMAIL=oluwayemioyinlola2@gmail.com            # optional
```

**Without them the route answers `503 not_configured` and the form says so,
then hands over the email address.** A contact form that silently swallows
messages is worse than no contact form.

Also handled:

| Case | Response |
| --- | --- |
| Missing or bad fields | `422` with per-field messages, rendered inline |
| Honeypot filled, or submitted under 2s | `200 ok` — the bot learns nothing |
| More than 5 messages/hour from one IP | `429` |
| Resend rejects or throws | `502`, and the form offers the mailto fallback |

The rate limit is per-instance and in memory. It stops a script; it is not a
security boundary.

---

## The portrait

No photograph is ever shown on the site. The three source photos live in
`source-photos/` (git-ignored, never served) and are turned into stylised
assets by `scripts/bake-portraits.py`:

```bash
python3 scripts/bake-portraits.py     # needs numpy, scipy, pillow
```

Per photo (`portrait`, `field`, `street`):

| File | What it is |
| --- | --- |
| `<slug>-sketch.webp` | Line art, light ink. **Alpha is the ink density**, so there is no background at all — it composites over anything. |
| `<slug>-sketch-ink.webp` | The same drawing in dark ink, for paper and light surfaces. |
| `<slug>-cartoon.webp` | Flat cel colour with drawn outlines. |
| `<slug>-depth.png` | Grayscale relief map. PNG, not WebP — lossy compression on a height map bands the relief. |

Two things in that script are not obvious and are the difference between a
drawing and a filter:

- **Ink density follows brightness, not darkness.** The ink is light and the
  page is dark, so rendered brightness *is* ink density. Keying the hatching
  off darkness — the intuitive way — renders a photographic negative.
- **Hatching is gated by local structure.** A flat studio wall or an empty sky
  has no detail energy, so it takes no ink and drops away, while the subject
  keeps its full tonal range.

The cartoon pass flattens with repeated median filters and then quantises
with an **adaptive palette**. Per-channel posterising on an unflattened image
is what produces blotchy skin: the sensor noise survives quantisation and
each channel bands independently.

### The third dimension

`components/portrait/PortraitCanvas.tsx` displaces a mesh by the depth map,
lights the resulting relief, and cross-fades the two treatments. A toggle
picks the base; the pointer carries a torch that reveals the other underneath
it, and tilts the plate.

The stylising is baked rather than done in the shader because a real-time
pass cannot afford the median passes and palette quantisation above.

The depth map is deliberately **not** raw luminance. On a studio portrait the
brightest thing in frame is the shirt, so a luminance height-map pushes the
shirt forward and sinks the face. Height comes from low-frequency form plus
local detail energy instead, which lifts the features and leaves flat
backdrops flat.

It degrades cleanly: the still sketch is a real `<Image>` that is always
rendered, and the canvas only fades in once all three textures have loaded —
so no WebGL, or one failed texture, leaves a drawing rather than an error.

### Where they're used

- `/about` — the interactive portrait, with the sketch/cartoon toggle
- `/cv` — light ink on screen, **dark ink in print** (same alpha, different colour)
- `/contact` — the street scene, as a place

`field-*` is baked and unused — it is there to be dropped in.
