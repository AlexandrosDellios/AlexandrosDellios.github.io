/**
 * Mobile menu (DESIGN §5.21). The panel is a popover (works without JS);
 * this adds: aria-expanded sync, focus trap + focus return, scroll lock,
 * close on link click and when resizing to desktop, and a fallback for
 * browsers without the Popover API.
 */
import { lockScroll, unlockScroll } from './scroll';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

export function initMenu(): void {
  const panel = document.querySelector<HTMLElement>('[data-mobile-menu]');
  if (!panel) return;
  const toggles = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-menu-toggle]'));
  const supportsPopover = typeof panel.showPopover === 'function';
  let open = false;
  let returnFocusTo: HTMLElement | null = null;

  const setExpanded = (value: boolean) =>
    toggles.forEach((t) => t.setAttribute('aria-expanded', String(value)));
  // aria-expanded is set here, not in the markup: without JS the browser
  // exposes the popover button's expanded state natively.
  setExpanded(false);

  const onOpen = () => {
    if (open) return;
    open = true;
    returnFocusTo = (document.activeElement as HTMLElement | null) ?? toggles[0] ?? null;
    setExpanded(true);
    lockScroll();
    document.addEventListener('keydown', onKeydown);
    // Move focus into the dialog (first nav link reads best).
    requestAnimationFrame(() => {
      const target =
        panel.querySelector<HTMLElement>('.mobile-menu__link') ?? panel.querySelector<HTMLElement>(FOCUSABLE);
      target?.focus({ preventScroll: true });
    });
  };

  const onClose = (restoreFocus = true) => {
    if (!open) return;
    open = false;
    setExpanded(false);
    unlockScroll();
    document.removeEventListener('keydown', onKeydown);
    // Return focus to whatever opened the menu (the toggle) when focus was in
    // the panel or got dropped to <body> by the popover hiding.
    const active = document.activeElement;
    if (restoreFocus && (!active || active === document.body || panel.contains(active))) {
      const back =
        returnFocusTo && returnFocusTo !== document.body && document.contains(returnFocusTo)
          ? returnFocusTo
          : toggles[0];
      back?.focus({ preventScroll: true });
    }
  };

  const show = () => {
    if (supportsPopover) panel.showPopover();
    else {
      panel.setAttribute('data-open', '');
      onOpen();
    }
  };

  const hide = (restoreFocus = true) => {
    if (supportsPopover) {
      if (panel.matches(':popover-open')) panel.hidePopover();
      onClose(restoreFocus); // sync; the toggle event will find open === false
    } else {
      panel.removeAttribute('data-open');
      onClose(restoreFocus);
    }
  };

  // Focus trap + Esc (Esc is native for popovers; handled here for the fallback).
  const onKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && !supportsPopover) {
      event.preventDefault();
      hide();
      return;
    }
    if (event.key !== 'Tab') return;
    const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => el.offsetParent !== null || el === document.activeElement,
    );
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && (document.activeElement === first || !panel.contains(document.activeElement))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  if (supportsPopover) {
    // Fires for every way of opening/closing: button, Esc, light dismiss, script.
    panel.addEventListener('toggle', (event) => {
      const state = (event as ToggleEvent).newState;
      if (state === 'open') onOpen();
      else onClose();
    });
  } else {
    toggles.forEach((t) =>
      t.addEventListener('click', (event) => {
        event.preventDefault();
        if (open) hide();
        else show();
      }),
    );
    panel.querySelector('[data-menu-close]')?.addEventListener('click', (event) => {
      event.preventDefault();
      hide();
    });
  }

  // Following a link closes the menu first, so in-page anchors can scroll
  // (scroll is unlocked synchronously) and cross-page links don't flash.
  panel.addEventListener('click', (event) => {
    const link = (event.target as Element).closest('a[href]');
    if (link) hide(false);
  });

  // The panel is mobile-only: close it if the viewport grows to desktop.
  const desktop = window.matchMedia('(min-width: 1024px)');
  desktop.addEventListener('change', (e) => {
    if (e.matches && open) hide(false);
  });
}
