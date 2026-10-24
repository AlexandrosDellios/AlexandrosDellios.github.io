# DESIGN.md: "Lab Poster" design system

> **Status:** approved by Alexandros on 2026-10-20 (he picked "Lab Poster" over "Night Gallery" and "Sim | Real").
> The full inspiration analyses (fonts, colours and effects reverse-engineered from the 4 sites) are in `private/research/site_*.json`. They are local-only and gitignored.
>
> ## Amendments after user answers (these override anything below)
> - **No people's names** anywhere (teammates, supervisors). Say "Team of 3". The exceptions are Marco Odermatt (approved) and, on the award page only, the names Alexandros approved on 2026-10-24 (docs/DECISIONS.md).
> - **Project page header (2026-10-25):** the meta row under the title shows only the year and the link pills (Code, Website). Context, team and "my part" were too much text (Alexandros); the course and team stay on the home tiles, and "my part" is said in each page's text.
> - **Availability:** "Available summer 2027 · ~6 months".
> - **Claims:** use the CV wording as-is. Alexandros confirmed the claims are backed by his reports.
> - **Portrait:** `Images/pic.JPG`, rotated upright, background cut out, placed in the accent arch.
> - **Guide-dog robot photo** `Images/dog.png` is OK to publish (cut out onto the accent card).
> - **Polymander simulation videos** are OK to show.
> - **No links to teammate-owned repos** (their URLs contain names) or to private repos.
> - Stack: **Astro 7.4 + GSAP 3.15 (bundled from npm) + Lenis 1.3**, fonts via Fontsource npm packages, native cross-document view transitions.
>
> **As built (integration pass, 2026-10-20).** Deliberate deviations from the spec below:
> - Home: Experience and Toolbox share one band on desktop (7 + 5 columns) instead of two full-width sections. Home section gaps and the footer margin use `--section-sm` (64px at 1440), and the footer block is tighter, so the home page is 6.0 screens at 1440×900 and 10.8 at 390×844 (§2.5).
> - Project pages: the order is title, meta, **TL;DR, then the serif lead** (on desktop the TL;DR sits in the right column), so the TL;DR fits the first screen on phones (§2.7, §8).
> - Reading progress is a 2px bar in the header's underline slot (not 1px); project pages never use the M2 header underline, so two accent lines never stack.
> - Highlights bullets: the bold lead-in is set as a serif metric only when it ends with punctuation.
> - Videos: `extraVideos[].clickToPlay` clips never start by themselves (Polymander transitions). A clip started with its button is not interrupted by hovering another card. `extraVideos[].autoplay` clips play when they scroll into view on every screen, not only on touch screens (never under reduced motion or Save-Data), and `wide` makes a clip span the whole gallery (the Uno synthesis clip, 2026-10-24, at Alexandros's request).
> - View-transition names are filtered per navigation by one inline script in BaseLayout (`data-vt-name` / `data-vt-only`): only the clicked tile morphs into the hero, and off-screen targets are dropped.
> - M10 walk phases, by leg: LF 0, RH .25, RF .5, LH .75 (lateral-sequence walk, same as the report's gait figure).
>
> **QA pass (2026-10-20).** Changes after the five-lens review:
> - **No endless decorative loops (WCAG 2.2.2).** M3 rotator: one pass through the pairs, back to pair 1, paused while the pointer or focus is in the hero text. M10 metronome: walks while you scroll (paused ~5 s after load and 2 s after scrolling stops; a click wakes it). Status pulse: 3 pulses. Ring sticker (M9): turns only while hovered. Now-card trajectory dashes: only while the card is hovered or focused.
> - **Hero.** Desktop arch is square (PortraitArch `--arch-a: 1`, 1.2 × the old width, same height). The email address shows under the CTAs below 1024px (rule 2). Stacked layout up to 719px (tablet columns from 720). From 600px the one-line name is capped at `(100vw − 2·pad) / 8` so the whole name is readable at rest (only the ✦ and the repeats run off the edge). Phones: the name strip does not slide (one wrapped copy), it clips away from 35% of the M2 range.
> - **Focus never hidden under a collapsing strip (WCAG 2.4.11):** the home and project strips report their visible bottom edge to `setFocusClearance()` (scroll-padding-top + a focusin fallback).
> - **Strips:** project title strips share the home strip's ✦ separators (`.name-strip--stars`) and repeat enough to run off the edge (≈ 20 letters: UNO × 7).
> - **Tiles:** the title arrow follows the last word; tile focus anywhere (link or play button) mirrors hover; bottom-left tiles put chips and the outlined word in one flex row. Drawings can ship a label-free `tilePoster` (Uno: the 5-zone split).
> - **Placeholders** say "Coming soon" (not "Media needed"), and visitor labels carry no production specs. In galleries the placeholder is a slim band without a caption; when it would be a gallery's only item, the page shows one "Coming soon: …" line at the end of the Notes instead.
> - **Figures:** raster plots are multiplied onto the paper (no white boxes), wide ones are capped at 56rem, items from 2.4:1 span the gallery (≈2:1 plots pair up), cards in a row share one height. Clips wider than 3:1 put their play button and a "Full size ↗" (MP4) link under the frame. Hero media is shown at most 1.5× its source width.
> - **Project pages:** section headings carry one italic word (`The *approach*`, `What it *achieved*`, `*Notes*`); Highlights are a two-column metric grid on desktop; the prev/next cards are neutral paper-2 (max two accents on screen); the visible "TEAM" label is dropped ("Team of 3" says it).
> - **Lists:** More-work rows follow the SectionHead grid (year in cols 1–3, title from col 4). List-row preview cards (160px) are pinned in the dates / year column, never over the text. Meta lines break only between " · " segments (`Segments.astro`), Toolbox items never split.
> - **Phones:** the Now cards use `bodyShort` and hide the dark card's illustration; body copy in Now / Experience / TL;DR is ≥ 15px.
> - **Mobile menu** background is the accent mixed 80/20 with paper, so its small ink labels pass AA on every project accent.
> - **Glider `--accent-ink` is `#1A6796`** (the old `#1D6E9E` was 4.40:1 on paper-2).
>
> **Edits from Alexandros (2026-10-23).** These override §2.5, §3.3, §4 and §5 where they differ:
> - **Tiles are "print cards"** (his pick over a soft arch, a cut-corner tag and plain rounded corners): 4:3 media with a 2px ink border, square corners (`--r-print: 0`) and a hard ink shadow down-left (`--shadow-print: -6px 6px 0`). On hover/focus the print lifts 4px up-right while the shadow grows to `--shadow-lift` (-10px 10px), so the shadow stays put; the duotone still turns to colour. No exposed corner, no radius morph: `--r-tile` is gone. Chips sit top-left, the play toggle top-right. The project hero board (`--r-sm`, frame `--r-print`), the prev/next thumbnails and the social cards use the same print language.
> - **Selected work = 4 tiles + 2 statements** (3 × 2 grid: tile, tile, S1 / tile, S2, tile): Quadruped, Glider, Uno, Thymio. The S3 statement is gone.
> - **More projects** (section 03, was "Smaller and earlier work"): every other project (`section: more`: Polymander, Rocket, Fly navigation) is a row that links to its own page: year (project accent ink) | title → , one-liner, tag chips | course and team stacked on the right (one glued line below 1024px). Hover preview: the project poster. The multi-robot cleanup simulator was removed.
> - **Role pages** (`/experience/<slug>/`, `kind: role`): BioRob, AI Team, Mediacom, on the project template (meta: dates · org · Role · optional website pill; TL;DR Mission / My role / Status / Tools). The Now cards are whole-card links to them with a "Read more →" cue; the Experience rows link to them (stretched link; the " ·" before the org belongs to the title, so a wrapped org never starts a line with it; arrow after the org) and every row has a desktop hover preview (photo, or the drawn placeholder). List-row preview cards are pointer-only (keyboard focus would put them over the next row's dates); Escape closes any preview. Previews follow the pointer through scrolling (2026-10-24): after each scroll frame the card follows the row under the still pointer, instead of hiding on every scroll event (smooth scroll kept firing those after the wheel stopped, so a row under a resting pointer often never showed its card).
> - **Placeholders are drawings:** MediaPlaceholder shows a line sketch (src/assets/sketches/: photo, video, plot, arm, quadruped, award; ink lines, accent details inlined in the page accent) above the "COMING SOON · label" tag; `variant="band"` puts a small sketch beside the tag. Gallery `soon` items render as full drawn cards (16:9 for clips, 4:3 otherwise). The QA-pass "Coming soon: …" text line at the end of the Notes is gone: missing media is always drawn in the gallery (a lone `mediaNeeded` becomes the slim band). The gallery heading follows what it holds, placeholders included: Footage & *figures*, Photos & *footage*, *Footage*, *Figures* or *Photos*.
> - **Meta lines** (`Segments.astro`): each segment carries its own trailing " ·" and lines break only at the plain space between segments (a no-break space after an inline-block does not stop Chrome from breaking), so no meta line starts with "·".
> - **Header:** no project count on Work. **Section asides:** Now "Research & prototyping"; Selected work only "hover to play" (fine pointers); none on More projects and Toolbox. The aside spans cols 10–12 (title cols 4–9) so it stays on one line.
> - **Hero:** the cut-out's top mask layer stops at the D's widest point (1 − k), so the shoulder no longer pokes out past the curve at rest. On desktop the ring and lime stickers sit on the arch's right edge (`--arch-right`, computed from the same geometry), never over the text column; the tag sticker is narrower (`clamp(9.5rem, 12vw, 13rem)`) so it clears "Model Predictive". Checked from 1024 to 2560 px.
> - **Development-cycle timeline** (2026-10-24, `ProcessTimeline.astro`, frontmatter `timeline`): a numbered "Development *cycle*" section before the gallery. A hairline rail with a number and a dot per stage (the last dot in the accent); each stage: mono date, serif title, one line, then its photos in justified rows (equal heights, widths from each photo's ratio, no crop, lone items capped at 1.6 × the row height; phones: two columns, landscape items full width), each as a print (2px ink border) with a caption and a mono credit. Photos fade in one after another as they scroll in (M5 `[data-enter]`, now also on project pages; never under reduced motion, nothing hidden without JS).
> - **Photos in galleries** (2026-10-24): a figure with `photo: true` is shown as it is (no multiply blend onto the paper, no 56rem cap); the gallery heading also counts photos ("Figures & *photos*").
> - **Hero image and TL;DR** (2026-10-24): a page can set `hero` (+ `heroAlt`, `heroCredit`) for the top of the page only, with a small mono credit line under the board (the award page uses the ECAL studio shot); the TL;DR box no longer shows a "N lines" count, on every page.
> - **Footer bottom line:** "© 2026 Alexandros Dellios · Built with Astro · Inspired by cydstumpel.nl" (link).
> - New accents: fly navigation `#7BAE2F` / `#456A13`, AI Team `#1F9E8F` / `#0D6A60`, Mediacom `#C4893A` / `#7A5016`, BioRob the site orange (all `--accent-ink` ≥ 4.7:1 on paper-2).

---


Stack, per docs/DECISIONS.md: **Astro (static) + GSAP 3.13 + Lenis 1.3, deployed by GitHub Actions to GitHub Pages.**
- The workflow prompt said vanilla HTML with CDN libraries. The user's recorded decision (Astro) wins.
- Everything here also works in vanilla HTML if that decision changes.

## 1. Direction in one paragraph
The site reads like a warm, editorial lab poster:
- a giant condensed name runs off the edge of the screen;
- each page has one bold accent color;
- serif *statements* carry the voice;
- small mono "telemetry" labels carry the data;
- each project's robot footage sits in a calm duotone of its own color, then plays in full color as soon as you look at it.

It weights the user's #1 favourite most heavily:
- **cydstumpel ≈ 60%:**
  - structure, the per-page accent system and the type trio;
  - the name strip that collapses into the header;
  - tiles with one exposed corner;
  - serif statement cells with link tooltips;
  - stickers, press-pills, view transitions and the footer ticker.
- **bepatrickdavid ≈ 20%:** duotone media that turns to color, line-mask heading reveals, the experience table with hover previews, and the reading-progress hairline.
- **tamalsen ≈ 10%:** a mono "engineer voice" for labels, nav counts and dates, and a highlighter for focus and links.
- **adhamdannaway ≈ 10%:** short-homepage discipline, prev/next on project pages, and a split sim|real idea kept for later.

### What makes it robotics without clichés
- **Gait metronome.** A 4-dot CPG trot in the header. It is his own subject (CPGs appear in three of his projects), not a generic robot icon.
- **Telemetry labels.** Metric chips with units: `29% INCLINE · ≈16°`, `LANDED < 4 S`.
- **"Simulation comes alive".** A duotone poster becomes live footage on hover, or when it scrolls into view on touch screens.
- **Accents taken from his footage.** Mustard ramp, periwinkle water, arena green.
- **Figures redrawn in site ink.** Gait-phase diagram, airfoil, Uno pipeline.
- **Banned:** circuit-board textures, neon on black, glitch/scanline effects, particle networks, typing terminals, stock robot hands, blue "AI" gradient orbs, 3D models without a fallback.

## 2. Browsability rules (non-negotiable)
1. **No loader.** Text is readable within 300 ms of first paint. Content renders without JS; animated elements are hidden only behind an `html.js` class set inline in `<head>`.
2. **The first viewport (1440×900 and 390×844) shows:** name, "Robotics M.Sc. · EPFL", the static role line, availability, the email, and a **Download CV** button.
3. **The first project media starts within one scroll.** The Now cards start at about 85vh, and Selected work at about 1.6 screens.
4. **Every tile always shows** title, one-line outcome, metric chip, 3–4 tags, year and team size. Hover only adds flair; it never reveals information.
5. **Home page length is at most 6 screens on desktop and 11 on mobile.**
6. **The sticky header is always reachable,** with Work / Experience / Toolbox / Contact / CV. The CV is one click from every page.
7. **Project pages open with a 4-line TL;DR** above the fold.
8. **Rotating text never carries information alone.** The roles also appear in a static line.
9. **At most one video plays at a time.** None autoplays under reduced motion or Save-Data.

## 3. Design tokens

### 3.1 Color (light theme only in v1; `color-scheme: light`)

| Token | Value | Use | Contrast |
|---|---|---|---|
| `--paper` | `#F4EFE6` | page background | — |
| `--paper-2` | `#EBE4D8` | cards, figure mats, list hover | — |
| `--ink` | `#151412` | text, borders, outlines | 16.1:1 on paper |
| `--ink-2` | `#5E5850` | secondary text, meta | 6.1:1 |
| `--line` | `color-mix(in srgb, var(--ink) 18%, transparent)` | hairlines | — |
| `--dark` | `#1B1A17` | "Now · research" card | paper on dark 15.2:1 |
| `--accent` | `#E5501D` (actuator orange: e-stop / industrial-arm orange) | giant name, arch, buttons, footer block | 3.3:1 on paper, so **large text and shapes only**; ink on accent 4.8:1 |
| `--accent-ink` | `#B23A12` | small accent text, links | 5.2:1 |
| `--highlight` | `#DDF27A` (lime) | link-hover fill, `:focus-visible` background, one sticker | ink on lime 15:1 |

**Per-project accents** are set from frontmatter with `<html style="--accent:…;--accent-ink:…">`. The whole page re-themes: title strip, arch, pills, footer, `::selection`.

| Project | `--accent` (fill) | `--accent-ink` (text) | Source |
|---|---|---|---|
| Quadruped CPG+RL | `#E2A814` mustard | `#7A5800` (5.7:1) | yellow ramp |
| Polymander | `#7377C7` periwinkle | `#474BA3` (6.5:1) | water render |
| Rocket MPC | `#B8418E` magenta | `#8E2C6B` (6.7:1) | — |
| Uno sim-to-real | `#D23445` crimson | `#A61F30` (6.4:1) | Uno red |
| Thymio EKF | `#2C9658` arena green | `#1E6B3E` (5.7:1) | arena mat |
| Glider co-design | `#3A9AD9` sky | `#1A6796` (5.35:1; 4.85:1 on paper-2) | — |

Rules:
- **Fills never carry small text.**
- On a fill, text is either an outlined display word (paper fill, 1px ink stroke, `-2px 2px 0` ink shadow), so it is legible on any fill, or a **chip with its own paper background**.
- After the hero, `html` background may tint to `color-mix(in srgb, var(--paper) 94%, var(--accent))`. This is Cyd's overscroll tint; optional.

### 3.2 Typography (all free, self-hosted via Fontsource npm packages; no Google Fonts requests)

| Role | Family | Weights | Stands in for |
|---|---|---|---|
| Display (uppercase only) | **Anton** (`@fontsource/anton`) | 400 | Cyd's Bueno / PD's Tusker. Alternative: **Roboto Flex** at `wdth 25, wght 800` for a true variable squash |
| Voice: headings, statements, nav on desktop | **Instrument Serif** (`@fontsource/instrument-serif`) | 400 + italic | same as Cyd |
| Body | **Geist** (`@fontsource-variable/geist`) | 400–600 | same as Cyd (replaces Neue Montreal / Proxima Nova) |
| Telemetry: labels, tags, dates, metrics | **Geist Mono** (`@fontsource-variable/geist-mono`) | 400–500, `tabular-nums` | Tamal's Roboto Mono |

Loading:
- Subset to Latin.
- `font-display: swap`.
- `<link rel=preload>` Anton and Geist only.
- Metric-matched fallbacks: `Anton, "Impact", "Arial Narrow Bold", sans-serif` with `size-adjust`; Geist falls back to system-ui.

Scale (fluid, designed at 360 → 1440):

| Token | Font | Size | Line height | Tracking | Use |
|---|---|---|---|---|---|
| `--fs-giant` | Anton | `clamp(5rem, 13.9vw, 16rem)` | .86 | .01em | name strip, project title strip |
| `--fs-display` | Instrument Serif | `clamp(3rem, 1.6rem + 5.2vw, 7rem)` | .95 | -.015em | rotating role |
| `--fs-h2` | Instrument Serif | `clamp(2.25rem, 1.4rem + 3.4vw, 4.5rem)` | 1 | -.015em | section headings |
| `--fs-statement` | Instrument Serif | `clamp(1.5rem, 1.1rem + 1.4vw, 2.5rem)` | 1.1 | -.01em | statement cells, footer line |
| `--fs-h3` | Instrument Serif | `clamp(1.5rem, 1.2rem + .9vw, 2rem)` | 1.1 | 0 | tile and card titles |
| `--fs-tileword` | Anton | `clamp(2rem, 1.2rem + 2.6vw, 3.5rem)` | 1 | .01em | outlined word on tile |
| `--fs-lead` | Geist 400 | `clamp(1.125rem, 1.02rem + .45vw, 1.375rem)` | 1.45 | -.01em | bio, page leads |
| `--fs-body` | Geist 400 | `clamp(1rem, .97rem + .15vw, 1.0625rem)` | 1.6 | -.005em | body |
| `--fs-small` | Geist 400 | `.875rem` | 1.5 | 0 | captions, one-liners |
| `--fs-label` | Geist Mono 500 | `.75rem` | 1.3 | .08em, UPPERCASE | eyebrows, chips, dates |

Type rules:
- Exactly **one italic phrase** per serif headline.
- Measure: body 62ch, lead 46ch.
- Bold only as Geist 600.
- No all-caps paragraphs.

### 3.3 Space, grid, shape
- `--pad: max(1rem, 1.667vw)` gives a 16px gutter on phones and 24px at 1440.
- `--gap: 1rem` (≥1024), `.75rem` below.
- `--section: clamp(4.5rem, 9vw, 10rem)`
- `--maxw: 1600px`
- `--header-h: 64px` desktop, `56px` mobile.
- **Grid:** 12 columns at ≥1024px, 6 at 600–1023px, 4 below 600px. Subgrid for the work grid, so tile meta rows line up.
- **Radii:**
  - `--r-xs .375rem` (chips), `--r-sm .5rem` (figures, cards), `--r-pill 999px`.
  - `--r-tile: clamp(1.5rem, 6vw, 6rem)` on three corners, with one **exposed** (sharp) corner that rotates TL → TR → BL by tile index.
- **Borders:** 1px ink (chips, pills); 2px ink (Now cards, flip states).
- **Shadows:** hard offset only: `-3px 3px 0 currentColor`, pressing to `-1px 1px 0`. **No blurred shadows.**
- **Motion tokens:**

```css
--ease-out-quart: cubic-bezier(.25,1,.5,1);
--ease-out-back:  cubic-bezier(.34,1.56,.64,1);
--ease-out-expo:  cubic-bezier(.16,1,.3,1);
--ease-in-back:   cubic-bezier(.36,0,.66,-.56);
--dur-ui: .25s; --dur-m: .6s; --dur-l: 1s; --dur-vt: 1.1s;
```

## 4. Layout per section

| Section | Desktop (≥1024) | Tablet | Mobile (<600) |
|---|---|---|---|
| Header | sticky; logo + email + status left, metronome center, nav + CV pill right; 2px accent underline wipes in after the name strip clips | email hidden | logo, status dot, menu button |
| Name strip | `position:sticky; top:var(--header-h)`; flex row of 2–3 copies, overflowing right | same | min 5rem; no squash |
| Hero | cols 1–5: portrait in arch; cols 6–12: eyebrow, role rotator, bio, CTA row; stickers float at edges; ≤ 100vh | 2 cols, smaller portrait | stacked: portrait (max 70vw), role, bio, CTAs (2×2 grid); 1 sticker |
| Now | 2 cards × 6 cols; dark research card + accent AI Team card with cut-out robot | 2 cols | stacked |
| Selected work | 3×3 subgrid (6 tiles span 4, 3 statement cells span 4); 4:3 media | 2 cols, statements span 2 | 1 col; statements between tiles |
| More work | table rows: name / line / stack / year / link; hover thumb follows cursor | same | stacked rows, no thumbs |
| Experience | PD-style table: dates (mono) / role · org / line; hairline rows; tilted hover preview | same | stacked; preview hidden |
| Toolbox | 3-col group grid; group title (mono label) + items + "seen in →" project links | 2 cols | 1 col |
| Footer | full-bleed accent block, ink text; serif line left, contact right; sticky ticker below | same | stacked |
| Project page | title strip → meta row → lead + TL;DR (cols 1–7) beside a meta column (cols 9–12) → hero media full width → approach / results in 7-col reading column with figures breaking out to 10 cols → prev/next tiles | same, single column | single column |

## 5. Components

1. **Header**
   - Sticky. Background is `--paper`, gaining 90% opacity plus `backdrop-filter: blur(10px)` after 10px of scroll.
   - The 2px accent underline is `transform: scaleX(0→1)`, transform-origin left.
2. **NameStrip** (`<h1>`): Anton `--fs-giant`, `--accent`, one aria-visible copy, the others `aria-hidden`.
3. **RoleRotator:** two stacked lines with the first word italic, clipped container (`clip-path: inset(-10%)`), an sr-only static list, `aria-hidden` visual.
4. **PortraitArch**
   - Accent shape: `clip-path: inset(0 16% 0 0 round 0 50vw 50vw 0)`.
   - Photo inside: `border-radius: 50vw 50vw var(--r-sm) var(--r-sm)`.
   - Optional cut-out version that breaks the frame.
5. **Sticker:** inline SVG, rotated −6° to 10°; ring text on `<textPath>`; draggable rotation.
6. **PillButton**
   - Primary: ink fill with paper text. Secondary: paper fill, accent-ink text, 1px accent border.
   - Hard shadow `-3px 3px 0`; on hover/focus it presses (`translate(-2px,2px)`, shadow `-1px 1px 0`).
   - Geist 500 at `.9375rem`. Min height 44px.
7. **CopyEmail:** a button showing the address with a copy icon. `navigator.clipboard.writeText`, then a "Copied ✓" chip for 1.6 s. Falls back to a `mailto:` link.
8. **StatusBadge:** pulsing 8px lime dot plus a mono label. The pulse is off under reduced motion.
9. **GaitMetronome**
   - 2×2 dots (LF RF / LH RH), each 6px, accent when in swing, ink at 30% in stance, plus a mono gait label.
   - Click cycles trot → walk → pace → bound. `role="button"`, `aria-label="Gait animation: trot. Click to change."`.
10. **NowCard:** two variants, dark and accent. Kicker label, serif title, body, tags, media slot (or MediaPlaceholder), optional link.
11. **ProjectTile** (`<a>`, the whole card is the link)
    - Media box 4:3 with project `--accent` background.
    - Duotone poster: `img{filter:grayscale(1) contrast(1.1)}` with an overlay `::after{background:var(--accent);mix-blend-mode:multiply}`. Alternatively generate `*-duo.webp` at build time with sharp for identical results everywhere.
    - `<video preload="none" muted loop playsinline>`; its `src` is attached on first intent.
    - Outlined tile word at the bottom (`aria-hidden`).
    - Metric chip top-left (paper bg, mono).
    - **Below the media, always visible:** serif title, one-liner, tags, `year · context · team`.
    - `view-transition-name: media-<slug>` on the media box and `title-<slug>` on the title.
    - Focus-visible mirrors the hover state.
12. **StatementCell + LinkTooltip:** serif text. Each link gets a highlighter underline (`background-size` grows from 0 to 100% on hover/focus). On fine pointers, a pill tooltip with a round 24px thumbnail and the project name follows the cursor.
13. **Chips:** TagChip (mono, 1px line border, radius xs), MetricChip (paper bg, ink, mono 500), TeamChip.
14. **MoreWorkRow:** a 5-column grid row with a hairline; optional hover thumbnail (Cyd tooltip pattern).
15. **ExperienceRow:** the dates line uses `tabular-nums`. On hover/focus-within, a 200px preview tilted 4° fades in on the left (desktop only).
16. **SkillGroup:** label, items, and "seen in" links to projects.
17. **Footer:** accent block, ink text, a sticky ticker of the name (CSS marquee).
18. **Project page parts:**
    - TitleStrip (same component as NameStrip)
    - MetaRow
    - TLDR (2px ink border, `--paper-2`, 4 labelled lines)
    - Figure (paper-2 mat, caption in `--fs-small`, credit in mono)
    - MediaRow (2-up)
    - PrevNext (two compact tiles)
    - ReadingProgress (1px accent hairline under the header)
19. **MediaPlaceholder:** dashed 1px ink border, 45° hatching in `color-mix(accent 12%)`, and a mono label such as `COMING SOON · Guide-dog walking video` (production specs stay in docs/MEDIA.md). Per DECISIONS.md, placeholders stay visible until the media arrives.
20. **LoopVideo:** poster first. Plays when hovered (fine pointer) or ≥60% visible (touch); pauses when off-screen or the tab is hidden. A visible pause/play toggle is required for WCAG 2.2.2. Disabled under `prefers-reduced-motion` or `navigator.connection.saveData`.
21. **MobileMenu:** full-screen accent panel with a `clip-path: inset(0 0 100%) → inset(0)` wipe. Links are serif at 3rem. Focus trap, Esc closes, `aria-expanded`, and the body scroll locks (`data-lenis-prevent`).

## 6. Motion spec

The libraries are npm packages bundled by Astro. `gsap@3.13.x` provides core, ScrollTrigger, SplitText, Draggable and InertiaPlugin, all free since 3.13. `lenis@1.3.x` handles smooth scroll. Everything else is CSS, Web Animations or IntersectionObserver.

| # | Name | Trigger | Properties | Duration / easing | Implementation | Reduced motion |
|---|---|---|---|---|---|---|
| M1 | Intro | `html.is-ready` (`document.fonts.ready` or a 600 ms timeout) | Name strip `translateY(100%)→0` + opacity, delay .1s. Arch `clip-path inset(0 100% 0 0)→inset(0)`, delay .15s. Bio/CTAs `translateY(16px)` + opacity, delay .25s. Stickers `scale(0)→1`, delay .45s, stagger 60ms. **Done by about 1.0 s.** | .8s back-out / .9s out-quart / .6s out-quart / .4s back-out | CSS keyframes gated by `.js` | No animation; content shown immediately |
| M2 | Name strip collapse | scroll, from hero top to +55% of a viewport | Strip `x: 0→-40vw`; `scaleY 1→.62` (first 30%); `clip-path inset(0 0 0)→inset(0 0 100%)` (last 10%). Header underline `scaleX 0→1` (85–100%). Hero arch inset 16%→0. | scrub (scroll-linked), out-quart | GSAP ScrollTrigger `scrub:true`. A pure-CSS `animation-timeline: view()` version inside `@supports` is also acceptable | Static strip that scrolls away normally |
| M3 | Role rotator | hero in view (pauses off-screen and when the tab is hidden) | Outgoing pair `yPercent 0→100` + autoAlpha 0; incoming pair `-100→0`. Line stagger .1s, hold 3s | .4s, `back.out(0.9)` | GSAP timeline `repeat:-1`, toggled by ScrollTrigger | Shows pair 1 only; full list stays in the static line |
| M4 | Heading reveal | section `h2` enters at 85% of the viewport, once | SplitText lines with mask: `yPercent 110→0`, `rotate 6°→0`, transform-origin 0 50% | .9s `expo.out`, stagger .06 | GSAP SplitText + ScrollTrigger `once:true`. **h2 only** (≤ 8 per page) | Off |
| M5 | Tile entry | tiles at 90% of the viewport (batched) | opacity 0→1, scale .94→1 | .6s out-quart, stagger 60ms | `ScrollTrigger.batch` or IntersectionObserver plus CSS classes | Off |
| M6 | Tile hover / focus | `:hover` on `(hover:hover) and (pointer:fine)`, plus `:focus-visible` | Media radius `exposed → 0 45% 45% 45%`; duotone overlay opacity 1→0; video play (pause on leave); title arrow `translateX(-8px)→0`; chips fan on an arc (`scale 0→1`, delay `abs(i - n/2)*50ms`) | radius .4s out-quart, delay .1s; overlay .3s; chips .4s | CSS, with ~20 lines of JS for video intent | Overlay fades with no radius morph; no video |
| M7 | Touch playback | tile ≥60% visible (touch devices) | Full-color poster; plays only the most visible video | — | IntersectionObserver | Poster plus play button |
| M8 | Page transition (tile → project hero) | same-origin navigation | Shared `media-<slug>` group morphs size and position (`view-transition-class: project-media`). Old root fades .25s. Old title strip `translateY(-100%)` (.3s in-back); new strip rises (.5s back-out, delay .3s). Accent re-themes through the root crossfade | `--dur-vt` 1.1s out-quart | Native cross-document `@view-transition { navigation: auto; }`. **Not** Astro's ClientRouter, which keeps GSAP and Lenis setup simple. Chrome/Edge 126+ and Safari 18.2+; others get a normal load | `animation: none` on every `::view-transition-*` |
| M9 | Stickers | drag / scroll | Drag rotation with inertia. Ring text idle spin 40s linear. Scroll drift `x +6vw`, `rotate +20°` across the hero | drift scrubbed | GSAP Draggable `{type:'rotation', inertia:true}`; CSS spin. Loaded only at ≥750px with a fine pointer | No idle spin or drift; dragging still works (user-initiated) |
| M10 | Gait metronome | always (paused when the header is hidden or the tab is hidden) | Each dot: swing phase `translateY(-40%)` + accent color for 40% of the cycle. Phase offsets per gait: trot LF/RH 0, RF/LH .5; walk LF 0, RH .25, RF .5, LH .75 (lateral sequence); pace LF/LH 0, RF/RH .5; bound fronts 0, hinds .5. Scroll speed raises `playbackRate` = `1 + min(|lenis.velocity|/30, 2)` | .9s cycle, `ease-in-out` | CSS keyframes with negative delays; Web Animations API `getAnimations()` to set playbackRate | Static trot pose |
| M11 | Smooth scroll | wheel | expo-out easing; anchors use `lenis.scrollTo(target,{offset:-headerH})` | duration 1.0, `t => t===1?1:1-2**(-10*t)`; touch stays native (`syncTouch:false`) | Lenis driven by `gsap.ticker`, `lagSmoothing(0)` | **Not initialized**; native scroll with `scroll-behavior:auto` |
| M12 | Pill press | hover / focus / active | translate + shadow | .25s ease | CSS | Same (no motion concern) |
| M13 | Copy email chip | click | chip opacity + `translateY(4px→0)` | .2s in, out after 1.6s | JS + CSS | Same |
| M14 | Footer ticker | always (paused on hover, focus or off-screen) | `translateX(0→-50%)` | 40s linear infinite | CSS marquee with duplicated content | Static |
| M15 | Reading progress (project pages) | scroll | `scaleX` from 0 to 1 | linear | CSS `animation-timeline: scroll(root)` inside `@supports`; rAF fallback | Kept (it is information, not decoration) |
| M16 | Link tooltip | pointermove over a statement link | `translate` follows the cursor; opacity | .2s | ~15 lines of JS, fine pointers only | Tooltip appears next to the link with no movement |

Motion budget: **at most 4 things move at once in a viewport.** Nothing loops in the reading column of project pages except the hero video, which has a pause control.

## 7. Accessibility
- **Reduced motion.** `@media (prefers-reduced-motion: reduce)` disables M1–M5, M8 and M14, plus M9 idle motion and video autoplay. JS checks `matchMedia` before creating Lenis, ScrollTrigger scrubs or SplitText.
- **Focus.** `:focus-visible` gives a 2px ink outline, 3px offset, and a lime `--highlight` background on text links. Tiles show the hover state on focus. Skip link to `#main`. Logical tab order. Every hover behavior has a focus equivalent.
- **Contrast.** Body 16:1 and muted 6.1:1. Accent orange is used only for text ≥ 24px (3.3:1); small accent text uses `--accent-ink` (≥ 4.9:1 for every project). Fills never carry small text.
- **Semantics.**
  - One `<h1>` per page: the name, or the project title.
  - Sections are `<section aria-labelledby>`.
  - The rotator and sticker words are `aria-hidden`, with sr-only equivalents.
  - Each tile link's accessible name is its title.
  - Experience is a semantic list or `<table>`.
- **Media.** Posters have meaningful `alt` ("Simulated Unitree A1 climbing a yellow ramp in PyBullet"). Videos are muted and decorative, with a visible pause control; anything conveying results also has a caption. Figures use `<figure>`/`<figcaption>`.
- **Target size** ≥ 44×44 px. No hover-only information. Keyboard can operate the menu, copy button, metronome and stickers (stickers are skipped in tab order because they're decorative).
- **Language.** `lang="en"`. Visible "↗" plus `rel="noopener"` on external links.

## 8. Mobile behavior (tested at 360, 390 and 430 widths)
- **No horizontal scroll:** `overflow-x: clip` on the name strip only.
- **Header (56px):** logo, status dot, menu. The email moves into the menu and the footer. The metronome is hidden below 600px.
- **Name strip:** min 5rem, the name on two lines (one copy). It clips into the header progressively but neither slides nor squashes (QA pass: a slide only made sense with repeated copies).
- **Hero order:** portrait arch (max 70vw), rotating role, bio, a 2×2 CTA grid (CV / Email / GitHub / LinkedIn), static role line. One sticker, not draggable.
- **Tiles:** single column, 4:3 media. Full-color poster with no duotone, since there is no hover. The most visible video autoplays muted unless reduced motion or Save-Data. All meta is visible. No chip fan.
- **Lists:** experience and more-work rows stack (dates on top). No hover previews.
- **Project pages:** single column; the TL;DR fits the first screen; figures go full-bleed with captions; prev/next are stacked full-width tiles.
- **Gestures and scrolling:** Lenis is off for touch (native momentum). View transitions still work on mobile Safari 18.2+ and Chrome.

## 9. Performance budget (home, first load, 4G, mid-range phone)

| Item | Budget |
|---|---|
| HTML + critical CSS | ≤ 40 KB gzip (CSS inlined by Astro when small) |
| JS (home) | ≤ 90 KB gzip total (GSAP core + ScrollTrigger + SplitText ≈ 50, Lenis ≈ 5, app ≈ 10). Draggable + Inertia (≈ 15) are dynamically imported on desktop only |
| Fonts | ≤ 160 KB (4 Latin-subset woff2); only Anton + Geist preloaded |
| Images above the fold | portrait AVIF ≤ 120 KB (`fetchpriority=high`); everything else `loading=lazy` |
| Tile posters | ≤ 60 KB each (AVIF/WebP, widths 400/800/1200 via Astro `<Picture>`) |
| Videos | ≤ 600 KB per loop, ≤ 8 s, 24 fps, no audio, H.264 + VP9 WebM, `preload="none"`, source attached on intent; **never ship GIFs** |
| Total transfer before any video | ≤ 700 KB |
| Metrics | LCP < 2.0 s, CLS < 0.05, INP < 150 ms; Lighthouse ≥ 95 performance, 100 accessibility, 100 SEO |

Encoding recipes (ffmpeg is installed at /opt/homebrew/bin/ffmpeg):
- MP4: `ffmpeg -ss 2 -t 8 -i in.mp4 -vf "scale=960:-2,fps=24" -c:v libx264 -crf 28 -preset slow -pix_fmt yuv420p -an -movflags +faststart out.mp4`
- WebM: `-c:v libvpx-vp9 -crf 38 -b:v 0 -an out.webm`
- Poster: `-frames:v 1 out.png`, then Astro converts it to AVIF/WebP.

## 10. Implementation notes (Astro)
- **Config:** `astro.config.mjs` sets `site: 'https://alexandrosdellios.com'` (custom domain, since 2026-10-21) with no `base`. Static output. Deployed with the GitHub Pages workflow (`withastro/action`).
- **Content collection** `src/content/projects/*.md`, zod schema:

```
title, shortWord, slug, order, featured, year, context, team[],
myRole, oneLiner, metric, tags[], accent, accentInk, focus (object-position),
links{code?, teamRepo?, report?}, media{poster, video?, webm?, hero?},
lead, tldr{problem, built, result, stack}, status: 'draft'|'confirmed'
```

  Draft items can render with a visible "[CONFIRM]" marker in dev, and the build fails if a `draft` project is published.
- **Layouts:** `BaseLayout.astro` (head, fonts, header, footer, the `@view-transition` rule, the `html.js` inline script); `ProjectLayout.astro`.
- **Scripts:** `src/scripts/motion.ts` runs a reduced-motion check first, then dynamic imports per feature. Initialize Lenis before ScrollTrigger and call `lenis.on('scroll', ScrollTrigger.update)`.
- **Files:**
  - Videos go in `public/media/<slug>/`; Astro does not process video.
  - Images go in `src/assets/projects/<slug>/` (optimized).
  - The CV is at `public/CV-Alexandros-Dellios.pdf`; `/cv` redirects there via `src/pages/cv.astro` with a meta refresh.
- **SEO:**
  - Per-page `<title>`, for example "Quadruped locomotion with CPGs + RL · Alexandros Dellios".
  - OG image generated at build: name strip on accent, one per project.
  - JSON-LD `Person`.
  - Favicon: "AD" in Anton on orange, as SVG.
- **No three.js in v1.** An optional later easter egg is a lazy-loaded GLB of the quadruped with a poster fallback.

## 11. Don'ts (lessons from the inspiration sites)
- Never hide content behind a loader or a long intro (PD's ~4 s, Adham's preloader).
- Never put information only in hover states (Cyd's tile metadata, PD's mobile titles).
- No all-caps paragraphs, and no more than two accents on screen at once.
- No paid or trial fonts.
- No fragile WebGL without a fallback.
- No custom cursor.
- No jokes that read as unserious to a PI (fake availability, joke skill bars, percentage skill bars).
