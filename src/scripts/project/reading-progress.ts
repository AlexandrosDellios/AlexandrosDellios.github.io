/**
 * Reading progress fallback (DESIGN M15) for browsers without scroll-driven
 * animations. Where `animation-timeline: scroll()` is supported the hairline
 * is pure CSS (ReadingProgress.astro) and this does nothing.
 *
 * Writes --progress (0..1) on [data-reading-progress]; the bar reads it as
 * scaleX. Passive scroll listener, one rAF per frame at most. Lenis scrolls
 * the window, so native scroll events fire with smooth scrolling too.
 * Runs under reduced motion as well: it only follows the user's own scroll.
 */
export function initReadingProgress(): void {
  const el = document.querySelector<HTMLElement>('[data-reading-progress]');
  if (!el) return;
  if (typeof CSS !== 'undefined' && CSS.supports?.('animation-timeline: scroll()')) return;

  const root = document.documentElement;
  let queued = false;

  const update = () => {
    queued = false;
    const max = root.scrollHeight - window.innerHeight;
    const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    el.style.setProperty('--progress', progress.toFixed(4));
  };

  const request = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  };

  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', request, { passive: true });
  // Late layout changes (fonts, images) change the scrollable height.
  if ('ResizeObserver' in window) new ResizeObserver(request).observe(document.body);
  update();
}
