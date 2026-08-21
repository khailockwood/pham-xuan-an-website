# OHMS embedding — live status

_Last updated: August 2026._ Narrative background lives in `.claude/OhmsContext.md`;
this file is the fast-moving state.

## ✅ SHIPPED — the REAL OHMS Viewer 4.0, baked static from our XML

The primary experience on every interview page is now the **genuine OHMS Viewer
4.0** (uklibraries/ohms-viewer, branch `viewer_4.0`, the modern PHP 8 line —
upgraded Aug 2026 from `v3.10.16`), fed each interview's own XML.
The full viewer — media player, timestamped index, transcript, GPS map points,
hyperlinks, footnotes, keyword search — everything you'd see on Aviary.

How it works (see `scripts/ohms/build-viewer.mjs`): the OHMS Viewer is a PHP app,
but it only needs PHP **once**, to turn an XML export into an HTML page; all the
interactivity after that is client-side jQuery. So the build script runs the real
viewer locally (via `brew install php`) against each `public/ohms/interview*.xml`
and writes the rendered pages to `public/ohms-viewer/<id>.html`, alongside a copy
of the viewer's own CSS/JS. The committed output ships as plain static files —
**no PHP at runtime, nothing to host**. `InterviewDetail` iframes the baked page
via the existing `OhmsViewer` component (path derived from `ohmsXml`).

Rebuild whenever the XML changes: `npm run ohms:build` (needs PHP 8 + git).

The viewer's only runtime server call is its keyword-search AJAX
(`viewer.php?action=index|search`). `scripts/ohms/search-shim.js` reproduces those
two endpoints in the browser from the already-rendered index/transcript, returning
the identical JSON shape — validated against the real baked DOM (accent-folding,
synopsis-body matches, timecodes). Injected into every baked page automatically.

## Prior state (superseded, kept as fallback code paths)

| Piece | State |
| --- | --- |
| Website embed component (`OhmsViewer`) | ✅ Built — now iframes the baked viewer |
| Baked real-viewer pages for all 11 interviews | ✅ Shipped — `public/ohms-viewer/` |
| Native in-browser player (`OhmsNativePlayer`) | ✅ Kept as fallback (used by `InterviewDetail`) |
| Aviary embeds frame from any origin | ✅ Verified (`frame-ancestors … *`, no XFO) |

## ✅ SHIPPED — the interviews are live

The 11 OHMS 6.0 exports (collection "Pham Xuan An", repository "Dartmouth DDHI")
are in `public/ohms/` and wired to `src/content/interviews.ts` via `ohmsXml`. Each
interview page renders the native player against its own XML. Verified: index
segments render, click-to-seek works, MP4 interviews render as `<video>`, and the
two Berman records (no index published) degrade gracefully to audio + a notice.

**Media is public** — every `media_url` on `rcweb.dartmouth.edu` returns HTTP 206
with a correct content type and requires no Dartmouth login or VPN.

### Known data caveats (in the exports, not the site)
- **Index-only.** No `<transcript>` and no `<sync>` in any export, so the player
  shows a browsable/searchable index, not a transcript that follows the audio. If
  transcripts get added in OHMS, re-export and the player picks them up automatically.
- **`interview42211`** (Morrow part 4) has date `2026-12-30` — a future date, and
  out of sequence with parts 1–3 (Oct–Dec 2025). Probably should be `2025-12-30`.
- **`duration` is `00:00:00`** in interview36980 (Miller), 36981/36982 (McMorris),
  and 42707 (Cloud); the site shows "—" for these.
- **McMorris parts 1–2** carry `2005?` — rendered as "2005 (date uncertain)".
- **Summaries are auto-derived** from indexed segment titles and the Vietnamese
  copy is machine-drafted. Both need curation before launch.

---

**Two independent ways to display an interview:**

1. **Hosted embed** — set `ohmsUrl` to an Aviary (or `viewer.php`) URL.
2. **XML only** — drop the OHMS XML in `public/ohms/` and set `ohmsXml`. No viewer
   software, no hosting, no server anywhere.

`ohmsUrl` wins if both are set. Either way it is a one-line change per interview.

## What was proven

`OhmsViewer` was tested against a public, live OHMS Viewer and rendered the full
synchronized player (audio + timestamped index + transcript) inside our site chrome:

```
https://ohms-viewer.oralhistoriesatksu.org/viewer.php?cachefile=OHMS-Sample-001.xml
```

That host returns HTTP 200 with **no `X-Frame-Options`** and only
`Content-Security-Policy: upgrade-insecure-requests` — i.e. a stock
`uklibraries/ohms-viewer` install is cross-origin-embeddable out of the box. The
`/ohms-preview` route embedded this sample as a labelled demonstration; that route
was removed before launch (it was **not** PXA content, and it put visitor traffic
on another institution's server).

## ✅ DECIDED: Aviary (the project has an account)

**The project has an Aviary account**, which makes this the plan. No PHP viewer, no
Dartmouth server, no RCD ticket, no framing headers to negotiate — Aviary ingests
OHMS XML and publishes a ready-made embed URL.

Verified: Aviary embed URLs return HTTP 200 with
`content-security-policy: frame-ancestors 'self' … *` and **no `X-Frame-Options`**,
i.e. they can be framed from any origin including Vercel, with zero configuration.
This was verified from the (now removed) `/ohms-preview` route, which framed a
live public Aviary interview as proof.

### What to do in Aviary, per interview
1. Upload the media, and attach the interview's **OHMS XML** so Aviary builds the
   synchronized index/transcript (Aviary has a dedicated OHMS import).
2. Set the resource's access to **public** — an embed inherits the resource's access
   setting, so a restricted resource will prompt for a login inside the iframe.
3. Open the resource → **Share** → **Embed** → copy the embed URL. It looks like
   `https://<subdomain>.aviaryplatform.com/collections/<cid>/collection_resources/<rid>?embed=true`
   (older short form: `…/r/<resource-id>?embed=true`).
4. Paste it into that interview's `ohmsUrl` in `src/content/interviews.ts`. Done —
   the placeholder is replaced by the live synchronized viewer.

Useful embed params: `?t=<seconds>` to start at a time, `media_player=true` for the
player only, `tabs=dit` to choose which Description/Index/Transcript tabs show.

## Native in-browser player (no hosting at all)

`src/components/OhmsNativePlayer.tsx` + `src/lib/ohms.ts` parse an OHMS XML export
in the browser with `DOMParser` and render the synchronized experience directly:
media player, timestamped index, transcript, Index/Transcript toggle, keyword
search, click-to-seek, and active-passage highlight/auto-scroll. Styled to the
site's design system and bilingual (OHMS's own `_alt` / `transcript_alt`
translation fields are wired to the EN/VI toggle). The `/ohms-native` demo route
was removed before launch; the component itself is live in `InterviewDetail`
wherever an interview sets `ohmsXml`.

**To use it:** put the XML in `public/ohms/` and set `ohmsXml: "/ohms/<file>.xml"`
on that interview. That's the whole procedure — the XML file alone is sufficient.

Schema gotchas found while building the parser (documented in `src/lib/ohms.ts`):
- `<date>` carries its value in an **attribute**, not as text.
- `<point><time>` is **integer seconds**, and the first segment is not necessarily 0.
- `<sync>` is `"<interval-minutes>:|line(word)|…"` with **1-based** transcript line
  numbers. If `<sync>` is empty the transcript shows but won't follow the audio.
- For full sync, `<media_url>` should be an https direct media file.

Covered by unit tests in `src/lib/ohms.test.ts` against three real OHMS fixtures.

## Fallback routes (only if something can't live in Aviary)
1. **Reuse the existing `ohms-dvp.dartmouth.edu` viewer** — drop the PXA XML into the
   directory it already reads, embed `…/viewer.php?cachefile=<file>.xml`. No new install.
2. **Fresh self-host of `ohms-viewer` `viewer_4.0`** (PHP 8) — clone, copy
   `config.template.ini → config.ini`, set `tmpDir` + a `Repository` name that
   matches the `<repository>` value inside each XML **exactly**, upload the 3 XML to
   the cachefiles dir, link `viewer.php?cachefile=<file>.xml`. Frameable by default;
   optionally add a `frame-ancestors` CSP naming the Vercel origin to be explicit.

### Framing header (only if a host injects X-Frame-Options)
```apache
Header always unset X-Frame-Options
Header always set Content-Security-Policy "frame-ancestors 'self' https://*.vercel.app https://<final-domain>"
```

## Gotchas that produce a blank iframe (watch for these)
- **http media / http viewer** on our https site → blocked as mixed content. Viewer
  and all media it references must be https.
- **`Repository` name mismatch** between `config.ini` and the XML → viewer loads blank.
- **Media source unreachable/expired** (Aviary/Kaltura/YouTube/etc.) → transcript
  shows but nothing plays. Confirm the media each XML points at is public + permanent.

## Open questions for DDHI / RCD
- Is there an Aviary account, or an existing viewer URL for any PXA interview already?
- Are the 3 XML exports final/approved? How many interviews total?
- What media host do they reference, and is it public, permanent, https?
- Do the interviews have Vietnamese transcripts/indexes, or English only?

## Reference links
- Viewer software: https://github.com/uklibraries/ohms-viewer (branch `viewer_4.0`)
- Third-party-host install guide: https://www.oralhistoryonline.org/installing-the-ohms-viewer-on-a-third-party-webhost/
- Aviary sharing/embed docs: https://coda.aviaryplatform.com/sharing-content-from-aviary-74
- Live verified sample: https://ohms-viewer.oralhistoriesatksu.org/viewer.php?cachefile=OHMS-Sample-001.xml
