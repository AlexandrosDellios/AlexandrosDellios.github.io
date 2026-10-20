/**
 * Header behaviour (DESIGN §5.1):
 * - adds .is-scrolled to [data-site-header] after 10px of scroll (blur state);
 * - exposes setHeaderLine() for the 2px accent underline.
 */

const SCROLLED_AT = 10;

const header = (): HTMLElement | null => document.querySelector<HTMLElement>('[data-site-header]');

export function initHeader(): void {
  const el = header();
  if (!el) return;

  // Toggling a class to the value it already has is free, so no rAF throttle.
  const update = () => el.classList.toggle('is-scrolled', window.scrollY > SCROLLED_AT);
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/**
 * Control the header's 2px accent underline.
 *   setHeaderLine(true | false)  wipe in / out with a CSS transition (.is-lined)
 *   setHeaderLine(0.42)          scrubbed value 0..1, no transition (for ScrollTrigger onUpdate)
 *   setHeaderLine(null)          hand control back to CSS (removes the inline value)
 */
export function setHeaderLine(value: boolean | number | null): void {
  const el = header();
  if (!el) return;

  if (typeof value === 'number') {
    el.dataset.lineScrub = '';
    el.style.setProperty('--header-line', String(Math.min(1, Math.max(0, value))));
    return;
  }

  delete el.dataset.lineScrub;
  el.style.removeProperty('--header-line');
  if (value !== null) el.classList.toggle('is-lined', value);
}
