/**
 * Pause CSS marquees while they are off-screen (M14). Any element with
 * [data-marquee] gets .is-offscreen when it leaves the viewport; its CSS uses
 * that class to set animation-play-state: paused.
 */
export function initMarquees(): void {
  const els = document.querySelectorAll<HTMLElement>('[data-marquee]');
  if (els.length === 0) return;
  els.forEach((el) => el.classList.add('is-offscreen'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => entry.target.classList.toggle('is-offscreen', !entry.isIntersecting));
  });
  els.forEach((el) => io.observe(el));
}
