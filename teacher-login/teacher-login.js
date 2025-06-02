
function IDcheck() {
  const input = document.getElementById("input-wrapper").value;

  if (input === "abcd") {
    alert("Login successful");
  } else {
    alert(`The ID "${input}" is not valid.`);
    document.getElementById("input-wrapper").focus();
  }
}
document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      IDcheck();
    }
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const loginButton = document.getElementById("teacher-login-button");

  loginButton.addEventListener("click", () => {
    location.href = "https://smartynotchy.github.io/PHS-Hardware-Catalog/teacher-catalog/teacher-catalog.html";
  });
});
