function IDcheck() {
  const input = document.getElementById("password-input").value;

  if (input === "12345678") {
    alert("Login successful");
  } else {
    alert(`The ID "${input}" is not valid.`);
  }
}
document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      IDcheck();
    }
  });
});
window.addEventListener("DOMContentLoaded", () => {
  const loginButton = document.getElementById("login-button");

  loginButton.addEventListener("click", () => {
    // add your magic william
    window.location.href =
      "https://smartynotchy.github.io/PHS-Hardware-Catalog/teacher-catalog/teacher-catalog.html";
  });
});
