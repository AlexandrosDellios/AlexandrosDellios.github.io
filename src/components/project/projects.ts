/**
 * Build-time helpers for the detail pages: projects (/work/<id>/) and roles (/experience/<id>/).
 * Everything here runs in Node during `astro build` / `astro dev` (never in the browser).
 *
 *   getProjects()          projects (kind "project"), sorted by section (featured first), then `order`
 *                          (ids starting with "_" are stubs: skipped)
 *   getRoles()             roles (kind "role": BioRob, AI Team, Mediacom), sorted by `order`
 *   pageHref(entry)        canonical URL of a page (/work/<id>/ or /experience/<id>/)
 *   projectHref(id)        canonical URL of a project page
 *   vtNames(id)            the shared view-transition names (contract with the home tiles)
 *   accentStyle(data)      inline `--accent` / `--accent-ink` for a tile in another project's colour
 *   mediaKind(alt)         "Illustration" / "Diagram" chip when the poster is not a real capture
 *   publicImageSize(path)  intrinsic size of a JPEG/PNG in public/ (video posters → frame aspect)
 *   publicLabel(label)     a mediaNeeded label without its production spec (" · 16:9")
 *   splitSections(html)    cuts the rendered Markdown body into <h2> sections
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;
export type ProjectData = Project['data'];

/* ---- Collection ------------------------------------------------------------- */

const byOrder = (a: Project, b: Project) => a.data.order - b.data.order || a.id.localeCompare(b.id);
const SECTION_RANK = { featured: 0, more: 1 } as const;

/** All publishable projects: Selected work in grid order, then More projects. Ids starting with "_" are stubs. */
export async function getProjects(): Promise<Project[]> {
  const entries = await getCollection('projects', ({ id, data }) => !id.startsWith('_') && data.kind === 'project');
  return entries.sort((a, b) => SECTION_RANK[a.data.section] - SECTION_RANK[b.data.section] || byOrder(a, b));
}

/** The role pages (Now cards and Experience rows), in `order`. */
export async function getRoles(): Promise<Project[]> {
  const entries = await getCollection('projects', ({ id, data }) => !id.startsWith('_') && data.kind === 'role');
  return entries.sort(byOrder);
}

export const projectHref = (id: string): string => `/work/${id}/`;
export const roleHref = (id: string): string => `/experience/${id}/`;
export const pageHref = (entry: Pick<Project, 'id' | 'data'>): string =>
  entry.data.kind === 'role' ? roleHref(entry.id) : projectHref(entry.id);

/**
 * View-transition names shared with the home tiles (DESIGN M8):
 * tile media box <-> project hero media box, tile title <-> project <h1>.
 * The `media-` / `title-` prefix also keeps the ident valid if an id starts with a digit.
 */
export function vtNames(id: string): { media: string; title: string } {
  return { media: `media-${id}`, title: `title-${id}` };
}

/** Inline style that gives one element the shared name + class. */
export const vtStyle = (name: string, cls: 'project-media' | 'project-title'): string =>
  `view-transition-name: ${name}; view-transition-class: ${cls}`;

/* ---- Colour ---------------------------------------------------------------- */

/** Same rule as BaseLayout: only plain colour values may reach an inline style. */
export function safeColor(value?: string): string | undefined {
  return value && /^[#a-z0-9(),.%\s/-]+$/i.test(value.trim()) ? value.trim() : undefined;
}

/** `--accent` / `--accent-ink` for an element themed with ANOTHER project's colours (prev/next tiles). */
export function accentStyle(data: Pick<ProjectData, 'accent' | 'accentInk'>): string {
  return [
    safeColor(data.accent) && `--accent: ${safeColor(data.accent)}`,
    safeColor(data.accentInk) && `--accent-ink: ${safeColor(data.accentInk)}`,
  ]
    .filter(Boolean)
    .join('; ');
}

/* ---- Media ----------------------------------------------------------------- */

/**
 * Posters that are drawings, not captures, say so in their alt text
 * ("Illustration: …", "Diagram: …"). The hero shows that word as a chip so
 * nobody mistakes an illustration for a result (docs/MEDIA.md, glider).
 */
export function mediaKind(alt: string): string | null {
  const match = alt.match(/^\s*(illustration|diagram|render|mock-?up)\s*:/i);
  if (!match) return null;
  const word = match[1].toLowerCase();
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export interface Size {
  width: number;
  height: number;
}

const sizeCache = new Map<string, Size | null>();

/**
 * Intrinsic size of a JPEG or PNG under public/ (e.g. "/media/x/loop-poster.jpg").
 * Video posters are first frames with the clip's exact crop (docs/MEDIA.md §1.3),
 * so this gives the video's aspect ratio without shipping layout shift.
 * Returns null when the file is missing or not a JPEG/PNG.
 */
export function publicImageSize(publicPath?: string): Size | null {
  if (!publicPath || /^[a-z]+:\/\//i.test(publicPath)) return null;
  const cached = sizeCache.get(publicPath);
  if (cached !== undefined) return cached;

  let size: Size | null = null;
  try {
    const buffer = readFileSync(join(process.cwd(), 'public', publicPath.replace(/^\/+/, '')));
    size = pngSize(buffer) ?? jpegSize(buffer);
  } catch {
    size = null;
  }
  sizeCache.set(publicPath, size);
  return size;
}

function pngSize(b: Buffer): Size | null {
  // Signature 89 50 4E 47, then the IHDR chunk: width @16, height @20.
  if (b.length < 24 || b.readUInt32BE(0) !== 0x89504e47) return null;
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
}

function jpegSize(b: Buffer): Size | null {
  if (b.length < 4 || b[0] !== 0xff || b[1] !== 0xd8) return null;
  let i = 2;
  while (i + 9 < b.length) {
    if (b[i] !== 0xff) {
      i += 1;
      continue;
    }
    const marker = b[i + 1];
    // Fill bytes and stand-alone markers carry no length.
    if (marker === 0xff) {
      i += 1;
      continue;
    }
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd8)) {
      i += 2;
      continue;
    }
    // SOF0–SOF15 hold the frame size (C4 = DHT, C8 = JPG, CC = DAC are not frames).
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return { height: b.readUInt16BE(i + 5), width: b.readUInt16BE(i + 7) };
    }
    i += 2 + b.readUInt16BE(i + 2);
  }
  return null;
}

/**
 * A `mediaNeeded` label as visitors see it: a trailing production spec such as
 * " · 16:9" or " · landscape ≥1600px" is dropped (docs/MEDIA.md keeps it).
 */
export function publicLabel(label: string): string {
  return label.replace(/\s*·\s*(?:\d+:\d+|(?:landscape|portrait|square)?\s*≥\s*\d+\s*px)\s*$/i, '').trim();
}

/**
 * srcset widths for an optimised image: the candidates below the source width,
 * plus the source width itself (never upscaled, never above the largest candidate).
 */
export function widthsFor(width: number, candidates: number[] = [480, 800, 1200, 1600]): number[] {
  const max = candidates[candidates.length - 1];
  const list = candidates.filter((w) => w < width);
  if (width <= max) list.push(width);
  return list;
}

/** "16 / 9" style ratio + its numeric value, with a 16:9 fallback. */
export function ratioOf(size: Size | null | undefined): { css: string; n: number } {
  if (!size || !size.width || !size.height) return { css: '16 / 9', n: 16 / 9 };
  return { css: `${size.width} / ${size.height}`, n: Number((size.width / size.height).toFixed(4)) };
}

/* ---- Markdown body ----------------------------------------------------------- */

export type SectionKind = 'approach' | 'highlights' | 'notes' | 'other';

export interface BodySection {
  id: string;
  /** Inner HTML of the <h2> (trusted: comes from our own Markdown). */
  titleHtml: string;
  kind: SectionKind;
  /** Everything after the <h2> up to the next <h2>, lightly enhanced (see below). */
  html: string;
}

const pad2 = (n: number): string => String(n).padStart(2, '0');

function kindOf(title: string): SectionKind {
  const t = title.toLowerCase();
  if (/approach|method|how/.test(t)) return 'approach';
  if (/highlight|result|achiev/.test(t)) return 'highlights';
  if (/note|credit/.test(t)) return 'notes';
  return 'other';
}

/**
 * Small, explicit HTML touches so CSS can style the Markdown:
 * - every <ol> gets class "pj-steps" and `--steps: '05'` (the "01 / 05" telemetry counters);
 * - lists in a Highlights section get class "pj-highlights" (metric emphasis);
 * - a Highlights bullet whose bold lead-in is a complete phrase (it ends with
 *   . : ! or ?, e.g. "**29% slopes (≈16°).**") gets class "has-lead": CSS sets
 *   that lead-in as a serif metric on its own line. A lead-in that runs on
 *   into the sentence ("**75% accuracy** on …") stays inline, so the bullet
 *   still reads as one sentence.
 */
function enhance(html: string, kind: SectionKind): string {
  let out = html.replace(/<ol(\s[^>]*)?>([\s\S]*?)<\/ol>/g, (_m, attrs: string | undefined, inner: string) => {
    const count = (inner.match(/<li[\s>]/g) ?? []).length;
    return `<ol class="pj-steps" style="--steps: '${pad2(count)}'"${attrs ?? ''}>${inner}</ol>`;
  });
  if (kind === 'highlights') {
    out = out.replace(/<ul(\s[^>]*)?>/g, '<ul class="pj-highlights"$1>');
    out = out.replace(/<li>(\s*<strong>[^<]*?[.:!?]\s*<\/strong>)/g, '<li class="has-lead">$1');
  }
  return out;
}

/**
 * Split the rendered Markdown at each <h2>. Content before the first <h2>
 * (if any) is returned as `intro`. Returns no sections when the body has no
 * <h2>: the caller then renders the whole body as one block.
 */
export function splitSections(html: string): { intro: string; sections: BodySection[] } {
  const parts = html.split(/(?=<h2[\s>])/);
  let intro = '';
  const sections: BodySection[] = [];

  for (const part of parts) {
    const match = part.match(/^<h2([^>]*)>([\s\S]*?)<\/h2>/);
    if (!match) {
      intro += part;
      continue;
    }
    const [whole, attrs, inner] = match;
    const text = inner.replace(/<[^>]+>/g, '').trim();
    const id =
      attrs.match(/\sid="([^"]+)"/)?.[1] ??
      text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    const kind = kindOf(text);
    sections.push({ id, titleHtml: inner, kind, html: enhance(part.slice(whole.length), kind) });
  }
  return { intro: intro.trim(), sections };
}
