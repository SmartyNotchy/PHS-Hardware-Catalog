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
window.history.go(-1);
   };
                         }
