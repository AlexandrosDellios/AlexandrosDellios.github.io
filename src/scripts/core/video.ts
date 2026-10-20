/**
 * Video manager for <video data-loop-video> (DESIGN §5.20, M6, M7, §2.9).
 *
 * - Lazy: <source data-src> become real sources on first intent only.
 * - Intent:
 *     fine pointer:  pointerenter / focusin on the nearest [data-video-hover]
 *                    container plays, pointerleave / focusout pauses;
 *     touch, or [data-video-autoplay] on any device: the most visible video
 *                    that is >= 60% in view plays;
 *     the play/pause button ([data-video-toggle="<id>"]) always works;
 *     [data-video-manual] (on the video or an ancestor) opts out of hover and
 *     visibility starts: only the button plays it (long, story-like clips).
 * - Exactly one video plays at a time.
 * - Pauses when off-screen or when the tab is hidden.
 * - Nothing starts by itself under reduced motion or Save-Data (button only).
 * - State: root [data-loop-video-root] gets .is-playing and .has-frame;
 *   toggles get data-state="playing|paused" and a matching aria-label.
 */
import { canAutoplay, env } from './env';

interface VideoState {
  video: HTMLVideoElement;
  root: HTMLElement | null;
  hoverHost: HTMLElement | null;
  autoplayOnView: boolean;
  loaded: boolean;
  ratio: number;
  /** Paused explicitly by the user: no automatic restarts until they press play. */
  userPaused: boolean;
  /** Started explicitly by the user: auto-selection won't steal its turn. */
  userPlayed: boolean;
}

const states = new Map<HTMLVideoElement, VideoState>();
let current: HTMLVideoElement | null = null;
let resumeAfterHidden: HTMLVideoElement | null = null;

const VISIBLE_ENOUGH = 0.6;

/* ---- Core actions ----------------------------------------------------------- */

function attachSources(state: VideoState): void {
  if (state.loaded) return;
  state.loaded = true;
  state.video.querySelectorAll<HTMLSourceElement>('source[data-src]').forEach((source) => {
    source.src = source.dataset.src ?? '';
    source.removeAttribute('data-src');
  });
  state.video.preload = 'auto';
  state.video.load();
}

function play(video: HTMLVideoElement): void {
  const state = states.get(video);
  if (!state) return;
  if (current && current !== video) pause(current);
  current = video;
  attachSources(state);
  video.muted = true; // required for inline autoplay on iOS
  const attempt = video.play();
  if (attempt) {
    attempt.catch(() => {
      // Autoplay blocked or source failed: keep the poster, show "play".
      if (current === video) current = null;
      syncUi(state);
    });
  }
}

function pause(video: HTMLVideoElement): void {
  video.pause();
  if (current === video) current = null;
}

function syncUi(state: VideoState): void {
  const playing = !state.video.paused && !state.video.ended;
  state.root?.classList.toggle('is-playing', playing);
  if (playing) state.root?.classList.add('has-frame');
  const id = state.video.id;
  if (!id) return;
  document.querySelectorAll<HTMLButtonElement>(`[data-video-toggle="${CSS.escape(id)}"]`).forEach((btn) => {
    btn.dataset.state = playing ? 'playing' : 'paused';
    const label = playing ? btn.dataset.labelPause : btn.dataset.labelPlay;
    if (label) btn.setAttribute('aria-label', label);
  });
}

/* ---- Visibility-driven autoplay ------------------------------------------- */

/** Pick the most visible eligible video (>= 60%) and play it; pause the rest. */
function chooseByVisibility(): void {
  if (!canAutoplay() || document.hidden) return;

  // Respect a video the user started while it stays on screen.
  const cur = current ? states.get(current) : null;
  if (cur?.userPlayed && cur.ratio > 0) return;

  let best: VideoState | null = null;
  states.forEach((s) => {
    if (!s.autoplayOnView || s.userPaused || s.ratio < VISIBLE_ENOUGH) return;
    if (!best || s.ratio > best.ratio) best = s;
  });

  const chosen = best as VideoState | null;
  if (chosen && chosen.video !== current) play(chosen.video);
  if (!chosen && cur?.autoplayOnView && !cur.userPlayed) pause(cur.video);
}

/* ---- Setup ---------------------------------------------------------------------- */

export function initVideos(): void {
  const videos = Array.from(document.querySelectorAll<HTMLVideoElement>('video[data-loop-video]'));
  if (videos.length === 0) return;

  videos.forEach((video) => {
    const manual = video.closest('[data-video-manual]') !== null;
    const state: VideoState = {
      video,
      root: video.closest<HTMLElement>('[data-loop-video-root]'),
      hoverHost: env.finePointer && !manual ? video.closest<HTMLElement>('[data-video-hover]') : null,
      // Touch screens: every loop video plays when visible. Desktop: opt-in.
      autoplayOnView: !manual && (!env.finePointer || video.closest('[data-video-autoplay]') !== null),
      loaded: false,
      ratio: 0,
      userPaused: false,
      userPlayed: false,
    };
    states.set(video, state);

    video.addEventListener('playing', () => syncUi(state));
    video.addEventListener('pause', () => syncUi(state));
    video.addEventListener('ended', () => syncUi(state));

    // Hover / focus intent (mouse users), mirrored for keyboard focus (M6).
    const host = state.hoverHost;
    if (host) {
      const start = () => {
        // Reduced motion / Save-Data: hover never downloads a clip that will not
        // play (the button still loads and plays it on demand).
        if (!canAutoplay()) return;
        attachSources(state);
        // A clip the user started with its button keeps playing while it is on
        // screen: passing over another card on the way must not cut it off.
        const cur = current ? states.get(current) : undefined;
        const userClipRunning = cur !== undefined && cur !== state && cur.userPlayed && cur.ratio > 0;
        if (!state.userPaused && !userClipRunning) play(video);
      };
      const stop = () => {
        if (!state.userPlayed) pause(video);
      };
      host.addEventListener('pointerenter', start);
      host.addEventListener('pointerleave', stop);
      host.addEventListener('focusin', (e) => {
        if ((e.target as Element).matches(':focus-visible')) start();
      });
      host.addEventListener('focusout', (e) => {
        if (!host.contains(e.relatedTarget as Node | null)) stop();
      });
    }
  });

  // One observer for visibility: off-screen pause + most-visible autoplay.
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const state = states.get(entry.target as HTMLVideoElement);
        if (!state) return;
        state.ratio = entry.isIntersecting ? entry.intersectionRatio : 0;
        if (!entry.isIntersecting) {
          state.userPlayed = false;
          if (!state.video.paused) pause(state.video);
        }
      });
      chooseByVisibility();
    },
    { threshold: [0, 0.25, 0.5, 0.6, 0.75, 0.9, 1] },
  );
  videos.forEach((v) => io.observe(v));

  // Play/pause buttons (delegated, so buttons can live outside the video root).
  document.addEventListener('click', (event) => {
    const btn = (event.target as Element | null)?.closest<HTMLButtonElement>('[data-video-toggle]');
    if (!btn) return;
    event.preventDefault();
    const video = document.getElementById(btn.dataset.videoToggle ?? '') as HTMLVideoElement | null;
    const state = video ? states.get(video) : undefined;
    if (!video || !state) return;
    if (video.paused) {
      state.userPaused = false;
      state.userPlayed = true;
      play(video);
    } else {
      state.userPaused = true;
      state.userPlayed = false;
      pause(video);
    }
  });

  // Hidden tab: pause, and resume the same video when the tab comes back.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      resumeAfterHidden = current;
      if (current) pause(current);
    } else {
      const v = resumeAfterHidden;
      resumeAfterHidden = null;
      const s = v ? states.get(v) : undefined;
      if (v && s && s.ratio > 0 && !s.userPaused && (s.userPlayed || canAutoplay())) play(v);
      else chooseByVisibility();
    }
  });
}
