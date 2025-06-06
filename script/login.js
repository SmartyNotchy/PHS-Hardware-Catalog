function submitStudentLogin(project, group) {
    console.log(`Logging in as student: ${project}, ${group}`);
}

function submitTeacherPassword(password) {
    console.log(`Logging in as teacher with password: ${password}`);
}

function renderInitial() {
    const navIsClosed = root.classList.toggle("nav-closed");
    if (!navIsClosed) {
        root.classList.toggle("nav-closed");
    }
    
    const container = document.getElementById('login-container');
    container.innerHTML = '';

    if (userState.isLoggedIn) {
    const message = document.createElement('div');
    message.textContent = `Logged in as ${userState.username}`;

    const catalogBtn = document.createElement('button');
    catalogBtn.textContent = 'Proceed to Catalog';

    const logoutBtn = document.createElement('button');
    logoutBtn.textContent = 'Log Out';
    logoutBtn.onclick = () => {
        userState.isLoggedIn = false;
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

function renderStudentLogin() {
    const container = document.getElementById('login-container');
    container.innerHTML = '';

    const projectSelect = document.createElement('select');
    const defaultProjectOption = document.createElement('option');
    defaultProjectOption.text = 'Select a project';
    defaultProjectOption.disabled = true;
    defaultProjectOption.selected = true;
    projectSelect.appendChild(defaultProjectOption);

    for (const project of getProjects()) {
    const option = document.createElement('option');
    option.value = project;
    option.text = project;
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

    projectSelect.onchange = () => {
    const groups = getGroups(projectSelect.value);
    groupSelect.innerHTML = '';
    const defaultGroupOption = document.createElement('option');
    defaultGroupOption.text = 'Select a group';
    defaultGroupOption.disabled = true;
    defaultGroupOption.selected = true;
    groupSelect.appendChild(defaultGroupOption);

    for (const group of groups) {
        const option = document.createElement('option');
        option.value = group;
        option.text = group;
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

    loginBtn.onclick = () => submitStudentLogin(projectSelect.value, groupSelect.value);

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

    submitBtn.onclick = () => submitTeacherPassword(passwordInput.value);

    container.append(passwordInput, submitBtn, backBtn);
}

// Initialize page
window.addEventListener("load", renderInitial);