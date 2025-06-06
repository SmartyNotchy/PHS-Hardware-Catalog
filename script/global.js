/* COOKIES */

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1, cookie.length);
        }
        if (cookie.indexOf(nameEQ) == 0) {
            return cookie.substring(nameEQ.length, cookie.length);
        }
    }
    return undefined;
}

/* LOG IN STATUS */

const loginState = {
    isLoggedIn: false,
    isAdmin: false,
    uuid: "",
    token: ""
}

async function getLoginState() {
    if (getCookie("isLoggedIn") == undefined) {
        resetLoginState();
        saveLoginState();
    }

    loginState.isLoggedIn = getCookie("isLoggedIn");
    loginState.isAdmin = getCookie("isAdmin");
    loginState.uuid = getCookie("uuid");
    loginState.token = getCookie("token");

    if (loginState.isLoggedIn) {
        if (loginState.isAdmin) {
            const res = await get_cmd(new DataCommand("verify-token", [loginState.token]));
            if (!res.is_admin) {
                resetLoginState();
                saveLoginState();
            }
        } else {
            const res = await get_cmd(new DataCommand("get-obj", ["group", loginState.uuid]));
            if (!res.success || res.data == null) {
                resetLoginState();
                saveLoginState();
            }
        }
    }
}

function resetLoginState() {
    loginState.isLoggedIn = false;
    loginState.isAdmin = false;
    loginState.uuid = false;
    loginState.token = false;
}

function saveLoginState() {
    setCookie("isLoggedIn", loginState.isLoggedIn, 365);
    setCookie("isAdmin", loginState.isAdmin, 365);
    setCookie("uuid", loginState.uuid, 365);
    setCookie("token", loginState.token, 365);
}

function logout() {
    resetLoginState();
    saveLoginState();
    window.location.href = "/login.html";
}

getLoginState();

if (window.location.href.indexOf("login.html") == -1) {
    if (!loginState.isLoggedIn) {
        logout();
    }
    window.addEventListener("load", function() { document.getElementById("header_logout").onclick = logout; });
    
    document.addEventListener("DOMContentLoaded", async function () {
        if (loginState.isAdmin) {
        // Hide all student-only links
        document.querySelectorAll('.student-link').forEach(el => el.style.display = 'none');
        } else {
        // Hide all teacher-only links
        document.querySelectorAll('.teacher-link').forEach(el => el.style.display = 'none');
        }
        let name = "";
        if (loginState.isAdmin) {
            const teacher = await get_cmd(new DataCommand("get-obj", ["teacher", loginState.uuid]));
            name = teacher.data.name;
        } else {
            const group = await get_cmd(new DataCommand("get-obj", ["group", loginState.uuid]));
            name = group.data.name;
        }
        document.getElementById("header_user").innerText = name;
    });
}

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