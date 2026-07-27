const fs = require('fs');

let content = fs.readFileSync('c:/Users/A/Website-project-3/community.html', 'utf8');

const newCss = `    /* ============ PAGE HEADER ============ */
    .page-header {
      background: var(--bg);
      padding: 100px 0 40px;
    }
    .page-header-inner {
      display: flex;
      flex-direction: column;
    }
    .page-eyebrow {
      font-family: var(--font-mono);
      font-size: 11px; font-weight: 600;
      color: var(--accent);
      letter-spacing: 3px;
      text-transform: uppercase;
      margin-bottom: 12px;
      text-align: left;
    }
    .page-title {
      font-family: var(--font-headline);
      font-weight: 900;
      font-size: 52px;
      color: var(--text-primary);
      letter-spacing: -1.2px;
      line-height: 1.05;
      margin-bottom: 16px;
    }
    .page-title-rule {
      width: 48px; height: 2px;
      background: var(--accent);
      margin-bottom: 16px;
    }
    .page-sub {
      font-family: var(--font-body);
      font-weight: 300;
      font-size: 18px;
      color: var(--text-secondary);
      max-width: 540px;
      line-height: 1.55;
    }
    .header-divider {
      height: 1px; background: var(--border); border: 0;
      width: 100%;
    }
    
    /* COMPACT EDITORIAL METADATA BAR */
    .comm-meta-bar {
      display: flex;
      gap: 0;
      margin-top: 28px;
      flex-wrap: wrap;
    }
    .comm-meta-item {
      flex-shrink: 0;
    }
    .comm-meta-num {
      font-family: var(--font-mono);
      font-size: 20px;
      font-weight: 600;
      color: var(--accent);
      display: block;
    }
    .comm-meta-label {
      font-family: var(--font-mono);
      font-size: 10px;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 1px;
      display: block;
      margin-top: 3px;
    }
    .comm-meta-div {
      width: 1px;
      height: 36px;
      background: var(--border);
      margin: 0 20px;
      flex-shrink: 0;
      align-self: center;
    }

    .hero-ctas {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      align-items: center;
      margin-top: 28px;
    }
    .hero-ctas .btn-submit {
      /* Uses global btn-submit */
    }
    .hero-ctas .btn-text-link {
      color: var(--accent);
      font-weight: 500;
      font-size: 14px;
      transition: color 0.2s ease;
      background: none;
      border: none;
      padding: 0;
    }
    .hero-ctas .btn-text-link:hover {
      color: var(--accent-hover);
    }

    /* ============ TICKER (verbatim from index.html) ============ */
    .ticker {
      background: #1A1A1A;
      height: 36px;
      display: flex;
      align-items: center;
      overflow: hidden;
    }
    .ticker-inner {
      max-width: var(--max-width);
      margin: 0 auto;
      padding: 0 var(--gutter);
      width: 100%;
      display: flex;
      align-items: center;
      gap: 16px;
      height: 100%;
    }
    .live-badge {
      background: var(--accent);
      color: #fff;
      font-family: var(--font-mono);
      font-size: 10px;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 3px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      letter-spacing: 1px;
      flex-shrink: 0;
    }
    .live-dot {
      width: 6px; height: 6px;
      background: #fff;
      border-radius: 50%;
      animation: blink 1.2s infinite;
    }
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.2; }
    }
    .ticker-track {
      flex: 1;
      overflow: hidden;
      position: relative;
      mask-image: linear-gradient(to right, transparent 0, #000 5%, #000 95%, transparent 100%);
    }
    .ticker-content {
      display: inline-flex;
      gap: 32px;
      white-space: nowrap;
      font-family: var(--font-mono);
      font-size: 11px;
      color: #E8E4DF;
      animation: marquee 40s linear infinite;
    }
    .ticker-track:hover .ticker-content { animation-play-state: paused; }
    .ticker-content span::after {
      content: " • ";
      color: var(--accent);
      margin-left: 32px;
    }
    @keyframes marquee {
      0%   { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }

    /* ============ SECTION SHARED ============ */
    .section {
      padding: 72px 0;
    }
    .section-dark {
      background: var(--bg-dark);
      color: #fff;
    }
    .section-label {
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--accent);
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 12px;
    }
    .section-h2 {
      font-family: var(--font-headline);
      font-weight: 700;
      font-size: 36px;
      line-height: 1.15;
      color: var(--text-primary);
      letter-spacing: -0.5px;
      margin-bottom: 18px;
      max-width: 760px;
    }
    .section-dark .section-h2 { color: #fff; }
    .section-paragraph {
      font-size: 15px;
      color: var(--text-secondary);
      max-width: 640px;
      margin-bottom: 28px;
      line-height: 1.6;
    }
    .section-divider {
      width: 48px;
      height: 2px;
      background: var(--accent);
      margin-bottom: 24px;
    }

    /* ============ CONTRIBUTORS GRID ============ */
    .contributors-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-top: 24px;
    }
    .contributor-card {
      background: transparent;
      border-top: 2px solid var(--border);
      padding: 20px 0;
      transition: border-top-color 0.2s ease;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
    .contributor-card:hover {
      border-top-color: var(--accent);
    }
    .contributor-name {
      font-family: var(--font-headline);
      font-weight: 700;
      font-size: 17px;
      color: var(--text-primary);
    }
    .contributor-meta {
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--text-muted);
      letter-spacing: 0.5px;
      margin-top: 4px;
    }
    .stories-pill {
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--accent);
      margin-top: 8px;
      background: none;
      border: none;
      padding: 0;
    }

    /* ============ TOP PERFORMERS (dark) ============ */
    .spotlight-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-top: 24px;
    }
    .spotlight-card {
      background: #161616;
      border: 1px solid #222;
      border-radius: 0;
      padding: 24px;
      transition: border-color 0.2s ease;
      display: flex;
      flex-direction: column;
    }
    .spotlight-card:hover {
      border-color: var(--accent);
    }
    .pill-badge {
      font-family: var(--font-mono);
      font-size: 9px;
      color: var(--accent);
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 12px;
      display: block;
    }
    .spotlight-name {
      font-family: var(--font-headline);
      color: #fff;
      font-weight: 700;
      font-size: 20px;
      line-height: 1.3;
    }
    .spotlight-sub {
      font-family: var(--font-mono);
      color: #666;
      font-size: 12px;
      margin-top: 6px;
    }

    /* ============ LEADERBOARD ============ */
    .leaderboard {
      background: transparent;
      margin-top: 24px;
    }
    .rank-row {
      padding: 14px 0;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .rank-row:last-child { border-bottom: none; }
    .rank-num {
      font-family: var(--font-mono);
      font-weight: 500;
      color: var(--text-muted);
      font-size: 13px;
      width: 32px;
      flex-shrink: 0;
    }
    .rank-name {
      font-family: var(--font-body);
      font-weight: 600;
      color: var(--text-primary);
      font-size: 15px;
      flex: 1;
    }
    .rank-college {
      font-family: var(--font-mono);
      color: var(--text-secondary);
      font-size: 12px;
    }
    .rank-spacer { flex: 1; }
    .rank-badge {
      font-family: var(--font-mono);
      font-size: 11px;
      font-weight: 600;
      padding: 3px 10px;
      border-radius: 3px;
    }
    .rank-badge.gold   { background: #F5C842; color: #1a1a1a; }
    .rank-badge.silver { background: #B0B0B0; color: #1a1a1a; }
    .rank-badge.bronze { background: #CD7F32; color: #fff; }

    /* ============ CREATOR PROFILE PREVIEW ============ */
    .profile-preview-card {
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 28px;
      background: var(--surface);
      max-width: 480px;
      margin-top: 24px;
    }
    .profile-head {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 20px;
    }
    .profile-avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: var(--accent);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-headline);
      font-weight: 700;
      color: #fff;
      font-size: 14px;
      flex-shrink: 0;
    }
    .profile-name {
      font-family: var(--font-headline);
      font-weight: 700;
      font-size: 18px;
      color: var(--text-primary);
    }
    .gold-pill {
      background: #F5C842;
      color: #1a1a1a;
      font-family: var(--font-mono);
      font-size: 9px;
      padding: 2px 8px;
      border-radius: 3px;
      letter-spacing: 1px;
      margin-left: auto;
    }
    .profile-stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      padding: 16px 0;
      border-top: 1px solid var(--border);
      border-bottom: 1px solid var(--border);
    }
    .profile-stat-label {
      font-family: var(--font-mono);
      font-size: 10px;
      color: var(--text-muted);
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    .profile-stat-value {
      font-family: var(--font-headline);
      font-size: 20px;
      font-weight: 700;
      color: var(--text-primary);
      margin-top: 2px;
    }
    .view-profile-link {
      display: inline-block;
      margin-top: 16px;
      color: var(--accent);
      font-size: 13px;
      font-weight: 500;
      transition: color 0.2s ease;
      text-decoration: none;
    }
    .view-profile-link:hover { color: var(--accent-hover); }

    /* ============ VALUES GRID ============ */
    .values-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-top: 24px;
    }
    .value-card {
      border-top: 2px solid var(--border);
      padding-top: 16px;
      background: transparent;
      transition: border-top-color 0.2s ease;
    }
    .value-card:hover {
      border-top-color: var(--accent);
    }
    .value-title {
      font-family: var(--font-headline);
      font-weight: 700;
      font-size: 16px;
      color: var(--text-primary);
      margin-bottom: 6px;
    }
    .value-desc {
      color: var(--text-secondary);
      font-size: 13px;
      line-height: 1.5;
    }

    /* ============ JOIN CTA ============ */
    .join-cta {
      background: var(--bg-dark);
      color: #fff;
      padding: 72px 0;
      text-align: center;
    }
    .join-cta h2 {
      font-family: var(--font-headline);
      font-weight: 700;
      font-size: 36px;
      line-height: 1.15;
      letter-spacing: -0.5px;
      margin-bottom: 14px;
    }
    .join-cta p {
      color: #9A9A9A;
      font-size: 15px;
      max-width: 520px;
      margin: 0 auto 24px;
      line-height: 1.6;
    }

    /* ============ FOOTER (verbatim from index.html) ============ */
    footer {
      background: var(--bg-dark);
      color: #F9F7F4;
      padding: 56px 0 0;
    }
    .footer-grid {
      display: grid;
      grid-template-columns: 1.4fr 1fr 1fr 1fr;
      gap: 48px;
      padding-bottom: 40px;
    }
    .footer-logo {
      font-family: var(--font-headline);
      font-weight: 900;
      font-size: 24px;
      color: #fff;
      margin-bottom: 12px;
    }
    .footer-tagline {
      font-size: 13px;
      color: var(--text-muted);
      margin-bottom: 20px;
    }
    .socials {
      display: flex;
      gap: 14px;
    }
    .socials a {
      width: 36px; height: 36px;
      border: 1px solid #2a2a2a;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: border-color 0.2s ease, background 0.2s ease;
    }
    .socials a:hover { border-color: var(--accent); background: var(--accent); }
    .socials svg { width: 16px; height: 16px; fill: #fff; }
    .footer-heading {
      font-family: var(--font-mono);
      font-size: 11px;
      letter-spacing: 2px;
      color: var(--text-secondary);
      margin-bottom: 16px;
      text-transform: uppercase;
    }
    .footer-col ul li { margin-bottom: 10px; }
    .footer-col a {
      font-size: 14px;
      color: var(--text-muted);
      transition: color 0.2s ease;
      text-decoration: none;
    }
    .footer-col a:hover { color: #fff; }
    .footer-bottom {
      border-top: 1px solid #1c1c1c;
      padding: 18px 0;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
      font-family: var(--font-mono);
      font-size: 11px;
      color: #4A4A4A;
    }

    /* ============ ANIMATIONS (verbatim from index.html) ============ */
    @keyframes fadeIn {
      to { opacity: 1; }
    }
    @keyframes slideUp {
      to { opacity: 1; transform: translateY(0); }
    }
    .stagger {
      opacity: 0;
      transform: translateY(16px);
      animation: slideUp 0.5s ease forwards;
    }

    /* ============ RESPONSIVE ============ */
    @media (max-width: 1024px) {
      .page-title { font-size: 42px; }
      .section-h2 { font-size: 30px; }
      .join-cta h2 { font-size: 30px; }
      .footer-grid { grid-template-columns: 1.2fr 1fr 1fr; }
      .footer-grid .footer-col:nth-child(4) { display: none; }
    }

    @media (max-width: 768px) {
      :root { --gutter: 20px; }
      .nav-links { display: none; }
      .hamburger { display: flex; }
      .btn-submit { padding: 7px 14px; font-size: 12px; }

      .page-title { font-size: 36px; }
      .page-sub { font-size: 16px; max-width: 100%; }

      .section { padding: 56px 0; }
      .section-h2 { font-size: 26px; }
      .join-cta { padding: 56px 0; }
      .join-cta h2 { font-size: 26px; }
      .footer-grid { grid-template-columns: 1fr; gap: 40px; }
      
      .comm-meta-bar { gap: 16px; }
      .comm-meta-div { display: none; }
      .spotlight-grid { grid-template-columns: repeat(2, 1fr); }
      .values-grid { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 480px) {
      .page-title { font-size: 32px; }
      .join-cta h2 { font-size: 24px; }

      .contributors-grid {
        grid-template-columns: 1fr;
      }
      .spotlight-grid {
        grid-template-columns: 1fr;
      }
      .values-grid {
        grid-template-columns: 1fr;
      }
      .profile-stats {
        grid-template-columns: repeat(2, 1fr);
      }

      .footer-grid {
        grid-template-columns: 1fr;
        gap: 32px;
      }
      .footer-grid .footer-col:nth-child(4) { display: block; }
      .footer-bottom { flex-direction: column; align-items: flex-start; }
      
      .nav-inner { padding: 12px var(--gutter); }
      .logo { font-size: 20px; }
      .rank-college { display: none; }
    }
  </style>`;

const newHtml = `  <!-- ============ HERO ============ -->
  <section class="page-header">
    <div class="container">
      <div class="page-eyebrow">BUILT BY THE COMMUNITY</div>
      <h1 class="page-title">Powered by young voices.</h1>
      <div class="page-title-rule"></div>
      <p class="page-sub">WEVOX is powered by reporters, storytellers, and students from cities and campuses across India.</p>
      
      <div class="comm-meta-bar">
        <div class="comm-meta-item"><span class="comm-meta-num">2,400+</span><span class="comm-meta-label">Members</span></div>
        <div class="comm-meta-div"></div>
        <div class="comm-meta-item"><span class="comm-meta-num">900+</span><span class="comm-meta-label">Stories</span></div>
        <div class="comm-meta-div"></div>
        <div class="comm-meta-item"><span class="comm-meta-num">38</span><span class="comm-meta-label">Cities</span></div>
        <div class="comm-meta-div"></div>
        <div class="comm-meta-item"><span class="comm-meta-num">18</span><span class="comm-meta-label">States</span></div>
      </div>

      <div class="hero-ctas">
        <a href="join.html" class="btn-submit">Join the Community &rarr;</a>
        <a href="#contributors" class="btn-text-link">View Contributors &rarr;</a>
      </div>
    </div>
  </section>
  <hr class="header-divider" />

  <!-- ============ TICKER ============ -->
  <div class="ticker" aria-label="Community highlights">
    <div class="ticker-inner">
      <span class="live-badge"><span class="live-dot"></span>LIVE</span>
      <div class="ticker-track">
        <div class="ticker-content">
          <span>2,400+ active members across 38 cities</span>
          <span>900+ stories published this year</span>
          <span>New contributors joining daily from 200+ campuses</span>
          <span>Public rankings updated weekly</span>
          <span>2,400+ active members across 38 cities</span>
          <span>900+ stories published this year</span>
          <span>New contributors joining daily from 200+ campuses</span>
          <span>Public rankings updated weekly</span>
        </div>
      </div>
    </div>
  </div>

  <!-- ============ CONTRIBUTORS GRID ============ -->
  <section class="section" id="contributors">
    <div class="container">
      <div class="section-label">MEET THE COMMUNITY</div>
      <h2 class="section-h2">Contributors building the future.</h2>
      <div class="section-divider"></div>

      <div class="contributors-grid">
        <div class="contributor-card">
          <div class="contributor-name">Ananya Krishnan</div>
          <div class="contributor-meta">IIT Delhi · Reporter</div>
          <div class="stories-pill">12 stories</div>
        </div>
        <div class="contributor-card">
          <div class="contributor-name">Siddharth K.</div>
          <div class="contributor-meta">NLSIU · Storyteller</div>
          <div class="stories-pill">8 stories</div>
        </div>
        <div class="contributor-card">
          <div class="contributor-name">Neha M.</div>
          <div class="contributor-meta">Miranda House · Journalist</div>
          <div class="stories-pill">6 stories</div>
        </div>
        <div class="contributor-card">
          <div class="contributor-name">Pragya Sharma</div>
          <div class="contributor-meta">Delhi University · Reporter</div>
          <div class="stories-pill">15 stories</div>
        </div>
        <div class="contributor-card">
          <div class="contributor-name">Arjun Mehta</div>
          <div class="contributor-meta">IIT Bombay · Filmmaker</div>
          <div class="stories-pill">10 stories</div>
        </div>
        <div class="contributor-card">
          <div class="contributor-name">Fatima Sheikh</div>
          <div class="contributor-meta">AMU · Investigator</div>
          <div class="stories-pill">9 stories</div>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ TOP PERFORMERS (dark) ============ -->
  <section class="section section-dark">
    <div class="container">
      <div class="section-label">TOP PERFORMERS</div>
      <h2 class="section-h2">Celebrating excellence.</h2>
      <div class="section-divider"></div>

      <div class="spotlight-grid">
        <div class="spotlight-card">
          <span class="pill-badge">TOP REPORTER</span>
          <div class="spotlight-name">Pragya Sharma</div>
          <div class="spotlight-sub">DU · 128K Views</div>
        </div>
        <div class="spotlight-card">
          <span class="pill-badge">RISING VOICE</span>
          <div class="spotlight-name">Arjun Mehta</div>
          <div class="spotlight-sub">IIT-B · Featured in 5</div>
        </div>
        <div class="spotlight-card">
          <span class="pill-badge">MOST VIEWED</span>
          <div class="spotlight-name">The Invisible Crisis</div>
          <div class="spotlight-sub">2.3M Views</div>
        </div>
        <div class="spotlight-card">
          <span class="pill-badge">COMMUNITY</span>
          <div class="spotlight-name">Fatima Sheikh</div>
          <div class="spotlight-sub">AMU · 50+ stories</div>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ PUBLIC RANKINGS ============ -->
  <section class="section">
    <div class="container">
      <div class="section-label">WEVOX RANKINGS</div>
      <h2 class="section-h2">Public rankings based on impact.</h2>
      <div class="section-divider"></div>

      <div class="leaderboard">
        <div class="rank-row">
          <div class="rank-num">01</div>
          <div class="rank-name">Ananya Krishnan</div>
          <div class="rank-college">IIT Delhi</div>
          <div class="rank-spacer"></div>
          <div class="rank-badge gold">Gold</div>
        </div>
        <div class="rank-row">
          <div class="rank-num">02</div>
          <div class="rank-name">Neha M.</div>
          <div class="rank-college">Miranda House</div>
          <div class="rank-spacer"></div>
          <div class="rank-badge silver">Silver</div>
        </div>
        <div class="rank-row">
          <div class="rank-num">03</div>
          <div class="rank-name">Siddharth K.</div>
          <div class="rank-college">NLSIU</div>
          <div class="rank-spacer"></div>
          <div class="rank-badge bronze">Bronze</div>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ CREATOR PROFILE PREVIEW ============ -->
  <section class="section">
    <div class="container">
      <div class="section-label">CREATOR PROFILES</div>
      <h2 class="section-h2">Every member has a public profile.</h2>
      <div class="section-divider"></div>
      <p class="section-paragraph">Showcasing reports, videos, achievements, and rankings — all in one place.</p>

      <div class="profile-preview-card">
        <div class="profile-head">
          <div class="profile-avatar">AK</div>
          <div class="profile-name">Ananya Krishnan</div>
          <span class="gold-pill">GOLD</span>
        </div>
        <div class="profile-stats">
          <div class="profile-stat">
            <div class="profile-stat-label">Reports</div>
            <div class="profile-stat-value">12</div>
          </div>
          <div class="profile-stat">
            <div class="profile-stat-label">Videos</div>
            <div class="profile-stat-value">8</div>
          </div>
          <div class="profile-stat">
            <div class="profile-stat-label">Achievements</div>
            <div class="profile-stat-value">4</div>
          </div>
          <div class="profile-stat">
            <div class="profile-stat-label">Ranking</div>
            <div class="profile-stat-value">#1</div>
          </div>
        </div>
        <a href="#" class="view-profile-link">View Profile →</a>
      </div>
    </div>
  </section>

  <!-- ============ COMMUNITY VALUES ============ -->
  <section class="section">
    <div class="container">
      <div class="section-label">COMMUNITY CULTURE</div>
      <h2 class="section-h2">What drives us. What we stand for.</h2>
      <div class="section-divider"></div>

      <div class="values-grid">
        <div class="value-card">
          <div class="value-title">Collaboration</div>
          <div class="value-desc">We grow together.</div>
        </div>
        <div class="value-card">
          <div class="value-title">Fearless</div>
          <div class="value-desc">No holding back.</div>
        </div>
        <div class="value-card">
          <div class="value-title">Creative Freedom</div>
          <div class="value-desc">Your voice, your way.</div>
        </div>
        <div class="value-card">
          <div class="value-title">Meaningful</div>
          <div class="value-desc">Stories that matter.</div>
        </div>
      </div>
    </div>
  </section>`;

content = content.replace(/    \/\* ============ PAGE HEADER ============ \*\/[\s\S]*?  <\/style>/, newCss);
content = content.replace(/  <!-- ============ HERO ============ -->[\s\S]*?  <!-- ============ JOIN CTA ============ -->/, newHtml + '\n  <!-- ============ JOIN CTA ============ -->');
fs.writeFileSync('c:/Users/A/Website-project-3/community.html', content, 'utf8');
