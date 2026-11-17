---
name: The Pham Xuan An Project
description: A bilingual oral history archive, set like a university reading room.
colors:
  paper: "#FFFFFF"
  paper-2: "#F3F4F4"
  ink: "#151918"
  ink-soft: "#2E3834"
  ink-muted: "#585F5D"
  pine: "#00693E"
  pine-deep: "#06371F"
  pine-pale: "#BFE3CF"
  gold: "#B0852B"
  gold-bright: "#C9A23F"
  hairline: "#D9DDDB"
  rule-strong: "#7A8580"
  destructive: "#AD1F1F"
typography:
  masthead:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "5.125rem"
    fontWeight: 500
    lineHeight: 0.98
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "3rem"
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: "-0.015em"
  head:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "2.25rem"
    fontWeight: 500
    lineHeight: 1.14
    letterSpacing: "-0.01em"
  sub:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "1.6875rem"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "-0.005em"
  lead:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "IBM Plex Sans, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "IBM Plex Sans, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.45
  micro:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.06em"
rounded:
  none: "0px"
  sm: "2px"
  full: "9999px"
spacing:
  gutter: "28px"
  stack: "44px"
  section: "80px"
  section-lg: "88px"
  container-pad: "32px"
  container-max: "1400px"
components:
  button-gold:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "12px 24px"
  button-gold-hover:
    backgroundColor: "{colors.gold-bright}"
  button-pine:
    backgroundColor: "{colors.pine}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "12px 24px"
  button-pine-hover:
    backgroundColor: "{colors.pine-deep}"
  chip-filter:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-soft}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "8px 12px"
  chip-filter-selected:
    backgroundColor: "{colors.pine}"
    textColor: "{colors.paper}"
  input-search:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    height: "40px"
  register-row:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    padding: "28px 20px"
  register-row-hover:
    backgroundColor: "{colors.paper-2}"
  masthead:
    backgroundColor: "{colors.pine-deep}"
    textColor: "{colors.paper}"
    height: "68px"
  language-toggle-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.micro}"
    rounded: "{rounded.sm}"
    padding: "6px 10px"
---

# Design System: The Pham Xuan An Project

## Overview

**Creative North Star: "The Reading Room"**

The site is a university special-collections reading room: a quiet white ground, institutional green bands, and records you request, study and cite. Nothing performs. The photographs and the one piece of moving footage carry the colour and the feeling, and everything around them is set as carefully and plainly as a catalogue entry. Density is that of a well-made scholarly page: generous section rhythm, prose held to a readable measure, and metadata that is exact without being loud.

Hierarchy comes from typography and placement rather than ornament. A serif (Newsreader) carries names, headings and deks; a humanist sans (IBM Plex Sans) carries prose and every interface label; a mono face appears only where a machine-typed value would. Green is spent in deliberate bands (the masthead, the footer, the scrim over footage) and gold marks the few things that mean something: the end of the page, a link worth following, the active language.

The earlier "archival paper" language (cream, tan and beige grounds, plus the duotone-portrait and redaction "dossier" devices still in `design-system/`) is **retired**. Those devices dramatised secrecy; the reading room presents sources. They should not come back.

The room is formal but not inert. What makes it intriguing is the material itself: a face in footage, the many voices laid side by side, a name with two identities. It is never colour, ornament or novelty. Restraint is what keeps it from reading as a template, and no voice is styled to look more authoritative than another.

**Key Characteristics:**
- White-dominant neutral ground with no warm tint anywhere.
- Green as bands, not sprinkles; gold as signal, never as text on a light ground.
- Registers (hairline-ruled rows, whole row a link) instead of card grids.
- Flat surfaces, 2px corners, colour-change interactions, no page-load motion.
- Every string bilingual; every face carries a full Vietnamese subset.

## Colors

A cool, near-monochrome ground of white and green-tinged greys, framed by Dartmouth pine and touched with a burnished gold.

### Primary
- **Dartmouth Pine** (pine): links, the selected filter chip, the secondary solid button, and the hover colour for row titles. The institutional voice in the body.
- **Reading-Room Green** (pine-deep): the masthead, the footer, the scrim over the hero footage, and the double-record timeline band on the homepage. The colour of the room's walls; used as bands, never as a tint behind body text.
- **Pale Green** (pine-pale): secondary type on a pine-deep band only, such as "Hai Trung, 1927–2006" in the hero and the timeline's column heads. 9.6:1 on pine-deep; never on a light ground.

### Secondary
- **Burnished Gold** (gold): the 2px rule that closes the page above the footer, underline rules under featured links, and the active language in the toggle. The homepage carries no gold below the masthead. 3.3:1 on paper, so it is **never text on a light ground**.
- **Lamp Gold** (gold-bright): gold for dark grounds: the active nav item, footer section labels, and the outer halo of the focus ring.

### Neutral
- **Paper White** (paper): the page ground, dominant everywhere.
- **Recessed Grey** (paper-2): recessed bands ("What this archive holds"), image placeholders, and the hover fill of a register row. A neutral grey, never tan.
- **Ink** (ink): primary text and headings, 17.8:1 on paper.
- **Soft Ink** (ink-soft): secondary prose and deks, 12.3:1.
- **Muted Ink** (ink-muted): metadata, captions, back-links, the "In collaboration with" label. 6.5:1 on paper, 5.9:1 on paper-2.
- **Hairline** (hairline): the 1.37:1 rule between records in a register and around thumbnails. Separation only.
- **Control Rule** (rule-strong): the 3.8:1 edge of real controls (inputs, filter chips), per WCAG 1.4.11.

### Named Rules
**The Bands, Not Sprinkles Rule.** Pine-deep appears as whole bands (masthead, footer, footage scrim, the timeline band). It is not scattered through the body as backgrounds on small elements.

**The Gold Means Something Rule.** Gold marks the primary action, the end of the page, or a link worth following. It is never decoration, and on light grounds it is never text.

**The Third Rank Rule.** Muted text uses the solid ink-muted token, never ink-soft faded with alpha. Alpha-faded text landed between 2.4:1 and 4.0:1 and failed AA.

**The No Warm Ground Rule.** No cream, tan or beige anywhere. Retired in October 2026.

## Typography

**Display Font:** Newsreader (with Georgia, serif)
**Body Font:** IBM Plex Sans (with system-ui, sans-serif)
**Mono Font:** IBM Plex Mono (with ui-monospace), for machine values only

**Character:** A literary, slightly condensed news serif against a precise humanist sans from the same institutional register as a library catalogue. All three faces ship a full `vietnamese` subset, so stacked diacritics (ẩ, ữ, ọ) never fall back mid-word.

### Hierarchy
Rank names are roles, not sizes. Body ranks step by about 1.2 from a 17px base; display ranks step by 1.333 above it.

- **Masthead** (500, 82px, 0.98): the hero name at large widths, once per site. The one place the page raises its voice.
- **Title** (500, 48px, 1.05): page h1s and the hero name below `lg`.
- **Head** (500, 36px, 1.14): section h2s.
- **Sub** (500, 27px, 1.25): h3s and register-row titles.
- **Lead** (serif 400, 20px, 1.55): deks, standfirsts, interviewee names in a row, life dates.
- **Body** (sans 400, 17px, 1.65): running prose, held to about 70 characters (38rem; 40rem and 1.7 leading when set in the serif).
- **Label** (sans 400 or 500, 14px, 1.45): the metadata voice, nav, buttons and footer copy. Sentence case.
- **Micro** (mono 400, 13px, 0.06em tracking): timecodes, record identifiers and the EN/VI toggle. 13px is the floor.

### Named Rules
**The Machine Values Rule.** Mono is only for values a machine typed: timecodes, record IDs, language codes. Anything a person reads as prose (dates, durations, names, roles) is set in the sans metadata voice.

**The Stated Fact Rule.** Headings state a fact, not an aphorism. No tracked-out all-caps eyebrow labels above them.

**The Vietnamese Subset Rule.** A face without a full `vietnamese` subset is not eligible, however well it suits. After any type change, check the VI toggle visually.

## Layout

A centred container (max 1400px, 32px side padding) holds every section. Vertical rhythm comes from two section ranks: 80px, rising to 88px at `lg`. A heading block sits 44px (`stack`) above the content it introduces, and framed blocks pad their interiors by 28px (`gutter`). Everything smaller keeps Tailwind's 4px step.

Records are laid out as **registers**: a single column of full-width rows separated by hairlines, each row a multi-column grid at `md` (thumbnail, title and summary, then person and metadata, right-aligned), stacking to one column on phones. The homepage's two records are the one deliberate exception: Testimony and The written record sit side by side as two recessed panels of the same width (stacked on phones), so neither pillar is placed above the other.

The masthead is sticky at 64px, rising to 68px at `md`. Primary navigation shows inline from `xl` (1280px) and collapses to a menu below it; the language toggle is always visible. The homepage hero is full-bleed and fills the first screen below the masthead (at least 30rem), with its type anchored to the bottom and nothing else on it but the footage credit and pause control.

## Elevation & Depth

The system is flat. Depth comes from tonal bands (white against recessed grey against pine-deep) and hairline rules, not shadows. The single shadow in use appears on the sticky masthead once the page has scrolled, separating it from the content passing beneath. The one gradient is functional: a scrim over footage and photographs, so paper-white type over them keeps its contrast. On the hero footage it is a light pine-deep tint (35%) under a neutral ink gradient. The green is a trace, and the ink does the legibility work.

### Shadow Vocabulary
- **Masthead lift** (`box-shadow: 0 1px 0 hsl(var(--pine-deep)), 0 6px 20px -12px rgba(0,0,0,0.5)`): only on the scrolled masthead.

### Named Rules
**The Flat Room Rule.** Surfaces never lift. Interaction is shown by colour (a row fills with recessed grey, a title turns pine), never by shadow, translation or scale.

## Shapes

Document-like corners: a 2px radius on buttons, inputs and the language toggle, and square corners on filter chips, thumbnails, panels and register rows. The only round form is the circular pause control over the hero footage, a media control and deliberately distinct. Borders are 1px: the hairline for separation, the control rule for an interactive edge. The page ends on a 2px gold rule above the footer. Photographs sit in a 4:3 frame with a hairline border, partly desaturated in registers and fully greyscale under a scrim.

## Components

Quiet and exact: sharp edges, hairline rules, colour shifts in place of motion, nothing raised.

### Buttons
- **Shape:** near-square corners (2px).
- **Primary (gold):** burnished gold fill, ink text in the label rank at weight 500, 12px × 24px padding. Lightens to lamp gold on hover. Reserved for a main action on a dark band; the homepage has none.
- **Solid (pine):** pine fill with paper text, darkening to pine-deep on hover. For a primary action on a light ground.
- **Text link with rule:** pine label-rank text over a 1px gold bottom rule. The standard "go somewhere" link in the body. On dark grounds it becomes paper text over a 40%-paper rule that strengthens on hover.
- **Focus:** the global two-layer ring: a 2px ink outline offset 2px plus a 5px lamp-gold halo. Inside `.on-dark` the outline inverts to paper. Do not replace it with a single colour.

### Chips
- **Style:** square-cornered, 1px control-rule border, white fill, soft-ink label text, 8px × 12px padding.
- **State:** hover turns border and text pine. Selected fills pine with paper text. Used for the interview language filter.

### Inputs / Fields
- **Style:** white fill, 1px control-rule border, 2px corners, 40px tall, a muted-ink search glyph inset left.
- **Focus:** the global two-layer focus ring.

### Navigation
- **Masthead:** a solid pine-deep band. The site name sits left in the serif; nav links in the label rank are 70% paper, full paper on hover, and lamp gold when active. A shadow appears only after scroll. Below `xl` it becomes a menu button and a full-width pine-deep drawer.
- **Language toggle:** a bordered pair of mono micro buttons (EN / VI). The active language is filled (gold with ink text on dark grounds, ink with paper text on light) and announced with `aria-pressed`.
- **Footer:** pine-deep under a 2px gold top rule. Three columns (name, explore, cite this archive), section labels in lamp gold, and the citation format printed in full.

### Register Row (signature)
The archive's finding-aid pattern. A full-width row ruled by hairlines above and below, padded 28px × 16–20px, with the whole row a single link. On hover it fills with recessed grey and its serif title turns pine; nothing moves. Metadata on the right is set in the sans metadata voice with tabular numerals, as label/value pairs rather than a middle-dot string.

### The Two Records (signature)
The homepage section under the hero. Testimony and The written record are two recessed-grey panels of the same width, each with a serif heading, one muted count line, a list of entries ruled by faint hairlines, and a pine link to its full page at the foot. A testimony entry leads with one broad serif line on what the recordings cover, with the speaker below in the metadata voice; a book entry leads with its title in italics, with author and year below. On hover only the line turns pine; nothing fills, lifts or scales. No photographs until there is one of every speaker. The rule this serves: **no voice, and neither pillar, is styled to look more authoritative than another.**

### Hero Footage
A silent, greyscale 26-second loop under a pine-deep scrim, started from script so `prefers-reduced-motion` gets the poster frame instead, with a circular pause control (WCAG 2.2.2). It is the only moving thing on the site.

## Do's and Don'ts

### Do:
- **Do** keep the ground white (#FFFFFF) and recessed bands neutral grey (#F3F4F4).
- **Do** use the hairline for separating records and the control rule (3.8:1) for any interactive edge.
- **Do** build lists of records as registers, with the whole row as one link.
- **Do** pair metadata as label/value elements in the sans 14px metadata voice.
- **Do** show interaction as a colour change: a recessed-grey fill or a pine title.
- **Do** set every user-facing string bilingually and check the VI rendering after any type change.
- **Do** keep the hero footage muted, greyscale under a scrim, with its pause control and reduced-motion poster.

### Don't:
- **Don't** reintroduce cream, tan, beige or "archival paper" tones, or the duotone-portrait and redaction dossier devices.
- **Don't** use gold as text on a light ground, or the hairline (1.37:1) as a control boundary.
- **Don't** fade ink with alpha to make muted text; use ink-muted.
- **Don't** put tracked-out all-caps eyebrows above headings, or use mono for human-readable labels.
- **Don't** join facts into one middle-dot string (`A · B · C`) or write `WORD — fragment` headings.
- **Don't** use identical cards in a uniform grid, `hover:scale-*`, shadows on hover, decorative gradients, or page-load animations.
- **Don't** replace the two-layer focus ring with a single colour.
