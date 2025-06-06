async function submitStudentLogin(project, group) {
    console.log(`Logging in as student: ${project}, ${group}`);
    loginState.isLoggedIn = true;
    loginState.isAdmin = false;
    loginState.uuid = group;
    loginState.token = "No Tokens :(";
    saveLoginState();
}

async function submitTeacherPassword(password) {
    console.log(`Logging in as teacher with password: ${password}`);
    const loginReq = await post_cmd(new DataCommand("teacher-login", [password]));
    console.log(loginReq);
    if (loginReq.success) {
        loginState.isLoggedIn = true;
        loginState.isAdmin = true;
        loginState.uuid = loginReq.uuid;
        loginState.token = loginReq.token;
        saveLoginState();
        return true;
    } else {
        return false;
    }
}

async function renderInitial() {
    const navIsClosed = root.classList.toggle("nav-closed");
    if (!navIsClosed) {
        root.classList.toggle("nav-closed");
    }

    const container = document.getElementById('login-container');
    container.innerHTML = '';

    if (loginState.isLoggedIn) {
        const message = document.createElement('div');

        let loginStateName = "";
        if (loginState.isAdmin) {
            loginStateName = await get_cmd(new DataCommand("get-obj", ["teacher", loginState.uuid]));
            loginStateName = loginStateName.data.name;
        } else {
            const group = await get_cmd(new DataCommand("get-obj", ["group", loginState.uuid])).name;
            loginStateName = await get_cmd(new DataCommand("get-obj", ["teacher", loginState.uuid])).name;
        }
        message.textContent = `Logged in as ${loginStateName}`;

        const catalogBtn = document.createElement('button');
        catalogBtn.textContent = 'Proceed to Catalog';
        catalogBtn.onclick = () => { window.location.href = "/" };

        const logoutBtn = document.createElement('button');
        logoutBtn.textContent = 'Log Out';
        logoutBtn.onclick = () => {
            resetLoginState();
            renderInitial();
        };

        container.append(message, catalogBtn, logoutBtn);
    } else {
        const prompt = document.createElement('div');
        prompt.textContent = 'Log in as:';

        const studentBtn = document.createElement('button');
        studentBtn.textContent = 'Student';
        studentBtn.onclick = renderStudentLogin;

        const teacherBtn = document.createElement('button');
        teacherBtn.textContent = 'Teacher';
        teacherBtn.onclick = renderTeacherLogin;

        container.append(prompt, studentBtn, teacherBtn);
    }
}

async function getProjects() {
    const project_uuids = await get_cmd(new DataCommand("get-projects", []));
    const projects = await get_cmd(new DataCommand("get-obj-list", ["project", project_uuids]));
    const project_data = projects.data;
    console.log(project_data);
    return project_data;
}

async function getGroups(projUUID) {
    const project = await get_cmd(new DataCommand("get-obj", ["project", projUUID]));
    const groups = await get_cmd(new DataCommand("get-obj-list", ["group", project.groups]));
    return groups;
}

async function renderStudentLogin() {
    const container = document.getElementById('login-container');
    container.innerHTML = '';

    const projectSelect = document.createElement('select');
    const defaultProjectOption = document.createElement('option');
    defaultProjectOption.text = 'Select a project';
    defaultProjectOption.disabled = true;
    defaultProjectOption.selected = true;
    projectSelect.appendChild(defaultProjectOption);

    const projects = await getProjects();
    console.log(projects);

    for (const project of projects) {
        const option = document.createElement('option');
        option.value = project.uuid;
        option.text = project.name;
        projectSelect.appendChild(option);
    }

    const groupSelect = document.createElement('select');
    const defaultGroupOption = document.createElement('option');
    defaultGroupOption.text = 'Select a group';
    defaultGroupOption.disabled = true;
    defaultGroupOption.selected = true;
    groupSelect.appendChild(defaultGroupOption);
    groupSelect.disabled = true;

    const loginBtn = document.createElement('button');
    loginBtn.textContent = 'Submit Log In';
    loginBtn.disabled = true;

    const backBtn = document.createElement('button');
    backBtn.textContent = 'Back';
    backBtn.onclick = renderInitial;

    projectSelect.onchange = async function() {
        const groups = await getGroups(projectSelect.value);
        groupSelect.innerHTML = '';
        const defaultGroupOption = document.createElement('option');
        defaultGroupOption.text = 'Select a group';
        defaultGroupOption.disabled = true;
        defaultGroupOption.selected = true;
        groupSelect.appendChild(defaultGroupOption);

        for (const group of groups) {
            const option = document.createElement('option');
            option.value = group.uuid;
            option.text = group.name;
            groupSelect.appendChild(option);
        }
        groupSelect.disabled = false;
        loginBtn.disabled = true;
    };

    groupSelect.onchange = () => {
        if (projectSelect.value && groupSelect.value && groupSelect.selectedIndex > 0) {
            loginBtn.disabled = false;
        }
    };

    loginBtn.onclick = async function() {
        await submitStudentLogin(projectSelect.value, groupSelect.value);
        window.location.href = "/";
    }

    container.append(projectSelect, groupSelect, loginBtn, backBtn);
}

function renderTeacherLogin() {
    const container = document.getElementById('login-container');
    container.innerHTML = '';

    const passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.placeholder = 'Enter password';

    const submitBtn = document.createElement('button');
    submitBtn.textContent = 'Submit Password';
    submitBtn.disabled = true;

    const backBtn = document.createElement('button');
    backBtn.textContent = 'Back';
    backBtn.onclick = renderInitial;

    passwordInput.oninput = () => {
        submitBtn.disabled = !passwordInput.value.trim();
    };

    submitBtn.onclick = async function() {
        const res = await submitTeacherPassword(passwordInput.value);
        if (!res) alert("Incorrect password!");
        else window.location.href = "/";
    }

    container.append(passwordInput, submitBtn, backBtn);
}

// Initialize page
window.addEventListener("load", renderInitial);