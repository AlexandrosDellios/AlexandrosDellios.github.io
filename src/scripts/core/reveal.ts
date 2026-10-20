/**
 * Heading reveal (DESIGN M4) for [data-reveal="lines"]:
 * SplitText lines inside masks, yPercent 110 -> 0 and rotate 6° -> 0
 * (origin 0 50%), expo.out 0.9 s, stagger 0.06, once, when the heading's top
 * reaches 85% of the viewport. Re-splits on resize/font load without replaying.
 * Never runs under reduced motion (the CSS keeps headings visible there).
 * Use on section h2s only (≤ 8 per page).
 */
import type { gsap as GSAP } from 'gsap';
import type { SplitText as SplitTextType } from 'gsap/SplitText';

export function initReveals(gsap: typeof GSAP, SplitText: typeof SplitTextType): void {
  const headings = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal="lines"]'));

  headings.forEach((el) => {
    let done = false;

    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'reveal-line',
      // Line splits keep the words as real text: no aria-label / aria-hidden
      // swap (some screen readers read hidden text in browse mode, and the
      // label would drop the italic <em>).
      aria: 'none',
      autoSplit: true, // re-split when fonts load or the width changes
      onSplit(self) {
        el.classList.add('is-split'); // lifts the CSS pre-hide (base.css)
        if (done) return undefined; // already revealed: just keep the new lines static
        return gsap.from(self.lines, {
          yPercent: 110,
          rotate: 6,
          transformOrigin: '0% 50%',
          duration: 0.9,
          ease: 'expo.out',
          stagger: 0.06,
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          onComplete: () => {
            done = true;
          },
        });
      },
    });
  });
}
