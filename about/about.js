function toggleContent(x) {
  const allParagraphs = document.querySelectorAll(".help-container p");
  allParagraphs.forEach((p) => {
    if (p.classList.contains(x)) {
      p.style.visibility = "visible";
    } else {
      p.style.visibility = "hidden";
    }
  });
}
const button = document.getElementById("go-back");
button.addEventListener("click", () => {
  window.history.go(-1);
});
