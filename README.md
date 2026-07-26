# WEVOX

> **Student journalism. No filters.**

[![Status](https://img.shields.io/badge/status-active-brightgreen)](#)
[![Stack](https://img.shields.io/badge/stack-Vanilla%20JS%20%2B%20Firebase-orange)](#)
[![License](https://img.shields.io/badge/license-MIT-blue)](#license)

WEVOX is a premium student journalism and news platform built for India’s youth newsroom. Verified student journalists publish investigative stories and field video reports — no filters, no gatekeeping.

Inspired by the editorial design language of The New York Times, Reuters, Bloomberg, Apple News, The Hindu, and Indian Express.

---

## Table of Contents

- [Vision](#vision)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture Overview](#architecture-overview)
- [Local Setup](#local-setup)
- [Current Status](#current-status)
- [Roadmap](#roadmap)
- [Documentation](#documentation)
- [License](#license)

---

## Vision

WEVOX exists to give student journalists a platform that matches the quality of professional newsrooms. Every design and engineering decision is made in service of one goal: making student reporting look and feel as credible as it is.

- **Premium editorial design** — not a blog, not a social feed
- **Verified correspondents** — real students, real campuses
- **No algorithmic gatekeeping** — editorial decisions made by humans
- **Mobile-first** — most readers are on phones

---

## Features

| Feature | Status |
|---|---|
| Homepage with editorial story hierarchy | ✅ Live |
| Full article reader with reading progress bar | ✅ Live |
| Field Reports (YouTube integration) | ✅ Live |
| Trending Now section with thumbnails | ✅ Live |
| Category filter bar | ✅ Live |
| Live ticker / breaking news strip | ✅ Live |
| Story submission with Quill rich-text editor | ✅ Live |
| Firebase Authentication (email/password) | ✅ Live |
| Admin dashboard (approve / publish / edit) | ✅ Live |
| User profile dashboard | ✅ Live |
| Community leaderboard | ✅ Live |
| DOMPurify XSS protection | ✅ Live |
| Skeleton loading states | ✅ Live |
| Share buttons (Twitter/X, WhatsApp, Copy) | ✅ Live |
| Table of contents (auto-generated) | ✅ Live |
| Related stories sidebar | ✅ Live |
| More Stories section | ✅ Live |
| Mobile hamburger navigation | ✅ Live |
| Floating Action Button (FAB) | ✅ Live |
| Cloudinary image upload | 🚧 Needs Verification |
| Sitemap / robots.txt | ❌ Not yet |
| PWA / offline support | ❌ Not yet |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Markup | Pure HTML5 |
| Styling | Pure CSS3 (no framework) |
| Scripting | Vanilla JavaScript (ES2020+) |
| Database | Firebase Firestore |
| Authentication | Firebase Auth (email/password) |
| Media | Cloudinary (uploads), YouTube Data API v3 |
| Rich Text Editor | Quill.js 1.3.7 |
| XSS Sanitisation | DOMPurify 3.1.6 |
| Fonts | Google Fonts (Literata, DM Sans, IBM Plex Mono) |
| Hosting | *Needs Verification* |
| Version Control | Git + GitLab |

> **No build step. No bundler. No framework.** Every file is a self-contained HTML document that runs directly in the browser.

---

## Project Structure

```
wevox/
├── index.html            # Homepage — editorial feed, trending, field reports
├── story.html            # Dynamic article reader (Firestore ID or YouTube ID)
├── stories.html          # Full story listing with search and filters
├── media.html            # Field Reports — YouTube video grid
├── submit.html           # Story submission form (auth-gated)
├── admin-ultra.html      # Admin dashboard (auth-gated, role-checked)
├── profile.html          # User profile and journalist dashboard
├── community.html        # Community leaderboard and contributor list
├── about.html            # Static about page
├── join.html             # Join / onboarding page
├── news.html             # *Needs Verification — purpose unclear*
├── admin.html            # Legacy admin — retired, do not use
└└── docs/                 # Full documentation suite
    ├── PROJECT_ARCHITECTURE.md
    ├── SYSTEM_WORKFLOW.md
    ├── STORY_PIPELINE.md
    ├── FIREBASE.md
    ├── CLOUDINARY.md
    ├── UI_DESIGN_SYSTEM.md
    ├── COMPONENTS.md
    ├── SECURITY.md
    ├── PERFORMANCE.md
    ├── SEO.md
    ├── RESPONSIVE_GUIDE.md
    ├── AI_DEVELOPER_GUIDE.md
    ├── KNOWN_ISSUES.md
    └── ROADMAP.md
```

---

## Architecture Overview

WEVOX uses a **serverless, document-centric architecture**. There is no backend server. All data lives in Firestore. All rendering happens in the browser.

```
Browser
  │
  ├── HTML file (self-contained page)
  │     ├── Inline CSS (design tokens + component styles)
  │     └── Inline JS (Firebase SDK + page logic)
  │
  ├── Firebase Firestore (stories, trending, config)
  ├── Firebase Auth (user sessions)
  ├── YouTube Data API v3 (field report videos)
  └── Cloudinary (image delivery)
```

See [docs/PROJECT_ARCHITECTURE.md](docs/PROJECT_ARCHITECTURE.md) for the full rendering pipeline.

---

## Local Setup

No build step required.

```bash
# 1. Clone the repository
git clone https://gitlab.com/invpomega-group/Website-project-3.git
cd Website-project-3

# 2. Open in browser
# Option A: Direct file open
open index.html

# Option B: Local server (recommended to avoid CORS issues with Firebase)
npx serve .
# or
python3 -m http.server 8080
```

> Firebase credentials are embedded in each HTML file. The project uses a real Firebase project (`cjnsite-d3f3f`). For local development, the demo fallback data activates automatically if Firestore is unreachable.

---

## Current Status

| Area | Status | Notes |
|---|---|---|
| Homepage | ✅ Stable | Field Reports hierarchy fix applied |
| Story reader | ✅ Stable | DOMPurify sanitisation active |
| Admin dashboard | ✅ Stable | Legacy admin retired |
| Submit flow | ✅ Stable | Auth-gated |
| Mobile layout | ✅ Stable | Verified 320px–480px |
| Typography | ✅ Stable | Literata global headline font |
| XSS protection | ✅ Fixed | DOMPurify on all user content |
| Cloudinary | 🚧 Needs Verification | Upload flow exists in submit.html |
| SEO | ⚠️ Partial | OG tags present, no sitemap |
| Performance | ⚠️ Partial | Lazy loading active, no CDN confirmed |

---

## Roadmap

See [docs/ROADMAP.md](docs/ROADMAP.md) for the full phased plan.

**Phase 1 (Immediate)**
- Sitemap + robots.txt
- Firestore security rules audit
- Remove legacy `admin.html`

**Phase 2 (Near-term)**
- Search functionality
- Tag-based filtering
- Author profile pages

**Phase 3 (Long-term)**
- PWA / offline reading
- Push notifications
- Multi-language support

---

## Documentation

| Document | Purpose |
|---|---|
| [PROJECT_ARCHITECTURE.md](docs/PROJECT_ARCHITECTURE.md) | Full system architecture and rendering pipeline |
| [SYSTEM_WORKFLOW.md](docs/SYSTEM_WORKFLOW.md) | Every user and admin workflow |
| [STORY_PIPELINE.md](docs/STORY_PIPELINE.md) | Article lifecycle from submission to reader |
| [FIREBASE.md](docs/FIREBASE.md) | Firestore schema, auth, rules, data flow |
| [CLOUDINARY.md](docs/CLOUDINARY.md) | Image upload, delivery, and optimisation |
| [UI_DESIGN_SYSTEM.md](docs/UI_DESIGN_SYSTEM.md) | Typography, colour, spacing, editorial identity |
| [COMPONENTS.md](docs/COMPONENTS.md) | Every reusable UI component documented |
| [SECURITY.md](docs/SECURITY.md) | XSS, auth, input validation, known risks |
| [PERFORMANCE.md](docs/PERFORMANCE.md) | Lazy loading, rendering, critical path |
| [SEO.md](docs/SEO.md) | Metadata, Open Graph, structured data |
| [RESPONSIVE_GUIDE.md](docs/RESPONSIVE_GUIDE.md) | Breakpoints, layout rules, mobile philosophy |
| [AI_DEVELOPER_GUIDE.md](docs/AI_DEVELOPER_GUIDE.md) | Instructions for AI assistants continuing development |
| [KNOWN_ISSUES.md](docs/KNOWN_ISSUES.md) | Current bugs, technical debt, priorities |
| [ROADMAP.md](docs/ROADMAP.md) | Phased future development plan |

---

## License

MIT License — see `LICENSE` file.

---

## Credits

Built by the WEVOX team. Inspired by the editorial standards of The New York Times, Reuters, Bloomberg, Apple News, The Hindu, and Indian Express.

> *Student journalism. No filters.*
