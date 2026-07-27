/* ============ NAV AUTH STATE ============ */
(function () {
  if (typeof firebaseReady === 'undefined' || !firebaseReady) return;
  const loginBtn = document.getElementById("navLoginBtn");
  const avatarWrap = document.getElementById("navAvatarWrap");
  const avatarBtn = document.getElementById("navAvatarBtn");
  const avatarDropdown = document.getElementById("navAvatarDropdown");
  const signOutBtn = document.getElementById("navSignOut");

  if (!loginBtn || !avatarWrap || !avatarBtn || !signOutBtn) return;

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // Show avatar, hide Log In
      loginBtn.style.display = "none";
      avatarWrap.style.display = "block";
      // Set initials from displayName or email
      const name = user.displayName || user.email || "?";
      avatarBtn.textContent = name.charAt(0).toUpperCase();
    } else {
      // Show Log In, hide avatar
      loginBtn.style.display = "";
      avatarWrap.style.display = "none";
    }
  });

  // Toggle dropdown
  avatarBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    const isOpen = avatarWrap.classList.toggle("open");
    avatarBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  // Close dropdown on outside click
  document.addEventListener("click", function (e) {
    if (!avatarWrap.contains(e.target)) {
      avatarWrap.classList.remove("open");
      avatarBtn.setAttribute("aria-expanded", "false");
    }
  });

  // Close on Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      avatarWrap.classList.remove("open");
      avatarBtn.setAttribute("aria-expanded", "false");
    }
  });

  // Sign out
  signOutBtn.addEventListener("click", function () {
    firebase.auth().signOut();
  });
}());
