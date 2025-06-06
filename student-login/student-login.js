window.addEventListener("DOMContentLoaded", async () => {
  // doesnt exsist to my knowledge --> const projectSelect = document.getElementById("projects-select");
  const groupSelect = document.getElementById("groups-select");
  const loginButton = document.getElementById("login-button");
  let groupoptions =['1','2','3','4','5','6','7','8'];
  for(i=0;i<groupoptions.length;i++){
  let option = document.createElement("option");
  option.value= (groupoptions[i]);
  option.text=''+(i+1);
  groupSelect.appendChild(option);
  }


  //group append/pop
  
  /* 1. Fetch projects
  let projectUuids = [];
  try {
    projectUuids = await get_cmd(new DataCommand("get-projects", []));
    for (const uuid of projectUuids) {
      const project = await get_cmd(new DataCommand("get-obj", ["project", uuid]));
      const option = document.createElement("option");
      option.value = uuid;
      option.textContent = project.name;
      projectSelect.appendChild(option);
    }
  } catch (err) {
    alert("Failed to load projects.");
    console.error(err);
    return;
  }*/

  /* 2. When a project is selected, fetch its groups
  projectSelect.addEventListener("change", async () => {
    groupSelect.innerHTML = ""; // Clear previous options
    const selectedProjectUuid = projectSelect.value;
    if (!selectedProjectUuid) return;

    try {
      const project = await get_cmd(new DataCommand("get-obj", ["project", selectedProjectUuid]));
      const groupUuids = project.groups;
      const groups = await get_cmd(new DataCommand("get-obj-list", ["group", ...groupUuids]));
      for (const group of groups) {
        const option = document.createElement("option");
        option.value = group.id;
        option.textContent = group.name;
        groupSelect.appendChild(option);
      }
    } catch (err) {
      alert("Failed to load groups.");
      console.error(err);
    }
  });*/

  // 3. Login button
  loginButton.addEventListener("click", () => {
    const selectedGroupId = groupSelect.value;
    if (!selectedGroupId) {
      alert("Please select a group.");
      return;
    }
    //localStorage.setItem("selectedGroupId", selectedGroupId);
    //localStorage.setItem("studentLoggedIn", "true");
    //should work
    // Prevent form submission
  document.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault();
    window.location.href = "https://smartynotchy.github.io/PHS-Hardware-Catalog/student-catalog/student-catalog.html";
  });

  // Optional: still allow Enter key in input to work
  document
    .getElementById("login-button")
    .addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
       window.location.href = "https://smartynotchy.github.io/PHS-Hardware-Catalog/student-catalog/student-catalog.html";
      }
    });
    
    
  });
});
