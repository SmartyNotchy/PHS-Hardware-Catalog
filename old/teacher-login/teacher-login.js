document.addEventListener("DOMContentLoaded", function () {
  function IDcheck() {
    const input = document.getElementById("password-input").value;
    if (input === "abcd") {
      window.location.href =
        "https://smartynotchy.github.io/PHS-Hardware-Catalog/teacher-catalog/teacher-catalog.html";
      return true;
    } else {
      alert(`The ID "${input}" is not valid.`);
      document.getElementById("password-input").focus();
      return false;
    }
  }

  // Prevent form submission
  document.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault();
    IDcheck();
  });

  // Optional: still allow Enter key in input to work
  document
    .getElementById("password-input")
    .addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        IDcheck();
      }
    });
});
