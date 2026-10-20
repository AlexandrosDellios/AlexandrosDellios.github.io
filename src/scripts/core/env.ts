/**
 * Environment detection, evaluated once at startup (cheap, synchronous).
 * Everything motion-related checks these before doing work.
 */

const mq = (query: string): boolean =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia(query).matches;

type NetworkInformationLike = { saveData?: boolean };

export const env = {
  /** prefers-reduced-motion: reduce */
  reducedMotion: mq('(prefers-reduced-motion: reduce)'),
  /** navigator.connection.saveData (Chrome/Android "Lite mode" etc.) */
  saveData: Boolean((navigator as Navigator & { connection?: NetworkInformationLike }).connection?.saveData),
  /** Mouse/trackpad: hover-capable fine pointer. Touch screens are false. */
  finePointer: mq('(hover: hover) and (pointer: fine)'),
};

/** True when decorative motion must be skipped. */
export const isReducedMotion = (): boolean => env.reducedMotion;

/** True when the user asked to save data (no video autoplay / preload). */
export const isSaveData = (): boolean => env.saveData;

/** True for mouse/trackpad users (hover intent is meaningful). */
export const isFinePointer = (): boolean => env.finePointer;

/** Videos may start on their own (hover or visibility) only when this is true. */
export const canAutoplay = (): boolean => !env.reducedMotion && !env.saveData;

/** Lenis smooth scroll only for fine pointers with motion allowed (M11). */
export const wantsSmoothScroll = (): boolean => env.finePointer && !env.reducedMotion;

/** Run `fn` once the DOM is parsed (module scripts are deferred, but be safe). */
export function domReady(fn: () => void): void {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn, { once: true });
  } else {
    fn();
  }
}
