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
const back = document.getElementById('back');
  if(back){
  back.addEventListener("click", () => {
    alert('Login Successful');
      window.history.go(-1);
  }
   };

document.addEventListener('DOMContentLoaded', () => {
         backNavigation():
     
    });
