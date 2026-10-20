/**
 * Home page client entry (imported by src/pages/index.astro).
 *
 * The shared core (smooth scroll, header, videos, copy-email, heading reveals)
 * is booted by BaseLayout; this file only adds what is specific to the home:
 *
 *   cursor-preview.ts  M16 link tooltip + list-row thumbnails (no GSAP needed)
 *   hero.ts            M2 name-strip collapse + arch, M3 role rotator
 *   tiles.ts           M5 batched tile entry
 *   stickers.ts        M9 drag-to-spin (lazy Draggable/Inertia) + scroll drift
 *
 * Everything degrades to a static, fully readable page without JS, and
 * respects prefers-reduced-motion (each module checks ctx.reduced).
 */
import { onReady } from '../core/motion';
import { initCursorPreview } from './cursor-preview';
import { initHeroMotion } from './hero';
import { initStickers } from './stickers';
import { initTileEntry } from './tiles';

initCursorPreview();

onReady((ctx) => {
  initHeroMotion(ctx);
  initTileEntry(ctx);
  initStickers(ctx);
  // Layout may have shifted while fonts/images settled: recompute trigger positions.
  ctx.ScrollTrigger.refresh();
});
