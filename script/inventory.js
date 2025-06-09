document.addEventListener('DOMContentLoaded', async () => {
  const groupUUID = loginState.uuid;
  const token = loginState.token;
  const inventoryList = document.getElementById('inventory-list');

  if (!groupUUID || !token) {
    inventoryList.innerHTML = "<p>Error: Group UUID or token missing. Please log in again.</p>";
    return;
  }

  // Placeholder async function — assumed to be implemented elsewhere
  async function getGroupInventoryInstances(uuid) {
    const group = await get_cmd(new DataCommand("get-obj", ["group", uuid]));
    const instances = await get_cmd(new DataCommand("get-obj-list", ["component_instance", group.data.inventory]));
    console.log(instances, group);
    return instances.data;
  }

  async function renderInventory() {
    const res = await getGroupInventoryInstances(groupUUID);
    const items = res.data;

    if (!items || items.length === 0) {
      inventoryList.innerHTML = "<p>No items in inventory.</p>";
      return;
    }

    inventoryList.innerHTML = "";
    items.forEach(async (instance) => {
      const componentReq = await get_cmd(new DataCommand("get-obj", ["component", instance.component]));
      const component = componentReq.data;
        const card = document.createElement('div');
      
      card.classList.add('inventory-card');

      card.innerHTML = `
        <div class="field"><strong>Component:</strong> ${component.name || 'Unnamed Component'}</div>
        <div class="field"><strong>Description:</strong> ${component.description || 'N/A'}</div>
        <div class="field"><strong>Instance Condition:</strong> ${instance.itemCondition || 'Unknown'}</div>
        <div class="field"><strong>Details:</strong> ${instance.details || 'None'}</div>
        <button class="return-btn">Return</button>
      `;

      card.querySelector('.return-btn').addEventListener('click', async () => {
        if (confirm("Are you sure you want to return this item?")) {
          await returnComponent(token, groupUUID, instance.uuid); // you may adapt the signature
          card.remove();
        }
      });

      inventoryList.appendChild(card);
    });
  }

  renderInventory();
});
