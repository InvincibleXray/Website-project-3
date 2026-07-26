# UI Design System

> WEVOX — Typography, colour, spacing, editorial identity, and rules that must never change.

Related: [COMPONENTS.md](COMPONENTS.md) | [RESPONSIVE_GUIDE.md](RESPONSIVE_GUIDE.md) | [AI_DEVELOPER_GUIDE.md](AI_DEVELOPER_GUIDE.md)

---

## Table of Contents

- [Design Identity](#design-identity)
- [Colour Palette](#colour-palette)
- [Typography](#typography)
- [Spacing System](#spacing-system)
- [Grid System](#grid-system)
- [Elevation and Borders](#elevation-and-borders)
- [Animation Philosophy](#animation-philosophy)
- [Component Patterns](#component-patterns)
- [Editorial Hierarchy](#editorial-hierarchy)
- [Brand Consistency Rules](#brand-consistency-rules)
- [Rules That Must Never Change](#rules-that-must-never-change)

---

## Design Identity

WEVOX is designed to feel like a **premium editorial publication**, not a social media platform or a blog. Every visual decision is made in service of one goal: making student journalism look as credible as it is.

**Reference publications:** The New York Times, Reuters, Bloomberg, Apple News, The Hindu, Indian Express.

**Design keywords:** Premium. Clean. Minimal. Editorial. Modern newsroom. High readability. Professional visual hierarchy.

**What WEVOX is NOT:** A social feed. A content aggregator. A blog. A portfolio site.

---

## Colour Palette

All colours are defined as CSS custom properties on `:root` and must be referenced by token name, never by raw hex value in component styles.

### Core palette

| Token | Hex | Usage |
|---|---|---|
| `--bg` | `#F9F7F4` | Page background — warm off-white, not pure white |
| `--bg-dark` | `#0D0D0D` | Footer, mobile overlay, dark sections |
| `--surface` | `#FFFFFF` | Card backgrounds, modal backgrounds |
| `--border` | `#E8E4DF` | All borders — warm grey, not cool grey |
| `--text-primary` | `#1A1A1A` | Headlines, body text — near-black |
| `--text-secondary` | `#6B6B6B` | Author names, meta, secondary labels |
| `--text-muted` | `#9A9A9A` | Timestamps, read counts, captions |
| `--accent` | `#C8102E` | WEVOX red — the brand colour |
| `--accent-hover` | `#A50D26` | Hover state for accent elements |
| `--tag-bg` | `#F0EDE8` | Tag pill backgrounds, trending section background |

### Semantic colours (admin only)

| Token | Hex | Usage |
|---|---|---|
| `--success` | `#1E8E3E` | Approval, success states |
| `--danger` | `#C8102E` | Errors, destructive actions |
| `--info` | `#1A6FB5` | Informational states |
| `--warning` | `#B8860B` | Warning states |

### Colour philosophy

- The background is **warm** (`#F9F7F4`), not cool white. This reduces eye strain for long reading sessions and gives the platform a premium, paper-like quality.
- The accent red (`#C8102E`) is used **sparingly** — only for interactive elements, category labels, and brand marks. It should never be used for decorative purposes.
- Dark text on warm background achieves high contrast without the harshness of pure black on pure white.

---

## Typography

### Font stack

| Token | Font | Fallback | Role |
|---|---|---|---|
| `--font-headline` | Literata | Georgia, serif | All headlines, article titles, logo |
| `--font-body` | DM Sans | system-ui, -apple-system, sans-serif | Body text, UI labels, navigation |
| `--font-mono` | IBM Plex Mono | Courier New, monospace | Category tags, timestamps, metadata, code |

### Why these fonts?

- **Literata** is a reading-optimised serif designed for long-form digital content. It has excellent legibility at small sizes and strong editorial character. It is the global headline font for WEVOX and must not be changed or overridden per-story.
- **DM Sans** is a geometric sans-serif with high legibility at small sizes. It is used for all UI text where readability at 12–14px is critical.
- **IBM Plex Mono** provides a technical, journalistic character to metadata. It signals precision — timestamps, view counts, category codes.

### Type scale

| Element | Font | Size | Weight | Line Height |
|---|---|---|---|---|
| Homepage hero H1 | Literata | 42px (desktop) / 26px (mobile) | 700 | 1.1 |
| Article headline | Literata | 44px (desktop) / 26px (mobile) | 900 | 1.25 |
| Lead story title | Literata | 32px (desktop) / 26px (mobile) | 700 | 1.15 |
| Story card title | Literata | 19px | 700 | 1.35 |
| Article body paragraph | DM Sans | 18px (desktop) / 16px (mobile) | 400 | 1.8 |
| Article H2 | Literata | 26px (desktop) / 22px (mobile) | 700 | — |
| Article blockquote | Literata | 22px (desktop) / 18px (mobile) | 700 italic | 1.5 |
| Category tag | IBM Plex Mono | 10–11px | 600 | — |
| Timestamp / meta | IBM Plex Mono | 11–12px | 400 | — |
| Navigation links | DM Sans | 14px | 500 | — |
| Logo | Literata | 22px | 900 | — |

### Typography rules

1. **Literata is the global headline font.** It must not be overridden per-story or per-section.
2. **Per-story font selection has been permanently removed.** Do not reintroduce it.
3. **Body text is DM Sans, not Literata.** Literata is for headlines only.
4. **Metadata is always IBM Plex Mono.** Never use DM Sans for timestamps or view counts.
5. **Letter spacing on category tags is always `1px` or `2px`.** Never use `0` or negative values on mono tags.

---

## Spacing System

WEVOX does not use a rigid spacing scale (like Tailwind's 4px grid). Spacing is defined contextually per component. However, the following conventions are consistent:

| Context | Value |
|---|---|
| Page gutter (desktop) | `32px` (`--gutter`) |
| Page gutter (mobile) | `20px` (`--gutter` overridden in `@media (max-width: 768px)`) |
| Max content width | `1240px` (`--max-width`) |
| Article column max width | `720px` |
| Article body max width | `680px` |
| Card internal padding | `16–24px` |
| Section vertical padding | `48–60px` |
| Component gap (flex/grid) | `12–22px` |

---

## Grid System

### Homepage main grid

```css
.main-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px; /* Stories | Field Reports */
  gap: 72px;
}
/* Tablet: 55% / 45% */
/* Mobile: single column */
```

### Article grid

```css
.article-grid {
  display: grid;
  grid-template-columns: minmax(0, 720px) 260px; /* Article | Sidebar */
  gap: 60px;
  max-width: 1080px;
}
/* Tablet + Mobile: single column, sidebar hidden */
```

### Story card grid

```css
.story-card {
  display: grid;
  grid-template-columns: 160px 1fr; /* Thumbnail | Content */
  gap: 22px;
}
/* Lead card: single column (full-width image) */
/* Mobile: single column */
```

### Field Reports card grid

```css
.video-card {
  display: grid;
  grid-template-columns: 112px 1fr; /* Thumbnail | .video-body */
  gap: 12px;
}
/* .video-body is a flex column: tag → title → meta */
/* Desktop and mobile: same grid, .video-body handles stacking */
```

---

## Elevation and Borders

WEVOX uses **borders, not shadows**, as the primary separation mechanism. This is consistent with premium editorial design.

| Element | Treatment |
|---|---|
| Navbar | `border-bottom: 1px solid var(--border)` + shadow on scroll |
| Story cards | `border-bottom: 1px solid var(--border)` (no card shadow) |
| Trending cards | `background: var(--surface)` + subtle hover shadow |
| More Stories cards | `box-shadow: 0 2px 12px rgba(0,0,0,0.06)` |
| Modals | `border-radius: 8px` + dark overlay |
| Author card | `background: var(--tag-bg)` + `border-radius: 8px` |

**Rule:** Never add heavy drop shadows to story cards on the homepage. The editorial list style relies on borders and whitespace, not elevation.

---

## Animation Philosophy

Animations in WEVOX serve **one purpose**: to make content feel like it is arriving, not appearing. They are never decorative.

### Principles

1. **Entrance only.** Elements animate in; they do not animate out (except modals and overlays).
2. **Short duration.** Most animations are `0.2s–0.5s`. Nothing exceeds `0.5s`.
3. **Ease, not linear.** All transitions use `ease` or `ease-out`. Never `linear` for UI elements.
4. **Stagger for lists.** Cards in a list stagger with `animation-delay` increments of `0.06–0.1s`.
5. **IntersectionObserver for scroll reveals.** Paragraphs in article bodies fade in as they enter the viewport. This is done with `IntersectionObserver`, not scroll event listeners.

### Animation tokens

```css
/* Fade in (navbar, page load) */
@keyframes fadeIn { to { opacity: 1; } }

/* Slide up (hero, cards) */
@keyframes slideUp {
  to { opacity: 1; transform: translateY(0); }
}

/* Shimmer (skeleton loaders) */
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Blink (live dot in ticker) */
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.2; }
}
```

---

## Component Patterns

### Category tag

Always: `font-family: var(--font-mono)`, `color: var(--accent)`, `text-transform: uppercase`, `letter-spacing: 1px`, `font-size: 10–11px`.

### Section title

Always: `font-family: var(--font-body)`, `font-size: 13px`, `font-weight: 600`, `letter-spacing: 3px`, `text-transform: uppercase`, `color: var(--text-secondary)`, with a 32px wide 2px accent red underline via `::after`.

### Skeleton loader

Always: `background: linear-gradient(90deg, #E8E4DF 0%, #F5F2EE 50%, #E8E4DF 100%)`, `background-size: 200% 100%`, `animation: shimmer 1.5s infinite`.

### Hover states

- Story card title: `color: var(--accent)` on parent hover
- Thumbnail images: `transform: scale(1.02–1.03)` on parent hover
- Navigation links: `color: var(--accent)`
- Buttons: `background: var(--accent-hover)`

---

## Editorial Hierarchy

The visual hierarchy of every page mirrors the front page of a print newspaper:

```
Lead story (hero)          ← Largest. Full-width image. Biggest headline.
  └── Secondary stories      ← Compact. Thumbnail left. Two-line headline.
        └── Field Reports      ← Sidebar. Smaller thumbnail. Shorter title.
              └── Trending   ← Smallest unit. Card with image and rank.
```

This hierarchy must be preserved in all future layout changes.

---

## Brand Consistency Rules

1. The WEVOX logo is always `WEVOX` in Literata 900 weight, followed by a red dot (`<span class="dot">.</span>`).
2. The tagline is always **"Student journalism. No filters."** — exact capitalisation.
3. The accent colour `#C8102E` is the only red used in the UI. Do not introduce other reds.
4. The warm background `#F9F7F4` must never be replaced with pure white (`#FFFFFF`) on page backgrounds.
5. The footer is always dark (`var(--bg-dark)` = `#0D0D0D`).

---

## Rules That Must Never Change

These are non-negotiable constraints. Any AI assistant or contributor must treat these as immutable.

| Rule | Reason |
|---|---|
| Literata is the global headline font | Brand identity. Changing it breaks editorial consistency across all pages. |
| Per-story font selection must not be reintroduced | Was removed deliberately. It created inconsistency. |
| `--accent: #C8102E` must not change | Core brand colour. Changing it breaks the entire visual identity. |
| `--bg: #F9F7F4` must not change to `#FFFFFF` | The warm background is a deliberate editorial choice. |
| The lead story card must always be full-width | Editorial hierarchy principle. |
| DOMPurify must always sanitise article body HTML | Security. Never bypass or remove this. |
| `escapeHtml()` must always be used for string interpolation | Security. Never interpolate raw user data into HTML. |
| Desktop layouts must not change unless explicitly requested | Stability. Mobile fixes must be mobile-only. |
