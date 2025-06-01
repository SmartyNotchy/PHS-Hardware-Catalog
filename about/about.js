function toggleContent(x) {
  const allParagraphs = document.querySelectorAll(".help-container p");
  allParagraphs.forEach((p) => {
    if (p.classList.contains(x)) {
      p.style.display = "block";
    } else {
      p.style.display = "none";
    }
  });
}
//whyyyyyy
function backNavigation(){
const back = document.getElementById('back');
  
  back.addEventListener("click", () => {
    alert('Login Successful');
      window.history.go(-1);
   };
                         }
