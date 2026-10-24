/**
 * Client entry for project and role pages (/work/<id>/, /experience/<id>/), imported once by
 * ProjectLayout.astro. The shared behaviour (header, videos, heading reveals,
 * smooth scroll…) is already booted by BaseLayout's core script; this only
 * adds what is specific to project pages.
 *
 * The view-transition name juggling (pagereveal / pageswap) is NOT here: it
 * must be registered before first render, so it is an inline <head> script in
 * ProjectLayout.astro.
 */
import { onReady } from '../core/motion';
import { initTileEntry } from '../home/tiles';
import { initReadingProgress } from './reading-progress';
import { initTitleStrip } from './title-strip';

initTitleStrip();
initReadingProgress();
// Development-cycle photos ([data-enter], ProcessTimeline.astro) fade in one
// after another as they scroll into view (same M5 entry as the home tiles).
onReady(initTileEntry);
