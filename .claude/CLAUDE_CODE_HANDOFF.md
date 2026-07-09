# Pham Xuan An Project — Build Handoff

Paste this into Claude Code to resume. It captures the full state of the project,
the locked-in decisions, and the design system we just established. A companion
file, `homepage-mockup.html`, is the visual source of truth for the new design —
read it directly; it is a complete, self-contained HTML render of the target
homepage.

---

## 1. What this is

A bilingual (English / Vietnamese) digital-humanities **oral history archive**
about **Pham Xuan An** (Phạm Xuân Ẩn, 1927–2006) — the Time magazine
correspondent who was secretly a North Vietnamese intelligence officer ("Hai
Trung"). Produced by the **Dartmouth Digital History Initiative (DDHI)** with the
**Vietnam Studies Center at Fulbright University Vietnam**; archival partner is
**Texas Tech University's Vietnam Center & Sam Johnson Vietnam Archive**.

The single organizing idea for the whole design is **his duality**: two names,
two lives, two loyalties — mirrored by the site's two languages.

## 2. Current status

- Repo: `khailockwood/pham-xuan-an-website` (GitHub). Vite + React + TS + Tailwind
  + shadcn/ui, originally exported from Lovable.
- **Live on Vercel** (deployment is green / public at its `.vercel.app` URL).
  Reachable by link but not discoverable; custom domain not yet attached.
- Deploy pipeline works end to end: every push to `main` auto-builds & deploys.
- Build verified clean (`npm run build`, ~1700 modules).

Already added to the repo for deployment:
- `vercel.json` (SPA rewrite), `netlify.toml`, `public/_redirects` (SPA redirect)
- Real `README.md`
- Removed `bun.lockb` so **npm is the single lockfile** (use `npm install`).

To turn on stats: enable **Vercel Web Analytics** in the dashboard (no code).

## 3. Architecture decisions (LOCKED — do not revisit)

- The site is a **fully static React SPA**. No backend, no server, no PHP.
- **OHMS interviews are already hosted externally.** We embed each one via
  `<iframe>` using its existing OHMS viewer URL. We do NOT host the OHMS PHP
  viewer ourselves. (OHMS viewer is a PHP app — incompatible with static hosts —
  which is why we embed rather than self-host.)
- Hosting: **Vercel** under the owner's own account.
- Bilingual content stays in the existing `{ en, vi }` pattern (see §6).

## 4. Design system — the new direction

Concept: **press / editorial DNA** (he was a journalist — Time, Reuters wire era)
carrying a **documentary "dossier" undertone** (he was an intelligence officer).
Dark, archival hero that holds both identities in tension; everything below it
quiet, disciplined, paper-toned. The EN/VI toggle is treated as thematically
meaningful, not just a utility.

**Palette (hex — convert into the existing shadcn HSL tokens in `index.css`):**
| token        | hex       | role                                    |
|--------------|-----------|-----------------------------------------|
| paper        | `#ECE6D8` | primary page background (archival)      |
| paper-2      | `#E3DBC9` | secondary bands / cards                 |
| ink          | `#1B1A16` | primary text; dark "register" section   |
| pine         | `#00693E` | Dartmouth green; institutional accent   |
| pine-deep    | `#06371F` | hero + footer dark surface              |
| gold         | `#B0852B` | accent / CTA / seals / datelines        |
| gold-bright  | `#C9A23F` | gold for use on dark backgrounds        |
| rule (light) | ink @ ~16% on paper; paper @ ~18% on dark |

**Type (all support Vietnamese diacritics — required):**
- Display serif: **Newsreader** (Google Fonts) — name, headlines; italic for thesis lines.
- Body / UI: **IBM Plex Sans** (already in project; robust Vietnamese) — keep.
- Mono / utility: **Cutive Mono** — datelines, timestamps, record numbers,
  uppercase letterspaced labels (the "filed dispatch / dossier" texture).
- IBM Plex Sans was chosen originally for Vietnamese support; preserve that.
- Update `index.html` to load Newsreader + Cutive Mono (IBM Plex Sans already loaded).

**Homepage structure (see `homepage-mockup.html` for exact spacing/sizes):**
1. Sticky header: serif wordmark "The **Phạm Xuân Ẩn** Project", nav, EN/VI toggle.
2. **Hero** (pine-deep, atmospheric): mono dateline rule across top; kicker "an
   oral history of the man who lived two lives"; huge serif name "Phạm Xuân Ẩn";
   "1927 — 2006"; a **two-row identity reveal** ("THE CORRESPONDENT —
   Reuters · NY Herald Tribune · Time" vs. "THE INTELLIGENCE OFFICER — 'Hai
   Trung,' Colonel, People's Army of Vietnam", the secret row marked in gold);
   italic serif thesis sentence; gold "Enter the archive →" button + a text link.
   Right column: **duotone portrait** of An (grayscale image + pine-deep
   `mix-blend-mode:color` overlay + multiply gradient), thin gold corner marks,
   mono caption.
3. Intro band (paper): eyebrow "The Project"; large serif lead; 2-col body about
   the DDHI × Fulbright collaboration; "About this project →".
4. **Interview register** (ink/dark): NOT image cards — an editorial **list/finding
   aid**. Each row: mono number, serif title, mono meta (date · duration ·
   language · interviewer; original language marked in gold), one-line synopsis,
   a "▸ Listen & read" action. Hairline rules between. "View all interviews →".
5. Exhibits & Research (paper): 2 feature cards (image + tag + serif title + blurb).
6. Partners (paper-2): 3-cell bordered grid — DDHI, Fulbright VSC, Texas Tech.
7. Footer (pine-deep): wordmark + blurb, Explore links, "Cite this archive"
   citation format, EN/VI note.

Design discipline: spend the boldness on the hero (two-identity reveal + duotone
portrait); keep everything else restrained, lots of whitespace, gold used
sparingly. Sharp/minimal corners suit the "document/file" feel.

## 5. Key content facts (vetted — safe to use)

- Pham Xuan An (Phạm Xuân Ẩn), 1927–2006, born Bien Hoa.
- Journalist for **Reuters, New York Herald Tribune, and Time** — the only
  Vietnamese staff correspondent on Time's masthead.
- Secret identity **"Hai Trung,"** intelligence officer for North Vietnam from the
  early 1960s through the fall of Saigon (1975); **Colonel, People's Army of
  Vietnam** (later general).
- Studied journalism at **Orange Coast College, California (1957–59)**.
- Colleagues learned of his double life only after the war.
- Some placeholder copy still exists in `interviews.ts` (e.g. a "1-sentence
  synopsis" stub) and a couple of `project.ts` VI fields don't match their EN —
  flag rather than invent; the team supplies final bilingual copy.

## 6. Repo structure & where things live

```
src/
  content/                 all copy, separated from components (edit here)
    site.ts                site name, nav labels, shared UI strings
    bio.ts                 "Who was Pham Xuan An?" + timeline
    project.ts             about DDHI / the project
    exhibits.ts            exhibit entries
    interviews.ts          interview records (metadata + OHMS embed info)
  contexts/LanguageContext.tsx   bilingual engine; content is { en, vi }; t() picks
  components/              Layout, nav, language toggle, shadcn/ui primitives
  pages/                   Index, Interviews, InterviewDetail, About, etc.
  assets/                  images + logos (hero-portrait.jpg is the real portrait)
  index.css                shadcn HSL design tokens  ← update to new palette
tailwind.config.ts         font + color mapping       ← update fonts/colors
index.html                 Google Fonts <link>        ← add Newsreader + Cutive Mono
```

Bilingual pattern — every string is an object, both languages required:
```ts
summary: { en: "…", vi: "…" }   // rendered via t(summary)
```

## 7. Immediate next task

**Port `homepage-mockup.html` into the React app as the new `src/pages/Index.tsx`,
wired to the existing bilingual content and `t()` helper.** Steps:
1. Update design tokens: `index.css` (palette → HSL tokens), `tailwind.config.ts`
   (Newsreader / IBM Plex Sans / Cutive Mono; new colors), `index.html` (fonts).
2. Rebuild `Index.tsx` to match the mockup, pulling text from `src/content/*` and
   wrapping all copy in `t({ en, vi })`. Provide VI for any new strings
   (translations get reviewed later — leave clear TODOs where unsure).
3. Build a small reusable **duotone portrait** treatment and mono "dateline/label"
   utilities so other pages can reuse them.
4. `npm run dev` to check; keep it responsive (mockup is desktop — add mobile
   stacking for hero grid, register rows, partner grid).

## 8. Roadmap after the homepage

- Roll the design system across the other pages (Bio/"Who Was He?", The Project,
  Interviews index, Exhibits, Contact) using the same tokens + components.
- **Interviews index** → render as the same editorial register.
- **InterviewDetail** → build the OHMS embed: a responsive `<iframe>` to each
  interview's hosted OHMS viewer URL, with bilingual framing/metadata around it.
  (Owner will supply the actual viewer URLs; wire `interviews.ts` to hold a
  `ohmsUrl` per record.)
- Replace placeholder copy with final bilingual content.
- Attach custom domain in Vercel; enable Vercel Web Analytics.

## 9. Gotchas

- npm only (bun lockfile removed). Node 20+.
- Client-side routing needs the SPA rewrite configs (already present) — don't remove.
- Vietnamese has stacked diacritics (ẩ, ữ, ọ…) — only use fonts with full
  Vietnamese subsets; always test the VI toggle visually.
- Keep gold legible: use `gold` (#B0852B) on paper, `gold-bright` (#C9A23F) on dark.
