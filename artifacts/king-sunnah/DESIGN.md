---
name: King Sunnah
description: An institutional hadith reference platform redesigned as a complex you are guided through, not a dashboard you scroll.
colors:
  travertine-stone: "hsl(42 26% 93%)"
  charcoal-ink: "hsl(60 6% 15%)"
  brass-hairline: "hsl(38 22% 78%)"
  stone-plaque: "hsl(42 30% 97%)"
  mosque-green: "hsl(168 68% 17%)"
  brass: "hsl(38 45% 42%)"
  brass-bright: "hsl(40 55% 58%)"
  amber-signal: "hsl(37 91% 55%)"
  verification-seal: "hsl(168 55% 22%)"
  brick-seal-red: "hsl(4 48% 36%)"
  hall-directory-green: "hsl(168 62% 14%)"
typography:
  display:
    fontFamily: "Reem Kufi, IBM Plex Sans Arabic, sans-serif"
    fontWeight: 600
    lineHeight: 1.15
  body:
    fontFamily: "IBM Plex Sans Arabic, sans-serif"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  sm: "2px"
  md: "3px"
  lg: "5px"
  xl: "7px"
spacing:
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
components:
  button-primary:
    backgroundColor: "{colors.mosque-green}"
    textColor: "{colors.stone-plaque}"
    rounded: "{rounded.sm}"
    padding: "0.625rem 1.25rem"
  button-secondary:
    backgroundColor: "{colors.brass}"
    textColor: "{colors.stone-plaque}"
    rounded: "{rounded.sm}"
    padding: "0.625rem 1.25rem"
  plaque:
    backgroundColor: "{colors.stone-plaque}"
    rounded: "{rounded.sm}"
---

# Design System: King Sunnah

## Overview

**Creative North Star: "Complex Wayfinding"**

King Sunnah is built as a real institutional complex you are guided through, not an app that lists content in cards. Every screen borrows from the language of stone and brass hall signage and the amber prayer-time board: a visitor reads directory plaques to find the right hall (Search, Books, Narrators, Research), sees a live amber counter proving the collection's scale, and moves through numbered wayfinding rather than a scrolling feed. This replaces two things explicitly rejected during the redesign: the previously shipped generic green/white/gold shadcn-default dashboard (rounded cards, icon-in-circle tiles), and a "Golden Age" cream-and-gold devotional direction that was explored but not chosen because it is the default rendition every AI-generated Islamic-subject interface converges on.

The system is deliberately flat and architectural rather than soft and bubbly: hairline brass borders instead of drop shadows, square-cornered plaques instead of rounded cards, carved numerals instead of icon-in-colored-circle badges. Verification (a hadith's authenticity grade) reads as a stamped seal, not a colored pill. The one animated/luminous element in the whole system is the amber "signal" numeral — reserved exclusively for live, countable data (the total verified hadith count, the stats ledger) — so its rarity keeps it meaningful.

**Key Characteristics:**
- Stone-and-brass architectural signage in place of card grids
- One amber "signal" accent reserved for live/counted data only
- Verification shown as a stamped seal (green, with a check glyph), never a plain colored badge
- Flat, hairline-bordered plaques (2–3px radius) instead of rounded shadow cards
- Reem Kufi (a Kufic-inscription-derived display face) for carved/engraved headings; IBM Plex Sans Arabic for body and UI text
- RTL-first: every layout, icon position, and flex order is authored for Arabic reading order, not mirrored from an English default

## Colors

The palette reads as a real material world — quarried stone, cast brass, oxidized mosque-green, and one amber signal light — not a generic brand palette with a religious color cliché (avoid green+gold-as-decoration; here green and brass are structural materials, not accents sprinkled for flavor).

### Primary
- **Mosque Green** (`hsl(168 68% 17%)` / `#0E4F44`): primary buttons, active nav state, the research CTA band, the hall-directory sidebar background (deeper variant).

### Secondary
- **Brass** (`hsl(38 45% 42%)` / `#9C7A3C`): secondary actions, index numerals on directory/book-register plaques, hairline dividers (`brass-rule`), narrator initial tiles.
- **Brass Bright** (`hsl(40 55% 58%)` / `#C9A566`): hover state for brass-colored elements.

### Tertiary
- **Amber Signal** (`hsl(37 91% 55%)` / `#F5A623`): reserved exclusively for live/counted numerals — the homepage hadith-count counter and the stats ledger board. Never used decoratively.

### Neutral
- **Travertine Stone** (`hsl(42 26% 93%)` / `#F1EBDD`): page background.
- **Stone Plaque** (`hsl(42 30% 97%)` / near-white): card/plaque surface, one step lighter than the page ground.
- **Charcoal Ink** (`hsl(60 6% 15%)` / `#262521`): primary text, reads as engraved ink on stone.
- **Brass Hairline** (`hsl(38 22% 78%)`): all borders — plaques, dividers, inputs.
- **Verification Seal** (`hsl(168 55% 22%)`): the "صحيح" (authentic) grade stamp only.
- **Brick Seal Red** (`hsl(4 48% 36%)`): destructive actions only.

### Named Rules
**The One Signal Rule.** Amber is the system's only "alive" color. It appears solely on live, countable readouts (the homepage hadith counter, the stats ledger). If a number isn't real-time/aggregate data, it doesn't get amber.

**The Stamped Grade Rule.** A hadith's authenticity grade never renders as a generic colored pill. "صحيح" (authentic) gets a green outline with a check glyph, like a seal; anything else gets a plain neutral outline — never a red/orange "danger" color, because "unclassified" is not the same claim as "weak."

## Typography

**Display Font:** Reem Kufi (with IBM Plex Sans Arabic, sans-serif fallback)
**Body Font:** IBM Plex Sans Arabic (with generic sans-serif fallback)

**Character:** Reem Kufi is derived from Kufic monumental inscription lettering — the same lettering tradition carved into mosque facades and brass plaques — so headings genuinely read as "carved," not merely bold. IBM Plex Sans Arabic stays the workhorse for body copy, UI labels, and dense data, keeping long-form reading and interface chrome calm and legible.

### Hierarchy
- **Display** (font-display, 600, 2.25–3.75rem, 1.15 line-height): page/section titles, the hero headline, plaque titles (book names, narrator names).
- **Body** (font-sans, 400, 0.875–1rem, 1.6 line-height): paragraph copy, descriptions, UI labels.
- **Hadith matn** (font-display, 400–600, 1.125–1.5rem, ~2 line-height "leading-loose"): the Arabic hadith text itself gets the display face at a generous line-height, distinguishing scriptural text from interface chrome.
- **Signal numeral** (font-display, tabular-nums, amber, with a soft text-shadow glow): the one place numerals get special treatment, styled via the `.signal-numeral` utility.

### Named Rules
**The Tabular Numeral Rule.** Any live or comparative numeral (the hadith counter, stats figures) uses `tabular-nums` so digits don't jitter or reflow as they update.

## Layout

Content sits in a `max-w-5xl`–`max-w-6xl` centered column inside the hall-directory shell (a fixed 288px/`w-72` sidebar on desktop, collapsing to a slide-in drawer on mobile). The homepage is the one full-bleed exception — its hero, directory board, and news sections run edge-to-edge inside their own `max-w-4xl`/`max-w-6xl` sections rather than the shell's column, since it renders outside `Shell` entirely.

Directory-style listings (the homepage hall board, the Books register) use a single bordered container with internal `divide-x`/`divide-y` hairlines rather than a gap-separated grid of individual cards — one continuous plaque with dividers reads as a register or signage board, not a stack of app cards. Responsive behavior: `sm:divide-x` becomes stacked `divide-y` below the sm breakpoint, so the board degrades to a simple vertical list on mobile rather than trying to preserve columns.

Spacing rhythm favors generous section padding (`py-10`–`py-24` for full sections) with tighter internal plaque padding (`p-5`–`p-8`), and consistently more space above a heading than below it.

## Elevation & Depth

Flat-by-default. There is no floating-card shadow system; depth comes from the hairline brass border plus a very faint inset highlight (`inset 0 1px 0 0 rgb(255 255 255 / 0.5)`) that reads as a beveled stone edge, not a drop shadow. The `--shadow-sm/--shadow/--shadow-md` tokens exist and are used sparingly (hero search bar, a couple of interactive states) but are not the primary depth device.

### Named Rules
**The Flat Plaque Rule.** Surfaces are flat, bordered rectangles at rest (the `.plaque` utility). A shadow is a minor accent on one or two interactive elements, never the default way a container reads as "raised."

## Shapes

Radius is deliberately small and near-architectural: the base `--radius` is `0.1875rem` (3px), with `sm`/`md`/`lg`/`xl` steps built from it (2px–7px). Nothing in the system uses the old `rounded-xl`/`rounded-2xl`/`rounded-full` bubble language — corners read as chamfered stone edges, not soft app bubbles. Circular "icon in a colored circle" avatars were replaced system-wide with square, brass-bordered tiles (narrator initials, isnad chain numerals, saved-item type marks).

## Components

### Buttons
- **Shape:** flat rectangle, 2px radius (`rounded-sm` override on the shadcn `Button`, which otherwise defaults to the shrunk global radius).
- **Primary:** mosque green background, stone-plaque text, no shadow.
- **Secondary:** brass background, brightens to `brass-bright` on hover.
- **Ghost/Outline:** unchanged shadcn behavior, inherits the shrunk radius automatically from the token change.

### Plaques (the system's card replacement)
- **Corner style:** 2–3px radius, effectively square.
- **Background:** stone-plaque (`--card`), one step lighter than the page ground.
- **Border:** 1px brass-hairline (`--card-border`).
- **Depth:** faint inset highlight + `--shadow-sm`, never a floating shadow.
- **Internal padding:** `p-5`–`p-8` depending on density.
- Used for: featured hadith cards, search results, narrator cards, saved items, research compare panels.

### Directory boards (signature component)
A single bordered container divided by internal hairlines (`divide-x`/`divide-y`) rather than a gapped grid of separate cards. Each cell carries a large brass index numeral (Arabic-Indic, e.g. `٠١`) top-aligned opposite a small line icon, then a display-font title and one-line description, with an arrow affordance that fades in on hover. Used for the homepage hall directory and the Books register. This is the system's clearest departure from the "same-size icon+heading+text card" pattern the rest of the industry defaults to.

### Signal counters (signature component)
A bordered stone-deep box containing a large, tabular-numeral, amber-colored figure with a soft glow (`.signal-numeral`), paired with a short label. Used for the homepage live hadith count and, as a four-up ledger board (`divide-x`/`divide-y`, no individual card borders), on the Stats page. This is the one place the system allows a "glowing" treatment, and it is reserved for genuinely live/aggregate data.

### Isnad chain (signature component)
A vertical list where each narrator is a square brass-numbered tile linked by a thin vertical brass rule running behind the tiles (`before:` pseudo-element), evoking a manuscript margin genealogy rather than a generic numbered list. Used on the Hadith Detail page.

### Grade/verification tags
- **Style:** thin outline, no fill. "صحيح" (authentic) gets `verification-seal` green with a small check-shield glyph; any other grade gets a neutral gray outline with no icon.
- Never a filled colored pill; never a red/orange tone for "unclassified," since the source data does not support a weak/authentic spectrum beyond these two states.

### Navigation (hall directory / sidebar)
- **Style:** deep mosque-green panel, brass-highlighted active state via a left border-accent + numbered tile (`٠٠`–`٠٦`) rather than a filled rounded pill.
- **Mobile:** slides in from the right (matching RTL) as a full-height drawer with a scrim.

## Do's and Don'ts

### Do:
- **Do** use the `.plaque` utility (flat, brass-bordered, 2–3px radius) as the default container for any new list item or panel — never reach for a rounded shadow card.
- **Do** reserve amber (`--signal`) strictly for live/counted numerals; everything else uses mosque-green, brass, or neutral ink.
- **Do** render authenticity grading as a stamped outline tag (seal-green + check glyph for "صحيح," neutral outline otherwise), never a filled badge.
- **Do** use square, brass-bordered initial/numeral tiles in place of circular icon avatars.
- **Do** author directory-style listings (Books, homepage halls) as one bordered container with internal dividers, not a gapped grid of separate cards.

### Don't:
- **Don't** reintroduce `rounded-xl`/`rounded-2xl`/`rounded-full` — the shrunk global radius (2–7px) is the system's form language; large radii read as the rejected incumbent look.
- **Don't** put an icon inside a filled, rounded colored circle/box as a stand-in for content (the banned "icon-box" card pattern the redesign explicitly moved away from).
- **Don't** add a kicker/eyebrow label above a heading; let the heading (usually in Reem Kufi) carry its own weight.
- **Don't** invent narrator grading/generation data for display — the current hadith corpus leaves `reliability`/`generation` fields unpopulated for essentially all narrators, and the grade field only has two real values ("صحيح" and "غير مصنف"). Design for what the data actually supports; don't fabricate a richer grading UI than the source can back up.
- **Don't** use the amber signal color decoratively — its rarity is what makes it read as "live."
