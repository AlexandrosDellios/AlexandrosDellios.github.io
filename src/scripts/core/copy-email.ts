/**
 * CopyEmail (DESIGN §5.7, M13): copy the address, show "Copied ✓" for 1.6 s,
 * announce it politely; fall back to mailto: when the clipboard is unavailable.
 * Event delegation, so it also works for components rendered anywhere.
 */

const SHOW_FOR_MS = 1600;
const timers = new WeakMap<HTMLElement, number>();

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to the legacy path */
  }
  // Legacy fallback (older Safari / http): a hidden textarea + execCommand.
  try {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.append(area);
    area.select();
    const ok = document.execCommand('copy');
    area.remove();
    return ok;
  } catch {
    return false;
  }
}

export function initCopyEmail(): void {
  document.addEventListener('click', async (event) => {
    const button = (event.target as Element | null)?.closest<HTMLButtonElement>('[data-copy-email-btn]');
    if (!button) return;
    const root = button.closest<HTMLElement>('[data-copy-email]');
    const email = button.dataset.email ?? '';
    if (!root || !email) return;

    const status = root.querySelector<HTMLElement>('[data-copy-email-status]');
    const ok = await copyText(email);
    if (!ok) {
      // Say what happens instead of failing silently, open the mail app, and
      // keep keyboard focus on the button (navigating to mailto: can drop it).
      if (status) status.textContent = `Couldn’t copy the address (${email}). Opening your mail app.`;
      window.location.href = `mailto:${email}`;
      button.focus({ preventScroll: true });
      return;
    }

    if (status) status.textContent = `Email address copied: ${email}`;

    root.classList.add('is-copied');
    window.clearTimeout(timers.get(root));
    timers.set(
      root,
      window.setTimeout(() => {
        root.classList.remove('is-copied');
        if (status) status.textContent = '';
      }, SHOW_FOR_MS),
    );
  });
}
