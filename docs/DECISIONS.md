# Decisions log

Decisions taken with the user. Newest at the bottom. Don't re-ask these unless the user brings them up.

| Date | Decision | Notes |
|------|----------|-------|
| 2026-10-20 | Host on **GitHub Pages user site** `AlexandrosDellios.github.io` | Root URL https://alexandrosdellios.github.io. A custom domain can be added later via a `CNAME` file. |
| 2026-10-20 | **Private repos**: describe the projects and use their visuals, but **no repo links** | Applies to every private repo (the list is in the local research notes, `private/`). BioRob research stays high-level, with nothing unpublished. |
| 2026-10-20 | **Media**: the user will drop photos/videos in `assets/inbox/`. Until then the site uses **visible placeholders** that say what media is needed | See docs/MEDIA.md for the "needed from user" list. |
| 2026-10-20 | **CV PDF downloadable** from the site, and the site shows **alexandrosdellios@icloud.com** | CV copy: `public/CV-Alexandros-Dellios.pdf` (served at `/CV-Alexandros-Dellios.pdf`; `/cv/` redirects to it). |
| 2026-10-20 | ~~Tech stack: vanilla HTML/CSS/JS~~ **superseded below** | |
| 2026-10-20 | **Tech stack: Astro (static output) + GSAP/Lenis for motion**, deployed by **GitHub Actions** to GitHub Pages | The user asked whether Node is needed for "really nice sites". Explained that the visuals run in the browser either way. Recommended Astro for content collections (one Markdown file per project), per-project pages, automatic image optimization and view transitions. The user agreed. Node v26.12.0 installed via `brew install node` on 2026-10-20. |
| 2026-10-20 | Language: **English** | Default for internship applications. Not explicitly discussed. |
| 2026-10-20 | Design inspirations in order of preference: 1) cydstumpel.nl 2) bepatrickdavid.com 3) tamalsen.dev 4) adhamdannaway.com | The user wants a "very nice design but still simple enough to browse quickly". |
| 2026-10-20 | **Design direction: "Lab Poster"** (Cyd Stumpel–weighted: warm paper, actuator orange, giant name strip, per-project accents) | Chosen over "Night Gallery" (dark, Patrick David) and "Sim \| Real" (Adham/Tamal). Spec: docs/DESIGN.md. |
| 2026-10-20 | **Availability line:** "Available summer 2027 · ~6 months" | |
| 2026-10-20 | **Claims: use the CV wording as-is** | Research flagged a few CV claims not visible in the repos (8.9% footstep accuracy, rocket drag/wind, 1.5 m/s). Alexandros says all claims are correct and backed by his reports, so they're not needed. |
| 2026-10-20 | **Don't name people** (teammates, supervisors). Use "Team of N" | Also means no links to teammate-owned repos, whose URLs contain names (glider `perching-RL`, CoBAR fork). Open question: Marco Odermatt is named on the CV. |
| 2026-10-20 | Media approved: **portrait `Images/pic.JPG`** (rotate, crop, **cut out background**), **guide-dog photo `Images/dog.png`**, **Polymander sim videos** | |
| 2026-10-20 | **`Images/` is the media drop-zone** (the user created it). `assets/inbox/` was dropped | `Images/` is gitignored. Processed copies go to `src/assets/` (images) and `public/media/` (videos). |
| 2026-10-20 | **Folder layout:** `private/` (gitignored) holds research notes and raw media extracted from repos, including private ones. `docs/` is committed and must stay free of confidential info | The Pages repo must be public (GitHub Free). Never commit BioRob internals, SCIPER numbers or teammate names. |
| 2026-10-20 | **Purged the report PDFs (student IDs) from the git history** of the public Legged-Robot and MPC-Rocket repos (filter-branch + force-push, approved by Alexandros). Code links restored on both project pages | Backups: `private/backups/<repo>-before-cleanup-2026-10-20.bundle` (local only). GitHub may still serve the old SHAs until GitHub Support purges its cache (optional). |
| 2026-10-20 | **Publish now** to `AlexandrosDellios/AlexandrosDellios.github.io` (public), deployed by GitHub Actions | Approved by Alexandros. |
| 2026-10-20 | **Move the project to `~/Developer/Portfolio`** (out of iCloud-synced `~/Documents`) at the end of session 1 | Approved by Alexandros. Future sessions open the new path. |
| 2026-10-21 | **Custom domain: `alexandrosdellios.com`**, bought through Cloudflare Registrar, with DNS on Cloudflare (records "DNS only", not proxied) pointing to GitHub Pages | Purchase pending (the user buys it). Chosen over `.io` (pricier, uncertain TLD future). The `cf` CLI is installed and logged in for DNS work. |
| 2026-10-21 | **Domain live setup:** Cloudflare DNS (zone `alexandrosdellios.com`, all records DNS only): apex A ×4 (185.199.108–111.153) + AAAA ×4 (2606:50c0:8000–8003::153), `www` CNAME → `alexandrosdellios.github.io`. Pages custom domain set via `gh api`, HTTPS enforced once the certificate is issued | `site` / `site.url` / robots / OG cards switched to the new URL. The github.io URL redirects. |
| 2026-10-21 | **Stay on GitHub Pages** for hosting (Cloudflare only for DNS + analytics) | Pages covers everything a static portfolio needs. Cloudflare hosting would add caching, headers and previews, which visitors wouldn't notice. |
| 2026-10-21 | **Cloudflare Web Analytics** (cookieless beacon, production builds only) | Site created with `cf rum site-info create --host alexandrosdellios.com --no-auto-install` (DNS-only zone, so no auto-inject). Token in `site.cfAnalyticsToken`. Dashboard: Cloudflare → Analytics & Logs → Web Analytics. |
