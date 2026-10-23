// Line drawings for "Coming soon" placeholders: src/assets/sketches/<name>.svg.
// MediaPlaceholder inlines them; the Experience hover cards use the files as images.

export const SKETCHES = ['photo', 'video', 'plot', 'arm', 'quadruped', 'award'] as const;
export type Sketch = (typeof SKETCHES)[number];

/** A drawing that fits the label when none is given: "…video / clip / recording" → video, "…plot" → plot. */
export function sketchFor(label: string): Sketch {
  if (/\b(video|clip|recording|footage)s?\b/i.test(label)) return 'video';
  if (/\b(plot|curve|chart|graph)s?\b/i.test(label)) return 'plot';
  return 'photo';
}
