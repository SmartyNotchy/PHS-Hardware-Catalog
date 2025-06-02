
function IDcheck() {
  const input = document.getElementById("password-input").value;

  if (input === "abcd") {
    alert("Login successful");
  } else {
    alert(`The ID "${input}" is not valid.`);
    document.getElementById("password-input").focus();
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

 if (loginButton) {
    loginButton.onclick= () =>{
      IDcheck();
      window.location.href = "https://smartynotchy.github.io/PHS-Hardware-Catalog/teacher-catalog/teacher-catalog.html";
    };
  } else {
    alert("Login button not found in the DOM.");
  }
});
