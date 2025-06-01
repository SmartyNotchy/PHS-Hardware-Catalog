const hideNav = document.getElementById("hide-nav");
const root = document.documentElement;

hideNav.addEventListener("click", () => {
  root.classList.toggle("nav-collapsed");
  hideNav.querySelector("img").alt = ">";
});
