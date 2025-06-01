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


function backNavigation(){
const button = document.getElementById('go-back');
button.addEventListener("click", () => {
window.history.go(-1);
   };

document.addEventListener('DOMContentLoaded', () => {
      document.addEventListener('click', function(event) {
        if (event.target.id === 'go-back') {
          backNavigation();
        }
      });
    });
