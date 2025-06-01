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


document.addEventListener('DOMContentLoaded', () => {
  const backBtn = document.getElementById('back');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      alert('Login Successful');
      window.history.go(-1);
    });
  }
});
