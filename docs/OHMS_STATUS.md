# OHMS — how the interviews are published

_Companion to `CLAUDE.md`, which carries the durable summary. This file holds the
detail: how the pipeline works, what was tried, and what is known about the data._

## Shipped: OHMS Viewer 4.0, baked to static HTML

The primary experience on every interview page is the **genuine OHMS Viewer 4.0**
(`uklibraries/ohms-viewer`, branch `viewer_4.0` — the modern PHP 8 line, upgraded
from `v3.10.16`), fed each interview's own XML. Media player, timestamped index,
keyword search, GPS map points, hyperlinks, footnotes: the full viewer.

**How it works** (`scripts/ohms/build-viewer.mjs`): the OHMS Viewer is a PHP app,
but it needs PHP only **once** — to turn an XML export into an HTML page. Every bit
of interactivity after that is client-side jQuery. So the build script runs the real
viewer locally (PHP 8, e.g. `brew install php`) against each
`public/ohms/interview*.xml` and writes the rendered pages to
`public/ohms-viewer/<id>.html` alongside a copy of the viewer's own CSS and JS.

The committed output is plain static files. **No PHP at runtime, no viewer to host,
no server anywhere.** `InterviewDetail` iframes the baked page through the existing
`OhmsViewer` component, deriving the path from the record's `ohmsXml`.

Rebuild whenever the XML changes:

```bash
npm run ohms:build     # needs PHP 8 + git
```

### The search shim

The viewer's only runtime server call is its keyword-search AJAX
(`viewer.php?action=index|search`). `scripts/ohms/search-shim.js` reproduces those
two endpoints in the browser from the already-rendered index and transcript,
returning the identical JSON shape — validated against the real baked DOM, including
accent-folding, synopsis-body matches, and timecodes. It is injected into every
baked page automatically.

## Three ways to display an interview

| Route | How | Status |
| --- | --- | --- |
| `ohmsXml: "/ohms/<file>.xml"` | Baked static viewer above | **Default.** All 11 interviews |
| `ohmsUrl: "https://…"` | A hosted OHMS viewer or Aviary embed | Supported; wins if both are set |
| `OhmsNativePlayer` | Parses the XML in-browser, renders in the site's own design | Fallback, kept and tested |

`OhmsNativePlayer` (`src/components/OhmsNativePlayer.tsx` + `src/lib/ohms.ts`) parses
an OHMS export with `DOMParser` and renders the synchronized experience directly:
player, timestamped index, transcript, Index/Transcript toggle, keyword search,
click-to-seek, and active-passage highlight with auto-scroll. It is styled to the
site's design system and bilingual — OHMS's own `_alt` / `transcript_alt` translation
fields are wired to the EN/VI toggle. Covered by `src/lib/ohms.test.ts` against three
real fixtures.

## The interviews

The 11 OHMS 6.0 exports (collection "Pham Xuan An", repository "Dartmouth DDHI") live
in `public/ohms/` and are wired to `src/content/interviews.ts` via `ohmsXml`. Verified:
index segments render, click-to-seek works, MP4 interviews render as `<video>`, and the
two Berman records — which have no published index — degrade gracefully to audio plus a
notice.

**Media is public.** Every `media_url` returns HTTP 206 with a correct content type and
requires no login or VPN.

### Known data caveats (in the exports, not the site)

- **Index-only.** No `<transcript>` and no `<sync>` in any export, so the player shows a
  browsable, searchable index rather than a transcript that follows the audio. If
  transcripts are added in OHMS, re-export and the player picks them up automatically.
- **`interview42211`** (Morrow part 4) is dated `2026-12-30` — a future date, out of
  sequence with parts 1–3 (Oct–Dec 2025). Probably should be `2025-12-30`.
- **`duration` is `00:00:00`** in interview36980 (Miller), 36981/36982 (McMorris), and
  42707 (Cloud). Those four durations in `interviews.ts` were instead read from the
  media files' own headers — MP3 frame/Xing headers and MP4 `mvhd` — a method verified
  against the Morrow records, where it reproduces the OHMS values exactly.
- **Swanson disagrees:** OHMS records `01:52:46`; the published media runs `01:58:41`.
  The OHMS value is kept pending a check of which cut is current.
- **McMorris parts 1–2** carry `2005?`, rendered as "2005 (date uncertain)".
- **Summaries are auto-derived** from indexed segment titles, and the Vietnamese copy is
  machine-drafted. Both need curation before launch.

## OHMS XML schema gotchas

Found while building the parser; documented inline in `src/lib/ohms.ts`.

- `<date>` carries its value in an **attribute**, not as text.
- `<point><time>` is **integer seconds**, and the first segment is not necessarily 0.
- `<sync>` is `"<interval-minutes>:|line(word)|…"` with **1-based** transcript line
  numbers. An empty `<sync>` means the transcript shows but will not follow the audio.
- For full sync, `<media_url>` must be an https direct media file.

## Embedding a hosted viewer, if one is ever used

A stock `uklibraries/ohms-viewer` install is cross-origin-frameable out of the box — it
sets no `X-Frame-Options`. Aviary embed URLs likewise return
`content-security-policy: frame-ancestors 'self' … *` with no `X-Frame-Options`, so they
frame from any origin with no configuration. Both were verified against live public
instances during development.

To publish through Aviary: upload the media, attach the interview's OHMS XML so Aviary
builds the synchronized index, set the resource's access to **public** (an embed
inherits the resource's access setting, so a restricted resource prompts for login
inside the iframe), then Share → Embed and paste the URL into that interview's
`ohmsUrl`. Useful params: `?t=<seconds>` to start at a time, `media_player=true` for the
player alone, `tabs=dit` to choose which Description/Index/Transcript tabs appear.

### Blank-iframe failure modes

- **http media or http viewer** on an https site → blocked as mixed content. The viewer
  and everything it references must be https.
- **`Repository` name mismatch** between a self-hosted viewer's `config.ini` and the
  `<repository>` value inside the XML → the viewer loads blank.
- **Media unreachable or expired** → the index shows but nothing plays.
- If a host injects `X-Frame-Options`, it must be replaced with
  `Content-Security-Policy: frame-ancestors` naming the site's origin.

## Reference

- Viewer software: https://github.com/uklibraries/ohms-viewer (branch `viewer_4.0`)
- Third-party-host install guide: https://www.oralhistoryonline.org/installing-the-ohms-viewer-on-a-third-party-webhost/
- Aviary sharing/embed docs: https://coda.aviaryplatform.com/sharing-content-from-aviary-74
