document.addEventListener("DOMContentLoaded", async () => {
  try {
    if (!db) {
      console.error("Firestore not initialized");
      return;
    }

    const doc = await db.collection("pages").doc("community").get();
    if (!doc.exists) {
      // Fallback to existing static content
      return;
    }

    const data = doc.data();

    // Helper for safe HTML escaping
    const escapeHtml = (str) => {
      if (!str) return "";
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    };

    // Hero
    if (data.hero) {
      if (data.hero.headline) {
        const el = document.getElementById("cms-hero-headline");
        if (el) el.innerHTML = data.hero.headline; // Trust CMS HTML for styling
      }
      if (data.hero.subheadline) {
        const el = document.getElementById("cms-hero-sub");
        if (el) el.textContent = data.hero.subheadline;
      }
    }

    // Join CTA
    if (data.joinCta) {
      if (data.joinCta.headline) {
        const el = document.getElementById("cms-cta-headline");
        if (el) el.innerHTML = data.joinCta.headline;
      }
      if (data.joinCta.subheadline) {
        const el = document.getElementById("cms-cta-sub");
        if (el) el.textContent = data.joinCta.subheadline;
      }
      if (data.joinCta.buttonText) {
        const el = document.getElementById("cms-cta-link");
        if (el) el.textContent = data.joinCta.buttonText;
      }
    }

    // Community Values
    if (data.communityValues && Array.isArray(data.communityValues) && data.communityValues.length > 0) {
      const grid = document.getElementById("cms-values-grid");
      if (grid) {
        grid.innerHTML = data.communityValues.map(v => `
          <div class="value-card">
            <div class="value-icon">${escapeHtml(v.icon || '🤝')}</div>
            <div class="value-title">${escapeHtml(v.title)}</div>
            <p class="value-desc">${escapeHtml(v.description)}</p>
          </div>
        `).join("");
      }
    }

    // Featured Creators (fetch specifically)
    if (data.featuredCreators && Array.isArray(data.featuredCreators) && data.featuredCreators.length > 0) {
      try {
        const creatorPromises = data.featuredCreators.map(id => db.collection("users").doc(id).get());
        const creatorDocs = await Promise.all(creatorPromises);
        
        const validCreators = creatorDocs
          .filter(d => d.exists)
          .map(d => ({ id: d.id, ...d.data() }));

        if (validCreators.length > 0) {
          const grid = document.getElementById("cms-contributors-grid");
          if (grid) {
            const pinnedList = Array.isArray(data.pinnedCreators) ? data.pinnedCreators : [];
            grid.innerHTML = validCreators.map(c => {
              const isPinned = pinnedList.includes(c.id);
              const avatarLetter = (c.name || "?").charAt(0).toUpperCase();
              const points = c.points || 0;
              const badgeHtml = isPinned ? `<div style="position:absolute; top:-10px; right:-10px; background:var(--accent); color:#fff; border-radius:12px; padding:2px 8px; font-size:10px; font-weight:bold;">PINNED</div>` : ``;

              return `
                <div class="contributor-card" style="position:relative; ${isPinned ? 'border: 2px solid var(--accent);' : ''}">
                  ${badgeHtml}
                  <div class="avatar">${avatarLetter}</div>
                  <div class="contributor-name">${escapeHtml(c.name || 'Anonymous')}</div>
                  <div class="contributor-sub">${escapeHtml(c.college || c.city || 'Reporter')}</div>
                  <div class="contributor-stats">
                    <span>${points} pts</span>
                  </div>
                </div>
              `;
            }).join("");
          }
        }
      } catch (err) {
        console.error("Failed to load featured creators:", err);
      }
    }

  } catch (err) {
    console.error("Failed to load community CMS data:", err);
  }
});
