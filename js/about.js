document.addEventListener("DOMContentLoaded", async () => {
  try {
    if (!db) {
      console.error("Firestore not initialized");
      return;
    }

    const doc = await db.collection("pages").doc("about").get();
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
        if (el) el.innerHTML = data.hero.headline; // Trusting CMS HTML for styling
      }
      if (data.hero.subheadline) {
        const el = document.getElementById("cms-hero-sub");
        if (el) el.textContent = data.hero.subheadline;
      }
    }

    // Why WEVOX
    if (data.whyWeVox) {
      if (data.whyWeVox.title) {
        const el = document.getElementById("cms-why-title");
        if (el) el.innerHTML = data.whyWeVox.title;
      }
      if (data.whyWeVox.content) {
        const el = document.getElementById("cms-why-content");
        if (el) el.textContent = data.whyWeVox.content;
      }
    }

    // Vision
    if (data.vision) {
      if (data.vision.title) {
        const el = document.getElementById("cms-vision-title");
        if (el) el.textContent = data.vision.title;
      }
      if (data.vision.content) {
        const el = document.getElementById("cms-vision-content");
        if (el) el.textContent = data.vision.content;
      }
    }

    // Mission
    if (data.mission) {
      if (data.mission.title) {
        const el = document.getElementById("cms-mission-title");
        if (el) el.textContent = data.mission.title;
      }
      if (data.mission.content) {
        const el = document.getElementById("cms-mission-content");
        if (el) el.textContent = data.mission.content;
      }
    }

    // Founder Note
    if (data.founderNote) {
      if (data.founderNote.content) {
        const el = document.getElementById("cms-founder-note");
        if (el) el.textContent = `"${data.founderNote.content}"`;
      }
      if (data.founderNote.name || data.founderNote.role) {
        const el = document.getElementById("cms-founder-attrib");
        if (el) el.textContent = `— ${data.founderNote.name || 'Founders'}, ${data.founderNote.role || 'WEVOX'}`;
      }
    }

    // Join CTA
    if (data.joinCta) {
      if (data.joinCta.headline) {
        const el = document.getElementById("cms-cta-headline");
        if (el) el.innerHTML = data.joinCta.headline;
      }
      if (data.joinCta.buttonText) {
        const el = document.getElementById("cms-cta-link");
        if (el) el.textContent = data.joinCta.buttonText;
      }
    }

    // Editorial Pillars
    if (data.editorialPillars && Array.isArray(data.editorialPillars) && data.editorialPillars.length > 0) {
      const grid = document.getElementById("cms-pillars-grid");
      if (grid) {
        grid.innerHTML = data.editorialPillars.map(p => `
          <article class="pillar-card">
            <div class="pillar-icon">${escapeHtml(p.icon || '📖')}</div>
            <div class="pillar-title">${escapeHtml(p.title)}</div>
            <p class="pillar-desc">${escapeHtml(p.description)}</p>
          </article>
        `).join("");
      }
    }

    // Editorial Standards
    if (data.editorialStandards && Array.isArray(data.editorialStandards) && data.editorialStandards.length > 0) {
      const grid = document.getElementById("cms-standards-list");
      if (grid) {
        grid.innerHTML = data.editorialStandards.map((s, idx) => `
          <div class="standard-item">
            <div class="standard-num">${String(idx + 1).padStart(2, '0')}</div>
            <div class="standard-title">${escapeHtml(s.title)}</div>
            <p class="standard-desc">${escapeHtml(s.description)}</p>
          </div>
        `).join("");
      }
    }

  } catch (err) {
    console.error("Failed to load about CMS data:", err);
  }
});
