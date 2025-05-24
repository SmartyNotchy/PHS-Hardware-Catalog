function StudentSignUp() {
  const input = document.getElementById("StudentIDinput").value;

  if ((input.length===6)||(input === "abcd")) {
    alert('Account created');
  } else {
    alert(`There was an error in creating a student account with the ID: "${input}" .`);
  }
}
document.addEventListener('DOMContentLoaded', () => {
      document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
          StudentSignUp();
        }
      });
    });
