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

   };

document.addEventListener('DOMContentLoaded', () => {
      document.addEventListener('click', function(event) {
        if (event.target.id === 'back') {
          alert('Login Succesful');
          window.history.go(-1);
        }
      });
    });
