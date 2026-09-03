---
version: 1
slug: "src-components-auth-auth-screen-tsx"
primary_target: "src/components/auth/auth-screen.tsx"
related_targets: ["src/pages/login.tsx","src/pages/register.tsx","src/components/auth/role-picker.tsx"]
---

THESIS: The Figma mobile screenshots are business-logic evidence only (which fields, which flow, which validation, the role concept) — not a visual template. The previous build ported the phone screen's own chrome (a full-bleed color hero mimicking a phone status bar, a single narrow card, a bottom-sheet role picker) onto a wide desktop canvas, which reads as an app screen stretched wide, not a website. This surface is Operate mode inside King Sunnah's already-established Restrained Editorial world (DESIGN.md) and inherits it exactly — no new visual identity, no concept roll.

OWN-WORLD: Nothing new. Same stone/charcoal/mosque-green tokens, same IBM Plex Sans Arabic weights, same pill-radius-on-interactive / soft-rounded-static-container rule, same borderless soft-shadow `.surface-card`, same glass-nav visual language used elsewhere.

STORY: A visitor arrives to sign in or register as a normal website page, not a modal phone screen. Desktop reads as a real editorial split page: an institutional brand panel (real Alifta asset, mosque-green, a short Thin-weight line of actual value copy — why sign in — not the app's splash marketing line) beside the form. Mobile stacks to a single column, brand panel collapsing to a short band, matching how every other page on this site collapses (not to a simulated phone frame).

FIRST VIEWPORT: Desktop ≥ lg: two-column grid, brand panel (mosque-green, real Alifta building/emblem asset, logo mark, Thin headline + one line of real value copy, no literal Figma splash copy) on one side, the auth form (plain page background, not a card floating over a color band) on the other, full viewport height. Below lg: brand panel collapses to a short top band (logo + one line), form stacks below full-width, same as every other responsive page on this site.

FORM: Tab switcher (login/register) as the same pill-segmented control pattern already used for the books grid/list toggle — not a card-internal mobile tab bar. Role selection is a proper web `Select` dropdown (existing shadcn Select, pill-styled per system rule) listing the four roles with leading icons — never a bottom sheet/drawer, which is a native-mobile affordance with no web equivalent in this system. Guest access is a plain secondary link, not a phone-status-bar-style chip. Social buttons keep their existing inert/"قريباً" behavา and pill style. All field logic, validation, endpoints, and the DisplayName role-encoding are unchanged — this is a presentation-layer correction only.

FINISH: Feels like the rest of King Sunnah — quiet, editorial, soft-shadow, huge Thin type — not like a mobile app window that happens to be centered on a wide page.
