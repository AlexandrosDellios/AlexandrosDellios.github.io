/**
 * Project title strip collapse (DESIGN M2, project-page variant).
 *
 * Over the first 55% of a viewport of scroll, the giant short word:
 *   - slides left (x: 0 -> -40vw, out-quart);
 *   - >= 600px only: squashes (scaleY 1 -> 0.62) during the first 30%, while
 *     the strip's box is clipped in step so the paper band shrinks with it;
 *   - clips away into the header (bottom inset -> 100%).
 * On phones there is no squash (DESIGN §8); the band clips progressively.
 *
 * The strip is made sticky (.is-pinned) only here, once GSAP is ready, so a
 * page without JS (or where the motion stack fails) keeps a static strip
 * that scrolls away normally. Reduced motion: nothing runs (static strip).
 *
 * The header's own underline is not used on project pages: the reading
 * progress hairline takes that slot (ReadingProgress.astro).
 *
 * Focus (WCAG 2.4.11): while the strip covers the top of the page, its
 * visible bottom edge is reported to setFocusClearance(), so keyboard focus
 * is never left hidden underneath it.
 */
import { getHeaderHeight, onReady, setFocusClearance, stickyStripBottom } from '../core/motion';

const SQUASH = 0.62; // final scaleY of the strip text (desktop/tablet)
const RANGE = 0.55; // collapse distance, in viewport heights

export function initTitleStrip(): void {
  const strip = document.querySelector<HTMLElement>('[data-title-strip]');
  const inner = strip?.querySelector<HTMLElement>('[data-name-strip-inner]');
  if (!strip || !inner) return;

  onReady(({ gsap, reduced }) => {
    if (reduced) return;

    strip.classList.add('is-pinned');

    const mm = gsap.matchMedia();
    mm.add({ squash: '(min-width: 600px)', flat: '(max-width: 599.98px)' }, (context) => {
      const squash = Boolean(context.conditions?.squash);

      // Keep focus clear of the strip (it re-expands when scrolling back up).
      const reportClearance = () =>
        setFocusClearance(stickyStripBottom(strip), getHeaderHeight() + strip.offsetHeight);

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          start: 0,
          end: () => `+=${Math.round(window.innerHeight * RANGE)}`,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: reportClearance,
          onRefresh: reportClearance,
        },
      });

      // Slide: the whole range, out-quart (GSAP power3.out).
      tl.fromTo(inner, { x: 0 }, { x: () => -0.4 * window.innerWidth, duration: 1, ease: 'power3.out' }, 0);

      if (squash) {
        // Squash the text and shrink the paper band with it (same ease, so
        // the clip's bottom edge tracks the text's bottom edge).
        const band = `${Math.round((1 - SQUASH) * 100)}%`;
        tl.fromTo(inner, { scaleY: 1 }, { scaleY: SQUASH, duration: 0.3, ease: 'power3.out' }, 0);
        tl.fromTo(
          strip,
          { clipPath: 'inset(0% 0% 0% 0%)' },
          { clipPath: `inset(0% 0% ${band} 0%)`, duration: 0.3, ease: 'power3.out' },
          0,
        );
        // Last 10%: clip away into the header.
        tl.to(strip, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.1, ease: 'power2.in' }, 0.9);
      } else {
        // Phones: no squash; the band closes progressively from 35% on.
        tl.fromTo(
          strip,
          { clipPath: 'inset(0% 0% 0% 0%)' },
          { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.65, ease: 'power1.in' },
          0.35,
        );
      }

      return () => {
        // matchMedia reverts the tweens; also drop the inline clip/transform.
        gsap.set([strip, inner], { clearProps: 'clipPath,transform' });
        setFocusClearance(0);
      };
    });
  });
}
