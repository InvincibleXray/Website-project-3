/* ============ NAVBAR SCROLL & MOBILE MENU ============ */
const navbarEl = document.getElementById("navbar");
if (navbarEl) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) navbarEl.classList.add("scrolled");
    else navbarEl.classList.remove("scrolled");
  });
}

const hamburgerEl = document.getElementById("hamburger");
const mobileOverlayEl = document.getElementById("mobileOverlay");
const overlayCloseEl = document.getElementById("overlayClose");

function openMenu() {
  if (!mobileOverlayEl) return;
  mobileOverlayEl.classList.add("open");
  mobileOverlayEl.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeMenu() {
  if (!mobileOverlayEl) return;
  mobileOverlayEl.classList.remove("open");
  mobileOverlayEl.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

if (hamburgerEl) hamburgerEl.addEventListener("click", openMenu);
if (overlayCloseEl) overlayCloseEl.addEventListener("click", closeMenu);
if (mobileOverlayEl) {
  mobileOverlayEl.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMenu));
}
