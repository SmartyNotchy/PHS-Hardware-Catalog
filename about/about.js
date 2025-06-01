document.addEventListener("DOMContentLoaded", function () {
  const backButton = document.getElementById("back");

  if (backButton) {
    backButton.addEventListener("click", function () {
      window.history.back();
    });
  }
});
