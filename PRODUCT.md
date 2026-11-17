# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, served together rather than one ranked above the other:

- **Academic readers** (historians, students, teachers, journalists working from sources) who need to find the passage where a subject comes up, read what it covers, and cite it by the person speaking.
- **The general public** in Vietnam, the United States and elsewhere, who know Phạm Xuân Ẩn's story partly or not at all and want an easy way in.

Both read in English or Vietnamese, and each should get the full experience in their own language.

## Product Purpose

A free, bilingual oral history archive that presents **all the ways Phạm Xuân Ẩn has been portrayed**: in his own recorded words and in the accounts of colleagues, friends and the writers and historians who interviewed him. He was a Saigon correspondent for Reuters, the New York Herald Tribune and Time and, at the same time, an intelligence officer for North Vietnam. The archive sheds light on his story by putting every viewpoint side by side and making them easy to get into. It does not ask the reader to reach a judgement on him, and it does not hand them one. Readers form their own view from the primary recordings rather than from the books built on them.

Success means a reader of either audience, in either language, can find a voice, see who that person was to Ẩn, reach the moment in a recording where a subject comes up, and leave able to cite it.

## Positioning

The only place the 2005 recordings with Ẩn himself, enhanced and indexed, sit alongside new interviews with the people who knew him, published in English and Vietnamese together by Dartmouth (DDHI) and Fulbright University Vietnam's Vietnam Studies Center, with Texas Tech's Vietnam Center & Sam Johnson Vietnam Archive as archival partner. The organising idea is plurality of portrayal: many voices on one man, not a single authoritative narrative.

## Operating Context

- Interviews are published through the OHMS Viewer 4.0, baked to static pages: each recording arrives as indexed segments (title, synopsis, keywords), searchable, with segment deep links.
- Readers move between a biography, the interview register, individual recordings, a bibliography, and (in preparation) curated exhibits.
- **The subject is Ẩn as a whole, not any one recording** (owner, 2026-10-27). The homepage is a showcase of the man and how he has been portrayed; it must not be organised around individual interviews or interviewers.
- **The interviews and the bibliography are the archive's two pillars** (owner, 2026-10-27). The bibliography is being researched and will be large: the written record of how Ẩn was portrayed, set alongside the spoken one.
- A header toggle switches the whole interface between English and Vietnamese at once. Recordings stay in their original language; archival index titles are English-only in the current exports.
- Citation format: `[Interviewee], interviewed by [Interviewer], [Date], The Pham Xuan An Project.`

## Capabilities and Constraints

- Fully static site with no backend at runtime; it deploys as plain files and SPA routing configs must stay.
- Every user-facing string is bilingual (`Bilingual = { en, vi }`), with copy kept in `src/content/*`. Uncertain Vietnamese is still supplied and marked `// TODO: verify VI`.
- Fonts must carry a full Vietnamese subset; stacked diacritics (ẩ, ữ, ọ) must render, including in "Phạm Xuân Ẩn".
- OHMS exports in `public/ohms/` are the source of truth for interviews. Current exports are index-only, with no transcripts or sync.
- Public repository: no internal infrastructure, account identifiers or individual staff names.
- Undecided: the curated summaries, native review of the Vietnamese copy, the published team roster, and the exhibit content (marked "In preparation").

## Brand Commitments

- Name: "The Pham Xuan An Project" / "Dự án Phạm Xuân Ẩn".
- Institutional identity of DDHI / Dartmouth, Fulbright University Vietnam and Texas Tech, with partner logos in `src/assets/`.
- Voice: scholarly, plain and factual. Headings state facts rather than aphorisms. Archival honesty about what is uncertain, unindexed or not yet published.
- Character (confirmed by the owner, 2026-10-27): **formal, and intriguing to the viewer**. The interface must be distinctive and must not read as a generic or AI-generated template layout. It must never be colourful, playful or childish.

## Evidence on Hand

- 11 OHMS exports and their recordings (audio, plus filmed McMorris interviews), with baked viewer pages in `public/ohms-viewer/`.
- Photographs: `src/assets/interview-pxa.jpg`, and a hero loop and poster cut from the McMorris footage in `public/media/`.
- Biography (`bio.ts`) and bibliography (`bibliography.ts`).
- Absent and not to be fabricated: transcripts, exhibit essays, data visualisations, the team roster, testimonials, and any Vietnamese index titles.

## Product Principles

1. **Every viewpoint, no verdict.** Show all the ways Ẩn was presented, each voice on its own terms and with equal standing, so readers can compare them. The archive sheds light on his story without settling who he "really" was or steering anyone towards a judgement of him.
2. **Easy in, deep enough to cite.** A first-time visitor finds a way in quickly, and a scholar can reach the exact passage and its citation.
3. **Two languages, one archive.** Vietnamese is a peer of English, never a translation layer added afterwards.
4. **Primary sources first.** Lead readers to the recordings themselves. Interpretation is labelled as such.
5. **Honest about the record.** Uncertain dates, unindexed recordings and unfinished sections are stated plainly, never dressed up as complete.

## Accessibility & Inclusion

WCAG AA in practice: AA contrast ranks, a visible two-layer focus ring, a pause control on the moving hero (2.2.2), and `prefers-reduced-motion` honoured. *Inferred from the existing code and CLAUDE.md; a formal standard has not been confirmed.* Bilingual access is an inclusion requirement, not a feature.
