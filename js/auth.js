/* ============ NAV AUTH STATE ============ */
(function () {
  if (typeof firebaseReady === 'undefined' || !firebaseReady) return;
  const loginBtn = document.getElementById("navLoginBtn");
  const avatarWrap = document.getElementById("navAvatarWrap");
  const avatarBtn = document.getElementById("navAvatarBtn");
  const avatarDropdown = document.getElementById("navAvatarDropdown");
  const signOutBtn = document.getElementById("navSignOut");

  if (!loginBtn || !avatarWrap || !avatarBtn || !signOutBtn) return;

  // Make avatarBtn support background image
  avatarBtn.style.backgroundSize = "cover";
  avatarBtn.style.backgroundPosition = "center";
  avatarBtn.style.display = "flex";
  avatarBtn.style.alignItems = "center";
  avatarBtn.style.justifyContent = "center";

  window.updateNavAvatar = function(url, initialsText) {
    if (url) {
      avatarBtn.style.backgroundImage = `url('${url}')`;
      avatarBtn.textContent = "";
    } else {
      avatarBtn.style.backgroundImage = "none";
      avatarBtn.textContent = initialsText || "?";
    }
  };

  firebase.auth().onAuthStateChanged(async function (user) {
    if (user) {
      // Show avatar, hide Log In
      loginBtn.style.display = "none";
      avatarWrap.style.display = "block";
      
      const name = user.displayName || user.email || "?";
      const userInitials = name.charAt(0).toUpperCase();
      
      window.updateNavAvatar(user.photoURL, userInitials);
      
      if (typeof db !== "undefined") {
        try {
          const doc = await db.collection("users").doc(user.uid).get();
          if (doc.exists) {
            const data = doc.data();
            if (data.avatar) {
              window.updateNavAvatar(data.avatar, userInitials);
            } else if (!data.avatar && user.photoURL) {
              if (data.photoURL !== user.photoURL) {
                db.collection("users").doc(user.uid).set({ photoURL: user.photoURL }, { merge: true });
              }
              window.updateNavAvatar(user.photoURL, userInitials);
            }
          } else {
            // Profile doesn't exist, create it automatically!
            const newProfile = {
              uid: user.uid,
              name: user.displayName || "",
              email: user.email || "",
              avatar: user.photoURL || "",
              college: "",
              role: "reporter",
              verified: false,
              storiesCount: 0,
              videosCount: 0,
              totalReads: 0,
              points: 0,
              joinedAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            await db.collection("users").doc(user.uid).set(newProfile);
            console.log("Success: Automatic Firestore user profile created for " + user.uid);
          }
        } catch (err) {
          console.error("Failed to load user avatar:", err);
        }
      }

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
