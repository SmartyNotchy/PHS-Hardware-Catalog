const groups = [
  { id: "group1", name: "Group 1" },
  { id: "group22", name: "Group 2" },
  { id: "group3", name: "Group 3" },
  { id: "group4", name: "Group 4" }
];


window.addEventListener('DOMContentLoaded', () => {
  const select = document.getElementById('student-id-select');
  const loginButton = document.getElementById('login-button');
  while (select.options.length > 1) {
    select.remove(1);
  }

  groups.forEach(group => {
    const option = document.createElement('option');
    option.value = group.id;
    option.textContent = group.name;
    select.appendChild(option);


  });

  loginButton.addEventListener('click', () => {
    // add your magic william
    window.location.href = "https://smartynotchy.github.io/PHS-Hardware-Catalog/student-catalog/student-catalog.html";
 });
});