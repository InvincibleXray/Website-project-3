# Cloudinary

> WEVOX — Image upload, delivery, optimisation, and storage strategy.

Related: [STORY_PIPELINE.md](STORY_PIPELINE.md) | [PERFORMANCE.md](PERFORMANCE.md)

> **Needs Verification:** The Cloudinary integration exists in `submit.html` but the upload configuration details (cloud name, upload preset, API endpoint) are not fully visible in the inspected codebase. The following documents what is known and what needs verification.

---

## Role of Cloudinary in WEVOX

Cloudinary serves as the **image hosting and delivery layer** for WEVOX. When a contributor submits a story with a cover image, the image is uploaded to Cloudinary and the resulting URL is stored in Firestore as the `coverImage` field.

---

## Upload Process

### Where it happens
**Page:** `submit.html`
**Trigger:** Contributor selects a cover image file in the submission form

### Flow
```
1. Contributor selects image file
2. submit.html uploads to Cloudinary via unsigned upload preset
3. Cloudinary returns a secure URL
4. URL is stored in the submission form state
5. On form submit, URL is written to Firestore as coverImage field
```

### Upload method
Cloudinary unsigned uploads are used (no server-side signing required). This is appropriate for a client-side-only application.

---

## Image Delivery

Cloudinary URLs are stored in Firestore and used directly as `src` attributes on `<img>` elements throughout the site.

### Fallback strategy

All images have `onerror` fallbacks:
```html
<img src="{cloudinaryUrl}" onerror="this.src='{fallbackUrl}'" />
```

Fallback URLs use `picsum.photos` with deterministic seeds so the same fallback image always appears for the same story.

---

## Storage Strategy

- Cover images are stored permanently in Cloudinary
- No automatic deletion or expiry is configured (*Needs Verification*)
- Images are referenced by URL in Firestore — deleting a Firestore document does not delete the Cloudinary asset

---

## Performance Considerations

| Consideration | Current state | Recommended |
|---|---|---|
| Image format | *Needs Verification* | Use Cloudinary auto format (`f_auto`) to serve WebP/AVIF |
| Image sizing | *Needs Verification* | Use Cloudinary transformations to serve appropriately sized images |
| Lazy loading | `loading="lazy"` on all below-fold images | ✅ Already implemented |
| CDN delivery | Cloudinary CDN by default | ✅ Already in use |

---

## Future Improvements

| Improvement | Implementation |
|---|---|
| Add `f_auto,q_auto` to Cloudinary URLs | Automatic format and quality optimisation |
| Add `w_800` size transformation | Serve appropriately sized images for cards |
| Add `srcset` with multiple Cloudinary sizes | Responsive images for different viewports |
| Verify upload preset configuration | Ensure file type and size limits are set |
| Add image deletion on story deletion | Clean up Cloudinary assets when stories are removed |
