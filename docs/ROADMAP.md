# Roadmap

> WEVOX — Phased future development plan.

Related: [KNOWN_ISSUES.md](KNOWN_ISSUES.md) | [FIREBASE.md](FIREBASE.md) | [SEO.md](SEO.md)

---

## Phase 1 — Immediate (Security + SEO Foundation)

These items address active risks and critical gaps. They should be completed before any new features.

| Task | File | Type |
|---|---|---|
| Add `sitemap.xml` | Root | SEO |
| Add `robots.txt` | Root | SEO |
| Implement Firestore security rules | Firebase Console | Security |
| Add role-based admin authorisation | `admin-ultra.html` + Firestore | Security |
| Delete `admin.html` from repository | `admin.html` | Security |
| Add `og:image` to all pages | All pages | SEO |
| Verify and fix DOMPurify SRI hash | `story.html` | Security |
| Add HTTP referrer restriction to YouTube API key | Google Cloud Console | Security |

---

## Phase 2 — Near-term (Features + UX)

| Task | Description | Type |
|---|---|---|
| Full-text search | Search bar on `stories.html` filtering by title and content | Feature |
| Tag-based filtering | Click a tag pill on story page to see all stories with that tag | Feature |
| Author profile pages | Public page for each contributor showing their stories | Feature |
| Story bookmarking | Save stories to read later (localStorage or Firestore) | Feature |
| Reading history | Track recently read stories per user | Feature |
| Email notifications | Notify contributors when their story is approved | Feature |
| Pagination on stories list | Load more button or infinite scroll | Performance |
| `og:image` dynamic per story | Set to story `coverImage` URL | SEO |
| JSON-LD structured data | `Article` schema on story pages | SEO |
| Twitter Card meta tags | Rich preview on Twitter/X shares | SEO |

---

## Phase 3 — Long-term (Scale + Platform)

| Task | Description | Type |
|---|---|---|
| PWA / offline reading | Service worker, offline cache, install prompt | Performance |
| Push notifications | Breaking news alerts for subscribers | Feature |
| Multi-language support | Hindi and regional language story submission | Feature |
| Video upload (non-YouTube) | Direct video upload to Firebase Storage or Cloudinary | Feature |
| Newsletter integration | Weekly digest email to subscribers | Feature |
| Contributor verification system | Badge system for verified student journalists | Feature |
| Analytics dashboard | Readership metrics for contributors and admins | Feature |
| Content moderation queue | AI-assisted pre-screening of submissions | Feature |
| API layer | REST or GraphQL API for third-party integrations | Architecture |

---

## Technical Improvements

| Improvement | Reason |
|---|---|
| Extract shared CSS to a single stylesheet | Eliminate duplication across HTML files |
| Extract shared JS utilities to a single file | Eliminate duplication of `escapeHtml`, `formatDate`, etc. |
| Upgrade Quill to latest version | Security and feature improvements |
| Add error monitoring (Sentry) | Visibility into production errors |
| Add Cloudinary `f_auto,q_auto` transformations | Automatic image optimisation |
| Add `srcset` to cover images | Responsive images for different viewports |
| Implement Firebase App Check | Prevent API abuse |

---

## Long-term Vision

WEVOX aims to become the definitive platform for student journalism in India — a place where a story broken by a 19-year-old correspondent at a Tier-2 college gets the same editorial presentation as a story in a national newspaper.

The technical roadmap serves this vision by:
- Making the platform faster and more reliable for readers on slow mobile connections
- Making the submission and editorial workflow easier for contributors and admins
- Making stories more discoverable through SEO and social sharing
- Making the platform scalable as the contributor network grows
