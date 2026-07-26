# System Workflow

> WEVOX — Every user and admin workflow, step by step.

Related: [STORY_PIPELINE.md](STORY_PIPELINE.md) | [FIREBASE.md](FIREBASE.md) | [PROJECT_ARCHITECTURE.md](PROJECT_ARCHITECTURE.md)

---

## Workflows

- [Homepage Rendering](#homepage-rendering)
- [Story Reading](#story-reading)
- [Field Report Viewing](#field-report-viewing)
- [Story Submission](#story-submission)
- [Admin: Review and Publish](#admin-review-and-publish)
- [Authentication](#authentication)
- [Category Filtering](#category-filtering)
- [Trending Section](#trending-section)
- [Profile Dashboard](#profile-dashboard)
- [Community Leaderboard](#community-leaderboard)
- [Media / Field Reports Page](#media--field-reports-page)

---

## Homepage Rendering

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Firestore
    participant YouTube

    User->>Browser: Navigate to index.html
    Browser->>Browser: Parse HTML, apply CSS, show skeleton loaders
    Browser->>Firestore: fetchStories() — published, desc publishedAt, limit 40
    Browser->>YouTube: fetchChannelVideos(6) via YouTube Data API v3
    Browser->>Firestore: fetchTrending() — limit 12
    Browser->>Firestore: loadSiteConfig() — hero + footer docs
    Firestore-->>Browser: stories array (or SAMPLE_STORIES fallback)
    Browser->>Browser: renderStories() — lead card + 3 list cards
    YouTube-->>Browser: videos array (sorted by views, top 3)
    Browser->>Browser: renderVideoCards() — Field Reports sidebar
    Firestore-->>Browser: trending array (or SAMPLE_TRENDING fallback)
    Browser->>Browser: renderTrending() — cards with thumbnails + rank badges
    Browser->>Browser: renderTicker() — duplicate items for smooth marquee loop
    Firestore-->>Browser: siteConfig hero + footer
    Browser->>Browser: Update hero text and footer links from Firestore
```

**Fallback behaviour:** If any Firestore call fails, the page renders with `SAMPLE_*` demo data. The user never sees an error state on the homepage.

---

## Story Reading

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Firestore

    User->>Browser: Navigate to story.html?id={storyId}
    Browser->>Browser: Show skeleton loader
    Browser->>Firestore: db.collection(stories).doc(storyId).get()
    alt Story found and published
        Firestore-->>Browser: story document
        Browser->>Firestore: increment views by 1 (fire and forget)
        Browser->>Browser: renderStory(story)
        Browser->>Browser: Update <title>, og:title, og:description
        Browser->>Browser: buildTOC(articleBody) — auto-generate table of contents
        Browser->>Browser: setupParagraphReveal() — IntersectionObserver on paragraphs
        Browser->>Browser: buildShareButtons() — Twitter/X, WhatsApp, Copy
        Browser->>Firestore: loadMoreStories() — same category, limit 6
        Browser->>Browser: Render More Stories grid
    else Story status is pending
        Browser->>Browser: showUnderReview() state
    else Story not found
        Browser->>Browser: showNotFound() state
    else Firestore error
        Browser->>Browser: Try SAMPLE_STORIES fallback
    end
```

---

## Field Report Viewing

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant YouTube
    participant Firestore

    User->>Browser: Navigate to story.html?ytid={youtubeId}
    Browser->>YouTube: videos?id={ytId}&part=snippet,contentDetails,statistics
    YouTube-->>Browser: video metadata
    Browser->>Browser: renderVideo(story) — embed iframe + metadata
    Browser->>Firestore: Check videoCategories for admin note
    Firestore-->>Browser: admin note (if exists)
    Browser->>Browser: showAdminNote() below share row
```

---

## Story Submission

```mermaid
sequenceDiagram
    participant Contributor
    participant Browser
    participant FirebaseAuth
    participant Cloudinary
    participant Firestore

    Contributor->>Browser: Navigate to submit.html
    Browser->>FirebaseAuth: onAuthStateChanged()
    alt Not signed in
        FirebaseAuth-->>Browser: null
        Browser->>Browser: Show auth gate card
        Contributor->>Browser: Click Log In
        Browser->>FirebaseAuth: signInWithEmailAndPassword()
        FirebaseAuth-->>Browser: user object
        Browser->>Browser: Show submission form
    end
    Contributor->>Browser: Fill form (title, category, content via Quill)
    Contributor->>Browser: Upload cover image
    Browser->>Cloudinary: Upload image via Cloudinary upload API
    Cloudinary-->>Browser: Image URL
    Contributor->>Browser: Submit form
    Browser->>Browser: Client-side validation
    Browser->>Firestore: submissions.add({ ...formData, status: pending, authorUid })
    Firestore-->>Browser: Success
    Browser->>Browser: Show success message
```

---

## Admin: Review and Publish

```mermaid
sequenceDiagram
    participant Admin
    participant Browser
    participant FirebaseAuth
    participant Firestore

    Admin->>Browser: Navigate to admin-ultra.html
    Browser->>FirebaseAuth: onAuthStateChanged()
    alt Not signed in
        Browser->>Browser: Show login overlay
        Admin->>Browser: Enter credentials
        Browser->>FirebaseAuth: signInWithEmailAndPassword()
    end
    FirebaseAuth-->>Browser: user object
    Browser->>Browser: Show admin dashboard
    Browser->>Firestore: fetchPending() — submissions where status == pending
    Firestore-->>Browser: pending submissions array
    Browser->>Browser: Render submissions table
    Admin->>Browser: Click Review on a submission
    Browser->>Browser: Open modal with full submission content + Quill editor
    Admin->>Browser: Edit content if needed
    Admin->>Browser: Click Approve
    Browser->>Firestore: stories.add({ ...submission, status: published, publishedAt: now })
    Browser->>Firestore: submissions.doc(id).update({ status: approved })
    Firestore-->>Browser: Success
    Browser->>Browser: Toast notification, refresh pending list
```

---

## Authentication

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant FirebaseAuth

    User->>Browser: Click Log In
    Browser->>Browser: Navigate to profile.html
    Browser->>FirebaseAuth: onAuthStateChanged()
    alt Already signed in
        FirebaseAuth-->>Browser: user object
        Browser->>Browser: Show profile dashboard
    else Not signed in
        FirebaseAuth-->>Browser: null
        Browser->>Browser: Show login form
        User->>Browser: Enter email + password
        Browser->>FirebaseAuth: signInWithEmailAndPassword()
        alt Success
            FirebaseAuth-->>Browser: user object
            Browser->>Browser: Show profile dashboard
        else Error
            FirebaseAuth-->>Browser: error code
            Browser->>Browser: Show mapped error message
        end
    end
```

---

## Category Filtering

1. User clicks a category chip (e.g., "Campus Fraud")
2. All chips lose `.active` class; clicked chip gains `.active`
3. `currentCategory` state variable is updated
4. `renderStories()` is called — filters `allStories` array client-side by `matchesCategory()`
5. `renderVideos()` is called — filters `allVideos` array client-side
6. No new Firestore request is made — filtering is entirely client-side on already-loaded data

---

## Trending Section

1. `fetchTrending()` reads the `trending` Firestore collection (limit 12)
2. `renderTicker()` duplicates the items array and renders a marquee strip
3. `renderTrending()` renders cards with:
   - Thumbnail resolved via `resolveTrendingThumb()`: `t.imageUrl` → `allStories` lookup by `ref_id` → picsum fallback
   - Rank badge overlaid on thumbnail (bottom-left)
   - Category tag, headline, read count in `.trending-body`
4. Cards are horizontally scrollable with `scroll-snap-type: x mandatory`

---

## Profile Dashboard

1. `onAuthStateChanged()` checks auth state
2. If signed in: reads user's stories from Firestore by `authorUid`
3. Displays: story count, total views, submitted stories list
4. If not signed in: shows login prompt

---

## Community Leaderboard

1. Reads contributor data from Firestore
2. Renders ranked list of contributors by story count or views
3. Public page — no auth required

---

## Media / Field Reports Page

1. `fetchChannelVideos()` calls YouTube Data API v3
2. Fetches channel uploads playlist
3. Fetches video metadata (title, thumbnail, duration, views, publishedAt)
4. Renders video grid with category filter
5. Click on video card navigates to `story.html?ytid={youtubeId}`
