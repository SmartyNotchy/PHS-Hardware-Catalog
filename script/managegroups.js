const projectsContainer = document.getElementById('projects-container');
const createProjectBtn = document.getElementById('create-project-btn');
const projectTemplate = document.getElementById('project-template');
const groupTemplate = document.getElementById('group-template');

async function renderProjects() {
    const projects = await getProjects();
    projectsContainer.innerHTML = '';

    projects.forEach(async project => {
        const projectNode = projectTemplate.content.cloneNode(true);
        const projectEl = projectNode.querySelector('.project');
        projectEl.querySelector('.project-name').textContent = project.name;

        const addGroupBtn = projectEl.querySelector('.add-group-btn');
        const groupsContainer = projectEl.querySelector('.groups-container');

        addGroupBtn.addEventListener('click', async () => {
            const groupName = prompt('Enter new group name:');
            if (groupName) {
                const groupStudents = "";//prompt('Enter students in group (can be changed later):');
                await post_cmd(new DataCommand("admin-add-group", [loginState.token, project.uuid, groupName]));
                renderProjects();
            }
        });

        const projGroups = await getGroups(project.uuid);
        projGroups.sort((a, b) => String(a.name).localeCompare(String(b.name)));

        projGroups.forEach(group => {
            console.log("waow");
            console.log(group);

            const groupNode = groupTemplate.content.cloneNode(true);
            const groupEl = groupNode.querySelector('.group');
            groupEl.querySelector('.group-info').textContent = group.name;

            groupEl.querySelector('.edit-group-btn').addEventListener('click', async () => {
            const newName = prompt('Edit group name (leave blank for no change):', group.name);
            if (newName && newName !== group.name) {
                await post_cmd(new DataCommand("admin-edit-group", [loginState.token, group.uuid, newName]));
                renderProjects();
            }
            });

            groupsContainer.appendChild(groupEl);
        });

        projectsContainer.appendChild(projectEl);
    });
}

createProjectBtn.addEventListener('click', async () => {
    const name = prompt('Enter new project name:');
    if (name) {
        console.log(name);

        const res = await post_cmd(new DataCommand("admin-create-project", [ loginState.token, name ]));
        renderProjects();
    }
});

renderProjects();