# Portfolio: Alexandros Dellios

Personal portfolio website for Alexandros Dellios (Robotics M.Sc. student at EPFL), used for internship and lab applications.
Live at **https://alexandrosdellios.com**: GitHub Pages (repo `AlexandrosDellios/AlexandrosDellios.github.io`) on a custom domain whose DNS is on Cloudflare (DNS only, not proxied; managed with the `cf` CLI). Visitor stats: Cloudflare Web Analytics (cookieless beacon in BaseLayout, production builds only).

## Start here (future conversations)

1. Read [docs/PROGRESS.md](docs/PROGRESS.md) for the current status, what was done, and what's next.
2. Read [docs/DECISIONS.md](docs/DECISIONS.md) for decisions already taken with the user. Don't re-ask these.
3. Read [docs/CONTENT.md](docs/CONTENT.md), the source of truth for all text on the site (projects, experience, skills).
4. Read [docs/DESIGN.md](docs/DESIGN.md) for the design system (tokens, fonts, motion spec). Its "Amendments" block at the top overrides the rest and lists what was built differently.
5. Read [docs/MEDIA.md](docs/MEDIA.md) for the media inventory and the list of photos/videos the user still has to provide.
6. Open questions for Alexandros live in [docs/QUESTIONS.md](docs/QUESTIONS.md). It is **gitignored** (local only): it discusses specific repos and courses, which must not reach the public repo.

## Ground rules

- **Stack: Astro 7 (static output)**, GSAP + Lenis for motion, Fontsource fonts. Node v26 via Homebrew. Commands are in README.md: `npm run dev` / `build` / `preview` / `check` (`astro check`, keep it at 0 errors). Deployment: `.github/workflows/deploy.yml` builds and publishes to GitHub Pages on push to `main`.
- **Where things live:** page copy in `src/content/projects/<slug>.md` (schema: `src/content.config.ts`): `kind: project` pages at `/work/<slug>/` (`section: featured` = Selected-work tile, `more` = More-projects row) and `kind: role` pages at `/experience/<slug>/` (BioRob, AI Team, Mediacom). All other copy is in `src/data/site.ts`. Keep docs/CONTENT.md in sync with both.
- The **CV is the source of truth** for claims and numbers. The published copy is `public/CV-Alexandros-Dellios.pdf` (`/cv/` redirects to it).
- **Private repos** (listed in the local `private/research/`) can be described and their visuals used, but **never link to them**. BioRob research stays high-level, with nothing unpublished. **No people's names** (say "Team of 3"; the few exceptions Alexandros approved are in docs/DECISIONS.md), no teammate-owned repo links unless Alexandros approves one (DECISIONS), no SCIPER numbers or report PDFs, and no links to repos that still contain them (`links.code` only for a clean public repo; otherwise `privateRepo: true` → "Code: on request").
- **Committed docs hold rules, never findings about specific repos or courses** (those go in `private/` or the gitignored docs/QUESTIONS.md). The repo is public.
- **Media workflow:** the user drops raw media into `Images/` (gitignored, never modify the originals). Process copies into `src/assets/` (images, optimised by Astro) or `public/media/<slug>/` (videos: mp4 + webm + poster), and log them in docs/MEDIA.md (recipes in §2, workflow in §4). Missing media shows as a visible `mediaNeeded` placeholder.
- `private/` holds research notes and raw media from private repos: gitignored, read-only, never published.
- The user likes to be asked when something is unclear. Ask rather than guess on content.
- Always update `docs/PROGRESS.md` at the end of a work session.

## Code gotchas

- **Astro 7 drops whitespace that contains a newline** between text and an inline element (`write\n<a>x</a>` renders "write<a>"). Keep inline runs on one line or add `{' '}`.
- Content must render without JS. Animated elements may only start hidden behind `html.js` (set inline in `<head>`), and motion is off under `prefers-reduced-motion`.
- GSAP folds CSS `translate` / `rotate` / `scale` into its own transform on the first tween: never tween an element that also runs a CSS animation on those properties (see the note in NameStrip.astro).
- Shared client helpers are in `src/scripts/core/motion.ts` (`onReady`, `scrollToTarget`, `setHeaderLine`, `setFocusClearance`…); component APIs are documented in each component's header comment.
- **The repo lives in `~/Developer/Portfolio`.** It was moved there on 2026-10-20, out of `~/Documents`. **Keep it out of iCloud Drive** (`~/Documents` is synced on this Mac): iCloud writes conflict copies ("index 2.html") and restores deleted files. `npm run build` refuses to run while a copy exists in `src/` or `public/` (`scripts/check-icloud-copies.mjs`), and `.gitignore` excludes them.
- Media scripts: `scripts/media/render_svg.py` (SVG poster → PNG with the site fonts), `scripts/media/make_icons.mjs` (favicon.ico + apple-touch-icon), `scripts/og/make_og_images.py` (social cards, `default` included).
