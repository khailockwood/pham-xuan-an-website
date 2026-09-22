# The Pham Xuan An Project

A bilingual (English / Vietnamese) digital-humanities **oral history archive** about
**Phạm Xuân Ẩn** (1927–2006) — the Saigon correspondent for Reuters, the New York
Herald Tribune, and Time who was, at the same time, an intelligence officer for
North Vietnam under the name **Hai Trung**. His colleagues in the press corps
learned of it only after the war.

Produced by the **Dartmouth Digital History Initiative (DDHI)** with the **Vietnam
Studies Center at Fulbright University Vietnam**; archival partner is **Texas Tech
University's Vietnam Center & Sam Johnson Vietnam Archive**.

> This is a public repository. Keep internal infrastructure, hostnames, account
> identifiers, and individual staff names out of it — those belong in private notes.

---

## Commands

```bash
npm install        # npm only — do not reintroduce bun or a second lockfile
npm run dev        # http://localhost:8080
npm run build      # static output in dist/
npm run preview    # serve the production build
npm run lint
npm test           # vitest, single run
npm run ohms:build # re-bake the OHMS viewer pages (needs PHP 8 + git)
```

Node 20+.

**Verification gates before calling work done:** `npm run build` and `npm test`.
`npm run lint` currently reports 4 pre-existing errors in `src/components/ui/*` and
`tailwind.config.ts` — don't treat those as regressions, but don't add to them.

---

## Architecture

A **fully static React SPA** — Vite + React + TypeScript + Tailwind + shadcn/ui.
No backend, no database, no server-side code at runtime. It deploys as plain files
to any static host; SPA routing configs (`vercel.json`, `netlify.toml`,
`public/_redirects`) are committed and must stay, or deep links 404.

---

## Content conventions

**Every user-facing string is bilingual.** The type is `Bilingual = { en, vi }`
(`src/contexts/LanguageContext.tsx`), rendered through `t()`:

```ts
t({ en: "Listen to the interviews", vi: "Nghe các cuộc phỏng vấn" })
```

Never hardcode English. If a Vietnamese translation is uncertain, still supply one
and mark it `// TODO: verify VI` — several already carry that marker.

Copy lives in `src/content/*`, not inside components: `site.ts` (nav, shared UI
strings), `bio.ts` (biography + timeline), `project.ts` (mission, citation),
`exhibits.ts`, `interviews.ts`. Edit copy there.

Vietnamese stacks diacritics (ẩ, ữ, ọ). **Only use fonts with a full Vietnamese
subset**, and check the VI toggle visually after any type change. This is why the
mono face is IBM Plex Mono rather than Cutive Mono — Cutive ships no `vietnamese`
subset and fell back mid-word, including inside "Phạm Xuân Ẩn" itself.

---

## Design system

Tokens live in `src/index.css` (HSL custom properties) and are mapped to Tailwind
utilities in `tailwind.config.ts`. `design-system/` holds standalone preview pages
and mirrors the same tokens.

**Palette** — archival paper, Dartmouth pine, gold accent:

| token         | hex       | role                                        |
|---------------|-----------|---------------------------------------------|
| `paper`       | `#ECE6D8` | page ground (dominant)                      |
| `paper-2`     | `#E3DBC9` | recessed bands                              |
| `ink`         | `#1B1A16` | primary text — 13.9:1 on paper              |
| `ink-soft`    |           | secondary prose — 10.7:1                    |
| `ink-muted`   |           | metadata, captions — 6.0:1                  |
| `pine`        | `#00693E` | institutional accent, links                 |
| `pine-deep`   | `#06371F` | masthead, hero, footer                      |
| `gold`        | `#B0852B` | accent on paper                             |
| `gold-bright` | `#C9A23F` | gold on dark grounds                        |

The page is **beige-dominant**. Green is spent on deliberate bands — the masthead
flowing into the hero, and the footer — not scattered through the body. Gold is
sparing and always means something.

**Contrast rules that are load-bearing — do not "simplify" these away:**
- `ink-muted` is a solid third rank precisely because alpha-fading `ink-soft` to
  `/45…/65` landed between 2.4:1 and 4.0:1 and failed AA.
- `border-border` is a 1.39:1 hairline for separating records in a register. A real
  control boundary (input, button, filter chip) needs `border-strong` (3.6:1) per
  WCAG 1.4.11.
- The focus ring is two layers on purpose: no single palette colour clears 3:1
  against both paper and pine-deep, so an ink outline carries light grounds, a gold
  halo carries dark ones, and the outline inverts inside `.on-dark`.

**Type** — `Newsreader` (display serif), `IBM Plex Sans` (body/UI), `IBM Plex Mono`
(machine values only). Named ranks in `tailwind.config.ts`: `micro` `label` `body`
`lead` `sub` `head` `title` `masthead`. Names are roles, not sizes.

Utility classes in `index.css`:
- `.mono-label` — **machine-typed values only**: timecodes, record identifiers.
  It is not the metadata voice; tracked-out mono is the wrong register for anything
  a person reads as prose.
- `.meta-label` — the metadata voice: sentence-case sans at 14px.
- `.prose-measure` — running prose under ~68ch (72ch for the serif).
- `.duotone` — archival duotone photo treatment (see `DuotonePortrait`).

**Spacing ranks:** `gutter` (28px), `stack` (44px, heading → content),
`section` / `section-lg` (80 / 88px vertical section rhythm).

### House style — things that read as templated

The homepage was reworked to get away from generic-template chrome. Keep new work
clear of: tracked-out all-caps eyebrow labels above headings; facts joined into one
string with middle dots (`A · B · C`) instead of separate elements; `WORD — fragment`
constructions with a spaced em dash; monospace used for human-readable labels;
gradient washes as decoration; identical cards in a uniform grid; `hover:scale-*` on
everything; and page-load animations. Headings should state a fact, not an aphorism.

Lists of records are built as **registers** (a finding aid: hairline-ruled rows,
the whole row a link) rather than card grids. The homepage uses that one structure
for both interviews and exhibits.

---

## OHMS — how interviews are displayed

Interviews are published through the **real OHMS Viewer 4.0**
(`uklibraries/ohms-viewer`, branch `viewer_4.0`), **baked to static HTML at build
time**. This is the non-obvious part of the repo:

The OHMS Viewer is a PHP app, but it only needs PHP **once** — to turn an XML export
into an HTML page. Everything after that is client-side jQuery. So
`scripts/ohms/build-viewer.mjs` runs the real viewer locally against each
`public/ohms/interview*.xml` and writes rendered pages to
`public/ohms-viewer/<id>.html` with a copy of the viewer's CSS/JS. **The committed
output is plain static files — no PHP at runtime, no viewer to host anywhere.**

`InterviewDetail` iframes the baked page via `OhmsViewer` (path derived from the
record's `ohmsXml`). Re-run `npm run ohms:build` whenever the XML changes.

The viewer's one runtime server call is its keyword-search AJAX
(`viewer.php?action=index|search`). `scripts/ohms/search-shim.js` reproduces those
two endpoints in the browser from the already-rendered DOM, returning the identical
JSON shape, and is injected into every baked page automatically.

**Two ways to display an interview**, one line each in `interviews.ts`:
1. `ohmsXml: "/ohms/<file>.xml"` — the baked static viewer above. Default.
2. `ohmsUrl: "https://…"` — a hosted viewer or Aviary embed. Wins if both are set.

A third path, `OhmsNativePlayer` (`src/components/OhmsNativePlayer.tsx` +
`src/lib/ohms.ts`), parses OHMS XML in the browser with `DOMParser` and renders the
synchronized experience in the site's own design. It is kept as a fallback and is
covered by unit tests in `src/lib/ohms.test.ts`.

### OHMS XML schema gotchas (documented in `src/lib/ohms.ts`)
- `<date>` carries its value in an **attribute**, not as text.
- `<point><time>` is **integer seconds**, and the first segment is not necessarily 0.
- `<sync>` is `"<interval-minutes>:|line(word)|…"` with **1-based** line numbers. An
  empty `<sync>` means the transcript shows but won't follow the audio.
- Full sync needs `<media_url>` to be an https direct media file.

### Known data caveats (in the exports, not the site)
- **Index-only.** No `<transcript>` and no `<sync>` in any current export, so the
  player shows a browsable, searchable index rather than a transcript that follows
  the audio. Re-export if transcripts are added; the player picks them up.
- `interview42211` (Morrow part 4) is dated `2026-12-30` — a future date, out of
  sequence with parts 1–3 (Oct–Dec 2025). Probably should be `2025-12-30`.
- `duration` is `00:00:00` in interview36980, 36981, 36982 and 42707. Those four
  durations in `interviews.ts` were read from the media files' own headers instead
  (MP3 frame/Xing headers, MP4 `mvhd`) — a method verified against the Morrow
  records, where it reproduces the OHMS values exactly. Swanson is the one
  disagreement: OHMS says `01:52:46`, the media runs `01:58:41`; OHMS's value is
  kept pending a check of which cut is current.
- McMorris parts 1–2 carry `2005?`, rendered as "2005 (date uncertain)".
- Summaries are auto-derived from indexed segment titles and the Vietnamese copy is
  machine-drafted. **Both need curation before launch.**
- `exhibits.ts` still holds "Coming soon" titles. The homepage marks both exhibits
  "In preparation" rather than presenting them as published — keep that honest if
  you touch the section.

### Blank-iframe failure modes
- **http media or http viewer** on an https site → blocked as mixed content.
- **Media unreachable or expired** → index shows, nothing plays.
- If a host ever injects `X-Frame-Options`, framing needs
  `Content-Security-Policy: frame-ancestors` naming the site origin instead.

Live OHMS state and history: `docs/OHMS_STATUS.md`.

---

## Repo map

```
src/
  content/        bilingual copy — site.ts, bio.ts, project.ts, exhibits.ts, interviews.ts
  contexts/       LanguageContext.tsx — Lang, Bilingual, t()
  components/     Layout, LanguageToggle, Eyebrow, DuotonePortrait,
                  OhmsViewer (iframe), OhmsNativePlayer, ui/ (shadcn)
  pages/          Index, AboutPxa, AboutProject, Interviews, InterviewDetail,
                  Exhibits, ExhibitDetail, Contact, NotFound
  lib/ohms.ts     OHMS XML parser (+ ohms.test.ts)
  index.css       design tokens + utility classes
  assets/         pxa-hero.webp is the hero portrait; partner logos
public/
  ohms/           OHMS XML exports (source of truth for interviews)
  ohms-viewer/    baked static viewer pages — generated, committed
scripts/ohms/     build-viewer.mjs, search-shim.js, embed.css
design-system/    standalone component/token preview pages
docs/OHMS_STATUS.md
```

---

## Working agreements

- **Git is the repo owner's job.** Do not run `git add`, `git commit`, `git reset`,
  or create branches. Leave work as unstaged changes and report the file list.
- For visual or UI work, use the `frontend-design` skill.
- `design-system/` is synced with a claude.ai Design System project. Sync one
  component at a time rather than replacing wholesale.
