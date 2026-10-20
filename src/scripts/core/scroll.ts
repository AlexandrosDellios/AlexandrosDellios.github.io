/**
 * Scroll state shared by all core modules: the Lenis instance (desktop only),
 * programmatic scrolling with the header offset, scroll locking, and a small
 * velocity feed (used by the gait metronome).
 *
 * Lenis itself is created in smooth.ts (dynamically imported).
 */
import type Lenis from 'lenis';
import { env } from './env';

let lenis: Lenis | null = null;

/** The Lenis instance, or null (touch devices, reduced motion, before init). */
export const getLenis = (): Lenis | null => lenis;

/** Called by smooth.ts once Lenis exists. */
export function setLenis(instance: Lenis | null): void {
  lenis = instance;
}

/** Current sticky header height in px (reads the --header-h token). */
export function getHeaderHeight(): number {
  const header = document.querySelector<HTMLElement>('[data-site-header]');
  if (header) return header.offsetHeight;
  const token = getComputedStyle(document.documentElement).getPropertyValue('--header-h');
  return Number.parseFloat(token) || 0;
}

export interface ScrollToOptions {
  /** Extra offset in px (negative = stop earlier). The header height is always subtracted. */
  offset?: number;
  /** Jump without animation. */
  immediate?: boolean;
}

/**
 * Scroll to an element, selector, or y position, below the sticky header.
 * Uses Lenis when active, otherwise native scrolling (smooth unless reduced).
 */
export function scrollToTarget(target: Element | string | number, opts: ScrollToOptions = {}): void {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (el === null) return;

  // Resolve to an absolute y ourselves. (Passing an element to Lenis would also
  // apply the html scroll-padding-top, i.e. subtract the header twice.)
  const top =
    typeof el === 'number'
      ? el
      : el.getBoundingClientRect().top + window.scrollY - getHeaderHeight() + (opts.offset ?? 0);
  const y = Math.max(0, Math.round(top));

  if (lenis) {
    lenis.scrollTo(y, { immediate: opts.immediate });
    return;
  }

  window.scrollTo({ top: y, behavior: opts.immediate || env.reducedMotion ? 'auto' : 'smooth' });
}

/* ---- Scroll lock (mobile menu, dialogs) ------------------------------------ */
let lockCount = 0;

export function lockScroll(): void {
  lockCount += 1;
  if (lockCount > 1) return;
  document.documentElement.classList.add('is-scroll-locked');
  lenis?.stop();
}

export function unlockScroll(): void {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount > 0) return;
  document.documentElement.classList.remove('is-scroll-locked');
  lenis?.start();
}

/* ---- Velocity feed ----------------------------------------------------------- */
type VelocityListener = (velocity: number) => void;
const velocityListeners = new Set<VelocityListener>();

/**
 * Subscribe to scroll velocity (px per frame, signed). Fed by Lenis when it is
 * active, otherwise estimated from native scroll events. Returns an unsubscribe.
 */
export function onScrollVelocity(fn: VelocityListener): () => void {
  velocityListeners.add(fn);
  return () => velocityListeners.delete(fn);
}

export function emitVelocity(velocity: number): void {
  velocityListeners.forEach((fn) => fn(velocity));
}

/** Native fallback: estimate velocity from scroll deltas (used when no Lenis). */
export function startNativeVelocityFeed(): void {
  let lastY = window.scrollY;
  let lastT = performance.now();
  window.addEventListener(
    'scroll',
    () => {
      if (lenis) return; // Lenis feeds its own velocity
      const now = performance.now();
      const dt = Math.max(1, now - lastT);
      const v = ((window.scrollY - lastY) / dt) * 16.67; // px per 60 fps frame
      lastY = window.scrollY;
      lastT = now;
      emitVelocity(v);
    },
    { passive: true },
  );
}

/* ---- Focus not obscured (WCAG 2.4.11) ------------------------------------------ */
// The collapsing name strip (home) and title strip (project pages) stick under
// the header while they scrub away. Anything focused underneath would be hidden,
// so page scripts report how far down the strip currently reaches:
//   - html scroll-padding-top follows it (browsers honour scroll-padding when
//     they scroll a newly focused element into view);
//   - a focusin fallback scrolls up an element that is still covered, far
//     enough to clear the strip even at its full height (it re-expands as the
//     page scrolls back up).

let clearance = 0; // current bottom edge of the covering strip (viewport px), 0 = none
let clearanceMax = 0; // the same strip at its full height
let focusGuard = false;

/**
 * Visible bottom edge (viewport px) of a sticky strip that GSAP clips with
 * `clip-path: inset(top right BOTTOM left)` (getBoundingClientRect ignores the
 * clip). Returns 0 when the strip is not stuck under the header.
 */
export function stickyStripBottom(strip: HTMLElement): number {
  const rect = strip.getBoundingClientRect();
  if (rect.top > getHeaderHeight() + 1) return 0; // still in the flow, covers nothing
  const inset = /inset\(\s*[\d.]+%?\s+[\d.]+%?\s+([\d.]+)%/.exec(strip.style.clipPath)?.[1];
  const visible = 1 - (inset ? Number.parseFloat(inset) / 100 : 0);
  return visible > 0.001 ? rect.top + rect.height * visible : 0;
}

/**
 * Report what currently covers the top of the page below the header.
 * `bottom`: viewport y of its lower edge (0 = nothing). `max`: the same at full height.
 */
export function setFocusClearance(bottom: number, max = bottom): void {
  clearance = bottom > getHeaderHeight() + 1 ? Math.round(bottom) : 0;
  clearanceMax = Math.max(clearance, Math.round(max));
  document.documentElement.style.scrollPaddingTop = clearance ? `${clearance + 8}px` : '';
  if (!focusGuard) {
    focusGuard = true;
    document.addEventListener('focusin', onFocusIn);
  }
}

function onFocusIn(event: FocusEvent): void {
  const target = event.target;
  if (!(target instanceof HTMLElement) || target.closest('[data-site-header], [data-mobile-menu]')) return;
  // Let the browser's own scroll-into-view run first, then check.
  requestAnimationFrame(() => {
    if (!clearance || document.activeElement !== target) return;
    const r = target.getBoundingClientRect();
    if (r.bottom <= getHeaderHeight() || r.top >= clearance) return; // off-screen above, or clear
    scrollToTarget(window.scrollY + r.top - (clearanceMax + 12), { immediate: true });
  });
}
