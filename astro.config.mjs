// @ts-check
// Astro config for https://alexandrosdellios.github.io (GitHub Pages *user* site, so no `base`).
// Docs: https://docs.astro.build/en/reference/configuration-reference/
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const SITE = 'https://alexandrosdellios.github.io';

export default defineConfig({
  site: SITE,
  output: 'static',

  // Pages build to /path/index.html, which GitHub Pages serves for both /path and /path/.
  // 'ignore' keeps the dev server lenient about links written with or without the slash.
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },

  // Prefetch every same-origin link when it is hovered or focused, so project pages
  // (and their cross-document view transition) open instantly.
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },

  // Image service: Astro's default (sharp). Posters/figures go through <Image>/<Picture>.

  integrations: [
    sitemap({
      // /cv/ is only a redirect to the PDF; keep it out of the sitemap.
      filter: (page) => !/\/cv\/?$/.test(new URL(page).pathname),
    }),
  ],
});
