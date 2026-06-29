# The Pham Xuan An Project — Build Plan

A bilingual (English / Vietnamese) digital humanities site presenting an archive of oral history interviews with and about Pham Xuan An.

## Design direction

- **Palette (Navy Trust)** — institutional, academic feel
  - Deep navy `#0f1b3d` (primary surfaces, headers)
  - Mid navy `#1e3a5f` (secondary)
  - Steel blue `#3b6fa0` (accents, links)
  - Paper `#e8edf3` (background, body)
- **Typography** — `Libre Baskerville` for headings (editorial, archival authority) paired with `IBM Plex Sans` for body and UI. Vietnamese diacritics fully supported by both.
- **Tone** — restrained, archival, generous whitespace, subtle dividers, no flashy motion. Hover states and section transitions only.

## Site structure

Single-page app with these routes:

```text
/                  Home — hero, intro, featured interview, project blurb
/about-pxa         Who was Pham Xuan An? (biography, timeline, photos)
/about-project     About the project (mission, team, partners, methodology)
/exhibits          Exhibits index
/exhibits/:slug    Individual exhibit (long-form curated piece w/ media)
/interviews        Interviews index (filter by interviewee, date, language)
/interviews/:slug  Single interview — audio player + scrollable transcript
/contact           Contact form
```

A persistent header carries the project wordmark, nav, and the **EN / VI** toggle. Footer holds credits, partners, and copyright.

## Bilingual experience

- Single set of pages; header toggle swaps **all** UI labels and content text instantly.
- Language preference persisted in `localStorage`; defaults to English on first visit.
- All content (nav, page copy, interview metadata, transcripts, exhibit text) authored as `{ en, vi }` objects in typed content files under `src/content/`.
- A small `useLanguage()` hook + context provides current language and a `t(field)` helper.

## Sections in detail

**1. Home** — hero with portrait, project tagline, three feature cards linking to About PXA, Exhibits, Interviews. Short mission statement.

**2. Who was Pham Xuan An?** — biography prose, vertical timeline of key life events (1927 birth → 2006), gallery of historical photos, suggested reading.

**3. About the project** — mission, methodology of the oral-history work, team bios, institutional partners, how to cite, acknowledgements.

**4. Exhibits** — curated thematic pieces (e.g., "The Double Life", "Time Magazine Years"). Index shows cards with cover image, title, dek. Detail page is long-form with embedded images, pull-quotes, and links to relevant interviews.

**5. Interviews** — the heart of the archive.
- Index: searchable/filterable list (by interviewee name, year recorded, original language). Each card shows interviewee, date, duration, summary.
- Detail page: title + metadata block, embedded HTML5 audio player (play/pause, scrub, speed, download), and a synchronized scrollable transcript below. Transcript displayed in the currently selected site language; if the original recording language differs, a note indicates that. Toggle to view original-language transcript when available.

**6. Contact us** — name, email, subject, message. Validated with zod (trim, length limits, email format). On submit, shows a success toast. **Default: form submissions logged client-side and the email is composed via mailto** (no backend needed for the hardcoded-content phase). Easy to swap to email-via-Resend later.

## Content authoring

All content lives as typed TypeScript modules so you can edit and add interviews/exhibits without a CMS:

```text
src/content/
  site.ts           nav labels, footer, common UI strings (en/vi)
  bio.ts            PXA biography + timeline entries
  project.ts        About-the-project copy
  exhibits/
    index.ts        list of exhibits
    double-life.ts  individual exhibit content
  interviews/
    index.ts        list with metadata
    [slug].ts       per-interview: metadata, audio path, transcript segments
```

Audio files placed in `public/audio/`. Transcripts authored as arrays of `{ timestamp, speaker, text: { en, vi } }` segments so we can later add timestamp-click-to-seek.

Two sample interviews and one sample exhibit will be included as templates you can duplicate.

## Technical notes

- React Router routes added in `App.tsx` for the pages above.
- `LanguageProvider` context in `src/contexts/LanguageContext.tsx`; `useLanguage()` hook exposes `{ lang, setLang, t }`.
- Design tokens added to `src/index.css` (HSL values for the Navy Trust palette) and wired through `tailwind.config.ts` so components reference semantic tokens (`bg-background`, `text-primary`, `border-border`, etc.).
- Google Fonts (Libre Baskerville, IBM Plex Sans) loaded in `index.html` with Vietnamese subset.
- shadcn components reused: `button`, `card`, `input`, `textarea`, `select`, `badge`, `separator`, `toast`, `tabs` (for transcript language toggle).
- Audio player: native `<audio controls>` styled with a thin custom wrapper showing duration and download link.
- Contact form: `react-hook-form` + `zod` resolver, mailto fallback on submit.
- Fully responsive; mobile nav uses a `Sheet` drawer.

## Out of scope (for now, easy to add later)

- Admin dashboard / CMS — content is hardcoded as agreed.
- Backend storage of contact submissions or emailing via Resend — can be added with Lovable Cloud later.
- Full-text transcript search and timestamp-synced highlighting — structure supports it; UI to come in a later pass.
