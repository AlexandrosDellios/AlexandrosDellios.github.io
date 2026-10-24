# MEDIA.md: media inventory, processing recipes, and what is still needed

> **Where things live**
> - `Images/` is the **drop-zone** for Alexandros's originals. It is gitignored and **read-only** for processing: never edit files there, always write processed copies elsewhere.
> - `private/media-src/<folder>/` holds raw media extracted from the project repos (local only, gitignored).
> - Processed **images** go to `src/assets/me/` and `src/assets/projects/<slug>/`. Astro converts them to AVIF/WebP at build time, so they are kept as high-quality PNG/JPG (long edge ≤ 2000 px).
> - Processed **videos** (and their poster stills) go to `public/media/<slug>/`. Astro does not touch these, so they are already web-sized.
> - The social preview lives in `public/og/`.
>
> **Publishing rules for media** (from docs/DECISIONS.md): no people's names anywhere (file names inside screen recordings included), no links to private or teammate-owned repos, nothing from the BioRob research beyond CV wording, no report PDFs, no course photos or datasets.

Last full pass: 2026-10-20 (updated 2026-10-23: fly-navigation page media, role pages, drawn placeholders, print-card social cards).

---

## 0. Quick reference for the content files

What to put in each project's frontmatter (`src/content.config.ts`). `focus` is the `object-position` that makes the 16:9 or 3:2 loop line up with the 4:3 tile poster.

| Slug | `poster` | `focus` | `video` (`mp4` / `webm` / `poster`) | `figures` | `extraVideos` |
|---|---|---|---|---|---|
| `quadruped-cpg-rl` | `poster.png` | `50% 50%` | `/media/quadruped-cpg-rl/loop.*`, `loop-poster.jpg` | `fig-gait-phases.svg`, `fig-obs-space-reward-curves.png`, `fig-velocity-tracking.png`, `fig-foot-trajectory-cartesian-pd.png` | `velocity.*` (1.3 m/s run) |
| `polymander` | `poster.jpg` | `10% 50%` | `/media/polymander/loop.*`, `loop-poster.jpg` | `fig-metrics-vs-feedback-gain.png`, `fig-disruption-4conditions.png`, `fig-swim2walk-forces.png` | `walk.*`, `swim2walk.*`, `walk2swim.*` (page only, click to play) |
| `rocket-mpc` | `poster.png` (5:4) | `50% 100%` | none (`mediaNeeded`: landing screen recording) | `fig-nmpc-closed-loop-landing.png`, `fig-tube-mpc-mrpi-terminal-sets.png`, `fig-tube-mpc-extreme-disturbance.png`, `fig-offset-free-disturbance-estimate.png` | none |
| `uno-sim2real` | `poster.jpg` (the animation's last frame) | `50% 50%` | `/media/uno-sim2real/loop.*`, `loop-poster.jpg` | `fig-zones.jpg`, `fig-pipeline.svg`, `fig-f1.png`, `fig-failures.jpg`, `fig-gradcam.jpg` (all but the SVG with `photo: true`) | `synthesis.*` (full width, plays in view) |
| `thymio-ekf` | `poster.jpg` | `50% 50%` | `/media/thymio-ekf/loop.*`, `loop-poster.jpg` | `fig-visibility-graph-planned-path.png` (team work) | `kidnapping.*`, `camera-occlusion.*` |
| `glider-codesign` | `poster.png` (the animation's last frame) | `50% 50%` | `/media/glider-codesign/loop.*`, `loop-poster.jpg` | `fig-convergence.svg`, `fig-optimized-airfoils.png`, `fig-training-curve-neuralfoil.png`, `fig-rl-vs-ocp.png`, `fig-success-heatmap.png`, `fig-algorithm-comparison.png`, `poster-session.jpg` (photo) | none |
| `fly-navigation` | `poster.jpg` (the loop's first frame) | `50% 50%` | `/media/fly-navigation/loop.*`, `loop-poster.jpg` | none | none |
| `ai-team` (role) | `../../assets/me/guide-dog.jpg` | `50% 50%` | none | none | none (`soon`: walking video, Isaac Lab training clip, build photos) |
| `biorob` (role) | none (`mediaNeeded`: Lab photo, `sketch: arm`) | | none | none | none |
| `mediacom` (role) | `poster.jpg` (the finished Odermatt trophy, 4:3; previews and social card) + `hero: 03-prototype-front.jpg` (top of the page, ECAL studio shot) | `50% 50%` | none | none (the photos are in `timeline`: 14 photos, `01-…` to `15-…`) | none |

The glider and Uno posters are the last frames of real inference renders (§1.3).

---

## 1. Inventory of produced files

Sizes are on-disk bytes. "src" paths are relative to the repo root.

### 1.1 Identity (`src/assets/me/`)

| File | Size | Source | Processing | Used in |
|---|---|---|---|---|
| `portrait.jpg` | 864×1080 (4:5), 175 KB | `Images/pic.JPG` (1616×1080, camera export) | The pixels are already upright, but the file carries a wrong EXIF Orientation tag (8 = "rotate 90°"), which is why it looks sideways in viewers. Loaded the raw pixels, **dropped all EXIF** (kept the sRGB ICC profile), cropped a 4:5 box `(303, 0)–(1167, 1080)` centred on the face, saved JPEG q92 4:4:4. | **Not used** (not imported, so not published): the hero uses the cut-out. Kept as the source of the cut-out. |
| `portrait-cutout.png` | 864×861, RGBA, 716 KB | same | Same 4:5 crop. Mask from Apple Vision (`VNGenerateForegroundInstanceMaskRequest`, script §2.2), refined with closed-form matting (`pymatting`): wide unknown band where the wall behind is bright, narrow band against the dark door frame, face/neck protected, wall pockets between curls removed, then foreground colour estimation to remove beige spill. Trimmed to the alpha bounding box (top only, since the shoulders reach the sides and bottom). Fully transparent pixels zeroed. Checked on orange, ink and paper. | Hero cut-out that breaks out of the arch |
| `guide-dog.jpg` | 584×584, 120 KB | `Images/dog.png` (584×687 screenshot) | Square crop `(0, 103)–(584, 687)`, which removes the people in the background; JPEG q92. **Low resolution**: see §3. | AI Team page hero + its social card; the Experience row's hover preview; "Now · EPFL AI Team" card fallback |
| `guide-dog-cutout.png` | 532×550, RGBA, 298 KB | same | Apple Vision mask, plus two targeted fixes: the navy backpack and the light wall seen through the robot's frame (colour tests in fixed boxes), and the concrete floor between the stand legs (colour distance to the sampled floor colour). Light 0.6 px feather, trimmed. The result is clean at this size; it is soft because the source is a 584 px screenshot. | "Now · EPFL AI Team" accent card (cut-out on the flat orange) |

### 1.2 Projects: images (`src/assets/projects/<slug>/`)

| File | Size | Source (`private/media-src/…`) | Processing | Used as |
|---|---|---|---|---|
| `quadruped-cpg-rl/poster.png` | 566×424 | `legged-robot-cpg-drl/RL_SLOPE.gif`, frame 35 | Window-title bar and black rows cropped (`crop=400:212:0:8`), 4:3 crop `(58,0)–(341,212)` around the robot on the yellow ramp, **2× Lanczos upscale** (source is 400 px wide) | Tile poster + page hero still |
| `quadruped-cpg-rl/fig-gait-phases.svg` | 960×352 viewBox, 10 KB | redrawn from `gait_phase_diagram.png` | Generated by `gait_svg.py`: top view with each leg's phase offset, plus a one-cycle timeline with mustard `#E2A814` swing bars; ink `#151412` on transparent. Swing length uses duty factor 0.67 (the report's low-speed trot) for every gait and is labelled illustrative. Phase offsets: trot LF 0 / RF .5 / LH .5 / RH 0; walk 0 / .5 / .75 / .25; pace 0 / .5 / 0 / .5; bound .5 / .5 / 0 / 0. | Figure (approach section) |
| `quadruped-cpg-rl/fig-obs-space-reward-curves.png` | 894×500 | `obs_space_reward_curves.png` | white margins trimmed (16 px kept) | Figure: CPG states in the observation ≈ 2× reward |
| `quadruped-cpg-rl/fig-velocity-tracking.png` | 1000×450 | `velocity_tracking_0.5_1.0_1.5.png` | trimmed | Figure: speed tracking at 0.5 / 1.0 / 1.5 m/s |
| `quadruped-cpg-rl/fig-foot-trajectory-cartesian-pd.png` | 1200×500 | `foot_trajectory_cartesian_pd.png` | trimmed | Figure: foot tracking with vs without Cartesian PD |
| `polymander/poster.jpg` | 960×720 | `cmc-polymander-salamander/p1_swim_with_stretch_feedback.mp4` @ 15.84 s | The **same frame the loop starts on**, 4:3 crop `(30,0)–(990,720)` with the robot centred; JPEG q92 | Tile poster + page hero still |
| `polymander/fig-metrics-vs-feedback-gain.png` | 1198×800 | `p1_metrics_vs_feedback_gain.png` | trimmed | Figure: speed / CoT vs stretch-feedback gain |
| `polymander/fig-disruption-4conditions.png` | 1320×474 | `p1_disruption_4conditions.png` | trimmed | Figure: robustness under 20% disruption |
| `polymander/fig-swim2walk-forces.png` | 1184×730 | `p2_swim2walk_forces.png` | trimmed | Figure: body forces across the swim → walk drive range |
| `rocket-mpc/poster.png` | 1044×836 (5:4) | `mpc-rocket/rocket-3d-trajectory.png` | Crop `(0,292)–(1044,1128)`: from the corner of the descent path down to the rocket's exhaust. Use `focus: 50% 100%` so a 4:3 crop keeps the rocket. | Tile poster + page hero still |
| `rocket-mpc/fig-nmpc-closed-loop-landing.png` | 1794×382 | `nmpc-closed-loop-landing.png` (5×4 grid, several empty panels) | Re-composed to the two informative rows: positions x / y / z with the roll angle γ (30° → 0) moved into the empty 4th slot, then the four inputs with the time axis; column titles kept (`figures.py → nmpc_rows`) | Figure: NMPC recovers from a 30° roll and lands |
| `rocket-mpc/fig-tube-mpc-mrpi-terminal-sets.png` | 2000×848 | `tube-mpc-mrpi-terminal-sets.png` (2100 px) | trimmed, resized to 2000 px wide | Figure: minimal robust invariant set + terminal set |
| `rocket-mpc/fig-tube-mpc-extreme-disturbance.png` | 1489×435 | `tube-mpc-extreme-disturbance.png` | trimmed | Figure: tube MPC under worst-case disturbance |
| `rocket-mpc/fig-offset-free-disturbance-estimate.png` | 1279×703 | `offset-free-disturbance-estimate.png` | trimmed (large white margins) | Figure: disturbance estimate converges |
| `uno-sim2real/poster.jpg` | 1200×900 | the hero animation's final state (`scripts/figures/reading.py` in the ImageProject repo, §1.3) | JPEG q90 | Tile still, page poster, prev/next thumbnail, social card |
| `uno-sim2real/fig-zones.jpg` | 1800×1347 | `scripts/figures/zones.py` (repo): test photo L1000797 with the five zones (overlap corners tinted red) and the five padded 336 px crops the network sees | JPEG q90 of the PNG | Figure 01 (photo) |
| `uno-sim2real/fig-pipeline.svg` | 1400×500 viewBox, 9 KB | `uno-cards/pipeline-diagram.svg` | Same layout as the original, restyled: paper background, ink boxes with hard offset shadows, mono stage labels, crimson output box. Text updated 2026-10-24 to the submitted pipeline (two-card pairs at 336 px, focal loss, head-first fine-tuning). | Figure 02 |
| `uno-sim2real/fig-f1.png` | 1800×800 | `scripts/figures/f1_chart.py` (repo): per-class F1 of the submitted weights on the 81 held-out real crops, sorted, mean line 0.737, F1 = 0 classes (blue 2, blue 6, red 7) in red | as rendered (paper background, so `photo: true`: no multiply) | Figure 03 |
| `uno-sim2real/fig-failures.jpg` | 1620×642 | `scripts/figures/failures.py` (repo): two fanned hands from test photos (L1000885 P1, L1001000 P4) with the cards read and missed (checked by eye) | JPEG q90 | Figure 04 (photo) |
| `uno-sim2real/fig-gradcam.jpg` | 1500×1216 | `scripts/figures/gradcam_figure.py` (repo): three held-out crops (L1000853 P2, L1000907 P4, L1000784 P2) and their layer4 Grad-CAM (magma) | JPEG q90 | Figure 05 (photo) |
| `thymio-ekf/poster.jpg` | 640×480 | `autonomous-thymio/thymio-arena-setup.jpg` | Copied byte-for-byte (already 4:3, no EXIF). Real photo of the arena and robot. | Tile poster + page hero still |
| `thymio-ekf/fig-visibility-graph-planned-path.png` | 584×478 | `visibility-graph-planned-path.png` | trimmed | Figure (planning is **team work**: credit it in the caption) |
| `mediacom/01-first-prototypes.jpg` … `15-odermatt-ceremony.jpg` (14 files) | ≤ 2000 px long edge, 155–650 KB | `Images/Wafer Trophy/` (Alexandros, 2026-10-24): iPhone photos (HEIC converted with `sips`), ECAL studio shots (`Trophy`, `Trophy 2`, `Trophy full project`), EPFL photos (`On the journal Dimension number 18`, `Talk on the trophy`, `Marco Odermatt`) | Every file looked at. Oriented from the EXIF tag (two files were stored sideways), **all EXIF dropped (several carried GPS)**, ICC kept where present, long edge ≤ 2000 px, JPEG q90 4:4:4. Tall phone shots cropped to 3:4 (`08` top 10%, `10` top 22%). `06` was replaced on 2026-10-24 by `encasing.heic` (landscape, no crop). Names and faces kept as they are (DECISIONS 2026-10-24). | Award page "Development cycle" timeline (`timeline` in mediacom.md), in Alexandros's order: prototypes `01–05`, tests `06`, production `08–12`, print and stage `13–14`, award `15` (the tests stage also holds the protection-test clip, §1.3) |
| `glider-codesign/poster.png` | 960×540, 24 KB | the inference animation's last frame (`frames/f_0140.png`, see §1.3) | as rendered | Tile still, page poster, prev/next thumbnail, social card |
| `glider-codesign/fig-convergence.svg` | 960×380 viewBox, 4 KB | report Table 3, "Stage 3 reached" (PPO updates to the final curriculum stage per frozen wing, mean ± sd, 5 seeds: the column the report's speedups are computed from) | Redrawn as horizontal bars in site ink, CEM winner in sky `#3A9AD9`, Geist Mono labels (a one-off script in the session scratchpad; the numbers are in the SVG's `<desc>`) | Figure 01 |
| `glider-codesign/fig-optimized-airfoils.png` | 1166×426 | report Fig. 15 (embedded image, `pdfimages`) | Top panel only (the outlines; the CST bar panels are cut), trimmed | Figure 02 |
| `glider-codesign/fig-training-curve-neuralfoil.png` | 1200×476 | report Fig. 4 | trimmed | Figure 03 |
| `glider-codesign/fig-rl-vs-ocp.png` | 603×312 | report Fig. 6 | trimmed | Figure 04 |
| `glider-codesign/fig-success-heatmap.png` | 1282×734 | report Fig. 7 | trimmed | Figure 05 |
| `glider-codesign/fig-algorithm-comparison.png` | 1779×872 | report Fig. 8 | trimmed | Figure 06 |
| `glider-codesign/poster-session.jpg` | 1600×900 | `Images/Glider/Poster presentation.jpeg` (no EXIF) | re-saved JPEG q90; shown as a photo (`photo: true`, no multiply blend) | Figure 07 |
| `mediacom/poster.jpg` | 1500×1125 | `12-odermatt-final.jpg` | 4:3 crop centred on the trophy | Award page hero, social card, Experience hover preview (`image: 'award'`) |

### 1.3 Videos (`public/media/`)

All clips: H.264 High `yuv420p` + `+faststart` (`.mp4`) and VP9 two-pass constant quality (`.webm`), **no audio**, plus a `-poster.jpg` that is the clip's first frame with the same crop, so the poster → video switch has no jump. Frame rate is 24 fps, or the source rate when the source is slower (15 fps clips stay at 15 so frames are not duplicated unevenly).

| File(s) | Size (mp4 / webm) | Dimensions · length | Source (`private/media-src/…`) | Processing | Used as |
|---|---|---|---|---|---|
| `quadruped-cpg-rl/loop.*` + `loop-poster.jpg` | 113 KB / 75 KB | 400×212 · 5.0 s · 15 fps | `legged-robot-cpg-drl/RL_SLOPE.gif` (the GIF is the original; the repo MP4s were made from it) | `crop=400:212:0:8` (title bar + black rows), `hqdn3d` light denoise to remove GIF dithering, CRF 22 / VP9 32. The GIF already loops. | **Tile loop + page hero** (slope climb) |
| `quadruped-cpg-rl/velocity.*` + `velocity-poster.jpg` | 105 KB / 87 KB | 400×212 · 5.0 s · 15 fps | `RL_VEL_1.3ms.gif` | same recipe | Extra page video (1.3 m/s run) |
| `polymander/loop.*` + `loop-poster.jpg` | 403 KB / 391 KB | 960×540 · 7.33 s · 24 fps | `cmc-polymander-salamander/p1_swim_with_stretch_feedback.mp4` (1280×720, 31.25 fps) | Trim 15.84 s → +7.328 s: the most seamless window found by `find_loop.py` (mean abs. frame difference 0.66 / 255 between first and last frame). Lanczos to 960 px, CRF 26 / VP9 47 (re-encoded in the QA pass: at VP9 41 the WebM was 34% larger than the MP4, and browsers take the WebM first). | **Tile loop + page hero** (swimming with stretch feedback) |
| `polymander/walk.*` + `walk-poster.jpg` | 376 KB / 312 KB | 768×432 · 7.75 s · 24 fps | `p2_best_walk.mp4` | Trim 6.72 s → +7.77 s (best loop window), crop `768:432:176:144` (1.67× zoom on the robot), CRF 26 / VP9 42 (QA pass; was 36, larger than the MP4) | Extra page video (walking) |
| `polymander/swim2walk.*` + poster | 368 KB / 316 KB | 768×432 · 12 s · 24 fps | `p2_swim2walk.mp4` | Trim 20 → 32 s (the transition), crop `768:432:236:144`, CRF 23 / VP9 33 | Page only, click to play |
| `polymander/walk2swim.*` + poster | 373 KB / 317 KB | 768×432 · 12 s · 24 fps | `p2_walk2swim.mp4` | Trim 2 → 14 s, same crop/quality | Page only, click to play |
| `thymio-ekf/loop.*` + `loop-poster.jpg` | 187 KB / 104 KB | 416×288 (≈4:3) · 8 s · 15 fps | `autonomous-thymio/thymio-kidnapping-crop.mp4` (760×244 screen recording) | Right-hand "camera + planned path" panel only, without its window bar: `crop=208:144:522:54`, **2× Lanczos** (panel is 208 px wide), trim 6.5 → 14.5 s: the robot drives, is picked up and moved, and the path is re-planned. | **Tile loop** |
| `thymio-ekf/kidnapping.*` + poster | 377 KB / 265 KB | 736×180 · 24 s · 15 fps | same | Full 3-panel recording, `crop=736:180:14:40`. The crop removes the code editor's file list, which showed personal file names. | Extra page video (page hero row) |
| `thymio-ekf/camera-occlusion.*` + poster | 241 KB / 167 KB | 736×180 · 20 s · 15 fps | `thymio-camera-occlusion-crop.mp4` | same crop | Extra page video |
| `uno-sim2real/loop.*` + `loop-poster.jpg` | 825 KB / 640 KB | 1200×900 · 10.6 s · 24 fps | the submitted model run on test photo L1000947 (2026-10-24): `scripts/figures/reading.py` in the ImageProject repo | The five zones draw in, each zone's predicted cards appear as chips, the missed red 8 is a red "MISSED" chip (cards checked by eye: the test labels are hidden), the turn token is marked, a summary band ("5 OF 6 CARDS READ") ends it, then everything fades back to the plain photo for the loop. 4:2:0, BT.709 tags, H.264 CRF 22 / VP9 CRF 38, no audio. The README GIF is the same render at 720 px | Uno tile loop + page hero |
| `uno-sim2real/synthesis.*` + `synthesis-poster.jpg` | 893 KB / 710 KB | 1280×720 · 13.4 s · 24 fps | `scripts/figures/synthesis.py` (repo): training image 107 of `generate_synthetic.py --seed 0` built step by step (table patch, card cut-out, colour jitter, rotation and tilt, blur, paste, second card, brightness, letterbox, noise), then a grid of 12 samples and a "10,000 OF THESE" chip | 4:2:0, BT.709 tags, H.264 CRF 23 / VP9 CRF 35 two-pass, no audio | Extra page video, full width, plays when it scrolls into view (`autoplay`, `wide`) |
| `fly-navigation/loop.*` + `loop-poster.jpg` | 133 KB / 95 KB | 512×384 · 5.5 s · 24 fps | `cobar-fly-navigation-miniproject/fly_navigation_level2_backcam.mp4` | Trim 2.72 → 8.24 s (best loop window, before the camera tilts at the end), 4:3 crop `crop=512:384:0:48`, CRF 24 / VP9 34. Moved from `public/media/more/` on 2026-10-23 (the separate 512×384 still `more/fly-navigation.jpg` was deleted). | Fly-navigation page hero. `loop-poster.jpg` is also copied to `src/assets/projects/fly-navigation/poster.jpg` (11 KB): the page poster, More-projects hover preview, prev/next thumbnail and social card |
| `glider-codesign/loop.*` + `loop-poster.jpg` | 51 KB / 51 KB | 960×540 · 5.9 s · 24 fps | a real inference run (2026-10-24) of the team's trained final co-design policy flying its learned wing, in the team's own simulator (code cloned to a scratch folder, deleted afterwards): one deterministic CPU episode from the evaluation start | States logged every 0.01 s and drawn with matplotlib in site colours (paper, ink, sky trail, Geist Mono readout): every 2nd step, no interpolation, ×0.48 slow motion, last state held 0.8 s; glider drawn larger than scale. Framed so the perch (x ≈ 771 px), the readout and the scale bar sit inside the centred 4:3 crop (120–840 px) that tiles, prev/next and the social card use. H.264 CRF 26 / VP9 CRF 36, no audio. An independent re-run gave identical states. A GIF version was made for Alexandros but is not published (no GIFs on the site) | Glider tile loop + page hero |
| `mediacom/protection-test.*` + `protection-test-poster.jpg` | 886 KB / 705 KB | 720×900 (4:5) · 11.8 s · 24 fps | `Images/Wafer Trophy/Protection test.MP4` (1080×1920 phone video, 30 fps, with sound) | Whole clip, `crop=1080:1350:0:285` (4:5 around the wafer), Lanczos to 720 px, **audio dropped**, CRF 29 / VP9 40 (real footage: no `-tune animation`) | Award page timeline, "The tests" (plays when in view, pause button) |

### 1.4 Social preview (`public/og/`)

| File | Size | Processing | Used as |
|---|---|---|---|
| `default.png` | 1200×630, 95 KB | `scripts/og/make_og_images.py default`: paper background, "ALEXANDROS / DELLIOS" in Anton (accent `#E5501D`) sized to fill the width, "Robotics M.Sc. · EPFL" in Geist 500 (ink), the site URL and four focus areas in Geist Mono (`#5E5850`: Robot learning, Manipulation, Legged locomotion, Model predictive control), and a 2×2 trot "gait metronome" mark. Rendered at 2× and downsampled. | Default `og:image` / `twitter:image` |
| `<slug>.png` (10: 7 projects + 3 roles) | 1200×630, 85–220 KB | `scripts/og/make_og_images.py` (kept in the repo): byline + URL + gait mark, the title in Instrument Serif, metric chip and year · team in Geist Mono, the poster cropped 4:3 with the page's `focus` as a print card (square corners, 2px ink border, hard ink shadow; pages without a poster show their `sketch` drawing on paper-2 instead, its accent details recoloured to the page accent). Cards over 250 KB are re-saved with 256 colours, and the `shortWord` in Anton in the page accent. Re-run `python3 scripts/og/make_og_images.py [slug]` after changing those fields. Needs Pillow, fontTools + brotli, PyYAML (and macOS Quick Look for the sketches). | `og:image` of `/work/<slug>/` and `/experience/<slug>/` (ProjectLayout uses it automatically when the file exists) |

### 1.5 Icons (`public/`)

| File | Processing |
|---|---|
| `favicon.svg` | "AD" in Anton glyph outlines, ink on orange, rounded square |
| `favicon.ico` (16 + 32 px) · `apple-touch-icon.png` (180 px, square corners) | `node scripts/media/make_icons.mjs` (sharp) from `favicon.svg` |

### 1.6 Placeholder sketches (`src/assets/sketches/`)

| File | Drawing | Used as |
|---|---|---|
| `photo.svg` | camera | default drawing for photo placeholders |
| `video.svg` | screen with play button and timeline | labels with "video", "clip", "recording" or "footage" |
| `plot.svg` | axes with two curves | labels with "plot", "curve", "chart" or "graph" |
| `arm.svg` | robot arm picking up a cube | BioRob page hero; BioRob Experience hover card |
| `quadruped.svg` | quadruped with a guide-dog handle | available (`sketch: quadruped`) |
| `award.svg` | medallion on a column and plinth | available (`sketch: award`); the award page now has real photos |

160×120 viewBox line drawings, 2.5px ink strokes, accent details on elements with class `acc` (fill) / `acc-stroke` (stroke). Drawn by hand for the site (2026-10-23). MediaPlaceholder inlines them (`?raw`), so the accent parts follow the page accent; the Experience hover cards and the social cards use the files as images (orange accents).

### 1.7 Deliberately not used
- Everything in `private/media-src/biorob-egocentric-manipulation/` (unpublished research).
- `uno-cards/synthetic-augmentation-grid.jpg` (an illustration, not his data). Course photos are fine for the Uno page (DECISIONS 2026-10-24).
- The raw GIFs (converted to MP4/WebM instead; never ship GIFs).
- Weaker plots (joint angles, slope velocity, NMPC open loop, PID grid, random-disturbance tube, CPG vs animal, heatmaps), the CoBAR weekly-exercise media, and anything from the Faster R-CNN fork.

---

## 2. Recipes

Tools on this Mac: `ffmpeg`/`ffprobe` (Homebrew), Python 3 with Pillow, NumPy, OpenCV, `swift` (Vision framework), `qlmanage` (Quick Look). Extra Python packages (`pymatting`, `fonttools`, `brotli`) were installed in a throwaway venv, not in the project. Run Python on files from repos or downloads with `python3 -I`.

### 2.1 Web video (loops and page clips)

```bash
# encode.sh IN OUT_BASE SS DUR "FILTERS" FPS [CRF_H264=26] [CRF_VP9=36]
# writes OUT_BASE.mp4, OUT_BASE.webm and OUT_BASE-poster.jpg
CHAIN="$VF,fps=$FPS,format=yuv420p"
ffmpeg -ss "$SS" -t "$DUR" -i "$IN" -vf "$CHAIN" -an \
  -c:v libx264 -preset veryslow -crf "$CRF" -profile:v high -tune animation -pix_fmt yuv420p \
  -g $((FPS*4)) -movflags +faststart "$OUT.mp4"
ffmpeg -ss "$SS" -t "$DUR" -i "$IN" -vf "$CHAIN" -an -c:v libvpx-vp9 -crf "$CRF9" -b:v 0 \
  -row-mt 1 -deadline good -cpu-used 1 -pass 1 -passlogfile "$OUT.vp9log" -f webm /dev/null
ffmpeg -ss "$SS" -t "$DUR" -i "$IN" -vf "$CHAIN" -an -c:v libvpx-vp9 -crf "$CRF9" -b:v 0 \
  -row-mt 1 -deadline good -cpu-used 1 -pass 2 -passlogfile "$OUT.vp9log" "$OUT.webm"
ffmpeg -ss "$SS" -i "$IN" -vf "$VF" -frames:v 1 -q:v 2 "$OUT-poster.jpg"   # poster = first frame
```

Examples (exact calls used):

```bash
encode.sh RL_SLOPE.gif public/media/quadruped-cpg-rl/loop 0 5 "crop=400:212:0:8,hqdn3d=1.5:1.5:3:3" 15 22 32
encode.sh p1_swim_with_stretch_feedback.mp4 public/media/polymander/loop 15.84 7.328 "scale=960:540:flags=lanczos" 24 26 41
encode.sh p2_best_walk.mp4 public/media/polymander/walk 6.72 7.77 "crop=768:432:176:144" 24 26 36
encode.sh p2_swim2walk.mp4 public/media/polymander/swim2walk 20 12 "crop=768:432:236:144" 24 23 33
encode.sh thymio-kidnapping-crop.mp4 public/media/thymio-ekf/loop 6.5 8 "crop=208:144:522:54,scale=416:288:flags=lanczos" 15 22 32
encode.sh thymio-kidnapping-crop.mp4 public/media/thymio-ekf/kidnapping 0 24 "crop=736:180:14:40" 15 24 34
encode.sh fly_navigation_level2_backcam.mp4 public/media/fly-navigation/loop 2.72 5.52 "crop=512:384:0:48" 24 24 34
```

Budgets: loops ≤ 8 s and ≤ ~600 KB per file; page clips ≤ ~1 MB. If a file is over budget, raise the CRF by 2 (H.264) or 3 (VP9) and re-run. Use `-tune animation` for simulator renders; drop it for real camera footage.

**Finding a seamless loop.** `find_loop.py VIDEO MIN_S MAX_S [crop] [from_s] [to_s]` decodes 160×90 grayscale frames and lists the (start, end) pairs whose first and last frames differ least. A mean absolute difference under ~1 (of 255) loops invisibly; 4–6 is a visible but acceptable jump when the camera tracks the robot.

### 2.2 Background removal (cut-outs)

1. **Mask with Apple Vision** (macOS 14+). The image must not carry an EXIF rotation (save a clean RGB PNG first):

```swift
// fgmask.swift  —  swift fgmask.swift in.png mask.png
import Foundation
import Vision
import CoreImage
import ImageIO
import UniformTypeIdentifiers
let a = CommandLine.arguments
let src = CGImageSourceCreateWithURL(URL(fileURLWithPath: a[1]) as CFURL, nil)!
let cg = CGImageSourceCreateImageAtIndex(src, 0, nil)!
let handler = VNImageRequestHandler(cgImage: cg, orientation: .up, options: [:])
let req = VNGenerateForegroundInstanceMaskRequest()
try handler.perform([req])
let obs = req.results!.first!
let buf = try obs.generateScaledMaskForImage(forInstances: obs.allInstances, from: handler)
let ci = CIImage(cvPixelBuffer: buf)
let out = CIContext().createCGImage(ci, from: ci.extent, format: .L8, colorSpace: CGColorSpaceCreateDeviceGray())!
let dest = CGImageDestinationCreateWithURL(URL(fileURLWithPath: a[2]) as CFURL, UTType.png.identifier as CFString, 1, nil)!
CGImageDestinationAddImage(dest, out, nil); CGImageDestinationFinalize(dest)
```

2. **Refine the edge (hair, fine wires).** Build a trimap from the mask (eroded core = foreground, dilated outside = background, band between = unknown), relabel unknown pixels whose colour matches the local background as background, then run `pymatting.estimate_alpha_cf` (closed-form matting) and `pymatting.estimate_foreground_ml` (removes background colour spill). Make the band wide (~40 px) where the background is clearly different from the subject, and narrow (~8 px) where it is similar (dark hair against a dark door). Protect skin with a hand-placed ellipse so it is never mistaken for a beige wall.
3. **Check** the cut-out composited on orange `#E5501D`, ink `#151412` and paper `#F4EFE6`, zoomed on hair and thin parts. Zero the RGB of fully transparent pixels more than 4 px from the subject (smaller PNG), and trim to the alpha bounding box.
4. Fallback if Vision struggles: `rembg` in a venv with the `birefnet-portrait` (people) or `isnet-general-use` (objects) model, then steps 2–3.

### 2.3 Figures and stills
- **Plots:** trim white margins and keep 16 px of padding (Pillow: bounding box of pixels darker than 245). Keep the native resolution and resize only when the long edge is over 2000 px. Save PNG, and let Astro make AVIF/WebP.
- **Tile posters:** crop to 4:3 around the subject. For very small sources (< 500 px wide), upscale 2× with Lanczos so the browser does not upscale with a blurrier filter. When the tile also has a loop, take the poster from the loop's first frame so the switch is seamless.
- **Photos:** always check EXIF orientation by looking at the raw pixels (`Image.open()` without `exif_transpose`) **and** at the tag. Save without EXIF, keep the ICC profile.

### 2.4 SVG to PNG (Quick Look)
`qlmanage -t -s <px> -o OUTDIR file.svg` draws the SVG inside a **768×768 CSS-px** WebKit viewport and scales that viewport to `<px>`; anything wider than 768 px is cut off, and transparency is composited on white. `python3 scripts/media/render_svg.py in.svg out.png WIDTH [bg_hex]` (kept in the repo) handles this:
1. Embeds the site fonts (Fontsource `woff2` files from `node_modules`) as base64 `@font-face` rules in a temporary copy.
2. Paints the requested background inside the SVG.
3. Forces the root size to fit 768 px.
4. Renders at 2× the target and crops the drawn area.
5. Downsamples with Lanczos.

The published SVGs keep plain font names (`'Geist'`, `'Geist Mono'`), so they use the page's fonts when inlined and system fallbacks inside an `<img>`.

### 2.5 Fonts in Pillow
Pillow reads Fontsource `.woff` files directly (Anton, Instrument Serif). Geist and Geist Mono ship only as variable `.woff2`, so convert them first: `TTFont(path).flavor = None; save(out.ttf)` (fontTools + brotli). Then `ImageFont.truetype(...).set_variation_by_axes([500])` selects the weight.

---

## 3. Needed from Alexandros

Until each item arrives, the site shows a visible "Coming soon" placeholder with the label in the "Placeholder label" column. Visitor labels carry no specs: the orientation, size and length live in this table only.

| # | What | Orientation · minimum size | Format and length | Where it appears | Placeholder label |
|---|---|---|---|---|---|
| 1 | **BioRob lab / robot setup photo**, cleared by the lab for publication. No screens showing results, no unpublished hardware details, no faces without consent. | Landscape 3:2 or 4:3, ≥ 1600 px wide | JPG/HEIC, original from the phone/camera | BioRob page hero (`/experience/biorob/`); "Now · Research" dark card (home); Experience row hover preview | `COMING SOON · Lab photo` (drawn: robot arm) |
| 2 | **Guide-dog robot, high-res photo.** The current one is a 584 px screenshot. Whole robot including the feet, ideally against a plain wall or floor, and the team's OK. | Portrait 4:5 or square, ≥ 2000 px long edge | Original camera/phone file (not a screenshot) | AI Team page hero; "Now · EPFL AI Team" card (cut-out on orange) | (replaces `guide-dog*.{jpg,png}`); more photos: `COMING SOON · Build photos` card on the AI Team page |
| 3 | **Guide-dog robot walking video.** Steady camera, robot fully in frame, a few seconds of clean walking. | Landscape 16:9, ≥ 1920×1080 | MP4/MOV, 5–15 s; sound not needed | AI Team page gallery (and the Now card) | `COMING SOON · Walking video` (AI Team page) |
| 4 | **Isaac Lab training clip**: many parallel robots on varied terrain. | Landscape 16:9, ≥ 1280×720 | Screen recording, 5–10 s | AI Team page gallery | `COMING SOON · Isaac Lab training clip` (AI Team page) |
| 5 | ~~**Mediacom Doctor Honoris Causa award**~~ **Received 2026-10-24** (14 photos + 1 clip, `Images/Wafer Trophy/`), see §1.2 and §1.3. | | | Award page timeline | none |
| 6 | ~~**Glider co-design plots**~~ **Received 2026-10-24** (the report, see §1.2): (a) convergence curve (success rate vs training steps, co-design vs the NACA 4412 baseline), (b) the learned airfoil vs NACA 4412. Ideally the **raw data** (CSV of curve points and airfoil coordinates), so both can be redrawn in site colours like the gait figure. | Landscape, ≥ 1600 px wide if PNG; SVG/PDF or CSV preferred | PNG/SVG/CSV | Glider project page; the real airfoil replaces the illustrative poster | `COMING SOON · Convergence plot`, `Learned airfoil vs NACA 4412 plot` (drawn cards in the gallery) |
| 7 | ~~**Glider evaluation clip**~~ **Made 2026-10-24** from an inference run of the team's trained policy (§1.3): | Landscape 16:9, ≥ 1280×720 | MP4, 5–10 s | Glider tile loop + page hero | `COMING SOON · Perching evaluation clip` (drawn card) |
| 8 | **Rocket landing screen recording** from the course visualiser: the NMPC landing from the 30° roll start (and optionally the tube-MPC run). | Landscape 16:9, ≥ 1920×1080 (≥ 1280×720 minimum) | Screen recording, 5–10 s, no cursor | Rocket tile loop + page hero | `COMING SOON · Rocket landing screen recording` (slim band in the gallery) |
| 9 | ~~**Uno prediction overlay**~~ **Made 2026-10-24** from the submitted model on a course test photo (course photos allowed, DECISIONS 2026-10-24), §1.3. | | | Uno tile loop + page hero | none |
| 10 | **Original high-res quadruped videos** (PyBullet recordings behind `RL_SLOPE.gif` / `RL_VEL_1.3ms.gif`). The current loops are 400 px wide and look soft on large or retina screens. | Landscape 16:9, ≥ 1280×720 | MP4, the full recordings | Quadruped tile loop + page hero, velocity extra | (replaces `quadruped-cpg-rl/loop.*`, `velocity.*`) |
| 11 | *Nice to have:* the portrait's **full-resolution export** (`pic.JPG` is a 1616×1080 export of a 24 MP camera file). | Original | JPG | Hero portrait (sharper on retina) | none |
| 12 | *Nice to have:* the original 640×480 Thymio demo videos and a phone video of the robot driving in the arena. | Landscape, ≥ 1280×720 for the phone video | MP4 | Thymio tile loop + page hero | none |

---

## 4. Processing new media dropped into `Images/`

1. **Never modify `Images/`.** Copy what you need into a scratch folder first, and **look at every file** before choosing (open it, or make a contact sheet: `ffmpeg -i in.mp4 -vf "fps=1,scale=320:-1,tile=4x4" -frames:v 1 sheet.png`).
2. **Check before publishing:**
   - no faces of people who have not agreed;
   - no names on screens (file browsers, terminals, window titles, slides);
   - no confidential lab content;
   - no course datasets.
   Crop or mask anything doubtful (as with the Thymio editor sidebar).
3. **Photos** → `src/assets/…`:
   - load the raw pixels, check orientation visually, and drop EXIF while keeping the ICC profile;
   - crop to the target ratio (4:3 tiles, 4:5 portrait), keep ≤ 2000 px on the long edge, and save JPEG q90–92 (photos) or PNG (renders/diagrams);
   - for cut-outs, follow §2.2.
4. **Videos** → `public/media/<slug>/`:
   - find the best window with `find_loop.py`, then run `encode.sh` (§2.1) with a crop that frames the subject;
   - width 960 px, or the source width if smaller;
   - check both files' sizes against the budget and look at a frame from each encode.
5. **Update this file** (inventory row + remove the item from §3), then the project's frontmatter (`poster`, `focus`, `video`, `figures`, `extraVideos`), and remove its `mediaNeeded` label.
6. Run `npm run build` once at the end. Astro regenerates AVIF/WebP for everything in `src/assets`.
