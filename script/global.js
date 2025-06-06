/* NAVBAR */

const root = document.documentElement;
const body = document.querySelector("body");
const main = document.querySelector("main");
const toggleNavButton = document.querySelector(".toggle-nav-btn");

function toggleNav() {
    const toggleNavButtonTooltip = toggleNavButton.querySelector(".tooltip");
    const toggleNavButtonImg = toggleNavButton.querySelector("img");

    const navIsClosed = root.classList.toggle("nav-closed");

    if (navIsClosed) {
        toggleNavButtonImg.src =
            "icons/navbar/open-nav.png";
        toggleNavButtonImg.alt = ">";
        toggleNavButtonTooltip.textContent = "Open Navbar";
    } else {
        toggleNavButtonImg.src =
            "icons/navbar/close-nav.png";
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

if (toggleNavButton != null) {
    window.addEventListener("load", updateScrollBarPadding);
    toggleNavButton.addEventListener("click", () => {
        toggleNav();
        updateScrollBarPadding();
    });
}


/* LOG IN STATUS */

// Placeholder login state
const userState = {
    isLoggedIn: false,
    userType: null, // 'student' or 'teacher'
    username: 'SampleUser'
};

// Placeholder functions
function getProjects() {
    return ['Project Alpha', 'Project Beta'];
}

function getGroups(project) {
    return project === 'Project Alpha' ? ['Group 1', 'Group 2'] : ['Group A', 'Group B'];
}