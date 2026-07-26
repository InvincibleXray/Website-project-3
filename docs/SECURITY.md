# Security

> WEVOX — XSS protection, authentication, input validation, known risks, and future improvements.

Related: [FIREBASE.md](FIREBASE.md) | [AI_DEVELOPER_GUIDE.md](AI_DEVELOPER_GUIDE.md) | [KNOWN_ISSUES.md](KNOWN_ISSUES.md)

---

## Table of Contents

- [Security Model Overview](#security-model-overview)
- [XSS Protection](#xss-protection)
- [Authentication](#authentication)
- [Authorization](#authorization)
- [Input Validation](#input-validation)
- [Firebase Security](#firebase-security)
- [Content Security](#content-security)
- [Known Risks](#known-risks)
- [Future Improvements](#future-improvements)

---

## Security Model Overview

WEVOX is a client-side application with no backend server. All security controls are implemented in:

1. **The browser** — DOMPurify sanitisation, `escapeHtml()` encoding
2. **Firebase Auth** — authentication for write operations
3. **Firestore security rules** — server-side access control (rules not confirmed in codebase)

Because there is no backend, the attack surface is primarily:
- **XSS via user-submitted content** rendered into the DOM
- **Unauthorised Firestore writes** if security rules are permissive
- **Admin panel access** without proper role verification

---

## XSS Protection

### Two-layer defence

WEVOX uses two complementary mechanisms to prevent XSS:

#### Layer 1: `escapeHtml()` — for text interpolation

Used everywhere that a string value is interpolated into an HTML template literal.

```javascript
const escapeHtml = (str = "") => String(str)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#039;");
```

**Applied to:** story titles, author names, university names, category labels, tag names, video titles, all metadata fields.

**Rule:** Every variable interpolated into a template literal as `${value}` must be wrapped in `escapeHtml(value)`. No exceptions.

#### Layer 2: DOMPurify — for rich HTML content

Used exclusively in `story.html` for the article body, which is the only place where arbitrary HTML from Firestore is injected into the DOM.

```javascript
const bodyHTML = DOMPurify.sanitize(rawBody, {
  ADD_TAGS: ['iframe', 'blockquote'],
  ADD_ATTR: [
    'allowfullscreen', 'allow', 'loading', 'frameborder',
    'src', 'width', 'height', 'style',
    'data-wevox-tweet', 'data-instgrm-permalink',
    'class', 'id', 'target', 'rel', 'href'
  ],
  ALLOW_DATA_ATTR: false,
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur'],
});
```

**DOMPurify version:** 3.1.6 (loaded from Cloudflare CDN with SRI hash)

**What DOMPurify allows:**
- Standard article HTML: `<p>`, `<h2>`, `<h3>`, `<blockquote>`, `<strong>`, `<em>`, `<a>`, `<ul>`, `<ol>`, `<li>`, `<img>`, `<figure>`, `<figcaption>`
- YouTube/Vimeo iframes (for embedded video in articles)
- Twitter/Instagram blockquote embeds

**What DOMPurify strips:**
- All event handlers (`onerror`, `onclick`, `onload`, etc.)
- `javascript:` href values
- `data:` URIs in src attributes
- Any tag or attribute not in the allowlist

### Admin XSS protection

The admin dashboard (`admin-ultra.html`) uses a custom `esc()` function for all content rendered into the admin UI:

```javascript
const esc = s => {
  const d = document.createElement('div');
  d.textContent = s == null ? '' : String(s);
  return d.innerHTML;
};
```

This uses the browser's own text node escaping, which is equivalent to `escapeHtml()` but uses the DOM API directly.

### Fixed vulnerabilities

| Vulnerability | Status | Fix applied |
|---|---|---|
| XSS via article body HTML | ✅ Fixed | DOMPurify 3.1.6 with strict allowlist |
| XSS via story title in template literals | ✅ Fixed | `escapeHtml()` on all interpolated values |
| XSS in admin dashboard | ✅ Fixed | `esc()` function on all admin-rendered content |
| Legacy admin panel exposure | ✅ Fixed | `admin.html` retired (still exists in repo — see Known Risks) |

---

## Authentication

**Provider:** Firebase Auth, email/password only.

**Session management:** Firebase Auth handles session persistence via IndexedDB. Sessions persist across browser restarts until explicitly signed out.

**Sign-in flow:**
```javascript
auth.signInWithEmailAndPassword(email, password)
  .catch(e => { /* show error message */ })
```

**Auth state observation:**
```javascript
auth.onAuthStateChanged(user => {
  if (user) { /* show authenticated content */ }
  else { /* show login gate */ }
});
```

**Error messages:** Auth errors are mapped to user-friendly messages. The raw Firebase error code is never shown to the user. The password error message is redacted (`[REDACTED]`) in the admin panel to prevent user enumeration.

---

## Authorization

### Current state

Authorization is **authentication-only**. Any signed-in Firebase user can access the admin panel if they know the URL. There is no role-based access control in the client-side code.

### Risk

A contributor who submits a story (and therefore has a Firebase Auth account) could navigate directly to `admin-ultra.html` and access admin functions if Firestore security rules do not enforce role checks server-side.

### Recommended fix

1. Add a `role` field to user documents in a `users` Firestore collection
2. Check `role === 'admin'` in Firestore security rules for all write operations on `stories`, `trending`, and `siteConfig`
3. Add a client-side check in `admin-ultra.html` that reads the user's role from Firestore and redirects non-admins

---

## Input Validation

### Story submission (`submit.html`)

Client-side validation is performed before Firestore write:
- Title: required, minimum length check
- Category: must be one of the predefined list
- Content: Quill editor output (HTML) — validated for minimum length
- Cover image: URL validation if provided

**Gap:** There is no server-side validation. A malicious user could bypass client-side checks and write arbitrary data to Firestore if security rules permit it.

### Admin inputs

All admin form inputs are escaped with `esc()` before rendering. Admin writes to Firestore are trusted (admin is assumed to be a trusted user).

---

## Firebase Security

### API key exposure

The Firebase API key is embedded in every HTML file. This is **expected and safe** for Firebase client-side SDKs. The API key identifies the Firebase project but does not grant access to data. Access is controlled by Firestore security rules.

### YouTube API key exposure

The YouTube Data API key is also embedded in the HTML. This key is restricted to the YouTube Data API v3 read operations. **Needs Verification:** whether the key has HTTP referrer restrictions applied in the Google Cloud Console.

### Firestore security rules

See [FIREBASE.md](FIREBASE.md#security-rules) for the recommended rules. The actual deployed rules are not visible in the codebase and must be verified in the Firebase Console.

---

## Content Security

### Image sources

Images are loaded from:
- Cloudinary CDN (cover images)
- `picsum.photos` (demo fallback images)
- YouTube thumbnail CDN (`img.youtube.com`)
- External URLs submitted by contributors

**Risk:** No Content Security Policy (CSP) header is set. A CSP would restrict which domains can serve images and scripts.

### External scripts

External scripts loaded by the application:

| Script | Source | Integrity check |
|---|---|---|
| Firebase App | `gstatic.com` | No SRI |
| Firebase Firestore | `gstatic.com` | No SRI |
| Firebase Auth | `gstatic.com` | No SRI |
| DOMPurify | Cloudflare CDN | SRI hash present (but hash in source appears malformed — Needs Verification) |
| Quill.js | `cdn.quilljs.com` | No SRI |
| Google Fonts | `fonts.googleapis.com` | No SRI (fonts, not scripts) |
| Twitter widgets | `platform.twitter.com` | No SRI (loaded dynamically) |
| Instagram embed | `instagram.com` | No SRI (loaded dynamically) |

---

## Known Risks

| Risk | Severity | Status |
|---|---|---|
| No role-based admin authorisation | High | Open |
| `admin.html` (legacy) still exists in repo | Medium | Open — should be deleted |
| No Content Security Policy header | Medium | Open |
| No SRI on Firebase SDK scripts | Low | Open |
| YouTube API key without referrer restriction | Medium | Needs Verification |
| Firestore security rules not confirmed | High | Needs Verification |
| No server-side input validation on submissions | Medium | Open |
| DOMPurify SRI hash appears malformed in source | Medium | Needs Verification |

---

## Future Improvements

| Improvement | Priority |
|---|---|
| Implement Firestore role-based security rules | High |
| Add `role` field to user documents | High |
| Delete `admin.html` from repository | Medium |
| Add Content Security Policy header | Medium |
| Add HTTP referrer restriction to YouTube API key | Medium |
| Verify and fix DOMPurify SRI hash | Medium |
| Add SRI to Firebase SDK script tags | Low |
| Implement rate limiting on story submissions | Low |
