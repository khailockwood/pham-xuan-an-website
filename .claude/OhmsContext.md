# The Pham Xuan An Project — Full Project Context

A complete, standalone briefing for Claude Code. It consolidates all decisions,
findings, dead-ends, and current state so you can (1) continue finding a way to
embed the OHMS viewer and (2) keep building the website. A terser version of the
durable facts lives in `CLAUDE.md` (auto-loaded each session); the live OHMS
investigation state lives in `docs/OHMS_STATUS.md`. This file is the narrative
superset of both.

---

## 1. The project

A bilingual (English / Vietnamese) digital-humanities **oral history archive**
about **Pham Xuan An** (Phạm Xuân Ẩn, 1927–2006) — a Time magazine correspondent
in Saigon who was secretly a senior North Vietnamese intelligence officer (code
name **"Hai Trung"**). The whole site turns on that **duality**: the journalist
everyone in the press corps trusted vs. the intelligence officer none of them knew.
Two names, two lives — mirrored by the site's two languages.

**Owner/developer:** Khai Lockwood (Dartmouth student researcher, NetID `f006zfq`).
**Partners:** Dartmouth Digital History Initiative (DDHI); Vietnam Studies Center
at Fulbright University Vietnam; archival partner Texas Tech University's Vietnam
Center & Sam Johnson Vietnam Archive.
**DDHI coordinator / main contact:** Mara Gregory.
**Dartmouth RCD (server admin) contact:** Elijah Gagne ("EWG").

### Vetted biographical facts (safe to use as content)
- 1927–2006, born Bien Hoa.
- Journalist for **Reuters, the New York Herald Tribune, and Time** — the only
  Vietnamese staff correspondent on Time's masthead.
- Secretly an intelligence officer for North Vietnam from the early 1960s through
  the fall of Saigon (1975); rose to **Colonel** (later general), People's Army of Vietnam.
- Studied journalism at **Orange Coast College, California (1957–59)**.
- Kept songbirds; colleagues learned of his double life only after the war.

---

## 2. Stack, repo, and deployment

- **Stack:** Vite + React + TypeScript + Tailwind + shadcn/ui. Originally exported
  from Lovable, now a normal Git repo.
- **Package manager:** **npm only.** The `bun.lockb` was deliberately removed — do
  not reintroduce bun. Node 20+.
- **Repo:** GitHub `khailockwood/pham-xuan-an-website`.
- **Hosting:** **Vercel**, connected to the repo. **Every push to `main` auto-builds
  and deploys** (~30–90s). The site is **live** (green deployment) at its
  `.vercel.app` URL — publicly reachable by link but not yet on a custom domain and
  not discoverable/indexed.
- **Preview deploys:** pushing any non-`main` branch (or opening a PR) creates a
  separate preview URL without touching production — good for reviewing the redesign.
- **Failed builds** keep the last good version live; check the Deployments tab for red "Error".
- **Analytics/stats** (owner wanted pings/visits/time): enable **Vercel Web
  Analytics** in the dashboard (one toggle, no code). No custom backend needed.

Commands: `npm install` · `npm run dev` (localhost:8080) · `npm run build` ·
`npm run preview` · `npm run lint`.

**Deploy config committed (do not remove):** `vercel.json`, `netlify.toml`,
`public/_redirects` — these make client-side (React Router) routes resolve instead
of 404ing. A real `README.md` is also in place.

### Git auth learnings (already resolved, noted so they don't recur)
- GitHub HTTPS pushes need a **personal access token** (fine-grained, Contents:
  Read/write), not the account password.
- A large-push `HTTP 400 / RPC failed` was fixed with
  `git config http.postBuffer 524288000` (and, if needed, `git config --global http.version HTTP/1.1`).
  SSH remote is the fallback if HTTPS keeps failing.

---

## 3. Architecture (locked)

- The website is a **fully static React SPA**. **No backend, no database, no PHP in
  this repo.**
- Interviews are displayed through the **OHMS Viewer**, a separate **PHP** app that
  runs on a **Dartmouth server** and is embedded here via `<iframe>`. This repo
  never hosts the viewer — it only points an iframe at the viewer's public URL.
- Therefore the site can stay on any static host (Vercel). The OHMS piece is a
  separate hosting concern handled on Dartmouth infrastructure (see §5).

---

## 4. Design system (direction locked; implementation pending)

**Concept:** press/editorial DNA (he was a journalist — Time/Reuters wire era)
carrying a documentary "dossier" undertone (he was a spy). A dark, atmospheric,
archival **hero** that holds his two identities in tension; everything below it
quiet, disciplined, paper-toned. The EN/VI toggle is treated as thematically
meaningful. **Visual source of truth: `design/homepage-mockup.html`** (a complete
rendered mockup — read it directly when implementing).

**Palette** (map into shadcn HSL tokens in `src/index.css`):
`paper #ECE6D8` · `paper-2 #E3DBC9` · `ink #1B1A16` · `pine #00693E` ·
`pine-deep #06371F` · `gold #B0852B` · `gold-bright #C9A23F` (gold for dark backgrounds).

**Type** (all must support Vietnamese diacritics): **Newsreader** (display serif) ·
**IBM Plex Sans** (body; already loaded; robust Vietnamese) · **Cutive Mono**
(datelines, timestamps, labels). Update `index.html` to load Newsreader + Cutive Mono.

**Homepage structure** (from the mockup): sticky header w/ serif wordmark + nav +
EN/VI toggle → dark hero (mono dateline; huge serif name "Phạm Xuân Ẩn"; a two-row
"identity reveal" contrasting THE CORRESPONDENT vs. THE INTELLIGENCE OFFICER
"Hai Trung", the secret row marked in gold; italic serif thesis; gold CTA; duotone
portrait with gold corner marks) → paper intro band → dark **interview "register"**
(an editorial finding-aid list, NOT image cards: mono number, serif title, mono
meta, synopsis, "Listen & read") → exhibit cards → partner grid → deep-pine footer.

**Discipline:** spend the boldness on the hero; keep the rest restrained with lots
of whitespace and sparing gold. Semantic Tailwind tokens already in use across the
codebase: `font-display`, `bg-card`, `border-border`, `text-accent`, `text-foreground`.

---

## 5. OHMS embedding — the central open problem

### The distinction that matters most
"OHMS" is two separate things:
1. **OHMS / Aviary authoring tool** — where interviews are indexed and synced, then
   exported as an **XML file**. Private, editor-only.
2. **OHMS Viewer** — a separate **PHP web app** that reads one XML file and renders
   the public synchronized player at `https://<host>/viewer.php?cachefile=<file>.xml`.

**An XML file is not embeddable.** Only a running Viewer yields a URL an `<iframe>`
can use. The owner has the **XML** and says interviews are "already on OHMS," but
having XML ≠ having a viewer URL. Closing that gap is the task.

> **Settled (July 2026):** discussion with DDHI produced exactly one operative
> takeaway — an OHMS **XML file on its own is not enough**; it must be fed into a
> running **OHMS Viewer** to be embeddable. No ready-made viewer URL for the PXA
> interviews was provided, so a viewer still has to be stood up (or the interviews
> put into a hosted viewer like Aviary). The question is now purely *which* viewer.

### Embedding is proven end-to-end (website side is done)
Research + a working test confirmed the mechanics. The site's `OhmsViewer` iframe
successfully renders a real hosted OHMS Viewer — verified against the public
Kansas State sample `https://ohms-viewer.oralhistoriesatksu.org/viewer.php?cachefile=OHMS-Sample-001.xml`
(HTTP 200, no `X-Frame-Options`, only `Content-Security-Policy: upgrade-insecure-requests`).
An unlisted route **`/ohms-preview`** embeds that sample as a live demonstration.
So the only remaining work is producing a viewer URL for *our* three XML files.
See `docs/OHMS_STATUS.md` for the live state.

### What is confirmed
- **XML exports exist** in DartFS: `\\dartfs-hpc.dartmouth.edu\rc\lab\D\DDHI`,
  under `public_html\pham_xuan_an`. (Mac mount via Finder → Connect to Server:
  `smb://dartfs-hpc.dartmouth.edu/rc/lab/D/DDHI`, user `KIEWIT\f006zfq`, VPN if off-campus.)
- Owner has **SSH + root/sudo** on VM **`ddhi-web01-prd.dartmouth.edu`**, which runs
  **five live public sites**: `ddhi.dartmouth.edu`, `ddhi-repo.dartmouth.edu`,
  `ddhi-repo-stage.dartmouth.edu`, `dvp.dartmouth.edu`, and **`ohms-dvp.dartmouth.edu`**.
- **`ohms-dvp.dartmouth.edu`** is an existing, working OHMS Viewer on that same box —
  the reference implementation to copy conventions from.
- That VM was just upgraded **PHP 7.2 → 8.2.31** (InfoSec-driven). OHMS Viewer
  **`viewer_4.0`** requires **PHP 8.x** (confirmed via its README + `composer.json`
  pin `php >= 8.0`). Plausible (unconfirmed) that the PHP bump broke an older viewer
  and viewer_4.0 is the modern-PHP fix.
- Website is a static React SPA on **Vercel** (not Dartmouth infra; not Omeka, which
  is what `dvp.dartmouth.edu` runs).

### The three possible paths (lightest first — the website code is identical in all)
1. **A viewer already serves the PXA interviews** (e.g. Aviary, which hands out
   public links/embed codes directly, or an existing Dartmouth instance) → just
   collect URLs and embed. Almost no work.
2. **Reuse the existing `ohms-dvp` viewer** — drop the PXA XML into the directory it
   already reads and embed `ohms-dvp.dartmouth.edu/viewer.php?cachefile=...`. No new install.
3. **Fresh dedicated install** (e.g. `ohms-pxa.dartmouth.edu`) with viewer_4.0 —
   heaviest; needs RCD to provide a hostname + TLS cert + framing headers.

DDHI's initial framing leaned toward path 3 (a full new viewer install), but that
is the heaviest option and unconfirmed as necessary. Push toward the lightest
viable path rather than defaulting to a full install — research shows two much
lighter routes:
- **Aviary (aviaryplatform.com)** — a hosted SaaS that ingests OHMS XML and hands
  out ready-made public **iframe embed codes** (`…aviaryplatform.com/r/<id>?embed=true`),
  whose embed pages send `frame-ancestors … *` so they embed anywhere with zero
  server work. If DDHI/Dartmouth already has (or will open) an Aviary account and
  the three interviews go in, this is near-zero effort. **Check this first.**
- **Self-host `uklibraries/ohms-viewer` `viewer_4.0`** (PHP 8) — stateless, no DB,
  and **cross-origin-frameable out of the box** (it sets no `X-Frame-Options`). This
  is what path 2/3 below install; the existing `ohms-dvp` box already runs a viewer
  to copy conventions from.

### The decisive question (to resolve with DDHI / RCD)
> "Can you send me the browser link where one of these interviews already displays —
> a URL I can open and watch the transcript sync to the audio? If none exists, can
> the existing `ohms-dvp` viewer render our XML, or should a new dedicated viewer be
> stood up? And does Dartmouth/DDHI have an Aviary account we could load them into?"

A working `https://…` link → path 1, basically done. "It's in Aviary/OHMS, log in"
→ authoring tool only, not embeddable yet. "Here's the XML" → not embeddable yet.

### Also confirm during recon
- Are the XML exports **final/approved**, or drafts? How many interviews (3 now, or more coming)?
- **Media source:** OHMS XML points at the audio/video (Aviary, Kaltura, Brightcove,
  YouTube/Vimeo, SoundCloud, Dartmouth streaming, or direct files). Is it **public,
  permanent, and https**? A viewer with unreachable/http/expired media shows a
  transcript with no playable audio — the most common failure mode.
- Bilingual: do interviews have Vietnamese transcripts/indexes, or English only?
- Naming convention for XML files (the `cachefile` name becomes part of each URL).

### Production-server cautions (important)
- Root on `ddhi-web01-prd` can take down 5 live public sites. Before **any** change:
  ask RCD for a **VM snapshot**, and check whether `ohms-dvp` still works after the
  PHP upgrade (`curl -I https://ohms-dvp.dartmouth.edu/`) so a pre-existing break
  isn't attributed to you.
- If a fresh install is needed, two things only RCD can provide:
  (a) an **https hostname + cert** (browsers block an http iframe as mixed content);
  (b) a **`Content-Security-Policy: frame-ancestors <site-origin>`** header — without
  it (or with a default `X-Frame-Options: SAMEORIGIN`), the iframe renders **blank**.
- SSH requires VPN; if the connection hangs, the VPN-assigned IP may need a firewall
  adjustment — reply to the ITC ticket / contact Elijah.
- `ddhi-repo-stage.dartmouth.edu` may be a usable staging environment to test on.

### Install outline (only if path 3, after snapshot + RCD sign-off)
```bash
cd /var/www
sudo git clone -b viewer_4.0 https://github.com/uklibraries/ohms-viewer.git ohms-pxa
cd ohms-pxa
sudo cp config/config.template.ini config/config.ini
sudo nano config/config.ini          # set tmpDir + the XML/cachefile directory
sudo chmod -R 775 tmp
sudo chown -R www-data:www-data tmp  # match whatever user ohms-dvp uses
# place XML in the configured dir, then test:
# https://ohms-pxa.dartmouth.edu/viewer.php?cachefile=<interview>.xml
```
Clone `ohms-dvp`'s existing config/docroot/XML-path/ownership conventions rather
than inventing new ones — reconnaissance on the VM answers almost every config question.

---

## 6. Website side of OHMS — BUILT & WIRED, waiting only for URLs

All of this now exists in the repo (done July 2026):

- **`src/components/OhmsViewer.tsx`** — a responsive `<iframe>` embed that
  - takes an optional `url` and a `title` (for a11y),
  - renders a bilingual "coming soon" placeholder when `url` is undefined (so the
    site is complete now and each interview lights up when its URL arrives),
  - includes an "open in new tab" fallback for the framing/mixed-content gotchas,
  - carries the correct `allow`/`allowFullScreen`/`referrerPolicy` and lazy-loads,
  - documents both framing gotchas inline.
- **`interviews.ts`** — the `Interview` type has `ohmsUrl?: string`.
- **`InterviewDetail.tsx`** — renders `<OhmsViewer url={iv.ohmsUrl} title={t(iv.title)} />`
  as the primary experience, with the local `<audio>` + transcript kept below as a
  fallback (retire it once every interview has an OHMS URL).
- **`/ohms-preview`** (`src/pages/OhmsPreview.tsx`, unlisted route) — embeds the
  public KSU sample as a live, clearly-labelled proof that the pipeline works.
  Delete before public launch.

**To light up a real interview:** set its `ohmsUrl` in `interviews.ts` to the
hosted viewer URL. Nothing else to change.

---

## 7. Content & conventions

- **All user-facing copy is bilingual:** every string is `{ en, vi }` (type
  `Bilingual`), rendered via `t()` from `src/contexts/LanguageContext.tsx`. Never
  hardcode English; always `t({ en: "...", vi: "..." })`. Provide VI for new strings;
  if unsure of a translation, add it with `// TODO: verify VI`.
- **Content lives in `src/content/*`:** `site.ts` (UI strings/nav), `bio.ts`,
  `project.ts`, `exhibits.ts`, `interviews.ts`. Edit copy there, not inside components.
- Only use fonts with full **Vietnamese diacritic** support; always test the VI toggle visually.

### The three interviews (current `interviews.ts` — NOTE: placeholder data is inconsistent and needs reconciling with real records)
1. slug `robert-shaplen-recollection` — title "Interview with Pham Xuan An",
   interviewer Edward Miller, 2005-01-11, 01:28:47, original EN. *(Slug and transcript
   speaker "Shaplen" don't match the title/interviewee — Lovable placeholder mismatch.)*
2. slug `nguyen-thi-thu-an` — title "Interview with Germaine Swanson", interviewer
   Le Thi Hong Phuc, 2026-01-18, 01:58:41, original EN. *(Slug/transcript speaker
   also mismatched.)*
3. slug `nguyen-thi-ngoc-hai` — title "Interview with Nguyen Thi Ngoc Hai",
   interviewer Le Thi Hong Phuc, 2026-04-10, 48:02, original VI. `summary` is still
   the literal placeholder "1-sentence synopsis" / "Tóm tắt 1 câu".
- **Action:** reconcile slugs, titles, interviewees, transcripts, and summaries with
  the real interview records (and align each with its eventual `ohmsUrl`). Flag rather
  than invent final content.

---

## 8. Repo map

```
src/
  content/            bilingual copy (site.ts, bio.ts, project.ts, exhibits.ts, interviews.ts)
  contexts/LanguageContext.tsx   Lang, Bilingual, t()
  components/         Layout, nav, language toggle, OhmsViewer, shadcn/ui
  pages/              Index, Interviews, InterviewDetail, About, etc.
  assets/             images/logos (hero-portrait.jpg is the real portrait)
  index.css           shadcn HSL design tokens   ← update to new palette
tailwind.config.ts    fonts + colors             ← add Newsreader/Cutive Mono, new colors
index.html            Google Fonts <link>        ← add Newsreader + Cutive Mono
vercel.json · netlify.toml · public/_redirects   SPA routing (keep)
CLAUDE.md             auto-loaded durable context
docs/OHMS_STATUS.md   live OHMS state
design/homepage-mockup.html   design source of truth
```

---

## 9. Prioritized next actions

**OHMS track (unblocks the archive):**
1. Decide the viewer path with DDHI/RCD (decisive question above). Check the Aviary
   option first — it's the lightest; otherwise reuse `ohms-dvp` or install viewer_4.0.
2. Mount DartFS; inspect `public_html/pham_xuan_an` — are the XML final? what media
   do they reference, and is it public + https?
3. Obtain **one** working viewer URL (any path). The website side is already done:
   just paste the URL into interview #1's `ohmsUrl` in `interviews.ts` → it goes
   live (the `OhmsViewer` component + wiring already exist; see §6). Confirm framing
   headers allow the site's origin (viewer_4.0 needs none; Aviary needs none).
4. Repeat for the other interviews, then remove the `/ohms-preview` demo route.

**Website track (parallel, not blocked by OHMS):**
5. Implement the design system from `design/homepage-mockup.html`: update
   `index.css`, `tailwind.config.ts`, `index.html`, then rebuild `Index.tsx`, wiring
   all copy through `t({ en, vi })`; keep it responsive.
6. Roll the system across the other pages (Bio/"Who Was He?", The Project, Interviews
   register, Exhibits, Contact).
7. Reconcile the interview records with real data (§7). Replace placeholder copy.
8. Before public launch: attach a custom domain in Vercel, enable Vercel Web
   Analytics, confirm final production domain (affects citations + the iframe
   framing-header allowlist).
```