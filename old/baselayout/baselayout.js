const root = document.documentElement;
const body = document.querySelector("body");
const main = document.querySelector("main");
const toggleNavButton = document.querySelector(".toggle-nav-btn");
const toggleNavButtonTooltip = toggleNavButton.querySelector(".tooltip");
const toggleNavButtonImg = toggleNavButton.querySelector("img");

function toggleNav() {
  const navIsClosed = root.classList.toggle("nav-closed");

  if (navIsClosed) {
    toggleNavButtonImg.src =
      "https://smartynotchy.github.io/PHS-Hardware-Catalog/icons/open-nav.png";
    toggleNavButtonImg.alt = ">";
    toggleNavButtonTooltip.textContent = "Open Navbar";
  } else {
    toggleNavButtonImg.src =
      "https://smartynotchy.github.io/PHS-Hardware-Catalog/icons/close-nav.png";
    toggleNavButtonImg.alt = "<";
    toggleNavButtonTooltip.textContent = "Close Navbar";
  }
}

function isScrollBarVisible() {
  return main.scrollHeight > main.clientHeight;
}
function updateScrollBarPadding() {
  if (isScrollBarVisible()) {
    body.classList.remove("no-scroll-bar");
  } else {
    body.classList.add("no-scroll-bar");
  }
}

window.addEventListener("load", updateScrollBarPadding);
toggleNavButton.addEventListener("click", () => {
  toggleNav();
  updateScrollBarPadding();
});
