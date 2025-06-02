
function IDcheck() {
  const input = document.getElementById("password-input").value;

  if (input === "abcd") {
    return true;
  } else {
    alert(`The ID "${input}" is not valid.`);
    //document.getElementById("password-input").focus();
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
        alert("why doesnt this work");

      }
      
      
    };
  } else {
    alert("Login button not found in the DOM.");
  }
});
