document.addEventListener('DOMContentLoaded', async () => {
  const requestsContainer = document.getElementById('requests-container');

  // Fetch requests data from backend
  async function fetchRequests() {
    const ruids = await get_cmd(new DataCommand("get-requests", []));
    const requests = await get_cmd(new DataCommand("get-obj-list", ["request_form", ruids]));
    const req_data = requests.data;
    console.log(req_data, requests, ruids);
    req_data.sort((a, b) => {
        const statusWeight = status => {
        if (status === 'pending') return 2;
        if (status === 'accepted' || status === 'rejected') return 1;
        return 0;
        };

        const statusDiff = statusWeight(b.status) - statusWeight(a.status);
        if (statusDiff !== 0) return statusDiff;

        return String(a.reason).localeCompare(String(b.reason));
        });
    
    for (const req of req_data) {
        const reqgroup = await get_cmd(new DataCommand("get-obj", ["group", req.group_uuid]));
        console.log(req, reqgroup);
        req.groupName = reqgroup.data.name;        
    }

    return req_data
  }

  // Placeholder async function returning instance and component details
  async function getInstanceDetails(instanceUUID) {
    const instance = await get_cmd(new DataCommand("get-obj", ["component_instance", instanceUUID]));
    const component = await get_cmd(new DataCommand("get-obj", ["component", instance.data.component]));
    const res = {
        instance: instance.data,
        component: component.data
    };
    console.log(res);

    // Simulate async fetch; replace with actual API call if needed
    return res;
  }

  async function renderRequests(requests) {
    if (!requests || requests.length === 0) {
      requestsContainer.innerHTML = '<p>No requests found.</p>';
      return;
    }
    requestsContainer.innerHTML = ''; // Clear existing

    // Use for...of for async/await inside loop
    for (const req of requests) {
      const card = document.createElement('div');
      card.classList.add('request-card');

      // Await the instance details
      const { instance, component } = await getInstanceDetails(req.component_instance);

      card.innerHTML = `
        <div class="field">
          <strong>Requested Component:</strong> ${component.name || 'N/A'}
        </div>
        <div class="field">
        <strong>Requested By:</strong> ${req.groupName}
        </div>
        <div class="field">
          <strong>Item Details:</strong> ${instance.details || 'N/A'} - Condition: ${instance.itemCondition || 'N/A'}
        </div>
        <div class="field request-reason"><strong>Reason:</strong> ${req.reason}</div>
        <div class="field"><strong>Status:</strong> ${req.status}</div>
        ${req.teacherMessage ? `<div class="teacher-message"><strong>Teacher Message:</strong><br>${req.teacherMessage}</div><br><br>` : ''}
        <button class="reject-btn">Reject Request</button>
        <button class="approve-btn">Approve Request</button>
        
      `;
    
      if (req.status == "pending") {
        card.querySelector('.approve-btn').addEventListener('click', async () => {
        const msg = prompt("Enter a message to send to the group.", "Approved.") 
        if (msg) {
          await post_cmd(new DataCommand("accept-request", [loginState.token, req.uuid, msg]));

          card.innerHTML = `
            <div class="field">
            <strong>Requested Component:</strong> ${component.name || 'N/A'}
            </div>
            <div class="field">
            <strong>Requested By:</strong> ${req.groupName}
            </div>
            <div class="field">
            <strong>Item Details:</strong> ${instance.details || 'N/A'} - Condition: ${instance.itemCondition || 'N/A'}
            </div>
            <div class="field request-reason"><strong>Reason:</strong> ${req.reason}</div>
            <div class="field"><strong>Status:</strong> ${req.status}</div>
            ${msg ? `<div class="teacher-message"><strong>Teacher Message:</strong><br>${msg}</div><br><br>` : ''}
            <button class="reject-btn" disabled>Reject Request</button>
            <button class="approve-btn" disabled>Approve Request</button>
            
        `;
        }
      });

      card.querySelector('.reject-btn').addEventListener('click', async () => {
        const msg = prompt("Enter a message to send to the group.", "Rejected.") 
        if (msg) {
          await post_cmd(new DataCommand("reject-request", [loginState.token, req.uuid, msg]));
          
          card.innerHTML = `
            <div class="field">
            <strong>Requested Component:</strong> ${component.name || 'N/A'}
            </div>
            <div class="field">
            <strong>Requested By:</strong> ${req.groupName}
            </div>
            <div class="field">
            <strong>Item Details:</strong> ${instance.details || 'N/A'} - Condition: ${instance.itemCondition || 'N/A'}
            </div>
            <div class="field request-reason"><strong>Reason:</strong> ${req.reason}</div>
            <div class="field"><strong>Status:</strong> ${req.status}</div>
            ${msg ? `<div class="teacher-message"><strong>Teacher Message:</strong><br>${msg}</div><br><br>` : ''}
            <button class="reject-btn" disabled>Reject Request</button>
            <button class="approve-btn" disabled>Approve Request</button>
            
        `;
            }
      });
      } else {
        card.querySelector('.approve-btn').setAttribute("disabled", true);

      card.querySelector('.reject-btn').setAttribute("disabled", true);
      }
      

      requestsContainer.appendChild(card);
    }
  }

  async function cancelRequest(requestUUID) {
    try {
      const response = await fetch('/api/cancel-request', { // your backend endpoint to handle cancellation
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ request_uuid: requestUUID, group_uuid: groupUUID })
      });
      const result = await response.json();
      if (result.success) {
        alert('Request cancelled successfully.');
        const updatedReqs = await fetchRequests(groupUUID);
        await renderRequests(updatedReqs);
      } else {
        alert('Failed to cancel request: ' + result.message);
      }
    } catch (err) {
      alert('Error cancelling request: ' + err.message);
    }
  }

  const reqs = await fetchRequests();
  await renderRequests(reqs);
});
