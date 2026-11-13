#!/usr/bin/env python3
"""Pecah logo Komandro (PNG 11768x11768) jadi aset web yang terpisah.

Input : PNG besar (satu file berisi: emblem + wordmark + tagline + badge lingkaran)
Output: public/brand/* (logo transparan), public/* (favicon, app icon, og-image)

Struktur sumber (koordinat di PNG asli):
  emblem   : x 1304..10300, y 1740..7816
  wordmark : x 1960..9376,  y 8584..9316
  tagline  : x 3148..8188,  y 9680..10176
"""
import math
import sys
from pathlib import Path

from PIL import Image, ImageDraw

Image.MAX_IMAGE_PIXELS = None

SRC = Path(sys.argv[1] if len(sys.argv) > 1 else "/home/hudya/Downloads/Mask group (3) (1).png")
OUT = Path(sys.argv[2] if len(sys.argv) > 2 else "public")

NAVY = (10, 25, 39)      # #0A1927 background badge
WHITE = (255, 255, 255)  # #FFFFFF emblem + wordmark
GREEN = (98, 243, 4)     # #62F304 aksen emblem
RED = (255, 5, 5)        # #FF0505 "CCIT"

BOX = {
    "emblem": (1304, 1740, 10300, 7816),
    "wordmark": (1960, 8584, 9376, 9316),
    "tagline": (3148, 9680, 8188, 10176),
}
BOX["lockup"] = (1304, 1740, 10300, 9316)   # emblem + wordmark
BOX["seal"] = (1304, 1740, 10300, 10176)   # emblem + wordmark + tagline


def _palette_len(c):
    return math.dist(c, NAVY)


PL = {c: _palette_len(c) for c in (WHITE, GREEN, RED)}


def classify(r, g, b):
    if r > 60 and g < r * 0.6 and b < r * 0.6:
        return RED
    if g > 45 and g > r * 1.3 and g > b * 1.3:
        return GREEN
    return WHITE


def flatten(img):
    """RGBA di atas badge -> RGB opaque dengan background navy."""
    bg = Image.new("RGB", img.size, NAVY)
    return Image.composite(img.convert("RGB"), bg, img.getchannel("A").point(lambda v: 255 if v >= 128 else 0))


def key_out(flat):
    """Buang background navy: kembalikan (color RGBA, mono navy RGBA)."""
    w, h = flat.size
    color = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    mono = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    sp, cp, mp = flat.load(), color.load(), mono.load()
    for y in range(h):
        for x in range(w):
            r, g, b = sp[x, y]
            dr, dg, db = r - NAVY[0], g - NAVY[1], b - NAVY[2]
            dist = math.sqrt(dr * dr + dg * dg + db * db)
            if dist < 7:
                continue
            col = classify(r, g, b)
            a = min(255, int(round(dist / PL[col] * 255)))
            if a == 0:
                continue
            cp[x, y] = (col[0], col[1], col[2], a)
            mp[x, y] = (NAVY[0], NAVY[1], NAVY[2], a)
    return color, mono


def extract(src, name, width):
    region = flatten(src.crop(BOX[name]))
    h = max(1, round(width * region.height / region.width))
    region = region.resize((width, h), Image.LANCZOS)
    return key_out(region)


def circle_mask(size):
    big = 4
    m = Image.new("L", (size * big, size * big), 0)
    d = size * big
    ImageDraw.Draw(m).ellipse((0, 0, d - 1, d - 1), fill=255)
    return m.resize((size, size), Image.LANCZOS)


def save_png(img, path, alpha_steps=32):
    """Quantisasi alpha (32 level) -> file jauh lebih kecil, mata tidak lihat beda."""
    q = 255 // (alpha_steps - 1) if alpha_steps else 1
    r, g, b, a = img.convert("RGBA").split()
    a = a.point(lambda v: min(255, round(v / q) * q))
    Image.merge("RGBA", (r, g, b, a)).save(path, optimize=True)


def make_icon(mark_color, size, scale=0.66, opaque=False):
    """Badge navy + emblem di tengah.

    opaque=False -> badge lingkaran transparan (favicon/app icon).
    opaque=True  -> kotak navy penuh (apple-touch-icon / maskable, harus opaque
                    karena iOS & Android memotong sendiri sudutnya).
    """
    canvas = Image.new("RGBA", (size, size), NAVY + (255,))
    if not opaque:
        canvas.putalpha(circle_mask(size))
    mw = round(size * scale)
    mh = max(1, round(mw * mark_color.height / mark_color.width))
    m = mark_color.resize((mw, mh), Image.LANCZOS)
    canvas.alpha_composite(m, ((size - mw) // 2, (size - mh) // 2))
    return canvas


def make_og_image(mark, wordmark, tagline, width=1200, height=630):
    """Kartu share 1200x630 (Open Graph / Twitter card).

    Latar navy penuh, lalu emblem + wordmark + tagline ditumpuk di tengah
    dengan rasio asli masing-masing (skala hanya lewat lebar).
    """
    stack = [(mark, 340, 36), (wordmark, 620, 24), (tagline, 480, 0)]
    scaled = []
    for img, w, gap in stack:
        h = max(1, round(w * img.height / img.width))
        scaled.append((img.resize((w, h), Image.LANCZOS), gap))
    total = sum(im.height + gap for im, gap in scaled)
    canvas = Image.new("RGBA", (width, height), NAVY + (255,))
    y = (height - total) // 2
    for im, gap in scaled:
        canvas.alpha_composite(im, ((width - im.width) // 2, y))
        y += im.height + gap
    return canvas.convert("RGB")


def main():
    src = Image.open(SRC).convert("RGBA")
    brand = OUT / "brand"
    brand.mkdir(parents=True, exist_ok=True)
    sizes = {}

    # --- emblem / wordmark / tagline (transparan) ---
    em, em_mono = extract(src, "emblem", 800)
    wm, wm_mono = extract(src, "wordmark", 1400)
    tg, tg_mono = extract(src, "tagline", 1000)

    for name, (color, mono) in {
        "logo-emblem": (em, em_mono),
        "logo-wordmark": (wm, wm_mono),
        "logo-tagline": (tg, tg_mono),
    }.items():
        save_png(color, brand / f"{name}.png")
        save_png(mono, brand / f"{name}-navy.png")

    # --- lockup & seal (transparan) ---
    for name, width in (("lockup", 1200), ("seal", 1200)):
        color, mono = extract(src, name, width)
        save_png(color, brand / f"logo-{name}.png")
        save_png(mono, brand / f"logo-{name}-navy.png")

    # --- badge lingkaran (opaque, sesuai desain asli) ---
    flat_full = flatten(src)
    b = flat_full.resize((1024, 1024), Image.LANCZOS).convert("RGBA")
    b.putalpha(circle_mask(1024))
    save_png(b, brand / "brand-badge-1024.png")

    # --- kartu share (Open Graph / Twitter) ---
    make_og_image(em, wm, tg).save(OUT / "og-image.png", optimize=True)

    # --- favicon & app icon (badge + emblem saja) ---
    # scale = lebar emblem relatif terhadap kanvas; 0.66 pas untuk favicon,
    # 0.55 supaya emblem tetap di dalam safe-area 80% ikon maskable.
    icons = {
        "favicon-16.png": (16, 0.86),
        "favicon-32.png": (32, 0.78),
        "favicon-48.png": (48, 0.72),
        "icon-192.png": (192, 0.66),
        "icon-512.png": (512, 0.66),
    }
    for name, (size, scale) in icons.items():
        save_png(make_icon(em, size, scale), OUT / name, alpha_steps=0)

    # Apple touch icon: wajib opaque (iOS mengabaikan transparansi).
    save_png(make_icon(em, 180, 0.62, opaque=True), OUT / "apple-touch-icon.png", alpha_steps=0)
    # Maskable (Android adaptive icon): opaque, emblem di safe-area.
    save_png(make_icon(em, 512, 0.55, opaque=True), OUT / "icon-maskable-512.png", alpha_steps=0)

    ico = OUT / "favicon.ico"
    make_icon(em, 64, 0.70).save(
        ico,
        sizes=[(16, 16), (32, 32), (48, 48), (64, 64)],
        format="ICO",
    )

    products = sorted(list(brand.iterdir()) + [OUT / n for n in list(icons) + [
        "favicon.ico", "apple-touch-icon.png", "icon-maskable-512.png", "og-image.png",
    ]])
    print(f"{'file':40s} {'size':>9s}  dim")
    total = 0
    for p in products:
        kb = p.stat().st_size / 1024
        total += kb
        with Image.open(p) as im:
            print(f"{str(p):40s} {kb:8.1f}K  {im.size[0]}x{im.size[1]}")
    print(f"{'TOTAL':40s} {total:8.1f}K")


if __name__ == "__main__":
    main()
