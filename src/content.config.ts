// Content contract for the detail pages (one Markdown file per page in src/content/projects/).
// Two kinds share one schema and one page template (ProjectLayout):
//   kind "project"  /work/<id>/        tiles in Selected work (section "featured") or rows in More projects ("more")
//   kind "role"     /experience/<id>/  the Now cards and Experience rows (BioRob, AI Team, Mediacom)
// For roles: `year` holds the dates ("Feb 2026 – now"), `context` the organisation and `myPart` the role title.
// The Markdown BODY holds "Approach" and "Highlights" prose. Everything structured lives in frontmatter.
// See docs/CONTENT.md for the copy itself and docs/MEDIA.md for where each media file comes from.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { SKETCHES } from './components/global/sketches';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      kind: z.enum(['project', 'role']).default('project'),
      // Projects only: a tile in Selected work, or a row in More projects.
      section: z.enum(['featured', 'more']).default('featured'),
      title: z.string(), // "Quadruped locomotion with CPGs + deep RL"
      shortTitle: z.string(), // short <title>/nav label, e.g. "Quadruped CPG + RL"
      shortWord: z.string(), // giant outlined word on tile + project title strip, e.g. "A1 QUADRUPED"
      order: z.number(), // position within its kind / section (1 = first)
      year: z.string(), // "2025" (roles: "Feb 2026 – now")
      context: z.string(), // "EPFL · Legged Robots course" (roles: the organisation)
      team: z.string(), // "Team of 3" | "Solo". Never teammate names (user decision)
      myPart: z.string().optional(), // only when verified / provided by Alexandros (roles: the role title)
      oneLiner: z.string(), // always visible on the tile
      metric: z.string(), // telemetry chip, e.g. "29% INCLINE"
      tags: z.array(z.string()).min(2).max(5),
      accent: z.string(), // fill color (large shapes / display text only)
      accentInk: z.string(), // AA-contrast text color on paper
      cvMatch: z.boolean().default(false), // project appears on the CV
      links: z
        .object({
          code: z.url().optional(), // only PUBLIC repos owned by Alexandros, with no report PDFs / student IDs in them
          website: z.url().optional(), // a public project / team website
          websiteLabel: z.string().optional(), // its pill label, e.g. "Project docs" (default "Website")
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
      // Optional image for the TOP of the page only (ProjectHero), e.g. a studio shot; the tile,
      // previews, prev/next and social card keep `poster`. Overrides `video` in the hero.
      hero: image().optional(),
      heroAlt: z.string().optional(), // its alt text (default: posterAlt)
      heroCredit: z.string().optional(), // a credit line under the hero, e.g. "Photo: ECAL photographers"
      focus: z.string().default('50% 50%'), // object-position for the 4:3 crop
      video: z
        .object({
          mp4: z.string(), // public path, e.g. "/media/<slug>/loop.mp4"
          webm: z.string().optional(),
          poster: z.string().optional(), // public path to a still for <video poster>
        })
        .optional(),
      mediaNeeded: z.string().optional(), // label for a visible MediaPlaceholder when media is missing
      sketch: z.enum(SKETCHES).optional(), // drawing on this page's placeholders (default: picked from the label)
      // Media still to come, shown as "Coming soon" cards in the gallery (labels only, no specs).
      soon: z.array(z.string()).default([]),
      // Development story in stages, oldest first (ProcessTimeline.astro): each stage has a date
      // label, a serif title with ONE *italic* phrase, an optional line of text, and its photos
      // (or clips) in order. Rendered as the "Development cycle" section before the gallery.
      timeline: z
        .array(
          z.object({
            when: z.string(), // "Nov 2024"
            title: z.string(), // "The *prototypes*"
            text: z.string().optional(),
            media: z
              .array(
                z.union([
                  z.object({ src: image(), alt: z.string(), caption: z.string(), credit: z.string().optional() }),
                  z.object({
                    mp4: z.string(), // public path
                    webm: z.string().optional(),
                    poster: z.string().optional(), // public path to the first frame
                    alt: z.string(),
                    caption: z.string(),
                    credit: z.string().optional(),
                  }),
                ]),
              )
              .default([]),
          }),
        )
        .default([]),
      figures: z
        .array(
          z.object({
            src: image(),
            alt: z.string(),
            caption: z.string(),
            credit: z.string().optional(),
            photo: z.boolean().default(false), // a photo, not a plot: shown as is (plots are multiplied onto the paper)
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
      // Roles read the four lines as Mission / My role / Status / Tools.
      tldr: z.object({
        problem: z.string(),
        built: z.string(),
        result: z.string(),
        stack: z.string().optional(),
      }),
    }),
});

export const collections = { projects };
