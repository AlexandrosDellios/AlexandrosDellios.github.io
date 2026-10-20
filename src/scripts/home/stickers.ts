/**
 * Hero stickers (DESIGN M9).
 *
 * - Drag-to-spin with inertia: GSAP Draggable + InertiaPlugin, dynamically
 *   imported ONLY for screens ≥ 750px with a fine pointer (touch phones never
 *   download them). Under reduced motion dragging still works (it is
 *   user-initiated) but without the inertia throw.
 * - Scroll drift: on desktop (≥ 1024px, motion allowed) each sticker drifts
 *   sideways and turns a little more as the hero scrolls away (scrubbed).
 * - The idle ring-text spin is pure CSS (Sticker.astro).
 */
import type { MotionContext } from '../core/motion';

const DRAG_QUERY = '(min-width: 750px) and (hover: hover) and (pointer: fine)';

export function initStickers(ctx: MotionContext): void {
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (!hero) return;
  const stickers = Array.from(hero.querySelectorAll<HTMLElement>('[data-sticker]'));
  if (stickers.length === 0) return;

  initDrift(ctx, hero, stickers);
  if (window.matchMedia(DRAG_QUERY).matches) void initDrag(ctx, stickers);
}

async function initDrag({ gsap, reduced }: MotionContext, stickers: HTMLElement[]): Promise<void> {
  try {
    const [{ Draggable }, { InertiaPlugin }] = await Promise.all([
      import('gsap/Draggable'),
      import('gsap/InertiaPlugin'),
    ]);
    gsap.registerPlugin(Draggable, InertiaPlugin);

    const targets = stickers
      .map((s) => s.querySelector<SVGElement>('[data-sticker-drag]'))
      .filter((el): el is SVGElement => el !== null && el.getClientRects().length > 0);

    Draggable.create(targets, {
      type: 'rotation',
      inertia: !reduced,
      // Light friction so a flick spins a turn or two, then settles.
      throwResistance: 1200,
      onPress() {
        gsap.killTweensOf(this.target);
      },
    });
    document.documentElement.classList.add('has-sticker-drag');
  } catch (error) {
    // Stickers stay static: they are decoration.
    console.warn('[stickers] drag unavailable', error);
  }
}

function initDrift({ gsap, reduced }: MotionContext, hero: HTMLElement, stickers: HTMLElement[]): void {
  if (reduced) return;
  const mm = gsap.matchMedia();
  mm.add('(min-width: 1024px)', () => {
    stickers.forEach((sticker, i) => {
      const drift = sticker.querySelector<HTMLElement>('[data-sticker-drift]');
      if (!drift) return;
      const dir = i % 2 === 0 ? 1 : -1;
      gsap.to(drift, {
        x: () => window.innerWidth * 0.06 * dir,
        rotation: 20 * dir,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    });
  });
}
