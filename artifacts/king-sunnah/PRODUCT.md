# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two primary audiences, served through different flows in the same product:

- **General educated Muslim public**: casual readers looking up a hadith, checking its authenticity grade, or learning about the Sunnah. Job: quick lookup, clarity, trust at a glance. Served by Home, Search, Hadith Detail, Books, Narrators, Saved.
- **Hadith students and researchers**: doing isnad (chain) verification, narrator biography research (jarh wa ta'dil), and cross-book comparison. Job: precision, depth, and exportable working results. Served by Research (multi-hadith compare, export) and Stats, and the deeper narrator/isnad views within Narrator Profile and Hadith Detail.

## Product Purpose

King Sunnah (مجموعة الملك عبدالعزيز للسنة النبوية) is a trustworthy digital reference for the Prophetic Sunnah: verified hadith texts, full isnad chains, narrator biographies, and authenticity grading, searchable across the canonical books (Bukhari, Muslim, Tirmidhi, and other dawāwīn al-sunnah). Success means a visitor — public or specialist — can find a hadith, see how authentic it is and why (chain and grading), and trace or compare it with confidence.

## Positioning

Unlike a plain hadith-lookup app or a standalone narrator-biography reference, King Sunnah integrates primary hadith text, full narrator-chain verification, and comparison/research tooling (compare up to 3 hadiths, export results) in one platform — under the same institutional authority that grades and publishes the underlying scholarship.

## Operating Context

- Arabic is the sole interface language today: `dir="rtl"` / `lang="ar"` are set unconditionally in `App.tsx`. No English/locale toggle currently exists in code (the Alifta reference site's EN/AR switch is a reference cue only, not a confirmed requirement — treat as undecided/future unless the user asks for it).
- The product is officially affiliated with **the General Presidency for Scholarly Research and Ifta (Dar al-Ifta), Saudi Arabia** ("Alifta"). Real institutional assets already exist in the repo (`public/images/alifta-emblem.png`, `alifta-building.jpg`, `alifta-mufti.jpg`) and should be treated as real assets to use, not placeholders — but any new seal usage, letterhead-style claims, or official wording should stay conservative and not overclaim authority beyond what these assets support.
- Frontend stack: React 18 + Vite + Tailwind v4 + shadcn/ui (`components.json`), `wouter` router, TanStack Query, a small Zustand-style `store.ts` for saved items/notes. API layer is generated (Orval) from `lib/api-spec/openapi.yaml` via `@workspace/api-client-react`.
- Existing routes: `/` (Home, full-width, no sidebar), `/search`, `/hadith/:id`, `/books`, `/narrators`, `/narrator/:id`, `/research`, `/saved`, `/stats` — all non-home routes render inside `components/layout/shell.tsx` (currently a fixed dark-green sidebar).

## Capabilities and Constraints

- Hadith search (text/narrator/book), hadith detail with isnad chain, saved items with personal notes, narrator directory + individual narrator profiles with related hadiths, book/collection browsing, a research workspace (compare up to 3 hadiths, export to PDF), and aggregate stats (hadith/book/narrator counts).
- Backend/API surface, data model, and routes are out of scope for this redesign — this is a UI/UX redesign of the existing frontend (`artifacts/king-sunnah`), not a new feature build.
- `artifacts/mockup-sandbox` already contains a prior, unfinished exploration (`src/components/mockups/sunnah-redesign/`: `Current.tsx`, `GoldenAgeHome.tsx`, `GoldenAgeHome.css`) — evidence/anti-reference for this round, not a locked decision. The user asked to see it presented as one option among a few new directions, not auto-adopted.

## Brand Commitments

- Name: "مجموعة الملك عبدالعزيز للسنة النبوية" (King Sunnah collection), operating under Dar al-Ifta (Alifta) authority.
- Real assets on hand: Alifta emblem, building photo, and a photo of the Mufti (`public/images/`) — see Evidence below.

## Evidence on Hand

- `artifacts/king-sunnah/public/images/`: `alifta-emblem.png`, `alifta-building.jpg`, `alifta-mufti.jpg`, `king-sunnah-mark.svg` — real institutional imagery, usable directly.
- `screenshots/alifta-reference-home.png` — the real Alifta government website, for institutional tone/legitimacy reference only (not a template to copy literally).
- `screenshots/king-sunnah-desktop.jpg` / `-mobile.jpg` and related `king-sunnah-alifta-*` shots — current shipped UI (generic shadcn look), the incumbent to treat as anti-reference for this redesign.
- `screenshots/golden-age-home.jpg` and the matching `mockup-sandbox` source — one prior direction exploration, to be presented as a candidate, not assumed final.
- No user research, analytics, or testimonials on hand — none to be fabricated.

## Product Principles

1. Serve both audiences from one coherent system: fast, low-friction lookup for the public; precise, dense, exportable tooling for researchers — without making either flow feel bolted on.
2. Authenticity and provenance are the product's core trust signal — grading, isnad, and sourcing should be legible at a glance, not buried.
3. The institutional affiliation (Dar al-Ifta) earns a dignified, scholarly visual register — real assets are used accurately and without overclaiming.
4. Arabic RTL is the primary and only shipped reading experience; typography and layout are designed RTL-first, not mirrored from an LTR default.

## Accessibility & Inclusion

No specific standard confirmed yet; RTL Arabic correctness (line-breaking, numeral direction, mixed Arabic/Latin content) is a known functional requirement given the product's audience.
