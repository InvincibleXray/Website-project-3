# Known Issues

> WEVOX — Current bugs, technical debt, and priorities.

Related: [SECURITY.md](SECURITY.md) | [ROADMAP.md](ROADMAP.md) | [AI_DEVELOPER_GUIDE.md](AI_DEVELOPER_GUIDE.md)

---

## Active Bugs

| # | Issue | File | Severity | Status |
|---|---|---|---|---|
| 1 | `admin.html` (legacy admin) still exists in repository | `admin.html` | Medium | Open |
| 2 | DOMPurify SRI hash in `story.html` appears malformed | `story.html` | Medium | Needs Verification |
| 3 | `news.html` purpose is unclear — may be unused | `news.html` | Low | Needs Verification |
| 4 | No `sitemap.xml` or `robots.txt` | Root | High | Open |
| 5 | Dynamic meta tags on `story.html` not crawlable without JS | `story.html` | High | Open |
| 6 | No `og:image` tag on any page | All pages | Medium | Open |
| 7 | Firebase config duplicated in every HTML file | All pages | Low | Open (by design, but technical debt) |
| 8 | CSS design tokens duplicated in every HTML file | All pages | Low | Open (by design, but technical debt) |
| 9 | No Firestore security rules confirmed | Firebase Console | High | Needs Verification |
| 10 | Admin panel has no role-based access control | `admin-ultra.html` | High | Open |
| 11 | YouTube API key has no confirmed HTTP referrer restriction | Google Cloud Console | Medium | Needs Verification |

---

## Technical Debt

| Item | Description | Impact |
|---|---|---|
| CSS duplication | All design tokens and base styles are copied into every HTML file | Maintenance burden: changing a token requires updating every file |
| Firebase config duplication | Same config object in every HTML file | If config changes, every file must be updated |
| No shared component system | Navbar, footer, and other shared components are duplicated | Changes to navbar require updating every page |
| Inline scripts | All JS is inline in `<script>` blocks | No code reuse, no linting, no type checking |
| No error monitoring | No Sentry or equivalent | Errors in production are invisible |
| No analytics | No confirmed analytics implementation | Cannot measure readership or engagement |
| `admin.html` not deleted | Legacy file still in repository | Confusion risk, potential security surface |
| Quill 1.3.7 | Quill is on an old version (1.3.7, released 2019) | May have unpatched vulnerabilities |

---

## Fixed Issues (Historical)

| Issue | Fix applied | Commit |
|---|---|---|
| XSS via article body HTML | DOMPurify 3.1.6 added to `story.html` | — |
| XSS in admin dashboard | `esc()` function applied to all admin-rendered content | — |
| Mobile cover image rendering bug in `story.html` | Root-cause fix applied to cover image CSS | — |
| Field Reports card metadata competing with headline | DOM fix: wrapped text in `.video-body` flex container | — |
| Trending cards visually empty | Added thumbnails with rank badge overlay | — |
| Per-story font selection | Removed permanently; Literata is global headline font | — |
| Legacy admin panel | `admin.html` retired (file still exists, not linked) | — |

---

## Priority Matrix

| Priority | Issues |
|---|---|
| **High** | #4 (no sitemap), #5 (meta not crawlable), #9 (Firestore rules), #10 (admin auth) |
| **Medium** | #1 (legacy admin file), #2 (DOMPurify SRI), #6 (no og:image), #11 (YouTube key) |
| **Low** | #3 (news.html), #7 (config duplication), #8 (CSS duplication) |
