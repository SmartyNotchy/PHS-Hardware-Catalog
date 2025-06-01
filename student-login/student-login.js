const groups = [
  { id: "g1", name: "Group 1" },
  { id: "g2", name: "Group 2" },
  { id: "g3", name: "Group 3" },
  { id: "g4", name: "Group 4" },
  { id: "g5", name: "Group 5" },
  { id: "g6", name: "Group 6" },
  { id: "g7", name: "Group 7" },
  { id: "g8", name: "Group 8" },
  { id: "g9", name: "Group 9" },
];

window.addEventListener("DOMContentLoaded", () => {
  const select = document.getElementById("groups-select");
  const loginButton = document.getElementById("login-button");
  while (select.options.length > 1) {
    select.remove(1);
  }

  groups.forEach((group) => {
    const option = document.createElement("option");
    option.value = group.id;
    option.textContent = group.name;
    select.appendChild(option);
  });

  loginButton.addEventListener("click", () => {
    // add your magic william
    window.location.href =
      "https://smartynotchy.github.io/PHS-Hardware-Catalog/student-catalog/student-catalog.html";
  });
});
