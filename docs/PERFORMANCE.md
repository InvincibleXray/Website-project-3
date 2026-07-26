# Performance

> WEVOX — Lazy loading, rendering optimisation, critical path, and future improvements.

Related: [PROJECT_ARCHITECTURE.md](PROJECT_ARCHITECTURE.md) | [SEO.md](SEO.md)

---

## Current Performance Strategies

### Lazy image loading

All images below the fold use `loading="lazy"`:

```html
<img class="story-thumb" src="..." alt="" loading="lazy" />
```

This defers image fetching until the image is near the viewport, reducing initial page load bandwidth.

### Skeleton loaders

Every dynamic section shows a shimmer skeleton immediately on page load, before Firestore data arrives. This eliminates layout shift and gives the user immediate visual feedback.

### IntersectionObserver for scroll effects

Article paragraph reveal animations use `IntersectionObserver` instead of scroll event listeners:

```javascript
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
      obs.unobserve(e.target); // Stop observing after reveal
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
```

`IntersectionObserver` is more performant than scroll listeners because it runs off the main thread.

### Image error fallbacks

All images have `onerror` fallbacks to prevent broken image icons:

```html
<img src="{url}" onerror="this.src='{fallbackUrl}'" />
```

### Font preconnect

Google Fonts connections are preconnected before the stylesheet loads:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

### Inline CSS

CSS is inline in `<style>` blocks, eliminating one render-blocking HTTP request per page.

### Demo fallback data

If Firestore is slow or unavailable, `SAMPLE_*` data renders immediately. The page is never blank.

---

## Critical Rendering Path

```
1. HTML parse begins
2. Inline <style> applied (no external CSS request)
3. Skeleton loaders visible
4. Google Fonts loaded (preconnected, non-blocking)
5. Firebase SDK loaded (from gstatic.com CDN)
6. Firebase initialised
7. Firestore queries fired
8. YouTube API called (index.html, media.html)
9. Data arrives → render functions called
10. Skeletons replaced with real content
11. IntersectionObserver set up for scroll reveals
```

**Render-blocking resources:** Firebase SDK scripts are render-blocking. They are placed at the bottom of `<body>` to minimise impact.

---

## Known Performance Gaps

| Gap | Impact | Priority |
|---|---|---|
| No CDN for HTML files | Slower TTFB for distant users | Medium |
| Firebase SDK not deferred | Render-blocking | Low (already at bottom of body) |
| No service worker / caching | Every visit re-fetches all data | Medium |
| CSS duplicated across all HTML files | Larger total download | Low |
| No image compression pipeline | Cover images may be large | Medium |
| YouTube API called on every homepage load | API quota consumption | Low |
| No pagination on stories list | All 40 stories loaded at once | Low |

---

## Future Improvements

| Improvement | Expected impact |
|---|---|
| Add service worker for offline caching | Instant repeat visits, offline reading |
| Implement Firebase CDN / hosting | Faster TTFB globally |
| Add `srcset` to cover images | Serve appropriately sized images per device |
| Defer Firebase SDK with `defer` attribute | Unblock rendering |
| Implement Firestore real-time listeners for trending | Live updates without page refresh |
| Add pagination to stories list | Reduce initial data load |
| Extract shared CSS to a single stylesheet | Reduce total CSS download |
