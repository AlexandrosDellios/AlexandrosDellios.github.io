#!/usr/bin/env python3
"""
Per-project social preview images (og:image / twitter:image), 1200x630.

    python3 scripts/og/make_og_images.py            # all projects + the default card
    python3 scripts/og/make_og_images.py polymander # one project
    python3 scripts/og/make_og_images.py default    # the site-wide card only

Writes public/og/<slug>.png for every src/content/projects/<slug>.md (projects
and the role pages), and
public/og/default.png (home and every page without its own card): the giant
two-line name in orange, the byline, and the focus areas (FOCUS below; keep
them in step with site.rolesStatic in src/data/site.ts).
ProjectLayout.astro picks a file up automatically when it exists (otherwise
the page uses public/og/default.png). Re-run after changing a project's
title, shortWord, metric, accent or poster.

Look (same family as public/og/default.png, "Lab Poster"):
  - paper background, "Alexandros Dellios · Robotics M.Sc. · EPFL" top left,
    the site URL and the 2x2 gait mark top right;
  - the project title in Instrument Serif, the metric as a mono chip and the
    year · team line on the left;
  - the poster on the right, cropped to 4:3 with the project's `focus`, as a
    "print card" (2px ink border, hard ink shadow down-left, like the home
    tiles); a page without a poster shows its `sketch` drawing there instead
    (src/assets/sketches/, rendered with scripts/media/render_svg.py);
  - the shortWord as a giant Anton word in the project accent along the bottom.
Rendered at 2x and downsampled with Lanczos for clean edges.

Requirements: Python 3 with Pillow, fontTools + brotli (to read the Geist
woff2 files) and PyYAML. Fonts come from node_modules (run `npm install`).
Glyphs the latin subsets lack (✓ → ≈ …) fall back to a macOS system font.
"""
from __future__ import annotations

import re
import subprocess
import sys
import tempfile
from functools import lru_cache
from pathlib import Path

import yaml
from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
PROJECTS = ROOT / "src/content/projects"
SKETCHES = ROOT / "src/assets/sketches"
OUT = ROOT / "public/og"
NM = ROOT / "node_modules"

W, H, S = 1200, 630, 2  # output size and supersampling factor
MAX_BYTES = 250_000  # larger cards are re-saved with 256 colours

PAPER = "#F4EFE6"
PAPER_2 = "#EBE4D8"
INK = "#151412"
INK_2 = "#5E5850"
SITE = "ALEXANDROSDELLIOS.COM"
BYLINE = "Alexandros Dellios · Robotics M.Sc. · EPFL"
ACCENT = "#E5501D"  # site default --accent (actuator orange)
NAME = ["ALEXANDROS", "DELLIOS"]
FOCUS = ["ROBOT LEARNING", "MANIPULATION", "LEGGED LOCOMOTION", "MODEL PREDICTIVE CONTROL"]

FONT_FILES = {
    "anton": NM / "@fontsource/anton/files/anton-latin-400-normal.woff",
    "serif": NM / "@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff",
    "sans": NM / "@fontsource-variable/geist/files/geist-latin-wght-normal.woff2",
    "mono": NM / "@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2",
}
FALLBACKS = [
    Path("/System/Library/Fonts/Supplemental/Arial Unicode.ttf"),
    Path("/System/Library/Fonts/Apple Symbols.ttf"),
]
_tmp = Path(tempfile.mkdtemp(prefix="og-fonts-"))


# ---- fonts -------------------------------------------------------------------


@lru_cache(maxsize=None)
def font_path(key: str) -> Path:
    """Pillow reads .woff directly; variable .woff2 is converted to .ttf first."""
    src = FONT_FILES[key]
    if src.suffix != ".woff2":
        return src
    out = _tmp / (src.stem + ".ttf")
    font = TTFont(str(src))
    font.flavor = None
    font.save(str(out))
    return out


@lru_cache(maxsize=None)
def cmap(path: Path) -> frozenset[int]:
    return frozenset(TTFont(str(path), fontNumber=0).getBestCmap().keys())


@lru_cache(maxsize=None)
def font(key: str, size: int, weight: int | None = None) -> ImageFont.FreeTypeFont:
    f = ImageFont.truetype(str(font_path(key)), size)
    if weight is not None:
        f.set_variation_by_axes([weight])
    return f


@lru_cache(maxsize=None)
def fallback(size: int) -> tuple[ImageFont.FreeTypeFont, frozenset[int]] | None:
    for p in FALLBACKS:
        if p.exists():
            return ImageFont.truetype(str(p), size), cmap(p)
    return None


def runs(text: str, key: str, size: int, weight: int | None = None):
    """Split text into (substring, font) runs, using the fallback for missing glyphs."""
    main = font(key, size, weight)
    have = cmap(font_path(key))
    fb = fallback(size)
    out: list[tuple[str, ImageFont.FreeTypeFont]] = []
    for ch in text:
        f = main if (ord(ch) in have or ch.isspace() or fb is None or ord(ch) not in fb[1]) else fb[0]
        if out and out[-1][1] is f:
            out[-1] = (out[-1][0] + ch, f)
        else:
            out.append((ch, f))
    return out


def text_width(text: str, key: str, size: int, weight: int | None = None, tracking: float = 0) -> float:
    return sum(f.getlength(t) for t, f in runs(text, key, size, weight)) + tracking * max(len(text) - 1, 0)


def draw_text(d: ImageDraw.ImageDraw, xy, text: str, key: str, size: int, fill, weight=None, tracking: float = 0, anchor="ls"):
    """Draw text on a baseline (anchor 'ls'), run by run; `tracking` adds px between characters."""
    x, y = xy
    for chunk, f in runs(text, key, size, weight):
        if tracking:
            for ch in chunk:
                d.text((x, y), ch, font=f, fill=fill, anchor=anchor)
                x += f.getlength(ch) + tracking
        else:
            d.text((x, y), chunk, font=f, fill=fill, anchor=anchor)
            x += f.getlength(chunk)
    return x


def wrap(text: str, key: str, size: int, max_w: float) -> list[str]:
    words, lines, cur = text.split(), [], ""
    for w in words:
        trial = f"{cur} {w}".strip()
        if text_width(trial, key, size) <= max_w or not cur:
            cur = trial
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


# ---- content -------------------------------------------------------------------


def frontmatter(md: Path) -> dict:
    m = re.match(r"^---\n(.*?)\n---", md.read_text(encoding="utf-8"), re.S)
    if not m:
        raise ValueError(f"{md}: no frontmatter")
    return yaml.safe_load(m.group(1))


def crop_4_3(img: Image.Image, focus: str) -> Image.Image:
    """object-fit: cover to 4:3 with a CSS-like object-position ("10% 50%")."""
    fx, fy = (float(v.strip("%")) / 100 for v in (focus or "50% 50%").split())
    w, h = img.size
    if w / h > 4 / 3:
        cw, ch = round(h * 4 / 3), h
    else:
        cw, ch = w, round(w * 3 / 4)
    x0, y0 = round((w - cw) * fx), round((h - ch) * fy)
    return img.crop((x0, y0, x0 + cw, y0 + ch))


def print_mask(size: tuple[int, int], r: int) -> Image.Image:
    """The print card's shape (radius 0 = square corners, like --r-print)."""
    m = Image.new("L", size, 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, size[0] - 1, size[1] - 1), radius=r, fill=255)
    return m


def sketch_board(name: str, size: tuple[int, int], accent: str) -> Image.Image:
    """A "Coming soon" board for pages without a poster: the sketch on paper-2,
    its accent details (drawn in the site orange) recoloured to the page accent."""
    board = Image.new("RGBA", size, PAPER_2)
    svg = Path(_tmp) / f"sketch-{name}-{accent[1:]}.svg"
    out = svg.with_suffix(".png")
    if not out.exists():
        svg.write_text((SKETCHES / f"{name}.svg").read_text(encoding="utf-8").replace(ACCENT, accent), encoding="utf-8")
        subprocess.run(
            [sys.executable, str(ROOT / "scripts/media/render_svg.py"), str(svg), str(out), "800", PAPER_2[1:]],
            check=True,
            capture_output=True,
        )
    art = Image.open(out).convert("RGBA")
    w = round(size[0] * 0.6)
    art = art.resize((w, round(art.height * w / art.width)), Image.LANCZOS)
    board.alpha_composite(art, ((size[0] - art.width) // 2, (size[1] - art.height) // 2))
    return board


# ---- render ------------------------------------------------------------------------


def render(slug: str, fm: dict, md: Path) -> Path:
    s = lambda v: round(v * S)  # 1x -> 2x pixels
    accent, accent_ink = fm["accent"], fm["accentInk"]
    img = Image.new("RGB", (s(W), s(H)), PAPER)
    d = ImageDraw.Draw(img)
    pad = 56

    # Top row: byline left, URL + gait mark right.
    draw_text(d, (s(pad), s(pad + 22)), BYLINE, "sans", s(26), INK, weight=500)
    url_w = text_width(SITE, "mono", s(17), 500, tracking=s(1.2))
    draw_text(d, (s(W - pad) - url_w, s(pad + 20)), SITE, "mono", s(17), INK_2, weight=500, tracking=s(1.2))
    gx, gy, dot, gap = W - pad - url_w / S - 28 - 34, pad + 1, 14, 6  # 2x2 trot mark
    for i, colour in enumerate([accent, INK, INK, accent]):
        cx, cy = gx + (i % 2) * (dot + gap), gy + (i // 2) * (dot + gap)
        d.ellipse((s(cx), s(cy), s(cx + dot), s(cy + dot)), fill=colour)

    # Poster, 4:3 on the right, under the top row.
    ph = 318
    pw = round(ph * 4 / 3)
    px, py = W - pad - pw, 108  # bottom at 426: clear of the giant word's cap line (~449)
    board = None
    if fm.get("poster"):
        poster = Image.open((md.parent / fm["poster"]).resolve()).convert("RGBA")
        poster = crop_4_3(poster, fm.get("focus", "50% 50%")).resize((s(pw), s(ph)), Image.LANCZOS)
        board = Image.new("RGBA", poster.size, accent)  # accent shows through transparent posters
        board.alpha_composite(poster)
    elif fm.get("sketch"):
        board = sketch_board(fm["sketch"], (s(pw), s(ph)), accent)
    if board is not None:
        # Print card: square corners (--r-print: 0), hard ink shadow down-left, a 2px ink border.
        r, off = 0, 8
        d.rounded_rectangle((s(px - off), s(py + off), s(px + pw - off), s(py + ph + off)), radius=r, fill=INK)
        img.paste(board.convert("RGB"), (s(px), s(py)), print_mask(board.size, r))
        d.rounded_rectangle((s(px), s(py), s(px + pw) - 1, s(py + ph) - 1), radius=r, outline=INK, width=s(2))

    # Title (serif), metric chip, meta line on the left.
    col_w = px - pad - 40
    size = 54
    lines = wrap(fm["title"], "serif", s(size), s(col_w))
    while len(lines) > 3 and size > 40:
        size -= 2
        lines = wrap(fm["title"], "serif", s(size), s(col_w))
    y = 150 + size * 0.8
    for line in lines:
        draw_text(d, (s(pad), s(y)), line, "serif", s(size), INK)
        y += size * 1.04

    chip = fm["metric"].upper()
    cfs, cpx, cpy = 17, 14, 11
    cw = text_width(chip, "mono", s(cfs), 500, tracking=s(1)) / S
    cy0 = y - size * 0.8 + 26
    d.rounded_rectangle((s(pad), s(cy0), s(pad + cw + 2 * cpx), s(cy0 + cfs + 2 * cpy)), radius=s(6), fill=PAPER, outline=INK, width=s(1.5))
    draw_text(d, (s(pad + cpx), s(cy0 + cpy + cfs * 0.78)), chip, "mono", s(cfs), INK, weight=500, tracking=s(1))
    meta = f"{fm['year']} · {fm['team']}".upper()
    draw_text(d, (s(pad), s(cy0 + cfs + 2 * cpy + 34)), meta, "mono", s(15), accent_ink, weight=500, tracking=s(1.2))

    # Giant shortWord along the bottom, in the accent (large text only: DESIGN §3.1).
    word = fm["shortWord"].upper()
    fs = 180  # Anton caps are ~0.84 em tall: 180 px -> ~151 px, top at ~449
    max_w = W - 2 * pad
    while text_width(word, "anton", s(fs)) > s(max_w) and fs > 80:
        fs -= 4
    draw_text(d, (s(pad - 4), s(H - 30)), word, "anton", s(fs), accent)

    out = OUT / f"{slug}.png"
    final = img.resize((W, H), Image.LANCZOS)
    final.save(out, optimize=True)
    # Photo-heavy cards: 256 colours keep the file under ~250 KB (some apps drop
    # link-preview images around 300 KB).
    if out.stat().st_size > MAX_BYTES:
        final.quantize(256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.FLOYDSTEINBERG).save(out, optimize=True)
    return out


def gait_mark(d: ImageDraw.ImageDraw, s, x: float, y: float, accent: str) -> None:
    """The 2x2 trot mark of the header metronome (diagonal pairs in the accent)."""
    dot, gap = 14, 6
    for i, colour in enumerate([accent, INK, INK, accent]):
        cx, cy = x + (i % 2) * (dot + gap), y + (i // 2) * (dot + gap)
        d.ellipse((s(cx), s(cy), s(cx + dot), s(cy + dot)), fill=colour)


def render_default() -> Path:
    """Site-wide card: byline, URL, the giant two-line name, focus areas bottom right."""
    s = lambda v: round(v * S)
    img = Image.new("RGB", (s(W), s(H)), PAPER)
    d = ImageDraw.Draw(img)
    pad = 64

    draw_text(d, (s(pad), s(92)), "Robotics M.Sc. · EPFL", "sans", s(34), INK, weight=500)
    url_w = text_width(SITE, "mono", s(17), 500, tracking=s(1.2))
    draw_text(d, (s(W - pad) - url_w, s(94)), SITE, "mono", s(17), INK_2, weight=500, tracking=s(1.2))
    gait_mark(d, s, W - pad - url_w / S - 28 - 34, 64, ACCENT)

    # The name: the first line spans the card width; both lines share the size.
    fs = 260
    while text_width(NAME[0], "anton", s(fs)) > s(W - 2 * pad + 8) and fs > 120:
        fs -= 2
    for i, line in enumerate(NAME):
        draw_text(d, (s(pad - 4), s(340 + i * 0.955 * fs)), line, "anton", s(fs), ACCENT)

    # Focus areas, right-aligned, beside the short second line.
    for i, line in enumerate(FOCUS):
        w = text_width(line, "mono", s(17), 500, tracking=s(1.2))
        draw_text(d, (s(W - pad) - w, s(475 + 30 * i)), line, "mono", s(17), INK_2, weight=500, tracking=s(1.2))

    out = OUT / "default.png"
    img.resize((W, H), Image.LANCZOS).save(out, optimize=True)
    return out


def main(argv: list[str]) -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    wanted = set(argv)
    if not wanted or "default" in wanted:
        out = render_default()
        print(f"{out.relative_to(ROOT)}  {out.stat().st_size // 1024} KB")
    for md in sorted(PROJECTS.glob("*.md")):
        slug = md.stem
        if slug.startswith("_") or (wanted and slug not in wanted):
            continue
        out = render(slug, frontmatter(md), md)
        print(f"{out.relative_to(ROOT)}  {out.stat().st_size // 1024} KB")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
