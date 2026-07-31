document.addEventListener("DOMContentLoaded", async () => {
  // Wait for Firebase to initialize
  const checkDb = setInterval(async () => {
    if (typeof db !== 'undefined') {
      clearInterval(checkDb);
      console.log("Community initialized");
      await initCommunity();
    }
  }, 100);
});

async function initCommunity() {
  // 1. Fetch Manual "Meet the Community"
  let meetMembers = [];
  try {
    const pageDoc = await db.collection("community").doc("page").get();
    const pageData = pageDoc.exists ? pageDoc.data() : {};
    meetMembers = pageData.meetMembers || [];
    console.log("Meet Members loaded");
  } catch (err) {
    console.error("Collection: community | Document: page | Function: initCommunity (Meet Members) | Error:", err);
  }
  
  // Safe execution of meet members render
  try {
    renderMeetMembers(meetMembers);
  } catch (err) {
    console.error("Function: renderMeetMembers | Error:", err);
  }

  // 2. Fetch Users Data Ordered by Points
  let users = [];
  try {
    const usersSnap = await db.collection("users").orderBy("points", "desc").get().catch(async (e) => {
      console.error("Collection: users | Document: N/A | Function: initCommunity (orderBy) | Error:", e);
      // Fallback to normal get if index is missing
      return await db.collection("users").get();
    });
    
    users = usersSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    // Normalize properties
    users.forEach(u => {
      u.storiesCount = u.storiesCount || 0;
      u.videosCount = u.videosCount || 0;
      u.totalReads = u.totalReads || 0;
      u.points = u.points || 0;
    });

    console.log("Users loaded");
  } catch (err) {
    console.error("Collection: users | Document: N/A | Function: initCommunity (Users Fetch) | Error:", err);
  }

  // Ensure DOM elements exist, if not create them
  ensureDOMContainers();

  // Safe execution of Top Performers render
  try {
    renderTopPerformers(users);
    console.log("Top Performers rendered");
  } catch (err) {
    console.error("Function: renderTopPerformers | Error:", err);
  }
  
  // Safe execution of Rankings render
  try {
    renderRankings(users);
    console.log("Rankings rendered");
  } catch (err) {
    console.error("Function: renderRankings | Error:", err);
  }
  
  // Safe execution of Creator Profile render
  try {
    renderCreatorProfile(users);
    console.log("Creator Profile rendered");
  } catch (err) {
    console.error("Function: renderCreatorProfile | Error:", err);
  }
}

function ensureDOMContainers() {
  const containers = [
    'cms-contributors-grid',
    'cms-spotlight-grid',
    'cms-leaderboard',
    'cms-creator-profile'
  ];
  
  containers.forEach(id => {
    if (!document.getElementById(id)) {
      const el = document.createElement('div');
      el.id = id;
      document.body.appendChild(el);
      console.warn(`Created missing container: ${id}`);
    }
  });
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatNumber(n) {
  if (!n) return "0";
  if (n < 1000) return n;
  if (n < 100000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return (n / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
}

function renderMeetMembers(members) {
  const grid = document.getElementById("cms-contributors-grid");
  if (!grid) return;

  if (members.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-muted);">No community members added yet.</div>`;
    return;
  }

  // Sort by display order
  members.sort((a, b) => (Number(a.displayOrder) || 0) - (Number(b.displayOrder) || 0));

  grid.innerHTML = members.map(m => {
    const avatar = m.image ? `<img src="${escapeHtml(m.image)}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">` 
                           : escapeHtml((m.name || "?").charAt(0).toUpperCase());
    return `
      <div class="contributor-card">
        <div class="avatar" style="${m.image ? 'background:transparent;' : ''}">${avatar}</div>
        <div class="contributor-name">${escapeHtml(m.name || 'Anonymous')}</div>
        <div class="contributor-meta">${escapeHtml(m.college || '')} · ${escapeHtml(m.role || '')}</div>
        <div class="stories-pill" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;margin-top:8px;">
          ${escapeHtml(m.bio || 'WEVOX Contributor')}
        </div>
      </div>
    `;
  }).join("");
}

function renderTopPerformers(users) {
  const grid = document.getElementById("cms-spotlight-grid");
  if (!grid) return;
  
  if (!users || users.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:20px;color:var(--text-muted);">No top performers yet. Publish some stories!</div>`;
    return;
  }

  // 1. Top Reporter (Most published stories)
  let topReporter = users.reduce((prev, curr) => (curr.storiesCount > (prev ? prev.storiesCount : -1)) ? curr : prev, null);
  
  // 2. Rising Voice (Verified user with fewest stories but highest points per story)
  let risingVoice = null;
  const verifiedUsers = users.filter(u => u.verified && u.storiesCount > 0 && u.storiesCount <= 5);
  if (verifiedUsers.length > 0) {
    risingVoice = verifiedUsers.reduce((prev, curr) => (curr.points > (prev ? prev.points : -1)) ? curr : prev, null);
  } else {
    // Fallback if no verified new users
    const validUsers = users.filter(u => u.storiesCount > 0 && u.id !== (topReporter ? topReporter.id : ''));
    risingVoice = validUsers.length > 0 ? validUsers[Math.floor(Math.random() * validUsers.length)] : null;
  }

  // 3. Most Read Author
  let mostReadAuthor = users.reduce((prev, curr) => (curr.totalReads > (prev ? prev.totalReads : -1)) ? curr : prev, null);

  // 4. Community Champion (Highest total points overall)
  let champion = users.reduce((prev, curr) => (curr.points > (prev ? prev.points : -1)) ? curr : prev, null);

  const cards = [];

  if (topReporter && topReporter.storiesCount > 0) {
    cards.push(`
      <div class="spotlight-card">
        <span class="pill-badge">TOP REPORTER</span>
        <div class="spotlight-name">${escapeHtml(topReporter.name || 'Anonymous')}</div>
        <div class="spotlight-sub">${escapeHtml(topReporter.college || topReporter.university || 'Independent')} · ${topReporter.storiesCount} Stories</div>
      </div>
    `);
  }

  if (risingVoice) {
    cards.push(`
      <div class="spotlight-card">
        <span class="pill-badge">RISING VOICE</span>
        <div class="spotlight-name">${escapeHtml(risingVoice.name || 'Anonymous')}</div>
        <div class="spotlight-sub">${escapeHtml(risingVoice.college || risingVoice.university || 'Independent')} · ${formatNumber(risingVoice.totalReads)} Reads</div>
      </div>
    `);
  }

  if (mostReadAuthor && mostReadAuthor.totalReads > 0) {
    cards.push(`
      <div class="spotlight-card">
        <span class="pill-badge">MOST VIEWED</span>
        <div class="spotlight-name">${escapeHtml(mostReadAuthor.name || 'Anonymous')}</div>
        <div class="spotlight-sub">${formatNumber(mostReadAuthor.totalReads)} Total Views</div>
      </div>
    `);
  }

  if (champion && champion.points > 0) {
    cards.push(`
      <div class="spotlight-card">
        <span class="pill-badge">CHAMPION</span>
        <div class="spotlight-name">${escapeHtml(champion.name || 'Anonymous')}</div>
        <div class="spotlight-sub">${escapeHtml(champion.college || champion.university || 'Independent')} · ${champion.points} Pts</div>
      </div>
    `);
  }

  if (cards.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:20px;color:var(--text-muted);">No top performers yet. Publish some stories!</div>`;
  } else {
    grid.innerHTML = cards.join("");
  }
}

function renderRankings(users) {
  const lb = document.getElementById("cms-leaderboard");
  if (!lb) return;
  
  if (!users || users.length === 0) {
    lb.innerHTML = `<div style="text-align:center;padding:20px;color:var(--text-muted);">No rankings available yet.</div>`;
    return;
  }

  const sorted = [...users].sort((a, b) => b.points - a.points).filter(u => u.points > 0).slice(0, 5);

  if (sorted.length === 0) {
    lb.innerHTML = `<div style="text-align:center;padding:20px;color:var(--text-muted);">No rankings available yet.</div>`;
    return;
  }

  lb.innerHTML = sorted.map((u, i) => {
    let badge = "";
    if (i === 0) badge = `<div class="rank-badge gold">Gold</div>`;
    else if (i === 1) badge = `<div class="rank-badge silver">Silver</div>`;
    else if (i === 2) badge = `<div class="rank-badge bronze">Bronze</div>`;
    else badge = `<div class="rank-badge" style="background:var(--surface);color:var(--text-muted);">#${i+1}</div>`;

    return `
      <div class="rank-row">
        <div class="rank-num">0${i + 1}</div>
        <div class="rank-name">${escapeHtml(u.name || 'Anonymous')}</div>
        <div class="rank-college">${escapeHtml(u.college || u.university || 'Independent')}</div>
        <div class="rank-spacer"></div>
        ${badge}
      </div>
    `;
  }).join("");
}

function renderCreatorProfile(users) {
  const container = document.getElementById("cms-creator-profile");
  if (!container) return;
  
  if (!users || users.length === 0) {
    container.innerHTML = `<div style="text-align:center;padding:20px;color:var(--text-muted);">No active creators found.</div>`;
    return;
  }

  // Filter users who have published at least one story or video
  const activeUsers = users.filter(u => u.storiesCount > 0 || u.videosCount > 0);
  if (activeUsers.length === 0) {
    container.innerHTML = `<div style="text-align:center;padding:20px;color:var(--text-muted);">No active creators found.</div>`;
    return;
  }

  // Randomize (Fisher-Yates) and pick 1
  for (let i = activeUsers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [activeUsers[i], activeUsers[j]] = [activeUsers[j], activeUsers[i]];
  }

  const creator = activeUsers[0];
  
  // Find their rank (users array is already assumed sorted if using orderBy)
  const sorted = [...users].sort((a, b) => b.points - a.points).filter(u => u.points > 0);
  const rank = sorted.findIndex(u => u.id === creator.id) + 1;
  const rankLabel = rank > 0 ? `#${rank}` : 'Unranked';

  let pill = '';
  if (rank === 1) pill = `<span class="gold-pill">GOLD</span>`;
  else if (rank === 2) pill = `<span class="gold-pill" style="background:#C0C0C0;color:#000;">SILVER</span>`;
  else if (rank === 3) pill = `<span class="gold-pill" style="background:#CD7F32;color:#fff;">BRONZE</span>`;

  const avatarContent = creator.avatar 
    ? `<img src="${escapeHtml(creator.avatar)}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`
    : escapeHtml((creator.name || "?").charAt(0).toUpperCase());

  container.innerHTML = `
    <div class="profile-preview-card">
      <div class="profile-head">
        <div class="profile-avatar" style="${creator.avatar ? 'background:transparent;' : ''}">${avatarContent}</div>
        <div class="profile-name">${escapeHtml(creator.name || 'Anonymous')}</div>
        ${pill}
      </div>
      <div class="profile-stats">
        <div class="profile-stat">
          <div class="profile-stat-label">Reports</div>
          <div class="profile-stat-value">${creator.storiesCount}</div>
        </div>
        <div class="profile-stat">
          <div class="profile-stat-label">Videos</div>
          <div class="profile-stat-value">${creator.videosCount}</div>
        </div>
        <div class="profile-stat">
          <div class="profile-stat-label">Total Reads</div>
          <div class="profile-stat-value">${formatNumber(creator.totalReads)}</div>
        </div>
        <div class="profile-stat">
          <div class="profile-stat-label">Ranking</div>
          <div class="profile-stat-value">${rankLabel}</div>
        </div>
      </div>
      <a href="javascript:void(0)" onclick="alert('Viewing full public profiles will be enabled in Phase 3.')" class="view-profile-link">View Profile →</a>
    </div>
  `;
}
