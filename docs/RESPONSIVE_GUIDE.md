# Responsive Guide

> WEVOX — Breakpoints, layout priorities, responsive philosophy, and rules for future UI changes.

Related: [UI_DESIGN_SYSTEM.md](UI_DESIGN_SYSTEM.md) | [AI_DEVELOPER_GUIDE.md](AI_DEVELOPER_GUIDE.md) | [COMPONENTS.md](COMPONENTS.md)

---

## Breakpoints

| Breakpoint | Width | Target devices |
|---|---|---|
| Desktop | `> 1024px` | Laptops, desktops, large monitors |
| Tablet | `768px – 1024px` | iPads, small laptops |
| Mobile | `≤ 768px` | All phones |
| Small mobile | `≤ 480px` | Small Android phones, iPhone SE |

### CSS media queries used

```css
@media (max-width: 1024px) { /* Tablet adjustments */ }
@media (max-width: 768px)  { /* Mobile layout */ }
@media (max-width: 480px)  { /* Small mobile fine-tuning */ }
```

---

## Mobile Verification Widths

Every mobile fix must be verified at these exact widths:

| Width | Device |
|---|---|
| 320px | Small Android phones |
| 360px | Common Android phones (Samsung Galaxy A series) |
| 390px | iPhone 14 Pro |
| 412px | Google Pixel 7 |
| 480px | Large phones / small tablets |

---

## Layout Changes by Breakpoint

### Homepage (`index.html`)

| Element | Desktop | Tablet (≤1024px) | Mobile (≤768px) |
|---|---|---|---|
| `.main-grid` | `1fr 320px`, gap 72px | `55% 45%`, gap 36px | Single column, gap 40px |
| `#videos` | Sticky sidebar, border-left | Sticky sidebar | Static, no border, no padding |
| `.story-card` | `160px 1fr` grid | `160px 1fr` grid | Single column |
| `.story-thumb` | `160px × 108px` | `160px × 108px` | Full width, 200px height |
| `.identity-grid` | 2-column | 2-column | Single column |
| `.stats` | 2×2 grid | 2×2 grid | Horizontal scroll row |
| `--gutter` | `32px` | `32px` | `20px` |

### Article page (`story.html`)

| Element | Desktop | Tablet (≤1024px) | Mobile (≤768px) |
|---|---|---|---|
| `.article-grid` | `720px 260px` | Single column | Single column |
| `.sidebar` | Sticky, visible | Hidden | Hidden |
| `.headline` | 44px | 36px | 26–28px |
| `.cover-wrap` | Normal margin | Normal margin | Full-bleed (negative margin) |
| `.article-content p` | 18px, 1.8 line-height | 18px | 16px, 1.75 |
| `.more-grid` | 3-column | 3-column | Single column |

---

## Responsive Philosophy

### Mobile-first content priority

On mobile, content is prioritised in this order:
1. Navbar (fixed, always visible)
2. Hero headline and stats
3. Category filter bar (sticky)
4. Stories (primary content)
5. Field Reports (secondary, below stories)
6. Trending (tertiary, horizontal scroll)
7. Footer

### Desktop layout is frozen

Desktop layouts are stable and must not be changed unless explicitly requested. All responsive work is done in `@media (max-width: 768px)` blocks.

### Horizontal scroll for overflow content

On mobile, sections that cannot stack vertically use horizontal scroll:
- `.stats` (hero statistics)
- `.filter-inner` (category chips)
- `.trending-row` (trending cards)

All use `overflow-x: auto; scrollbar-width: none` to hide the scrollbar.

### Full-bleed images on mobile

The article cover image on mobile uses negative margin to break out of the container and span the full viewport width:

```css
@media (max-width: 768px) {
  .cover-wrap {
    margin: 0 calc(var(--gutter) * -1);
    width: calc(100% + (var(--gutter) * 2));
  }
  .cover { border-radius: 0; }
}
```

This is a deliberate editorial choice — full-bleed cover images feel more immersive on mobile.

---

## Rules for Future UI Changes

1. **Never modify desktop layout to fix a mobile issue.** Use `@media (max-width: 768px)` overrides.
2. **Never modify tablet layout to fix a mobile issue.** Use `@media (max-width: 768px)` overrides.
3. **Always verify at 320px, 360px, 390px, 412px, and 480px** after any mobile change.
4. **Check for horizontal overflow** (`overflow-x` on `body`) after any layout change.
5. **Touch targets must be at least 44px tall** on mobile.
6. **Font sizes must not go below 12px** on mobile (browser minimum is 10px but 12px is the practical minimum for readability).
7. **The `.video-body` wrapper must remain a single grid child** in `.video-card`. Do not make its children direct grid children.
8. **The lead story card must remain full-width** on all viewports.
9. **The sidebar (`#videos`) must be `position: static` on mobile** — sticky positioning breaks the single-column layout.
10. **The `--gutter` variable must be `20px` on mobile** — do not override it to a smaller value.
