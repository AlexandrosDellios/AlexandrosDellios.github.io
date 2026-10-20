#!/usr/bin/env python3
"""
Render an SVG drawn in the site fonts to a PNG (docs/MEDIA.md §2.4).

    python3 scripts/media/render_svg.py IN.svg OUT.png WIDTH [BG_HEX]
    python3 scripts/media/render_svg.py src/assets/projects/uno-sim2real/poster.svg \
        src/assets/projects/uno-sim2real/poster.png 1600 F4EFE6

Used for the posters that are drawings (Uno pipeline, glider airfoil): Astro
then makes AVIF/WebP from the PNG. The published SVGs keep plain font names
('Geist', 'Geist Mono'), so this script embeds the Fontsource files.

How it works (macOS only: it uses Quick Look, `qlmanage`):
  1. Copies the SVG to a temp dir and embeds the site fonts from node_modules
     as base64 @font-face rules (Geist, Geist Mono, Instrument Serif, Anton).
  2. Paints BG_HEX behind the drawing (Quick Look composites on white).
  3. Forces the root size to fit 768 CSS px: qlmanage draws the SVG inside a
     768 × 768 WebKit viewport and cuts off anything wider.
  4. Renders at about 2× the target and crops the drawn area.
  5. Downsamples to WIDTH with Lanczos.

Requirements: Python 3 with Pillow; `npm install` (for the font files).
"""
from __future__ import annotations

import base64
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
NM = ROOT / "node_modules"
VIEWPORT = 768  # Quick Look's fixed CSS viewport

# (family names used in the SVGs, font file, weight range)
FONTS = [
    (["Geist", "Geist Variable"], NM / "@fontsource-variable/geist/files/geist-latin-wght-normal.woff2", "100 900"),
    (
        ["Geist Mono", "Geist Mono Variable"],
        NM / "@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2",
        "100 900",
    ),
    (["Instrument Serif"], NM / "@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2", "400"),
    (["Anton"], NM / "@fontsource/anton/files/anton-latin-400-normal.woff2", "400"),
]


def font_css() -> str:
    rules = []
    for families, path, weight in FONTS:
        data = base64.b64encode(path.read_bytes()).decode("ascii")
        for family in families:
            rules.append(
                f"@font-face{{font-family:'{family}';font-weight:{weight};"
                f"src:url(data:font/woff2;base64,{data}) format('woff2');}}"
            )
    return "\n".join(rules)


def prepare(svg: str, bg: str | None) -> tuple[str, float, float]:
    """Embed fonts, paint the background and fit the root into the viewport."""
    m = re.search(r'viewBox="([\d.\s-]+)"', svg)
    if not m:
        raise SystemExit("the SVG needs a viewBox")
    vx, vy, vw, vh = (float(v) for v in m.group(1).split())
    scale = VIEWPORT / max(vw, vh)
    w, h = vw * scale, vh * scale

    # Root size: replace (or add) width/height on the <svg> element.
    def fix_root(tag: re.Match[str]) -> str:
        t = re.sub(r'\s(width|height)="[^"]*"', "", tag.group(0))
        return t.replace("<svg", f'<svg width="{w:.2f}" height="{h:.2f}"', 1)

    svg = re.sub(r"<svg\b[^>]*>", fix_root, svg, count=1)

    inject = f"<style>{font_css()}</style>"
    if bg:
        inject += f'<rect x="{vx}" y="{vy}" width="{vw}" height="{vh}" fill="#{bg}"/>'
    # Right after the root tag, so the background sits under everything.
    svg = re.sub(r"(<svg\b[^>]*>)", r"\1" + inject.replace("\\", "\\\\"), svg, count=1)
    return svg, w, h


def main() -> None:
    if len(sys.argv) < 4:
        raise SystemExit(__doc__)
    src, out, width = Path(sys.argv[1]), Path(sys.argv[2]), int(sys.argv[3])
    bg = sys.argv[4].lstrip("#") if len(sys.argv) > 4 else None
    if not shutil.which("qlmanage"):
        raise SystemExit("qlmanage not found (macOS Quick Look is required)")

    svg, w, h = prepare(src.read_text(encoding="utf-8"), bg)
    px = min(4096, width * 2 * VIEWPORT // int(round(w)))  # ~2x the target width

    with tempfile.TemporaryDirectory() as tmp:
        tmp_svg = Path(tmp) / "render.svg"
        tmp_svg.write_text(svg, encoding="utf-8")
        subprocess.run(["qlmanage", "-t", "-s", str(px), "-o", tmp, str(tmp_svg)], check=True, capture_output=True)
        raster = Image.open(Path(tmp) / "render.svg.png").convert("RGB")

    # The viewport (768 × 768) was scaled to px: crop the drawn area, then resize.
    k = raster.width / VIEWPORT
    drawn = raster.crop((0, 0, round(w * k), round(h * k)))
    height = round(width * h / w)
    drawn.resize((width, height), Image.Resampling.LANCZOS).save(out, optimize=True)
    print(f"{out} ({width}x{height})")


if __name__ == "__main__":
    main()
