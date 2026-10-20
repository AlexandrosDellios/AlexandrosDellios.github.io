/**
 * Hero motion (DESIGN M2, M3), run from scripts/home/index.ts via onReady().
 *
 * M2 Name-strip collapse (scroll-scrubbed, first 55% of a viewport):
 *   - the strip becomes sticky under the header (.is-collapsing);
 *   - its row slides left (x 0 → −40vw), from 600px up. Phones show a single
 *     wrapped copy (no repeats to run off the edge), so there the strip stays
 *     put and only clips away, progressively from 35% on;
 *   - desktop only: it squashes (scaleY 1 → .62) during the first 30%, and the
 *     strip's clip follows the squash so no empty paper band covers content;
 *   - last 10%: it clips away upwards (inset bottom → 100%);
 *   - 85–100%: the header's accent underline wipes in (setHeaderLine);
 *   - the portrait arch widens (--k .16 → 0);
 *   - its visible bottom edge is reported to setFocusClearance(), so keyboard
 *     focus is never hidden under it (WCAG 2.4.11).
 *   Reduced motion: nothing sticks or moves; the underline simply switches on
 *   once the strip has scrolled out of view.
 *
 * M3 Role rotator: ONE pass through the pairs, back to the first (3 s hold,
 *   outgoing pair drops out, incoming pair falls in with back.out), then it
 *   stops (no endless loop next to the bio, WCAG 2.2.2). It pauses while the
 *   pointer or keyboard focus is in the hero text, off-screen and in hidden
 *   tabs. Off under reduced motion (first pair stays).
 */
import type { MotionContext } from '../core/motion';
import { getHeaderHeight, setFocusClearance, setHeaderLine, stickyStripBottom } from '../core/motion';

const SQUASH = 0.62;
const COLLAPSE_VH = 0.55;
const HOLD = 3;

export function initHeroMotion(ctx: MotionContext): void {
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (!hero) return;
  initStripCollapse(ctx, hero);
  initRoleRotator(ctx, hero);
}

/* ---- M2 ------------------------------------------------------------------------ */
function initStripCollapse({ gsap, ScrollTrigger, reduced }: MotionContext, hero: HTMLElement): void {
  const strip = hero.querySelector<HTMLElement>('[data-name-strip]');
  const inner = strip?.querySelector<HTMLElement>('[data-name-strip-inner]');
  const arch = hero.querySelector<HTMLElement>('[data-arch]');
  if (!strip || !inner) return;

  if (reduced) {
    // Static strip that scrolls away; the underline takes over once it is gone.
    ScrollTrigger.create({
      trigger: strip,
      start: () => `bottom top+=${getHeaderHeight()}`,
      onEnter: () => setHeaderLine(true),
      onLeaveBack: () => setHeaderLine(false),
    });
    return;
  }

  strip.classList.add('is-collapsing');
  const lineFrom = (p: number) => Math.min(1, Math.max(0, (p - 0.85) / 0.15));

  const mm = gsap.matchMedia();
  mm.add(
    {
      desktop: '(min-width: 1024px)',
      tablet: '(min-width: 600px) and (max-width: 1023.98px)',
      phone: '(max-width: 599.98px)',
    },
    (context) => {
      const desktop = Boolean(context.conditions?.desktop);
      const phone = Boolean(context.conditions?.phone);

      const update = (progress: number) => {
        setHeaderLine(lineFrom(progress));
        setFocusClearance(stickyStripBottom(strip), getHeaderHeight() + strip.offsetHeight);
      };

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          start: 0,
          end: () => window.innerHeight * COLLAPSE_VH,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => update(self.progress),
          onRefresh: (self) => update(self.progress),
        },
      });

      // y/scale are pinned explicitly: when GSAP first parses the row it folds the
      // CSS `translate` of the running M1 intro into its transform (and sets the
      // CSS property to none); pinning y: 0 stops that offset from being baked in.
      // Phones: no slide (one wrapped copy would just leave an empty right half).
      tl.fromTo(
        inner,
        { x: 0, y: 0 },
        { x: () => (phone ? 0 : -0.4 * window.innerWidth), y: 0, ease: 'power2.out', duration: 1 },
        0,
      );

      if (desktop) {
        // Squash the letters and pull the strip's bottom edge up with them.
        tl.fromTo(inner, { scaleY: 1 }, { scaleY: SQUASH, ease: 'power2.out', duration: 0.3 }, 0);
        tl.fromTo(
          strip,
          { clipPath: 'inset(0% 0% 0% 0%)' },
          { clipPath: `inset(0% 0% ${((1 - SQUASH) * 100).toFixed(1)}% 0%)`, ease: 'power2.out', duration: 0.3 },
          0,
        );
        tl.to(strip, { clipPath: 'inset(0% 0% 100% 0%)', ease: 'power1.in', duration: 0.1 }, 0.9);
      } else if (phone) {
        // The two-line name closes like a shutter, so it does not sit over the
        // portrait for half a screen of scrolling.
        tl.fromTo(
          strip,
          { clipPath: 'inset(0% 0% 0% 0%)' },
          { clipPath: 'inset(0% 0% 100% 0%)', ease: 'power1.in', duration: 0.65 },
          0.35,
        );
      } else {
        tl.fromTo(
          strip,
          { clipPath: 'inset(0% 0% 0% 0%)' },
          { clipPath: 'inset(0% 0% 100% 0%)', ease: 'power1.in', duration: 0.1 },
          0.9,
        );
      }

      if (arch) tl.fromTo(arch, { '--k': 0.16 }, { '--k': 0, ease: 'power1.out', duration: 1 }, 0);

      // Make sure the tail of the timeline exists even if no tween reaches t = 1.
      tl.set({}, {}, 1);

      return () => {
        setHeaderLine(null);
        setFocusClearance(0);
      };
    },
  );
}

/* ---- M3 ------------------------------------------------------------------------- */
function initRoleRotator({ gsap, ScrollTrigger, reduced }: MotionContext, hero: HTMLElement): void {
  if (reduced) return;
  const root = hero.querySelector<HTMLElement>('[data-role-rotator]');
  if (!root) return;
  const pairs = gsap.utils.toArray<HTMLElement>('[data-role-pair]', root);
  if (pairs.length < 2) return;

  const lines = (pair: HTMLElement) => pair.querySelectorAll<HTMLElement>('[data-role-line]');
  gsap.set(pairs, { autoAlpha: (i: number) => (i === 0 ? 1 : 0) });

  // One pass (pair 1 → … → pair 1), then it stays on the first pair.
  const tl = gsap.timeline({ paused: true });
  pairs.forEach((pair, i) => {
    const next = pairs[(i + 1) % pairs.length];
    const at = tl.duration() + HOLD;
    tl.to(lines(pair), { yPercent: 105, duration: 0.38, ease: 'power3.in', stagger: 0.08 }, at)
      .set(pair, { autoAlpha: 0 })
      .set(next, { autoAlpha: 1 }, at + 0.24)
      .fromTo(
        lines(next),
        { yPercent: -105 },
        { yPercent: 0, duration: 0.5, ease: 'back.out(0.9)', stagger: 0.1, immediateRender: false },
        at + 0.24,
      );
  });

  let inView = true;
  let held = false; // pointer or focus in the hero text: let people read
  const sync = () => {
    if (tl.progress() === 1) return; // finished its one pass
    if (inView && !held && !document.hidden) tl.play();
    else tl.pause();
  };

  const text = root.closest<HTMLElement>('.hero__text') ?? hero;
  const hold = (value: boolean) => () => {
    held = value;
    sync();
  };
  text.addEventListener('pointerenter', hold(true));
  text.addEventListener('pointerleave', hold(false));
  text.addEventListener('focusin', hold(true));
  text.addEventListener('focusout', (e) => {
    if (!text.contains(e.relatedTarget as Node | null)) hold(false)();
  });

  ScrollTrigger.create({
    trigger: hero,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => {
      inView = self.isActive;
      sync();
    },
  });
  document.addEventListener('visibilitychange', sync);
  sync();
}
