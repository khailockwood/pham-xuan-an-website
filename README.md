# The Pham Xuan An Project

A bilingual (English / Vietnamese) digital humanities archive of oral history
interviews with and about Pham Xuan An, produced by the Dartmouth Digital
History Initiative (DDHI) in collaboration with the Vietnam Studies Center at
Fulbright University Vietnam.

This is the website's source code: a static single-page app built with Vite,
React, TypeScript, and Tailwind CSS. It deploys as plain static files to any
static host (Vercel, Netlify, Cloudflare Pages, GitHub Pages). Oral history
interviews are presented through the OHMS viewer, embedded per interview via
iframe.

## Prerequisites

- Node.js 20 or newer (https://nodejs.org)
- npm (ships with Node)

## Run it locally

```bash
npm install        # install dependencies (first time only)
npm run dev        # start the dev server
```

Then open the URL it prints (default http://localhost:8080). The page
hot-reloads as you edit.

## Other commands

```bash
npm run build      # production build into dist/
npm run preview    # serve the production build locally to check it
npm run lint       # run eslint
npm run test       # run the test suite once
```

## Deploying

The site is static, so deployment is "build, then serve the dist/ folder."
Config for the two easiest hosts is already included.

### Vercel
1. Push this repo to GitHub.
2. In Vercel, "Add New Project" and import the repo.
3. Framework preset: Vite. Build command `npm run build`, output dir `dist`.
   (`vercel.json` already handles client-side routing.)
4. Deploy. Every push to the main branch redeploys automatically.

### Netlify
1. Push this repo to GitHub.
2. In Netlify, "Add new site" -> "Import an existing project."
3. Build command `npm run build`, publish directory `dist`.
   (`netlify.toml` and `public/_redirects` already handle this.)
4. Deploy. Every push to the main branch redeploys automatically.

Both include a redirect rule so deep links like `/interviews` resolve to the
app instead of 404ing.

## Project structure

```
src/
  content/         All site copy, separated from components for easy editing.
    site.ts        Site name, nav, shared UI labels.
    bio.ts         "Who was Pham Xuan An?" content.
    project.ts     "The Project" / about DDHI content.
    exhibits.ts    Exhibit entries.
    interviews.ts  Interview records (metadata, summaries, OHMS embed info).
  contexts/
    LanguageContext.tsx   Bilingual engine. Content is { en, vi }; t() picks one.
  components/      Layout, nav, language toggle, and shadcn/ui primitives.
  pages/           One file per route (Index, Interviews, InterviewDetail, ...).
  assets/          Images and logos.
```

## Editing content

Almost all text lives in `src/content/*`. Each piece of copy is an object with
English and Vietnamese:

```ts
summary: {
  en: "Pham Xuan An discusses his life and career.",
  vi: "Phạm Xuân Ẩn thảo luận về cuộc đời và sự nghiệp của ông.",
}
```

Add both languages for every field. The language toggle in the header switches
the whole site between them.

## Interviews and the OHMS viewer

Each interview is rendered with the OHMS (Oral History Metadata Synchronizer)
viewer, embedded via iframe from its hosted viewer URL. Interview records live
in `src/content/interviews.ts`.

