/**
 * In-page anchor links (#id and /#id while on "/") scroll smoothly to the
 * target below the sticky header, via Lenis when active (M11) or natively.
 * Focus moves to the target for keyboard and screen-reader users, and the URL
 * hash is updated without a jump. Links to other pages are left alone.
 */
import { scrollToTarget } from './scroll';

export function initAnchors(): void {
  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href*="#"]');
    if (!link || link.target === '_blank' || link.hasAttribute('download')) return;

    const url = new URL(link.href, location.href);
    const samePage = url.origin === location.origin && url.pathname === location.pathname;
    if (!samePage || !url.hash) return;

    const id = decodeURIComponent(url.hash.slice(1));
    const target = id === 'top' ? document.body : document.getElementById(id);
    if (!target) return;

    event.preventDefault();
    if (id === 'main' && link.hasAttribute('data-scroll-top')) {
      scrollToTarget(0);
    } else {
      scrollToTarget(target);
    }
    if (location.hash !== url.hash) history.pushState(null, '', url.hash);

    // Accessibility: move focus without a second jump.
    if (!target.hasAttribute('tabindex') && !target.matches('a, button, input, select, textarea')) {
      target.setAttribute('tabindex', '-1');
    }
    target.focus({ preventScroll: true });
  });
}
