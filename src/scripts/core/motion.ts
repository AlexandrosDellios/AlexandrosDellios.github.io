/**
 * Core client entry (imported once by BaseLayout) and the public API for page
 * scripts. Import helpers from here in home/project scripts:
 *
 *   import { onReady, getLenis, isReducedMotion, setHeaderLine } from '../scripts/core/motion';
 *   onReady(({ gsap, ScrollTrigger, SplitText, lenis, reduced }) => { … });
 *
 * Startup order
 *  1. Synchronous, tiny: header scroll state, mobile menu, copy-email, gait
 *     metronome, anchors, marquees, video manager. These need no library.
 *  2. Dynamic imports (separate chunks): gsap + ScrollTrigger always;
 *     SplitText + Lenis only when motion is allowed (Lenis only for fine
 *     pointers). Lenis is created before ScrollTrigger is used, driven by
 *     gsap.ticker, and calls ScrollTrigger.update on scroll.
 *  3. Heading reveals ([data-reveal="lines"]), then onReady callbacks.
 */
import { initAnchors } from './anchors';
import { initCopyEmail } from './copy-email';
import { domReady, env, wantsSmoothScroll } from './env';
import { initGait } from './gait';
import { initHeader } from './header';
import { initMarquees } from './marquee';
import { initMenu } from './menu';
import { startNativeVelocityFeed } from './scroll';
import { initVideos } from './video';

import type { gsap as GSAP } from 'gsap';
import type { ScrollTrigger as ST } from 'gsap/ScrollTrigger';
import type { SplitText as SplitTextType } from 'gsap/SplitText';
import type Lenis from 'lenis';

/* ---- Public re-exports ----------------------------------------------------- */
export { env, isReducedMotion, isSaveData, isFinePointer, canAutoplay } from './env';
export {
  getLenis,
  getHeaderHeight,
  scrollToTarget,
  lockScroll,
  unlockScroll,
  onScrollVelocity,
  setFocusClearance,
  stickyStripBottom,
} from './scroll';
export { setHeaderLine } from './header';
export { nudgeGait } from './gait';

export interface MotionContext {
  gsap: typeof GSAP;
  ScrollTrigger: typeof ST;
  /** null under reduced motion (don't split text then). */
  SplitText: typeof SplitTextType | null;
  /** null on touch devices and under reduced motion (native scroll). */
  lenis: Lenis | null;
  /** prefers-reduced-motion: reduce */
  reduced: boolean;
}

/* ---- Lazy motion stack ------------------------------------------------------- */
let motionPromise: Promise<MotionContext> | null = null;

/** Loads (once) and returns the shared GSAP / ScrollTrigger / Lenis setup. */
export function loadMotion(): Promise<MotionContext> {
  motionPromise ??= (async () => {
    const reduced = env.reducedMotion;
    const [{ gsap }, { ScrollTrigger }, splitMod] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
      reduced ? Promise.resolve(null) : import('gsap/SplitText'),
    ]);
    gsap.registerPlugin(ScrollTrigger);
    const SplitText = splitMod?.SplitText ?? null;
    if (SplitText) gsap.registerPlugin(SplitText);

    // Optional layers: a failure here must not block onReady() callbacks.
    let lenis: Lenis | null = null;
    if (wantsSmoothScroll()) {
      try {
        const { createLenis } = await import('./smooth');
        lenis = createLenis(gsap, ScrollTrigger);
      } catch (error) {
        console.warn('[motion] smooth scroll unavailable, using native scroll', error);
      }
    }

    if (SplitText && document.querySelector('[data-reveal="lines"]')) {
      try {
        const { initReveals } = await import('./reveal');
        initReveals(gsap, SplitText);
      } catch (error) {
        // Headings stay visible: base.css reveals them after a short fail-safe delay.
        console.warn('[motion] heading reveals unavailable', error);
      }
    }

    return { gsap, ScrollTrigger, SplitText, lenis, reduced };
  })();
  return motionPromise;
}

/**
 * Run `fn` once the motion stack is ready (DOM parsed, GSAP registered, Lenis
 * created when applicable). Safe to call many times, from any page script.
 */
export function onReady(fn: (ctx: MotionContext) => void): void {
  domReady(() => {
    loadMotion()
      .then(fn)
      .catch((error: unknown) => console.error('[motion] init failed', error));
  });
}

/* ---- Boot (once per page) ---------------------------------------------------- */
declare global {
  interface Window {
    __coreMotionBooted?: boolean;
  }
}

if (!window.__coreMotionBooted) {
  window.__coreMotionBooted = true;
  domReady(() => {
    initHeader();
    initMenu();
    initCopyEmail();
    initAnchors();
    initMarquees();
    initGait();
    initVideos();
    startNativeVelocityFeed();
    loadMotion().catch((error: unknown) => console.error('[motion] init failed', error));
  });
}
