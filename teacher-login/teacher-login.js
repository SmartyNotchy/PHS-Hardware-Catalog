
function IDcheck() {
  const input = document.getElementById("password-input").value;

  if (input === "abcd") {
    alert("Login successful");
    return true;
  } else {
    
    alert(`The ID "${input}" is not valid.`);
    document.getElementById("password-input").focus();
    return false;
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
      if(IDcheck()){
        window.location.href = "https://smartynotchy.github.io/PHS-Hardware-Catalog/student-login/student-login.html";

      }
      
      
    };
  } else {
    alert("Login button not found in the DOM.");
  }
});
