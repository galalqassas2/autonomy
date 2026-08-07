# Flexi Boost — Design Reference

Source of truth for colors, type, and component styling actually used across the live site (extracted from the Blade templates, not a separate design tool). Use this when building any new button, card, or section so it matches the rest of the site.

## Colors

The same 5 core colors repeat on every page, just under different CSS variable prefixes per page (`--wd-*` on contact/blog/team/careers/demos/service-details, `--fbx-*` on home, `--fba-*` on about, `--fsv-*` on services). The values are always identical:

| Role | Hex | Usage |
|---|---|---|
| Navy (primary) | `#051229` | Headings, body text on light backgrounds, dark section backgrounds, filled buttons |
| Navy 2 (secondary) | `#0a2640` | Gradient partner for navy (e.g. `linear-gradient(145deg, #0a2640 0%, #051229 100%)`) on dark blobs/CTAs |
| Gold (accent) | `#D4AF37` | Accent color, filled gold buttons, icon backgrounds, borders on hover |
| Gold 2 (accent, lighter) | `#E8C547` | Gradient partner for gold, hover states, "script" gradient text |
| Light (page background) | `#eef1f6` | Background for light hero sections and light page backgrounds |

Legacy theme (older/untouched components, `main.css`):
- `--tj-color-theme-dark`: `#051229` (same navy)
- `--tj-color-heading-primary`: `#051229`
- `--tj-color-border-1`: `#27354d`

**Gold gradient text** (used for the italic "script" emphasis word inside headings, e.g. *Deliver*, *your business*):
```css
background: linear-gradient(120deg, #B8922F, #D4AF37 50%, #E8C547);
-webkit-background-clip: text;
background-clip: text;
-webkit-text-fill-color: transparent;
```

## Typography

Two type systems exist on the site:

**Redesigned pages** (home, about, services, service-details, contact, blog, team, careers, demos) — the current standard, use this for anything new:
- Headings: `'Fraunces', serif` — weight 600–900, often with an italic gold-gradient "script" span for emphasis
- Body/UI text: `'Inter', sans-serif` — weight 400–700

**Legacy theme** (parts of the original template not yet redesigned):
- Headings: `'Libre Franklin', serif`
- Body: `'Lato', sans-serif`

Typical heading sizes use `clamp()` for responsiveness, e.g.:
```css
font-size: clamp(40px, 5.2vw, 72px);   /* H1 hero title */
font-size: clamp(29px, 3.5vw, 46px);   /* H2 section title */
font-size: clamp(22px, 2.6vw, 33px);   /* lead paragraph */
```
Body copy: `16–18px`, `line-height: 1.55–1.7`, color usually `rgba(5, 18, 41, 0.6–0.65)` (navy at reduced opacity) rather than pure black.

## Buttons

All buttons on redesigned pages are **fully pill-shaped**: `border-radius: 999px`. Three variants, reused with the same shape/sizing everywhere (`wd-btn-*` / `fbx-btn-*` / `fsv-btn-*` — same styles, different prefix per page):

**Gold (primary)**
```css
display: inline-flex; align-items: center; gap: 9px;
background: var(--*-gold);      /* #D4AF37 */
color: var(--*-navy);           /* #051229 */
font-size: 15px; font-weight: 700;
padding: 14px 32px;             /* home hero variant uses 15px 34px */
border-radius: 999px;
transition: background .3s, color .3s, gap .3s, transform .3s;
```
Hover: background → white, `gap` widens to 14px (icon nudges right), slight `translateY(-2px)` lift.

**Navy (filled, secondary)**
```css
background: var(--*-navy); color: #fff;
font-size: 15px; font-weight: 700;
padding: 14px 32px; border-radius: 999px;
```

**Ghost (outline)**
```css
border: 1.5px solid rgba(5, 18, 41, 0.22);   /* on light bg */
/* or rgba(255,255,255,0.45) on dark bg */
color: var(--*-navy);           /* or #fff on dark bg */
font-size: 15px; font-weight: 600–700;
padding: 13px 30px; border-radius: 999px;
```
Hover: border-color → gold, subtle gold-tinted background fill.

**Small pill / tag button** (e.g. "Confirm Booking" chips, badges):
```css
background: var(--*-gold); color: var(--*-navy);
padding: 10px 26px 10px 10px; border-radius: 999px;
font-size: 15px; font-weight: 700;
```

Legacy theme button (`.tj-primary-btn`, still used in a few untouched spots) is a more elaborate two-tone pill: navy body + a gold circular icon capsule on the left, `border-radius: 50px`.

## Cards

Border-radius scales with how "boxy" the card is:
- Standard content card: `border-radius: 16px` (e.g. testimonial cards, sidebar)
- Feature/service card: `border-radius: 20px` (e.g. service grid cards, media images)
- Large media/video wrapper: `border-radius: 26px`
- Pills/badges/tags: `border-radius: 999px` (fully rounded)

Shadow convention — always navy-tinted, never pure black:
```css
box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08);        /* light card */
box-shadow: 0 20px 44px rgba(5, 18, 41, 0.1);        /* hover state */
box-shadow: 0 30px 60px rgba(5, 18, 41, 0.16);       /* media image */
box-shadow: 0 40px 80px rgba(5, 18, 41, 0.25);       /* large video wrap */
```

Borders on cards (when present, not shadow-only): `1px solid rgba(5, 18, 41, 0.06–0.09)`.

Card hover pattern: `transform: translateY(-6px to -8px)`, border-color shifts to gold at ~50% opacity, shadow deepens.

## Icon boxes

Small rounded-square icon container used throughout (service cards, feature lists):
```css
width: 58px; height: 58px;
border-radius: 16px;
background: rgba(212, 175, 55, 0.13);   /* gold at 13% */
color: var(--*-gold);
```
On card hover, icon box often inverts: `background: var(--*-navy); color: var(--*-gold-2);` with a slight rotate (`transform: rotate(-6deg)`).

## Spacing

- Section vertical padding: `100px 0` desktop, drops to `70–76px 0` under 991px
- Card padding: `30px 40px 40px` (content cards), `32px 28px 28px` (service grid cards)
- Grid gap: `24px` typical between cards

## Notes for building anything new

1. **Always use the pill shape** (`border-radius: 999px`) for buttons and small tags/badges — never a small `4–8px` radius on a button, that's a legacy-theme pattern being phased out.
2. **Navy + gold only** — don't introduce new brand colors. Blues/greens/etc. only appear in unrelated legal-page accents (`--legal-accent: #0075ff`) and shouldn't be used for site UI.
3. **Shadows are always navy-tinted** (`rgba(5,18,41, x)`), not black.
4. Use `'Fraunces'` for any new heading and `'Inter'` for any new body/UI text — matches every page redesigned this year. Only touch `'Libre Franklin'`/`'Lato'` if you're editing an untouched legacy section.
5. The gold gradient (`#B8922F → #D4AF37 → #E8C547`) is reserved for the italic "script" emphasis word inside headings — don't apply it to buttons or body text.
