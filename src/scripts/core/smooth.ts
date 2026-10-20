/**
 * Lenis smooth scroll (DESIGN M11), desktop only.
 * Driven by gsap.ticker so ScrollTrigger and Lenis share one frame loop.
 * Never created for touch input or reduced motion (native scroll there).
 */
import type { gsap as GSAP } from 'gsap';
import type { ScrollTrigger as ST } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { emitVelocity, setLenis } from './scroll';

export function createLenis(gsap: typeof GSAP, ScrollTrigger: typeof ST): Lenis {
  const lenis = new Lenis({
    duration: 1,
    easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)), // expo-out
    smoothWheel: true,
    syncTouch: false, // touch keeps native momentum
    autoRaf: false, // gsap.ticker drives it (below)
  });

  // Keep ScrollTrigger in sync and feed the velocity listeners (metronome).
  lenis.on('scroll', (instance: Lenis) => {
    ScrollTrigger.update();
    emitVelocity(instance.velocity);
  });

  gsap.ticker.add((time: number) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  setLenis(lenis);
  return lenis;
}
