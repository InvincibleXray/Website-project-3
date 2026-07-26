# Firebase

> WEVOX — Firestore schema, Authentication, data flow, and security.

Related: [SECURITY.md](SECURITY.md) | [STORY_PIPELINE.md](STORY_PIPELINE.md) | [PROJECT_ARCHITECTURE.md](PROJECT_ARCHITECTURE.md)

---

## Table of Contents

- [Project Configuration](#project-configuration)
- [Authentication](#authentication)
- [Firestore Collections](#firestore-collections)
- [Collection: stories](#collection-stories)
- [Collection: submissions](#collection-submissions)
- [Collection: trending](#collection-trending)
- [Collection: siteConfig](#collection-siteconfig)
- [Collection: videos](#collection-videos)
- [Collection: videoCategories](#collection-videocategories)
- [Read Operations](#read-operations)
- [Write Operations](#write-operations)
- [Indexes Required](#indexes-required)
- [Security Rules](#security-rules)
- [Data Relationships](#data-relationships)
- [Error Handling Strategy](#error-handling-strategy)
- [Future Improvements](#future-improvements)

---

## Project Configuration

The Firebase project used by WEVOX is `cjnsite-d3f3f`. The same config object is duplicated in every HTML file that uses Firebase.

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBjMv5lhUQxDQdC3mihSH4Ep3ctFGxUZQY",
  authDomain: "cjnsite-d3f3f.firebaseapp.com",
  projectId: "cjnsite-d3f3f",
  storageBucket: "cjnsite-d3f3f.firebasestorage.app",
  messagingSenderId: "491318197551",
  appId: "1:491318197551:web:5a3c8fd938d94d924cf5da",
  measurementId: "G-JES3G3L45V"
};
```

**SDK version:** Firebase Compat SDK 9.22.0 (loaded from Google CDN)

> The compat SDK is used (not the modular v9 SDK) because it allows `firebase.firestore()` style calls without a build step.

---

## Authentication

**Provider:** Email/Password only (Firebase Auth)

### Auth flow

```mermaid
sequenceDiagram
    participant User
    participant Page
    participant FirebaseAuth

    User->>Page: Visit auth-gated page
    Page->>FirebaseAuth: auth.onAuthStateChanged()
    alt User is signed in
        FirebaseAuth-->>Page: user object
        Page->>Page: Show authenticated content
    else User is not signed in
        FirebaseAuth-->>Page: null
        Page->>Page: Show login gate / redirect
    end
```

### Pages that require authentication

| Page | Auth check | Behaviour if not signed in |
|---|---|---|
| `submit.html` | `onAuthStateChanged` | Shows auth gate card with login prompt |
| `admin-ultra.html` | `onAuthStateChanged` | Shows login overlay |
| `profile.html` | `onAuthStateChanged` | Shows login prompt |

### Admin authorisation

Admin access in `admin-ultra.html` is gated by Firebase Auth sign-in only. There is no Firestore-based role check in the current codebase — any authenticated user who knows the URL can access the admin panel.

> **Security risk.** See [SECURITY.md](SECURITY.md) for details and recommended fix.

---

## Firestore Collections

```
Firestore
├── stories/          # Published articles
├── submissions/      # Pending story submissions from contributors
├── trending/         # Manually curated trending items
├── siteConfig/       # Homepage hero text and footer config
├── videos/           # Firestore-stored video metadata (separate from YouTube)
└── videoCategories/  # YouTube video category groupings with admin notes
```

---

## Collection: `stories`

The primary content collection. Each document represents one published article.

### Document fields

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | string | Yes | Article headline |
| `category` | string | Yes | One of: Campus Fraud, Economy, Politics, Culture, Investigation, Field Reports, Documentary |
| `author` | string | Yes | Author display name |
| `university` | string | No | Author's institution |
| `coverImage` | string (URL) | No | Cover image URL (Cloudinary or external) |
| `coverCaption` | string | No | Caption shown below cover image |
| `excerpt` | string | No | Deck / standfirst shown on story page |
| `content` | string | Yes | Article body — HTML string (sanitised by DOMPurify on render) |
| `readTime` | string | No | e.g. "8 min read" |
| `tags` | array\<string\> | No | Tag pills shown at bottom of article |
| `status` | string | Yes | `"published"` or `"pending"` or `"rejected"` |
| `publishedAt` | Timestamp | Yes | Firestore server timestamp |
| `views` | number | No | Incremented by 1 on each story page load |
| `authorAvatar` | string (URL) | No | Author profile photo URL |
| `authorBio` | string | No | Short author bio shown in author card |
| `type` | string | No | `"VIDEO"` for video stories; omit for text articles |

### Example document

```json
{
  "title": "Inside the hostel mess scam",
  "category": "Campus Fraud",
  "author": "Ananya Krishnan",
  "university": "DU North Campus",
  "coverImage": "https://res.cloudinary.com/.../cover.jpg",
  "excerpt": "A six-month investigation...",
  "content": "<p>It started with a simple complaint...</p>",
  "readTime": "8 min read",
  "tags": ["Campus Fraud", "Investigation", "Hostels"],
  "status": "published",
  "publishedAt": "Timestamp",
  "views": 14230
}
```

---

## Collection: `submissions`

Story submissions from contributors via `submit.html`. These are pending review and do not appear on the public site until approved by an admin.

### Document fields

| Field | Type | Description |
|---|---|---|
| `title` | string | Submitted headline |
| `category` | string | Selected category |
| `content` | string | Rich text body from Quill editor (HTML) |
| `excerpt` | string | Submitted standfirst |
| `coverImage` | string (URL) | Uploaded cover image URL |
| `author` | string | Author name |
| `university` | string | Author's institution |
| `authorUid` | string | Firebase Auth UID of submitter |
| `authorEmail` | string | Submitter's email |
| `submittedAt` | Timestamp | Submission time |
| `status` | string | Always `"pending"` on creation |
| `readTime` | string | Estimated read time |

---

## Collection: `trending`

Manually curated by admins via the admin dashboard. Drives the Trending Now section on the homepage and the live ticker.

### Document fields

| Field | Type | Description |
|---|---|---|
| `title` | string | Trending item headline |
| `tag` | string | Category label |
| `type` | string | `"story"` or `"video"` |
| `ref_id` | string | Firestore document ID of the linked story (if type is story) |
| `imageUrl` | string (URL) | Thumbnail for the trending card |
| `readCount` | number | Read/view count displayed on card |

---

## Collection: `siteConfig`

Two documents: `hero` and `footer`. Allows admins to update homepage hero text and footer contact details without touching code.

### Document: `hero`

| Field | Type | Description |
|---|---|---|
| `eyebrow` | string | Small label above headline (e.g. "India's Youth Newsroom • Est. 2024") |
| `headline` | string | Main hero headline |
| `stat1Value` | string | First stat number |
| `stat1Label` | string | First stat label |
| `stat2Value` | string | Second stat number |
| `stat2Label` | string | Second stat label |
| `stat3Value` | string | Third stat number |
| `stat3Label` | string | Third stat label |
| `stat4Value` | string | Fourth stat number |
| `stat4Label` | string | Fourth stat label |

### Document: `footer`

| Field | Type | Description |
|---|---|---|
| `email` | string | Contact email shown in footer |
| `twitter` | string (URL) | Twitter/X profile URL |
| `youtube` | string (URL) | YouTube channel URL |
| `instagram` | string (URL) | Instagram profile URL |

---

## Collection: `videos`

Firestore-stored video metadata. Separate from the YouTube API integration. Used for videos that are managed directly in Firestore rather than pulled from YouTube.

### Document fields

| Field | Type | Description |
|---|---|---|
| `title` | string | Video title |
| `category` | string | Category label |
| `author` | string | Correspondent name |
| `university` | string | Correspondent's institution |
| `thumbnailUrl` | string (URL) | Thumbnail image URL |
| `videoUrl` | string (URL) | YouTube or direct video URL |
| `duration` | string | e.g. "11:24" |
| `description` | string | Video description |
| `status` | string | `"published"` or `"pending"` |
| `publishedAt` | Timestamp | Publication time |

---

## Collection: `videoCategories`

Used by the admin to group YouTube videos into categories and attach editorial notes.

### Document fields

| Field | Type | Description |
|---|---|---|
| `name` | string | Category name |
| `videos` | array\<object\> | Array of `{ youtubeId, note }` objects |

---

## Read Operations

| Page | Collection | Query | Fallback |
|---|---|---|---|
| `index.html` | `stories` | `where status == published, orderBy publishedAt desc, limit 40` | `SAMPLE_STORIES` |
| `index.html` | `trending` | `limit 12` | `SAMPLE_TRENDING` |
| `index.html` | `siteConfig` | `doc(hero)`, `doc(footer)` | Hardcoded defaults |
| `story.html` | `stories` | `doc(storyId)` | `SAMPLE_STORIES` array |
| `story.html` | `stories` | `where category == X, limit 6` (more stories) | `SAMPLE_STORIES` |
| `stories.html` | `stories` | `where status == published, orderBy publishedAt desc` | `SAMPLE_STORIES` |
| `admin-ultra.html` | `submissions` | `where status == pending` | None |
| `admin-ultra.html` | `stories` | `orderBy publishedAt desc` | None |

---

## Write Operations

| Page | Collection | Operation | Trigger |
|---|---|---|---|
| `story.html` | `stories` | `update({ views: increment(1) })` | Every story page load |
| `submit.html` | `submissions` | `add(submissionData)` | Form submit |
| `admin-ultra.html` | `stories` | `add(storyData)` | Admin approves submission |
| `admin-ultra.html` | `stories` | `update(storyData)` | Admin edits story |
| `admin-ultra.html` | `stories` | `delete(docId)` | Admin deletes story |
| `admin-ultra.html` | `submissions` | `update({ status: rejected })` | Admin rejects submission |
| `admin-ultra.html` | `trending` | `set / delete` | Admin manages trending |
| `admin-ultra.html` | `siteConfig` | `set(heroData)`, `set(footerData)` | Admin saves config |

---

## Indexes Required

The primary query on `stories` requires a composite index:

```
Collection: stories
Fields: status (Ascending), publishedAt (Descending)
```

If this index does not exist, the code falls back to a simple `limit(60)` query and filters client-side. This fallback is intentional and logged as a warning.

---

## Security Rules

> **Needs Verification** — The actual Firestore security rules are not visible in the codebase. The following represents the **recommended** rules based on the application's access patterns.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Public read for published stories
    match /stories/{storyId} {
      allow read: if resource.data.status == 'published';
      allow write: if request.auth != null && isAdmin();
    }

    // Submissions: authenticated users can create, admins can read/update
    match /submissions/{subId} {
      allow create: if request.auth != null;
      allow read, update, delete: if request.auth != null && isAdmin();
    }

    // Trending: public read, admin write
    match /trending/{docId} {
      allow read: if true;
      allow write: if request.auth != null && isAdmin();
    }

    // siteConfig: public read, admin write
    match /siteConfig/{docId} {
      allow read: if true;
      allow write: if request.auth != null && isAdmin();
    }

    function isAdmin() {
      // Needs Verification: no role field observed in codebase
      // Recommended: check a custom claim or an admins collection
      return request.auth != null;
    }
  }
}
```

---

## Data Relationships

```
submissions (pending)
    └── [admin approves] ───► stories (published)
                                  └── [ref_id] ───► trending

stories
    └── [id] ───► story.html?id={id}

videoCategories
    └── [youtubeId] ───► story.html?ytid={youtubeId}
```

---

## Error Handling Strategy

Every Firestore call is wrapped in try/catch. The pattern is:

1. Try the optimised query (with index)
2. If that fails (missing index), fall back to a simple query
3. If that fails (network/permission), use `SAMPLE_*` demo data
4. Log warnings to console, never throw to the user

This means the site **never shows a blank page** due to a Firestore error.

---

## Future Improvements

| Improvement | Priority | Reason |
|---|---|---|
| Implement proper Firestore security rules | High | Current rules unknown; admin access not role-gated |
| Add `role` field to user documents | High | Required for proper admin authorisation |
| Move Firebase config to environment variables | Medium | Config is currently hardcoded in every HTML file |
| Add Firestore indexes explicitly | Medium | Prevents silent fallback to unoptimised queries |
| Implement real-time listeners for trending | Low | Currently fetched once on page load |
| Add pagination to stories collection | Medium | Currently limited to 40 docs |
