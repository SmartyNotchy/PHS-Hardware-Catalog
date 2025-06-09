async function fetchForms() {
    const ruids = await get_cmd(new DataCommand("get-requests", []));
    const requests = await get_cmd(new DataCommand("get-obj-list", ["request_form", ruids]));
    const req_data = requests.data;

    const reuids = await get_cmd(new DataCommand("get-returns", []));
    const returns = await get_cmd(new DataCommand("get-obj-list", ["return_form", reuids]));
    const ret_data = returns.data;

    const all_forms = [
        ...req_data.map(f => ({ ...f, type: "[REQUEST]" })),
        ...ret_data.map(f => ({ ...f, type: "[RETURN]" }))
    ];

    all_forms.sort((a, b) => b.timestamp - a.timestamp);

      const container = document.getElementById("forms-container");
      container.innerHTML = '';

      for (const form of all_forms) {
        const div = document.createElement("div");
        if (form.type == "[REQUEST]" && form.status != "accepted") continue;

        const guid = form.group_uuid;
        const gname = (await get_cmd(new DataCommand("get-obj", ["group", guid]))).data.name;
        const iuid = form.component_instance;
        const idata = (await get_cmd(new DataCommand("get-obj", ["component_instance", iuid]))).data;
        const cuid = idata.component;
        const cdata = (await get_cmd(new DataCommand("get-obj", ["component", cuid]))).data;

        if (form.type == "[REQUEST]") {
            console.log(form.timestamp);
            div.textContent = `${form.type} | ${new Date(form.timestamp*1000).toLocaleString()} | Group '${gname}' took instance ${idata.details} of ${cdata.name}`;
        } else {
            div.textContent = `${form.type} | ${new Date(form.timestamp*1000).toLocaleString()} | Group '${gname}' returned instance ${idata.details} of ${cdata.name} with condition '${idata.itemCondition}'`
        }
        

        
        container.appendChild(div);
      }

}

window.addEventListener("load", fetchForms);