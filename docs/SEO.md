# SEO

> WEVOX — Metadata, Open Graph, structured data, and future improvements.

Related: [PERFORMANCE.md](PERFORMANCE.md) | [STORY_PIPELINE.md](STORY_PIPELINE.md)

---

## Current SEO Implementation

### Meta tags (all pages)

Every page has:
```html
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="description" content="..." />
```

### Open Graph tags

Present on all public pages:
```html
<meta property="og:title" content="WEVOX — Student journalism. No filters." />
<meta property="og:description" content="..." />
<meta property="og:type" content="website" /> <!-- or "article" on story.html -->
```

### Dynamic meta on story pages

`story.html` updates meta tags dynamically after the story loads:

```javascript
document.title = `${story.title} — WEVOX`;
document.getElementById('metaDesc').setAttribute('content', story.excerpt || story.title);
document.getElementById('ogTitle').setAttribute('content', `${story.title} — WEVOX`);
document.getElementById('ogDesc').setAttribute('content', story.excerpt || '');
```

**Gap:** Dynamic meta updates happen after JavaScript executes. Search engine crawlers that do not execute JavaScript will see the default placeholder meta, not the story-specific meta.

### Page titles

| Page | Title pattern |
|---|---|
| `index.html` | `WEVOX — Student journalism. No filters.` |
| `story.html` | `{story.title} — WEVOX` (set dynamically) |
| `stories.html` | `Stories — WEVOX` |
| `media.html` | `WEVOX — Field Reports` |
| `submit.html` | `Submit Your Story — WEVOX` |
| `profile.html` | `My Profile — WEVOX` |
| `community.html` | `WEVOX — Community` |
| `about.html` | `WEVOX — About` |

---

## SEO Gaps

| Gap | Impact | Priority |
|---|---|---|
| No `sitemap.xml` | Search engines cannot discover all story URLs | High |
| No `robots.txt` | No crawl guidance for search engines | High |
| Dynamic meta not crawlable by JS-disabled crawlers | Story pages may not rank for their headlines | High |
| No `og:image` tag | Social shares show no preview image | Medium |
| No canonical URL tags | Duplicate content risk if stories are shared with query params | Medium |
| No structured data (JSON-LD) | No rich results in Google Search | Medium |
| No Twitter Card meta tags | Twitter/X shares show no card preview | Low |

---

## Future Improvements

| Improvement | Implementation |
|---|---|
| Add `sitemap.xml` | Generate from Firestore published stories list |
| Add `robots.txt` | Allow all, disallow `/admin-ultra.html` |
| Add `og:image` | Set to story `coverImage` URL |
| Add canonical URL | `<link rel="canonical" href="{storyUrl}">` |
| Add JSON-LD structured data | `Article` schema with headline, author, datePublished, image |
| Add Twitter Card meta | `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image` |
| Consider SSR or pre-rendering | For story pages to make meta crawlable without JS |
