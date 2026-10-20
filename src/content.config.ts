// Content contract for featured projects (one Markdown file per project in src/content/projects/).
// The Markdown BODY holds "Approach" and "Highlights" prose. Everything structured lives in frontmatter.
// See docs/CONTENT.md for the copy itself and docs/MEDIA.md for where each media file comes from.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(), // "Quadruped locomotion with CPGs + deep RL"
      shortTitle: z.string(), // short <title>/nav label, e.g. "Quadruped CPG + RL"
      shortWord: z.string(), // giant outlined word on tile + project title strip, e.g. "A1 QUADRUPED"
      order: z.number(), // position in the Selected-work grid (1 = first)
      year: z.string(), // "2025"
      context: z.string(), // "EPFL · Legged Robots course"
      team: z.string(), // "Team of 3" | "Solo". Never teammate names (user decision)
      myPart: z.string().optional(), // only when verified / provided by Alexandros
      oneLiner: z.string(), // always visible on the tile
      metric: z.string(), // telemetry chip, e.g. "29% INCLINE"
      tags: z.array(z.string()).min(2).max(5),
      accent: z.string(), // fill color (large shapes / display text only)
      accentInk: z.string(), // AA-contrast text color on paper
      cvMatch: z.boolean().default(false), // project appears on the CV
      links: z
        .object({
          code: z.url().optional(), // only PUBLIC repos owned by Alexandros, with no report PDFs / student IDs in them
        })
        .default({}),
      // No public link: the meta row says "Code: on request" (links to the contact block). Use it for
      // private repos, and for public repos that can't be linked yet (e.g. a report PDF still in them).
      privateRepo: z.boolean().default(false),

      // ---- media ----
      poster: image().optional(), // tile + page hero still (src/assets/projects/<slug>/poster.*)
      // Optional tile-only still for drawings whose labels are illegible at tile size
      // (a crop / label-free version of the poster). The page hero and OG image keep `poster`.
      tilePoster: image().optional(),
      posterAlt: z.string(),
      focus: z.string().default('50% 50%'), // object-position for the 4:3 crop
      video: z
        .object({
          mp4: z.string(), // public path, e.g. "/media/<slug>/loop.mp4"
          webm: z.string().optional(),
          poster: z.string().optional(), // public path to a still for <video poster>
        })
        .optional(),
      mediaNeeded: z.string().optional(), // label for a visible MediaPlaceholder when media is missing
      figures: z
        .array(
          z.object({
            src: image(),
            alt: z.string(),
            caption: z.string(),
            credit: z.string().optional(),
          }),
        )
        .default([]),
      extraVideos: z
        .array(
          z.object({
            mp4: z.string(),
            webm: z.string().optional(),
            poster: z.string().optional(),
            caption: z.string(),
            // true = never starts by itself (no hover / scroll autoplay): only the
            // play button starts it. For longer clips that tell a story.
            clickToPlay: z.boolean().default(false),
          }),
        )
        .default([]),

      // ---- project page ----
      lead: z.string(), // one sentence; wrap ONE phrase in *asterisks* for the serif italic
      tldr: z.object({
        problem: z.string(),
        built: z.string(),
        result: z.string(),
        stack: z.string(),
      }),
    }),
});

export const collections = { projects };
