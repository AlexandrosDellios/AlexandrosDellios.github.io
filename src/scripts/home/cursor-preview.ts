/**
 * Cursor preview (DESIGN M16, §5.12 / §5.14 / §5.15): drives the single
 * floating element rendered by components/home/CursorPreview.astro.
 *
 * Any element with [data-preview-src] is a trigger (statement links, more-work
 * rows, experience rows). See CursorPreview.astro for the attributes.
 *
 * - Fine pointers only (touch never shows it: there is no hover).
 * - "pill" (statement links): follows the cursor with a light lerp (rAF runs
 *   only while visible).
 * - "card" (list rows): pinned in the row's leading column (dates / year),
 *   just under its first line (DESIGN §5.15 "fades in on the left"), so it
 *   never covers the text being read. When the row is stacked (no leading
 *   column wide enough), it falls back to following the cursor.
 * - Keyboard focus (:focus-visible) on a trigger shows it next to the element.
 * - Reduced motion: no following; it appears next to the trigger and stays.
 * - Hides on scroll, pointer leave, blur, and when the tab is hidden.
 * Thumbnails are preloaded on idle so the first hover is instant.
 */
import { env } from '../core/motion';

const OFFSET_X = 18;
const OFFSET_Y = 14;
const LERP = 0.22;
/** Gap between a pinned card and the row's main text column. */
const PIN_GAP = 16;

export function initCursorPreview(): void {
  const el = document.querySelector<HTMLElement>('[data-cursor-preview]');
  if (!el) return;
  const img = el.querySelector<HTMLImageElement>('[data-cpv-img]');
  const label = el.querySelector<HTMLElement>('[data-cpv-label]');
  if (!img || !label) return;

  const triggers = Array.from(document.querySelectorAll<HTMLElement>('[data-preview-src]'));
  if (triggers.length === 0) return;

  const follow = env.finePointer && !env.reducedMotion;
  let active: HTMLElement | null = null;
  let x = 0;
  let y = 0;
  let tx = 0;
  let ty = 0;
  let raf = 0;

  const place = (px: number, py: number) => {
    el.style.transform = `translate3d(${px.toFixed(1)}px, ${py.toFixed(1)}px, 0)`;
  };

  /** Keep the preview inside the viewport: flip to the left / above near edges. */
  const clampTarget = (cx: number, cy: number): [number, number] => {
    const w = el.offsetWidth || 220;
    const h = el.offsetHeight || 60;
    let nx = cx + OFFSET_X;
    let ny = cy + OFFSET_Y;
    if (nx + w > window.innerWidth - 8) nx = cx - OFFSET_X - w;
    if (ny + h > window.innerHeight - 8) ny = cy - OFFSET_Y - h;
    return [Math.max(8, nx), Math.max(8, ny)];
  };

  const tick = () => {
    x += (tx - x) * LERP;
    y += (ty - y) * LERP;
    place(x, y);
    raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.3 ? requestAnimationFrame(tick) : 0;
  };

  const fill = (trigger: HTMLElement) => {
    const { previewSrc, previewLabel = '', previewVariant = 'pill', previewAccent } = trigger.dataset;
    if (!previewSrc) return false;
    el.dataset.variant = previewVariant;
    if (img.getAttribute('src') !== previewSrc) img.src = previewSrc;
    label.textContent = previewLabel;
    if (previewAccent) el.style.setProperty('--cpv-accent', previewAccent);
    else el.style.removeProperty('--cpv-accent');
    return true;
  };

  /**
   * "card" rows: the spot in the row's leading column (first cell = dates /
   * year), right under that cell's text and ending PIN_GAP before the main
   * text. Null when the row is stacked (leading column too narrow).
   */
  const pinnedSpot = (row: HTMLElement): [number, number] | null => {
    const [lead, main] = Array.from(row.children) as HTMLElement[];
    if (!lead || !main) return null;
    const w = el.offsetWidth || 160;
    const h = el.offsetHeight || 150;
    const a = lead.getBoundingClientRect();
    const m = main.getBoundingClientRect();
    if (m.left - a.left < w * 0.8) return null;
    const x = Math.max(8, m.left - PIN_GAP - w);
    const y = Math.min(Math.max(8, a.bottom + 10), window.innerHeight - h - 8);
    return [x, y];
  };

  const isPinned = (trigger: HTMLElement) => trigger.dataset.previewVariant === 'card';

  const show = (trigger: HTMLElement, cx: number, cy: number) => {
    if (!fill(trigger)) return;
    active = trigger;
    const pin = isPinned(trigger) ? pinnedSpot(trigger) : null;
    [tx, ty] = pin ?? clampTarget(cx, cy);
    // First frame: jump to the target, then lerp from there.
    x = tx;
    y = ty;
    place(x, y);
    el.classList.add('is-visible');
  };

  /** Next to an element (keyboard focus, reduced motion). */
  const showBeside = (trigger: HTMLElement) => {
    const r = (trigger.getClientRects()[0] ?? trigger.getBoundingClientRect()) as DOMRect;
    show(trigger, r.right - OFFSET_X + 6, r.top - el.offsetHeight / 2 - OFFSET_Y + r.height / 2);
  };

  const hide = () => {
    active = null;
    el.classList.remove('is-visible');
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  };

  if (env.finePointer) {
    triggers.forEach((trigger) => {
      trigger.addEventListener('pointerenter', (e) => {
        if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
        if (follow) show(trigger, e.clientX, e.clientY);
        else showBeside(trigger);
      });
      trigger.addEventListener('pointerleave', () => {
        if (active === trigger) hide();
      });
      if (follow) {
        trigger.addEventListener('pointermove', (e) => {
          if (active !== trigger) return;
          if (isPinned(trigger) && pinnedSpot(trigger)) return; // stays put
          [tx, ty] = clampTarget(e.clientX, e.clientY);
          if (!raf) raf = requestAnimationFrame(tick);
        });
      }
    });
  }

  // Keyboard: links that are triggers show the preview beside themselves.
  document.addEventListener('focusin', (e) => {
    const target = e.target as HTMLElement | null;
    const trigger = target?.closest<HTMLElement>('[data-preview-src]');
    if (trigger && target?.matches(':focus-visible') && env.finePointer) showBeside(trigger);
  });
  document.addEventListener('focusout', (e) => {
    const trigger = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-preview-src]');
    if (trigger && trigger === active) hide();
  });

  window.addEventListener('scroll', () => active && hide(), { passive: true });
  document.addEventListener('visibilitychange', () => document.hidden && hide());

  // Warm the cache so the first hover shows the image immediately.
  if (env.finePointer) {
    const preload = () => {
      new Set(triggers.map((t) => t.dataset.previewSrc).filter(Boolean)).forEach((src) => {
        const i = new Image();
        i.decoding = 'async';
        i.src = src as string;
      });
    };
    if ('requestIdleCallback' in window) window.requestIdleCallback(preload, { timeout: 4000 });
    else setTimeout(preload, 2500);
  }
}
