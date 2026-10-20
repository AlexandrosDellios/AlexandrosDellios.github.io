/**
 * GaitMetronome (DESIGN M10): click cycles trot → walk → pace → bound, and
 * scroll speed raises the CSS animations' playbackRate:
 *   rate = 1 + min(|velocity| / 30, 2), eased in, then decaying back to 1.
 * The feet are CSS animations, so we reach them through getAnimations().
 *
 * It "walks while you scroll" (WCAG 2.2.2, no endless decorative loop):
 * .is-paused is set ~5 s after load and ~2 s after the last scroll movement,
 * and cleared by new scroll velocity or a click. Also paused in hidden tabs.
 */
import { env } from './env';
import { onScrollVelocity } from './scroll';

const GAITS = ['trot', 'walk', 'pace', 'bound'] as const;
type Gait = (typeof GAITS)[number];

const IDLE_AFTER_LOAD_MS = 5000;
const IDLE_AFTER_SCROLL_MS = 2000;

let target = 1;
let current = 1;
let raf = 0;
let roots: HTMLElement[] = [];
let idle = false;
let idleTimer = 0;

/** Paused while the tab is hidden or nothing has moved for a while. */
function syncPaused(): void {
  const paused = idle || document.hidden;
  roots.forEach((root) => root.classList.toggle('is-paused', paused));
}

/** Walk now, and go idle again after `ms` without movement. */
function wake(ms: number): void {
  idle = false;
  syncPaused();
  window.clearTimeout(idleTimer);
  idleTimer = window.setTimeout(() => {
    idle = true;
    syncPaused();
  }, ms);
}

function feetAnimations(): Animation[] {
  return roots.flatMap((root) =>
    Array.from(root.querySelectorAll<HTMLElement>('.gait__foot')).flatMap((foot) => foot.getAnimations()),
  );
}

function applyRate(rate: number): void {
  // Setting playbackRate keeps currentTime, so the four feet stay in phase.
  feetAnimations().forEach((anim) => {
    anim.playbackRate = rate;
  });
}

function tick(): void {
  current += (target - current) * 0.15;
  target += (1 - target) * 0.04; // decay towards the resting rate
  applyRate(current);
  if (Math.abs(current - 1) > 0.005 || Math.abs(target - 1) > 0.005) {
    raf = requestAnimationFrame(tick);
  } else {
    current = target = 1;
    applyRate(1);
    raf = 0;
  }
}

/** Feed a scroll velocity (px/frame). Exported so page scripts can nudge it too. */
export function nudgeGait(velocity: number): void {
  if (env.reducedMotion || roots.length === 0) return;
  if (Math.abs(velocity) > 0.5) wake(IDLE_AFTER_SCROLL_MS);
  target = Math.max(target, 1 + Math.min(Math.abs(velocity) / 30, 2));
  if (!raf) raf = requestAnimationFrame(tick);
}

function setGait(root: HTMLElement, gait: Gait): void {
  root.dataset.gait = gait;
  const label = root.querySelector('[data-gait-label]');
  if (label) label.textContent = gait;
  // The visible word is the button's description; screen readers rarely
  // re-read it, so the status line announces the change.
  const status = root.querySelector('[data-gait-status]');
  if (status) status.textContent = `Gait: ${gait}`;
  // A gait change may swap the keyframes (walk), which creates new Animation
  // objects at rate 1: re-apply the current rate on the next frame.
  requestAnimationFrame(() => applyRate(current));
}

export function initGait(): void {
  roots = Array.from(document.querySelectorAll<HTMLElement>('[data-gait-metronome]'));
  if (roots.length === 0) return;

  roots.forEach((root) =>
    root.addEventListener('click', () => {
      const now = (root.dataset.gait as Gait) ?? 'trot';
      const next = GAITS[(GAITS.indexOf(now) + 1) % GAITS.length];
      setGait(root, next);
      wake(IDLE_AFTER_LOAD_MS); // show the new gait for a few cycles
    }),
  );

  onScrollVelocity(nudgeGait);

  // Freeze while the tab is hidden (browsers throttle anyway; this keeps phase).
  document.addEventListener('visibilitychange', syncPaused);

  // A few cycles on load, then still until the page moves.
  wake(IDLE_AFTER_LOAD_MS);
}
