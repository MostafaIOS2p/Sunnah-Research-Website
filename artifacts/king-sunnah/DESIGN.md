---
name: King Sunnah
description: A single confident editorial reference for the Prophetic Sunnah — one quiet idea per viewport, restrained restrained-until-earned color, and huge thin-weight Arabic type.
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
typography:
  display:
    fontFamily: "IBM Plex Sans Arabic, sans-serif"
    fontWeight: 100
    fontSize: "clamp(2.75rem, 6vw, 4.75rem)"
    lineHeight: 1.08
    letterSpacing: "-0.01em"
  heading:
    fontFamily: "IBM Plex Sans Arabic, sans-serif"
    fontWeight: 300
    fontSize: "clamp(1.5rem, 3vw, 3rem)"
    lineHeight: 1.2
  body:
    fontFamily: "IBM Plex Sans Arabic, sans-serif"
    fontWeight: 300
    fontSize: "1rem"
    lineHeight: 1.6
  matn:
    fontFamily: "IBM Plex Sans Arabic, sans-serif"
    fontWeight: 300
    fontSize: "clamp(1.125rem, 2vw, 1.75rem)"
    lineHeight: 2
rounded:
  sm: "1.1875rem"
  md: "1.25rem"
  lg: "1.3125rem"
  xl: "1.4375rem"
  pill: "9999px"
spacing:
  sm: "0.5rem"
  md: "1.25rem"
  lg: "2.5rem"
  xl: "5rem"
components:
  button-primary:
    backgroundColor: "{colors.mosque-green}"
    textColor: "{colors.stone-plaque}"
    rounded: "{rounded.pill}"
    padding: "0.75rem 1.5rem"
  button-secondary:
    backgroundColor: "{colors.brass}"
    textColor: "{colors.stone-plaque}"
    rounded: "{rounded.pill}"
    padding: "0.75rem 1.5rem"
  surface-card:
    backgroundColor: "{colors.stone-plaque}"
    rounded: "{rounded.lg}"
    padding: "1.5rem"
  badge-neutral:
    backgroundColor: "hsl(60 6% 15% / 0.05)"
    textColor: "hsl(60 6% 15% / 0.65)"
    rounded: "{rounded.pill}"
    padding: "0.25rem 0.75rem"
  badge-verified:
    backgroundColor: "hsl(168 55% 22% / 0.1)"
    textColor: "{colors.verification-seal}"
    rounded: "{rounded.pill}"
    padding: "0.25rem 0.75rem"
---

# Design System: King Sunnah

## Overview

**Creative North Star: "The Restrained Editorial"**

King Sunnah is built as a single confident editorial product: one idea per viewport, huge quiet typography, and generous whitespace, in the register the user named directly ("modern, elegant, like Apple website"). It replaces two things explicitly rejected in this project's history: the original generic shadcn dashboard, and this project's own first redesign — the "Complex Wayfinding" world of stone-and-brass hall signage, carved Reem Kufi display type, square brass avatar tiles, and a fixed dark hall-directory sidebar. Those artifacts (hairline-bordered "plaques," near-square 3px radius, brass borders as the default depth device) are fully retired; nothing in this document should be read as continuing them.

The shipped system keeps the project's original HSL color tokens verbatim (a deliberate constraint) but recasts their role entirely: stone and charcoal carry nearly every screen, and mosque-green, brass, and amber each get exactly one deliberate, non-repeating job rather than being sprinkled as decoration. Depth comes from real soft shadows (offset + blur) on borderless cards, not from hairline borders. Corners are generous and soft everywhere: ~21px on cards, full pill radius on every interactive control (buttons, inputs, search fields, filter chips, badges). A sticky, blurred, translucent glass header replaces the old fixed sidebar entirely on every route.

An earlier pass of this build let color leak as a repeating per-item accent (colored narrator/book badges, a 4×-repeated amber stats numeral, and a same-size icon+card grid for the homepage's second section). That has since been corrected in the code this document describes: narrator/book accents are now neutral foreground tints, amber appears exactly once per view on the one true live/aggregate figure, and the homepage's second section is an asymmetric two-column editorial link list (sticky heading + a plain divided text list, no icons, no per-item color, no card boxes) rather than a grid of icon tiles.

**Key Characteristics:**
- One enormous, Thin-weight headline per key viewport; type carries the drama, not color or ornament
- Amber (`--signal`) reserved for exactly one live/aggregate numeral per view — never decorative, never repeated
- Soft-elevation, borderless cards (real offset+blur shadow) as the default container, replacing the old flat hairline "plaque"
- Full-pill radius on every interactive control; generous ~21px radius on static containers
- Sticky translucent/blurred glass navigation, not a fixed sidebar
- IBM Plex Sans Arabic exclusively, self-hosted Thin(100)–Bold(700), with large headlines running Thin/ExtraLight
- Neutral, non-color-coded avatars and metadata badges — no per-item accent coding anywhere in a listing

## Colors

The palette is the project's original HSL tokens, unchanged in value but recast: stone and charcoal are structural (the page itself), while mosque-green, brass, verification-green, and amber are each rationed to a specific, narrow job.

### Primary
- **Mosque Green** (`hsl(168 68% 17%)` / `#0E4F44`): the system's interactive/action color — primary buttons, links (`text-primary`), active states, focus rings, the homepage research CTA band background, and the neutral-tinted isnad-chain index numerals (`bg-primary/10 text-primary`). It is the most-used color in the system precisely because it marks "interactive," not "decorative."

### Secondary
- **Brass** (`hsl(38 45% 42%)` / `#9C7A3C`): used sparingly — the "saved" bookmark active-state color and the secondary button/badge fill (e.g. the research compare-count badge). Never a page-filling color.

### Tertiary
- **Amber Signal** (`hsl(37 91% 55%)` / `#F5A623`): reserved exclusively for one live/aggregate numeral per view — the homepage's total-hadith counter, and the single "total hadiths" tile on the Stats ledger (the other three Stats tiles are plain neutral charcoal numerals). It never appears as a badge, border, or icon tint.

### Neutral
- **Travertine Stone** (`hsl(42 26% 93%)` / `#F1EBDD`): page background.
- **Stone Plaque** (`hsl(42 30% 97%)`): card/surface background, one step lighter than the page.
- **Charcoal Ink** (`hsl(60 6% 15%)` / `#262521`): primary text; also the source of nearly all neutral tints (`foreground/[0.02–0.08]`) used for badges, dividers, icon-tile backgrounds, and section-band backgrounds.
- **Brass Hairline** (`hsl(38 22% 78%)`): the system's one remaining border color, used only faintly (`border/40`–`border/50`) for breadcrumbs, footer rule, and the isnad connecting line — never as a card's primary depth device anymore.
- **Verification Seal** (`hsl(168 55% 22%)`): the "صحيح" (authentic) grade badge only.
- **Brick Seal Red** (`hsl(4 48% 36%)`): destructive actions only (e.g. delete-from-compare hover state).

### Named Rules
**The One Signal Rule.** Amber appears on exactly one live/aggregate numeral per view — never more than once, never on a static or per-item count. If a second number on the same screen needs emphasis, it gets plain charcoal, not amber.

**The Neutral Item Rule.** Individual items inside any listing (narrator cards, book cards, hadith results, saved items) never carry their own accent color. Avatars, initials, and metadata badges are all the same neutral charcoal tint (`foreground/[0.05–0.06]`) regardless of which item they belong to; color is reserved for state (verified / active / live), never for per-item identity.

**The Stamped Grade Rule.** A hadith's authenticity grade never renders as a generic colored pill. "صحيح" (authentic) alone gets the verification-seal green fill + a small check-shield glyph; every other grade value renders as the same plain neutral badge as surrounding metadata (book name, chapter) — never a red/orange "danger" tone, since "unclassified" is not the same claim as "weak."

## Typography

**Display & Body Font:** IBM Plex Sans Arabic (self-hosted, the exact family shipped in the King Sunnah iOS app), with generic sans-serif fallback — one family for everything, display and body alike, distinguished only by weight and size.

**Character:** A single, quiet workhorse family carrying the full Thin(100)–Bold(700) range lets huge headlines run Thin/ExtraLight (the same move Apple's own site makes with SF Pro Display) while the same face stays legible and calm at body sizes. Reem Kufi and any "carved"/monumental display styling from the prior world are fully retired — there is no separate display face.

### Hierarchy
- **Display** (font-thin/100, `2.75rem`→`4.75rem` clamp, 1.08 line-height, tight tracking): the one enormous per-viewport headline (homepage hero, page titles like "بحث الأحاديث", "إحصائيات المجموعة").
- **Heading** (font-thin/font-light, `1.5rem`–`3rem`): section titles within a page ("كل ما تحتاجه، في مكان واحد", "مختارات موثقة").
- **Title** (font-medium, `1.125rem`–`1.5rem`): card/component titles — narrator names, book titles, directory-list item titles.
- **Body** (font-light/400, `0.875rem`–`1.125rem`, 1.6 line-height): descriptions, UI labels, metadata.
- **Hadith matn** (font-light, `1.125rem`–`1.75rem`, ~2 line-height "leading-loose"): the Arabic hadith text itself — the one place body copy gets a generous, scripture-appropriate line-height distinct from ordinary paragraph text.
- **Signal numeral** (font-thin, tabular-nums, `2.25rem`–`4.75rem`, amber with a soft glow): styled via `.signal-numeral`; reserved per the One Signal Rule.

### Named Rules
**The Thin Headline Rule.** Large per-viewport headlines run Thin (100) or Light (300) weight, never Bold or SemiBold — weight climbs only as text gets smaller (card titles at Medium/500, badges at Medium/500 for legibility at small size).

**The Tabular Numeral Rule.** Any live or comparative numeral (hero counter, stats figures, book index numbers) uses `tabular-nums` so digits don't jitter or reflow.

## Layout

Two container widths carry almost everything: `max-w-4xl` for single-document reading views (Hadith Detail, Narrator Profile, Search) and `max-w-6xl` for list/browse views (Home sections, Books, Narrators, Research, Stats), both centered with `px-5 md:px-8` gutters. Section rhythm is generous and consistent: `py-14`–`py-24` between major sections, with alternating plain and `bg-foreground/[0.02]` tinted bands to separate sections without borders.

The homepage is the one full-bleed exception, composed of stacked single-focus sections rather than the shell's single column: a centered `max-w-3xl` hero, a `max-w-6xl` two-column editorial section, a `max-w-4xl` process strip, and `max-w-6xl` featured/news sections.

**The homepage's second section (signature layout)** is an asymmetric two-column editorial grid (`minmax(0,0.9fr)_minmax(0,1.4fr)`): a sticky heading column on one side, and on the other a single bordered list of plain-text links divided by hairlines (`border-t`/`border-b`), each row showing only a title, one-line description, and an arrow that appears on hover — no icons, no per-item color, no card boxes. This replaced an earlier same-size icon+card grid and is the model for any future "list of top-level destinations" surface.

Responsive behavior: the two-column editorial grid, process strip, and card grids all collapse to a single column below `md`; the sticky glass header remains fixed while its desktop inline nav is replaced by a slide-down full-width panel.

## Elevation & Depth

Soft and shadow-based, not flat. The default container (`.surface-card`) is borderless: depth comes entirely from a real offset+blur `box-shadow`, replacing the prior world's hairline-border-as-depth. A `.surface-card-flat` variant (thin `card-border` at 50% opacity, no shadow) exists for lower-emphasis contexts. Cards lift further on hover via `-translate-y-1`/`-translate-y-0.5`, reinforcing the shadow as a physical, liftable surface rather than a printed outline.

### Shadow Vocabulary
- **`--shadow-sm`** (`0 1px 2px 0 rgb(38 37 33/0.04), 0 1px 1px 0 rgb(38 37 33/0.03)`): the lightest resting depth.
- **`--shadow`** (`0 8px 24px -8px rgb(38 37 33/0.10), 0 2px 6px -2px rgb(38 37 33/0.05)`): the default `.surface-card` shadow — used everywhere a card sits at rest.
- **`--shadow-md`** (`0 24px 48px -16px rgb(38 37 33/0.16), 0 8px 16px -4px rgb(38 37 33/0.08)`): elevated/hover states.
- **`--shadow-lg`** (`0 40px 80px -24px rgb(38 37 33/0.22), 0 12px 24px -8px rgb(38 37 33/0.10)`): reserved for the single most prominent surface per view (the homepage research CTA band).

### Named Rules
**The Borderless-By-Default Rule.** A container's depth comes from shadow, not from a border. Reach for `.surface-card` (shadow, no border) before `.surface-card-flat` (border, no shadow); the hairline border is a minor exception, never the default depth device it was in the prior world.

## Shapes

Corners are generous and soft, inverting the prior world's near-square 2–7px language entirely. The base `--radius` is `1.25rem` (20px); `.surface-card` renders at `--radius-lg` (~21px), with a few static container variants stepping up to `rounded-2xl` (stat tiles, filter inputs) and `rounded-[2rem]` (the homepage CTA band, the system's largest single radius).

Every interactive control — primary/secondary/outline/ghost buttons, the search field, filter chips, pagination controls, tab toggles — is overridden to full pill radius (`rounded-full`), regardless of the shadcn `Button` base's default `rounded-md`. This is a consistent, deliberate two-tier form language: **static containers get a large, soft rounded-rect radius; anything you can click or type into is a full pill.** Avatars and initial tiles are perfect circles (`rounded-full`, neutral charcoal tint) — the prior world's square brass-bordered tiles are fully retired.

## Components

### Buttons
- **Shape:** full pill (`rounded-full`) on every variant in practice, overriding the shadcn default `rounded-md`.
- **Primary:** mosque-green background, stone-plaque text, subtle shadow, no border.
- **Secondary:** brass background, stone-plaque text — reserved for lower-frequency actions (export, saved-state toggle).
- **Ghost / Outline:** transparent or bordered per shadcn defaults, with the pill-radius override; used for icon-only actions (copy, share, pagination) and toggles (grid/list view, search filters).

### Cards / Containers
- **Corner Style:** ~21px (`--radius-lg`) via `.surface-card`.
- **Background:** stone-plaque (`--card`).
- **Shadow Strategy:** `--shadow` at rest, `-translate-y` + implicit shadow growth on hover (see Elevation & Depth).
- **Border:** none by default (borderless is the norm); `.surface-card-flat` is the explicit bordered exception.
- **Internal Padding:** `p-5`–`p-8` (list items lighter, detail-page hero cards heavier).

### Inputs / Search Fields
- **Style:** pill-radius, usually borderless and set inside a `.surface-card` shell (icon + input + submit button sharing one soft-elevation container) rather than each having its own border.
- **Focus:** system-wide 2px amber (`--signal`) focus ring with 2px offset — the one place amber appears outside the One Signal Rule, since it is a state indicator (focus), not decoration.

### Badges / Metadata Pills
- **Style:** full pill, neutral charcoal tint (`bg-foreground/[0.05–0.06]`, text at 45–65% opacity) for ordinary metadata (book name, chapter, hadith count, "unclassified" grade).
- **Verified exception:** "صحيح" alone gets `bg-seal/10 text-seal` plus a small check-shield glyph — the system's only filled-and-colored badge state.

### Navigation
- **Style:** a sticky, translucent, blurred header (`.glass-nav`: `background/72%` + `saturate(180%) blur(20px)`) replacing the prior fixed dark sidebar on every route. Desktop nav items are pill-shaped text links with a subtle neutral tint for hover/active state (`foreground/[0.04–0.06]`) — no color-coded active indicator.
- **Mobile:** a full-width slide-down panel beneath the sticky header (not a side drawer), with the same pill-shaped, neutrally-tinted items stacked vertically.

### Avatars / Initial Tiles
- **Style:** perfect circle, neutral charcoal tint (`bg-foreground/[0.06]`, `text-foreground/70`), first-letter initial in display font — identical treatment on the narrator directory and narrator profile header, with no per-narrator color variation (see The Neutral Item Rule).

### Isnad Chain (signature component)
A vertical list where each narrator is a circular, neutrally-primary-tinted numbered badge (`bg-primary/10 text-primary`) connected by a thin vertical rule (`border/60`) running behind the badges — a plain, restrained numbered timeline. This replaced the prior world's square brass-numbered-tile "manuscript margin" device; the chain now reads as calm sequence, not carved genealogy.

### Editorial Link List (signature component)
See Layout: a divided, plain-text list of destination links (title + one-line description + hover-revealed arrow), paired with a sticky heading column. No icons, no per-item color, no card boxes. This is the corrected replacement for a same-size icon+card grid and is the reference pattern for any future top-level destination list.

## Do's and Don'ts

### Do:
- **Do** use `.surface-card` (borderless, soft shadow, ~21px radius) as the default container for any new panel or list item.
- **Do** reserve amber (`--signal`) for exactly one live/aggregate numeral per view; every other number is plain charcoal or the state color it already carries (verified-green, primary).
- **Do** render every interactive control — button, input, chip, pagination — at full pill radius (`rounded-full`), even though the underlying shadcn `Button` defaults to `rounded-md`.
- **Do** keep avatars, initials, and per-item metadata badges neutrally tinted and identical across every item in a listing; color marks state, never identity.
- **Do** render the "صحيح" grade as the one filled/colored badge (seal-green + check glyph); every other grade value uses the same plain neutral badge as surrounding metadata.
- **Do** author top-level destination lists (homepage hall links, any future "explore" list) as a divided plain-text list with a sticky heading column, per the Editorial Link List pattern — not a grid of same-size icon cards.

### Don't:
- **Don't** reintroduce Reem Kufi or any separate "carved"/monumental display face — IBM Plex Sans Arabic (Thin–Bold) is the sole family, for display and body alike.
- **Don't** reintroduce the near-square 2–7px radius or square brass-bordered avatar tiles from the prior "Complex Wayfinding" world; corners are generous and soft, and avatars are circles.
- **Don't** use a hairline border as a container's primary depth device — shadow is the default; a border is the flat, minor exception (`.surface-card-flat`), not the norm.
- **Don't** give individual listing items (narrators, books, hadith results) their own accent color or icon-in-colored-circle treatment — this repeating per-item-color pattern shipped once and was corrected; it does not come back.
- **Don't** repeat the amber signal treatment more than once per view, or apply it to a static/non-live number — its rarity is what makes it legible as "live."
- **Don't** add a kicker/eyebrow label above a heading; the Thin-weight headline carries its own weight.

<!-- Not canonized: an earlier pass of this build shipped invented per-item accent colors (narrator/book badges), a 4×-repeated amber stats numeral, and a same-size icon+card grid on the homepage. All three were craft-floor defects, not system decisions, and were corrected in the code this document describes — they are recorded above only as explicit Don'ts, never as inheritable rules. -->
