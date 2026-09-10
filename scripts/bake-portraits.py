"""
Bake stylised assets from the source photographs.

Produces, per photo:
  <slug>-sketch.webp      RGBA line art, light ink for a dark page. Alpha IS the
                          ink density, so there is no background at all and it
                          composites over anything.
  <slug>-sketch-ink.webp  The same drawing in dark ink, for paper and light
                          surfaces — the CV prints white.
  <slug>-cartoon.webp     Flat cel colour with drawn outlines.
  <slug>-depth.png        Grayscale relief map for the WebGL displacement. PNG,
                          not WebP: lossy compression on a height map shows up
                          as banding in the relief.

Two things this gets right that the obvious version does not:

  * The ink is light and the page is dark, so rendered brightness IS ink
    density. Hatching therefore has to follow the source's BRIGHTNESS, not its
    darkness, or the result reads as a photographic negative.

  * Hatching is gated by local structure, so flat backdrops (a studio wall, an
    empty sky) take no ink and drop away, while the subject keeps its tone.
"""

import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter, median_filter, sobel

SRC = "source-photos"
OUT = "public"

PHOTOS = [
    ("image.png", "portrait"),
    ("image 32.png", "field"),
    ("image ewwe.png", "street"),
]

INK_RGB = (240, 243, 248)      # light ink, for a dark page
OUTLINE_RGB = (18, 20, 26)
INK_DARK = (24, 26, 32)        # dark ink, for paper and light surfaces


def luminance(rgb: np.ndarray) -> np.ndarray:
    return rgb[..., 0] * 0.299 + rgb[..., 1] * 0.587 + rgb[..., 2] * 0.114


def norm(a: np.ndarray) -> np.ndarray:
    lo, hi = np.percentile(a, 1), np.percentile(a, 99)
    if hi - lo < 1e-6:
        return np.zeros_like(a)
    return np.clip((a - lo) / (hi - lo), 0, 1)


def structure_mask(g: np.ndarray, scale: float) -> np.ndarray:
    """Where the image actually has detail. ~0 on a flat wall or sky."""
    detail = np.abs(g - gaussian_filter(g, sigma=6.0 * scale))
    m = norm(gaussian_filter(detail, sigma=4.0 * scale))
    return np.clip(m * 2.1, 0, 1)


def vignette(h: int, w: int, strength: float = 0.62) -> np.ndarray:
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    r = np.hypot((yy - h / 2) / (h * 0.56), (xx - w / 2) / (w * 0.60))
    return np.clip(1.18 - r * strength, 0, 1) ** 1.1


# ------------------------------------------------------------------ sketch

def make_sketch(rgb: np.ndarray, scale: float, ink_rgb=INK_RGB) -> Image.Image:
    g = luminance(rgb) / 255.0
    h, w = g.shape
    struct = structure_mask(g, scale)

    # Contour is the drawing; everything else is shading on top of it.
    gs = gaussian_filter(g, sigma=1.2 * scale)
    edge = norm(np.hypot(sobel(gs, 0), sobel(gs, 1)))
    contour = np.clip((edge - 0.11) / 0.34, 0, 1) ** 0.72

    # Tonal hatching, keyed to BRIGHTNESS because the ink is light.
    tone = gaussian_filter(g, sigma=2.6 * scale)
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)

    def hatch(angle: float, freq: float) -> np.ndarray:
        d = xx * np.cos(angle) + yy * np.sin(angle)
        return (np.sin(d * freq) * 0.5 + 0.5) ** 2.6

    f = 0.5 / scale
    hatching = np.zeros_like(g)
    for threshold, angle, mult in (
        (0.30, 0.70, 0.9),
        (0.46, -0.62, 1.15),
        (0.62, 1.90, 1.4),
        (0.78, 0.18, 1.7),
    ):
        mask = np.clip((tone - threshold) / 0.17, 0, 1)
        hatching = np.maximum(hatching, hatch(angle, f * mult) * mask)

    hatching *= struct

    ink = np.clip(contour + hatching * 0.52, 0, 1)

    # A little grain so flat passages are not mathematically empty.
    rng = np.random.default_rng(7)
    grain = gaussian_filter(rng.random((h, w)).astype(np.float32), sigma=0.7)
    ink *= 0.93 + 0.14 * grain

    ink *= vignette(h, w)

    alpha = (np.clip(ink, 0, 1) ** 0.88 * 255).astype(np.uint8)
    out = np.zeros((h, w, 4), np.uint8)
    out[..., 0], out[..., 1], out[..., 2] = ink_rgb
    out[..., 3] = alpha
    return Image.fromarray(out, "RGBA")


# ----------------------------------------------------------------- cartoon

def make_cartoon(rgb: np.ndarray, scale: float) -> Image.Image:
    """Flatten hard, quantise with an adaptive palette, draw the lines back."""
    img = rgb.astype(np.float32)
    h, w = img.shape[:2]

    # Heavy edge-preserving flattening. Per-channel posterising on an
    # unflattened image is what produces blotchy skin — the noise survives
    # quantisation and each channel bands independently.
    k = max(5, int(round(9 * scale)) | 1)
    flat = img.copy()
    for _ in range(3):
        for c in range(3):
            flat[..., c] = median_filter(flat[..., c], size=k)
    flat = gaussian_filter(flat, sigma=(1.1 * scale, 1.1 * scale, 0))

    # An adaptive palette picks colours out of the picture, so skin stays
    # skin instead of splitting into red and green bands.
    pil = Image.fromarray(np.clip(flat, 0, 255).astype(np.uint8), "RGB")
    q = np.asarray(
        pil.quantize(colors=16, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
        .convert("RGB"),
        np.float32,
    ) / 255.0

    # Gentle lift only — the palette has already done the stylising.
    grey = luminance(q * 255.0)[..., None] / 255.0
    q = np.clip(grey + (q - grey) * 1.12, 0, 1)
    q = np.clip(q * np.array([1.02, 1.00, 0.97], np.float32), 0, 1)

    # Outlines come off the original, not the flattened copy — flattening
    # would already have eaten the fine ones.
    g = luminance(img) / 255.0
    gs = gaussian_filter(g, sigma=1.0 * scale)
    edge = norm(np.hypot(sobel(gs, 0), sobel(gs, 1)))
    outline = np.clip((edge - 0.15) / 0.28, 0, 1) ** 0.7

    ol = np.array(OUTLINE_RGB, np.float32) / 255.0
    out = q * (1.0 - outline[..., None]) + ol * outline[..., None]

    # Sink the corners toward the page so the plate has no hard rectangle.
    v = vignette(h, w, 0.5)[..., None]
    page = np.array([11, 13, 18], np.float32) / 255.0
    out = out * v + page * (1.0 - v)

    return Image.fromarray((np.clip(out, 0, 1) * 255).astype(np.uint8), "RGB")


# ------------------------------------------------------------------- depth

def make_depth(rgb: np.ndarray, scale: float) -> Image.Image:
    """
    Height for the WebGL relief.

    Not raw luminance: on a studio portrait the brightest thing is the shirt,
    which would come forward while the face sank. Low-frequency form plus
    local detail energy lifts the features and leaves flat backdrops flat.
    """
    g = luminance(rgb) / 255.0
    form = gaussian_filter(g, sigma=14.0 * scale)
    detail = np.abs(g - gaussian_filter(g, sigma=3.5 * scale))
    d = norm(form * 0.40 + norm(detail) * 0.90)
    d = gaussian_filter(d, sigma=1.2 * scale)
    return Image.fromarray((np.clip(d, 0, 1) * 255).astype(np.uint8), "L")


# -------------------------------------------------------------------- main

def main() -> None:
    for filename, slug in PHOTOS:
        src = Image.open(f"{SRC}/{filename}").convert("RGB")
        w, h = src.size
        scale = max(w, h) / 1080.0
        rgb = np.asarray(src, np.float32)

        # Two ink polarities from the same computation, because alpha carries
        # the drawing: light ink for the dark site, dark ink for paper and any
        # light surface (the CV prints white).
        # WebP throughout: it carries the alpha the line art needs and is
        # roughly 40% of the PNG.
        make_sketch(rgb, scale, INK_RGB).save(
            f"{OUT}/{slug}-sketch.webp", quality=90, method=6
        )
        make_sketch(rgb, scale, INK_DARK).save(
            f"{OUT}/{slug}-sketch-ink.webp", quality=90, method=6
        )

        make_cartoon(rgb, scale).save(f"{OUT}/{slug}-cartoon.webp", quality=88, method=6)

        make_depth(rgb, scale).resize((w // 2, h // 2), Image.LANCZOS).save(
            f"{OUT}/{slug}-depth.png", optimize=True
        )

        print(f"{slug:10} {w}x{h}  ->  sketch / cartoon / depth")


if __name__ == "__main__":
    main()
