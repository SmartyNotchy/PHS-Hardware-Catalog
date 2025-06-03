const root = document.documentElement;
const body = document.querySelector("body");
const main = document.querySelector("main");
const hideNavButton = document.getElementById("hide-nav");

function hideNav() {
  root.classList.toggle("nav-collapsed");
  hideNavButton.querySelector("img").alt = ">";
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
hideNavButton.addEventListener("click", () => {
  hideNav();
  updateScrollBarPadding();
});
