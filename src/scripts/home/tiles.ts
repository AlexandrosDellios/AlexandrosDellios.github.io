/**
 * Tile entry (DESIGN M5): work tiles, statement cells, Now cards and the
 * project pages' development-cycle photos ([data-enter]) fade and scale in
 * (opacity 0 → 1, scale .94 → 1, .6 s out-quart, 60 ms stagger) in batches as
 * they reach 90% of the viewport.
 *
 * Progressive enhancement: nothing is hidden by CSS. Only elements that are
 * still below the fold when this runs are hidden (by GSAP), so content is
 * never stuck invisible if a script fails, and nothing already on screen
 * flickers. Inline styles are cleared afterwards (no lingering transforms that
 * would trap fixed-position children or break view-transition snapshots).
 * Skipped under reduced motion.
 */
import type { MotionContext } from '../core/motion';

export function initTileEntry({ gsap, ScrollTrigger, reduced }: MotionContext): void {
  if (reduced) return;

  const fold = window.innerHeight * 0.9;
  const targets = gsap.utils
    .toArray<HTMLElement>('[data-enter]')
    .filter((el) => el.getBoundingClientRect().top > fold);
  if (targets.length === 0) return;

  gsap.set(targets, { opacity: 0, scale: 0.94, transformOrigin: '50% 30%' });

  ScrollTrigger.batch(targets, {
    start: 'top 90%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: 'power3.out', // = quart.out
        stagger: 0.06,
        overwrite: true,
        clearProps: 'opacity,transform,transformOrigin',
      }),
  });
}
