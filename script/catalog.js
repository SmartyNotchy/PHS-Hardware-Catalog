async function getCatalog() {
    const catalog_uuids = await get_cmd(new DataCommand("get-catalog", []));
    const components = await get_cmd(new DataCommand("get-obj-list", ["component", catalog_uuids]));
    const component_data = components.data;
    //console.log(project_data);
    return component_data;
}

async function getInstances(compUUID) {
    const component = await get_cmd(new DataCommand("get-obj", ["component", compUUID]));
    const instances = await get_cmd(new DataCommand("get-obj-list", ["component_instance", component.data.instances]));
    //console.log("Project Groups");
    //console.log(project);
    const instance_data = instances.data;
    //console.log(group_data);
    return instance_data;
}

/*
function getComponents() {
  return [
    {
      name: "Sensor A",
      image: "sensor-a.jpg",
      details: "Details about **Sensor A**.",
      instances: ["inst1", "inst2"]
    },
    {
      name: "Camera B",
      image: "camera-b.jpg",
      details: "Details about **Camera B**.",
      instances: ["inst3"]
    }
  ];
}

function getInstances(uuids) {
  return [
    { component: "inst1", available: true, pendingReq: false, itemCondition: "Good", details: "v1.0", group: "group1" },
    { component: "inst2", available: false, pendingReq: true, itemCondition: "Fair", details: "v1.1", group: "group1" },
    { component: "inst3", available: true, pendingReq: false, itemCondition: "Excellent", details: "v2.0", group: "group2" }
  ];
}
*/

async function renderCatalog() {
  const container = document.getElementById('catalog');
  const components = await getCatalog();
  container.innerHTML = '';

  components.forEach(comp => {
    const card = document.createElement('div');
    card.className = 'component-card';

    const title = document.createElement('h3');
    title.textContent = comp.name;

    const img = document.createElement('img');
    img.src = comp.image;

    const status = document.createElement('p');
    status.textContent = 'Status: ' + (comp.instances.length > 0 ? 'In stock' : 'Out of stock');

    const btn = document.createElement('button');
    btn.textContent = 'View More';
    btn.onclick = () => openModal(comp);

    card.append(title, img, status, btn);
    container.appendChild(card);
  });
}

async function openModal(comp) {
  const modalContainer = document.getElementById('modal-container');
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';

  const modal = document.createElement('div');
  modal.className = 'modal';

  // Title + Edit (Admin)
  const titleContainer = document.createElement('div');
  titleContainer.style.display = 'flex';
  titleContainer.style.alignItems = 'center';
  titleContainer.style.justifyContent = 'space-between';

  const title = document.createElement('h2');
  title.textContent = comp.name;

  titleContainer.appendChild(title);

  if (loginState.isAdmin) {
    const editTitleBtn = document.createElement('button');
    editTitleBtn.textContent = 'Edit Name';
    editTitleBtn.onclick = async () => {
      const newName = prompt("Enter new component name:", comp.name);
      if (newName) {
        await post_cmd(new DataCommand("admin-edit-component", [loginState.token, comp.uuid, newName, comp.details]));
        title.textContent = newName;
      }
    };
    titleContainer.appendChild(editTitleBtn);
  }

  // Layout: Image + Description
  const infoContainer = document.createElement('div');
  infoContainer.style.display = 'flex';
  infoContainer.style.gap = '1rem';

  const img = document.createElement('img');
  img.src = comp.image;
  img.style.maxWidth = '250px';
  img.style.flexShrink = '0';

  const descBox = document.createElement('div');

  const details = document.createElement('p');
  details.textContent = comp.details;

  descBox.appendChild(details);

  if (loginState.isAdmin) {
    const editDetailsBtn = document.createElement('button');
    editDetailsBtn.textContent = 'Edit Description';
    editDetailsBtn.onclick = async () => {
      const newDetails = prompt("Enter new description:", comp.details);
      if (newDetails) {
         await post_cmd(new DataCommand("admin-edit-component", [loginState.token, comp.uuid, comp.name, newDetails]));
         details.textContent = newDetails;
      }
    };
    descBox.appendChild(editDetailsBtn);
  }

  infoContainer.appendChild(img);
  infoContainer.appendChild(descBox);

  // Admin: Add Instance
  const addInstanceBtn = document.createElement('button');
  if (loginState.isAdmin) {
    addInstanceBtn.textContent = 'Add Instance';
    addInstanceBtn.onclick = async () => {
      let name = prompt("Enter instance name:");
      if (name) {
        await post_cmd(new DataCommand('admin-add-instance', [loginState.token, comp.uuid, name, "New"]));
        openModal(comp);
      }
    };
  }

  // Get and sort instances
  const instances = await getInstances(comp.uuid);
  instances.sort((a, b) => String(a.details).localeCompare(String(b.details)));

  const instanceList = document.createElement('div');
  instanceList.className = 'instance-list';
  if (instances.length === 0) {
  const placeholder = document.createElement('p');
  placeholder.textContent = 'No instances available.';
  placeholder.style.fontStyle = 'italic';
  instanceList.appendChild(placeholder);
  } else {

  instances.forEach(inst => {
    const item = document.createElement('div');
    item.className = 'instance-item';

    const content = document.createElement('div');
    content.innerHTML = `
      <strong>Condition:</strong> ${inst.itemCondition} <br>
      <strong>Details:</strong> ${inst.details} <br>
      <strong>Available:</strong> ${inst.available ? (inst.pendingReq ? "Requested by Other Group" : 'Yes') : 'No'}
    `;

    // Admin: Edit buttons
    if (loginState.isAdmin) {
      const editCond = document.createElement('button');
      editCond.textContent = 'Edit Condition';
      editCond.onclick = async () => {
        const newCond = prompt("New condition:", inst.itemCondition);
        if (newCond) {
          await post_cmd(new DataCommand("admin-edit-instance", [loginState.token, inst.uuid, inst.details, newCond]));
          openModal(comp); // re-render
        }
      };

      const editDetails = document.createElement('button');
      editDetails.textContent = 'Edit Details';
      editDetails.onclick = async () => {
        const newDet = prompt("New details:", inst.details);
        if (newDet) {
          await post_cmd(new DataCommand("admin-edit-instance", [loginState.token, inst.uuid, newDet, inst.itemCondition]));
          openModal(comp); // re-render
        }
      };

      item.append(content, editCond, editDetails);
    } else {
      item.append(content);
    }

    // Request button (non-admins only)
    if (inst.available && !inst.pendingReq && !loginState.isAdmin) {
      const reqBtn = document.createElement('button');
      reqBtn.textContent = 'Request';
      reqBtn.onclick = () => {
        window.location.href = '/request-placeholder.html';
      };
      item.appendChild(reqBtn);
    }

    instanceList.appendChild(item);
  });
  }


  const backBtn = document.createElement('button');
  backBtn.textContent = 'Back';
  backBtn.onclick = () => modalContainer.innerHTML = '';

  modal.append(titleContainer, infoContainer);
  if (loginState.isAdmin) modal.appendChild(addInstanceBtn);
  modal.append(instanceList, backBtn);

  overlay.appendChild(modal);
  modalContainer.innerHTML = '';
  modalContainer.appendChild(overlay);
}


document.getElementById('add-component-btn').addEventListener('click', () => {
  document.getElementById('add-component-modal').classList.remove('component-modal-hidden');
});

document.getElementById('component-cancel-btn').addEventListener('click', () => {
  document.getElementById('add-component-modal').classList.add('component-modal-hidden');
});

document.getElementById('component-submit-btn').addEventListener('click', async () => {
  const name = document.getElementById('component-name').value;
  const image = document.getElementById('component-image').files[0];
  const details = document.getElementById('component-details').value;

  // Placeholder function
  await add_component({ name, image, details });

  // Close modal
  await renderCatalog();
  document.getElementById('add-component-modal').classList.add('component-modal-hidden');
});

// Placeholder function definition
async function add_component(component) {
  await post_cmd(new DataCommand('admin-add-component', [loginState.token, component.name, "./images/arduino-uno-rev3.png", component.details]));
}

document.addEventListener('DOMContentLoaded', () => {
  const addButton = document.getElementById('add-component-btn');

  if (!loginState.isAdmin) {
    addButton.style.display = 'none';
  }
});

renderCatalog();