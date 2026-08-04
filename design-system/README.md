# Phạm Xuân Ẩn — Design System

The connected component library for the PXA archive site, synced between this repo
and claude.ai/design via Claude Code's `DesignSync` (`/design-sync`).

**Concept.** Press / editorial DNA over a documentary "dossier" undertone — archival
paper tones, Dartmouth pine, gold accents.

**Source of truth.** Tokens mirror `src/index.css` and `tailwind.config.ts`. Edit
components visually at claude.ai/design, then sync back down here one component at a time.

## Structure
- `styles/tokens.css` — palette, type, and shared utility classes every card uses.
- `foundations/` — colour, typography.
- `components/` — buttons, eyebrow, record card.
- `signature/` cards — duotone portrait, redaction/declassify (the dossier devices).

Each preview HTML carries a first-line `<!-- @dsCard group="…" -->` marker so the
Design System pane indexes it automatically.
