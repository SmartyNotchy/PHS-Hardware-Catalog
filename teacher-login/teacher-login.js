
function IDcheck() {
  const input = document.getElementById("password-input").value;

  if (input === "1234") {
    alert(`The ID "${input}" is  valid.`);
  } else {
    alert(`The ID "${input}" is not valid.`);
    //document.getElementById("password-input").focus();
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
    IDcheck();
    };
  } else {
    alert("Login button not found in the DOM.");
  }
});
