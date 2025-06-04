document.addEventListener("DOMContentLoaded", () => {
  const groupMembersList = document.querySelector("#group-members-list");

  const groupsContent = [
    {
      groupName: "group 1",
      groupMembers: ["Steve", "Tralelero Tralala", "Bombardilo Crocodilo"],
      inventory: [
        ["Arduino Uno Rev3", "bubbleguppies123"],
        ["Arduino Uno Rev3", "abc"],
        ["Arduino Motor Shield Rev3", "def"],
        ["Raspberry Pi 5", 1],
        ["Raspberry Pi 5", 2],
        ["Raspberry Pi 5", 3],
        ["Raspberry Pi 5", 4],
        ["Raspberry Pi 5", 5],
      ],
      requests: [
        "Arduino Uno Rev3",
        "Arduino Motor Shield Rev3",
        "Raspberry Pi 5",
      ],
    },
  ];

  function renderGroupMembers(groupContent) {
    groupContent.groupMembers.forEach((groupMember) => {
      const li = document.createElement("li");
      li.textContent = groupMember;
      groupMembersList.appendChild(li);
    });
  }

  renderGroupMembers(groupsContent[0]);
});
