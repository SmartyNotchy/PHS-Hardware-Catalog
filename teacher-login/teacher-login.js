function IDcheck() {
  const input = document.getElementById("TeacherIDinput").value;

  if (input === "abcd") {
    alert("Login successful");
  } else {
    alert(`The ID "${input}" is not valid.`);
  }
}
document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      IDcheck();
    }
  });
});
