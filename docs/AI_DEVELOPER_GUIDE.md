# AI Developer Guide

> Instructions for AI assistants continuing development on WEVOX.
> Read this entire document before making any code change.

Related: [PROJECT_ARCHITECTURE.md](PROJECT_ARCHITECTURE.md) | [UI_DESIGN_SYSTEM.md](UI_DESIGN_SYSTEM.md) | [RESPONSIVE_GUIDE.md](RESPONSIVE_GUIDE.md) | [SECURITY.md](SECURITY.md)

---

## Table of Contents

- [Project Philosophy](#project-philosophy)
- [Architecture Principles](#architecture-principles)
- [Coding Conventions](#coding-conventions)
- [Debugging Methodology](#debugging-methodology)
- [Root-Cause Analysis Process](#root-cause-analysis-process)
- [Rendering Pipeline Investigation](#rendering-pipeline-investigation)
- [Responsive Debugging Workflow](#responsive-debugging-workflow)
- [When to Modify HTML](#when-to-modify-html)
- [When to Modify CSS](#when-to-modify-css)
- [When to Modify JavaScript](#when-to-modify-javascript)
- [When NOT to Redesign](#when-not-to-redesign)
- [Editorial Identity Rules](#editorial-identity-rules)
- [Security Rules](#security-rules)
- [Performance Rules](#performance-rules)
- [Checklist Before Every Code Modification](#checklist-before-every-code-modification)
- [Checklist After Every Code Modification](#checklist-after-every-code-modification)
- [Common Mistakes to Avoid](#common-mistakes-to-avoid)

---

## Project Philosophy

WEVOX is a **production news platform**, not a prototype. Every change must be treated as a change to a live editorial product.

1. **Credibility is the product.** The design must always look professional. A broken layout or a visual regression is not a minor bug — it damages the platform's credibility.
2. **Minimal changes over clever solutions.** The smallest fix that solves the root cause is always preferred over a comprehensive refactor.
3. **Preserve what works.** Desktop layouts are stable. Mobile layouts have been carefully tuned. Do not touch what is not broken.
4. **Root cause first, fix second.** Never apply a fix before identifying the exact cause. A wrong fix is worse than no fix.
5. **No assumptions.** Read the actual code. Trace the actual DOM. Do not guess.

---

## Architecture Principles

1. **No build step.** There is no Webpack, Vite, or any bundler. Do not suggest adding one.
2. **No framework.** There is no React, Vue, or Angular. Do not suggest adding one.
3. **No external CSS files.** All CSS is inline in `<style>` blocks. Do not create `.css` files.
4. **No external JS files.** All JavaScript is inline in `<script>` blocks. Do not create `.js` files.
5. **Each HTML file is self-contained.** It has its own CSS, its own JS, its own Firebase init.
6. **Demo fallback data always exists.** Every page that reads Firestore has `SAMPLE_*` constants. Never remove them.
7. **Firebase Compat SDK.** The project uses `firebase-app-compat.js`, not the modular v9 SDK. Use `firebase.firestore()` style calls.

---

## Coding Conventions

### HTML

- Use semantic HTML5 elements: `<header>`, `<nav>`, `<main>`, `<aside>`, `<section>`, `<article>`, `<footer>`
- All interactive elements must have `aria-label` attributes
- Images must have `alt` attributes (empty string `alt=""` for decorative images)
- Use `loading="lazy"` on all images below the fold
- Never use inline `onclick` handlers. Use `addEventListener` in the script block.

### CSS

- Always use CSS custom properties (`var(--token)`) for colours, fonts, and spacing. Never hardcode hex values in component styles.
- Follow the existing section comment pattern: `/* ============ SECTION NAME ============ */`
- Mobile overrides go in `@media (max-width: 768px)` blocks at the bottom of the `<style>` block
- Never use `!important` except to override third-party styles (e.g., Quill)
- Use `min-width: 0` on flex/grid children that contain text to prevent overflow

### JavaScript

- Use `const escapeHtml(value)` for every variable interpolated into a template literal
- Use `DOMPurify.sanitize()` for any HTML string from Firestore that is injected via `innerHTML`
- Wrap all Firestore calls in `try/catch`
- Always provide a fallback to `SAMPLE_*` data if Firestore returns empty
- Use `const $ = (id) => document.getElementById(id)` shorthand for DOM lookups
- Never use `document.write()`
- Never use `eval()`

### Naming conventions

| Type | Convention | Example |
|---|---|---|
| CSS classes | kebab-case | `.story-card`, `.video-body` |
| CSS custom properties | `--kebab-case` | `--accent`, `--font-headline` |
| JS functions | camelCase | `renderStories()`, `fetchTrending()` |
| JS constants | UPPER_SNAKE_CASE | `SAMPLE_STORIES`, `YOUTUBE_API_KEY` |
| JS variables | camelCase | `allStories`, `currentCategory` |
| HTML IDs | camelCase | `storiesList`, `videosList` |

---

## Debugging Methodology

Follow this exact sequence for every bug report:

### Step 1: Understand the symptom precisely
- What exactly is wrong? ("metadata appears beside headline" not "layout is broken")
- On which page? Which section? Which component?
- On which viewport? Desktop, tablet, or mobile?
- Is it a CSS layout issue, a JS rendering issue, or a data issue?

### Step 2: Read the actual code
- Read the HTML structure generated by the relevant render function
- Read every CSS rule that applies to the affected elements
- Do not rely on memory or assumptions about what the code does

### Step 3: Trace the computed layout
- For CSS layout bugs: trace the display model (grid, flex, block) of the element and all its ancestors
- For JS rendering bugs: trace the exact HTML string generated by the render function
- Identify the exact property or combination of properties causing the issue

### Step 4: Identify the root cause
- State the root cause explicitly before writing any fix
- If the root cause is in the DOM structure (generated by JS), fix the DOM structure
- If the root cause is in CSS, fix the CSS
- Do not apply CSS workarounds to DOM structure problems

### Step 5: Apply the smallest possible fix
- Change only what is necessary
- Do not refactor surrounding code
- Do not add new abstractions

---

## Root-Cause Analysis Process

For layout bugs specifically, follow this investigation order:

```
1. What is the display model of the broken element?
   (display: grid / flex / block / inline-block)

2. What are its direct children?
   (Are they grid items? Flex items? Block elements?)

3. How many grid/flex children are there?
   (A grid with 2 columns and 4 children places them in 2 rows)

4. Is there a wrapper div where there should be one?
   (Three bare grid children vs. one wrapper containing three flex children)

5. What is min-width on the children?
   (Default min-width: auto prevents text from shrinking in flex/grid)

6. What does the mobile override change?
   (Does it change the display model? Does it conflict with base styles?)

7. What did the previous fix change?
   (Did it address the root cause or patch a symptom?)
```

### Lesson learned: The Field Reports bug

The Field Reports card bug (metadata appearing beside headline on mobile) was misdiagnosed twice:

- **Wrong diagnosis 1:** `-webkit-line-clamp` was causing the issue. Fix: remove clamp. **Result:** Made it worse (`overflow: visible` caused text bleed).
- **Wrong diagnosis 2:** `align-items` was wrong. Fix: add `align-items: start`. **Result:** No improvement.
- **Correct diagnosis:** `.video-tag`, `.video-title`, and `.video-meta` were **bare direct children of the CSS grid** with no wrapper. Each was a separate grid item in column 2. Without a flex container wrapping them, their vertical relationship was controlled by implicit grid row sizing, which was fragile on narrow viewports.
- **Correct fix:** Wrap all three in `<div class="video-body">` (a flex column) inside `renderVideoCards()`. This made column 2 a single grid child, and the flex column guaranteed vertical stacking at all viewports.

**Key lesson:** When three elements need to stack vertically inside a grid cell, wrap them in a flex column container. Do not try to control their relationship with individual CSS overrides on each element.

---

## Rendering Pipeline Investigation

When a rendered component looks wrong, investigate in this order:

### 1. Find the render function

Every dynamic section has a named render function:

| Section | Render function | File |
|---|---|---|
| Stories list | `renderStories()` | `index.html` |
| Field Reports | `renderVideoCards()` | `index.html` |
| Trending Now | `renderTrending()` | `index.html` |
| Article body | `renderStory()` | `story.html` |
| Video page | `renderVideo()` | `story.html` |
| More Stories | `loadMoreStories()` | `story.html` |

### 2. Read the exact HTML the function generates

Do not read the CSS and guess what the HTML looks like. Read the template literal in the render function and mentally construct the DOM tree.

### 3. Check the CSS against the actual DOM

For every element in the generated DOM, trace:
- Its own `display` property
- Its parent's `display` property and grid/flex configuration
- Any `@media` overrides that apply at the target viewport

### 4. Check for conflicts between base styles and mobile overrides

Mobile overrides in `@media (max-width: 768px)` can conflict with base styles. Always check both.

---

## Responsive Debugging Workflow

For any mobile layout issue, verify at these exact widths:

| Width | Device class |
|---|---|
| 320px | Small Android phones |
| 360px | Common Android phones |
| 390px | iPhone 14 Pro |
| 412px | Pixel 7 |
| 480px | Large phones / small tablets |

For each width, verify:
1. No horizontal overflow (no scrollbar on `<body>`)
2. Text does not overflow its container
3. Images do not exceed their container width
4. Touch targets are at least 44px tall
5. The visual hierarchy matches the design intent

**Rule:** Mobile fixes must be applied in `@media (max-width: 768px)` blocks. Never modify base styles to fix a mobile-only issue.

---

## When to Modify HTML

Modify the HTML structure (or the JS that generates it) when:

- The DOM structure is the root cause of a layout bug (e.g., missing wrapper div)
- A new element needs to be added to a component (e.g., adding a thumbnail to a card)
- Accessibility attributes are missing (`aria-label`, `alt`, `role`)
- Semantic structure is wrong (e.g., using `<div>` where `<article>` is correct)

**Do not** modify HTML to work around a CSS problem. Fix the CSS.

---

## When to Modify CSS

Modify CSS when:

- A layout property is wrong (wrong `display`, `grid-template-columns`, `flex-direction`)
- A spacing value needs adjustment
- A responsive override is missing or incorrect
- A hover state or transition needs updating
- A new component needs styling

**Do not** add CSS overrides to fix a problem caused by wrong DOM structure. Fix the DOM.

---

## When to Modify JavaScript

Modify JavaScript when:

- A render function generates incorrect HTML structure
- A data fetch needs a new field
- A new event listener is needed
- A utility function has a bug
- A new feature requires new logic

**Always** use `escapeHtml()` on any new string interpolated into a template literal.
**Always** use `DOMPurify.sanitize()` on any new HTML string from Firestore injected via `innerHTML`.

---

## When NOT to Redesign

Do not redesign any section unless the user explicitly says "redesign" or "rebuild from scratch".

Specifically, do not:
- Change the homepage layout structure
- Change the story card design
- Change the article reader layout
- Change the footer structure
- Change the navbar design
- Change the colour palette
- Change the typography system
- Change the animation style

When asked to "fix" something, fix only the reported issue. Do not improve adjacent elements that were not mentioned.

---

## Editorial Identity Rules

1. **Literata is the global headline font.** Do not override it. Do not add per-story font selection.
2. **The accent colour is `#C8102E`.** Do not change it. Do not introduce other reds.
3. **The warm background is `#F9F7F4`.** Do not change it to `#FFFFFF`.
4. **The lead story is always full-width.** Do not make it a thumbnail card.
5. **Category tags are always monospace, uppercase, accent red.** Do not change this pattern.
6. **The WEVOX logo always ends with a red dot.** Do not remove it.
7. **The footer is always dark.** Do not make it light.

---

## Security Rules

1. **Always use `escapeHtml()` for string interpolation.** No exceptions.
2. **Always use `DOMPurify.sanitize()` for article body HTML.** No exceptions.
3. **Never use `innerHTML` with raw user data.** Always sanitise first.
4. **Never use `eval()`.** No exceptions.
5. **Never use `document.write()`.** No exceptions.
6. **Never remove the DOMPurify script tag from `story.html`.**
7. **Never add `onerror`, `onclick`, or other event attributes to HTML elements** generated from user data.

---

## Performance Rules

1. **Always use `loading="lazy"` on images below the fold.**
2. **Always use `onerror` fallback on images** to prevent broken image icons.
3. **Use `IntersectionObserver` for scroll-triggered effects**, not scroll event listeners.
4. **Do not add new external script dependencies** without explicit approval.
5. **Do not add new Google Font families.** The three existing fonts cover all use cases.

---

## Checklist Before Every Code Modification

- [ ] Have I read the actual code in the file, not just the description of the issue?
- [ ] Have I identified the exact root cause (not a symptom)?
- [ ] Have I traced the full DOM structure generated by the relevant render function?
- [ ] Have I checked all CSS rules that apply to the affected elements, including mobile overrides?
- [ ] Have I confirmed that my fix addresses the root cause, not a symptom?
- [ ] Have I confirmed that my fix does not break desktop layout?
- [ ] Have I confirmed that my fix does not break tablet layout?
- [ ] Have I confirmed that my fix does not introduce new XSS vectors?
- [ ] Is my fix the smallest possible change that solves the problem?
- [ ] Does my fix follow the existing code style and naming conventions?

---

## Checklist After Every Code Modification

- [ ] Does the fix resolve the reported issue at 320px, 360px, 390px, 412px, and 480px?
- [ ] Is the desktop layout unchanged?
- [ ] Is the tablet layout unchanged?
- [ ] Are all `escapeHtml()` calls still in place for interpolated values?
- [ ] Is DOMPurify still sanitising article body HTML?
- [ ] Are there no new `!important` declarations (unless justified)?
- [ ] Are there no hardcoded hex values in new CSS (use tokens instead)?
- [ ] Is the commit message descriptive and includes the root cause?

---

## Common Mistakes to Avoid

| Mistake | Why it's wrong | Correct approach |
|---|---|---|
| Applying CSS overrides to fix a DOM structure problem | CSS cannot fix a missing wrapper div | Fix the DOM structure in the render function |
| Diagnosing a layout bug without reading the render function | The generated HTML may differ from what you expect | Always read the template literal in the render function |
| Adding `overflow: visible` to fix a clipping issue | May cause text to bleed into adjacent elements | Fix the container sizing instead |
| Changing base styles to fix a mobile-only issue | Breaks desktop | Use `@media (max-width: 768px)` overrides |
| Using raw hex values in new CSS | Breaks design token system | Use `var(--token)` |
| Removing `escapeHtml()` from an interpolation | XSS vulnerability | Always keep it |
| Adding a new font family | Breaks typography consistency | Use the existing three fonts |
| Redesigning a section when asked to fix a bug | Scope creep, breaks existing design | Fix only the reported issue |
| Assuming the previous fix was correct | The previous fix may have been wrong | Re-read the code and re-diagnose |
| Fixing a symptom instead of the root cause | The bug will reappear in a different form | Always find and fix the root cause |
