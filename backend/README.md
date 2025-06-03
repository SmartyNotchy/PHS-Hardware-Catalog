# `requests.js` Usage

Make sure that the script file is properly included in the HTML.

To send a POST request (any action that results in updating the database, including logins):

```JS
post_cmd(new DataCommand("command-name", [arg1, arg2, ...]))
.then((response) => {
    // response object indicates the status of the command posted
});
```

To send a GET request (fetch any resources that do not result in a database update):
```JS
get_cmd(new DataCommand('command-name', [arg1, arg2, ...]))
.then((data) => {
    // data object indicates the data fetched
});
```

Note that these commands are run **concurrently**, meaning that something like this
```JS
post_cmd(new DataCommand("action-1", [arg1, arg2, ...]))
.then((response) => {
    ...
});

get_cmd(new DataCommand("action-2", [arg1, arg2, ...]))
.then((data) => {
    ...
});
```
does not guarantee that `action-1` will be run after `action-2`; they may run at the same time, `action-2` might finish before `action-1`, etc.

If you need to force the order of these commands, chain `.then()`s:
```JS
post_cmd(new DataCommand("action-1", [arg1, arg2, ...]))
.then((response) => {
    get_cmd(new DataCommand("action-2", [arg1, arg2, ...]))
    .then((data) => {
        ...
    });
});
```
or use an `async` function:
```JS
async function myFunc() {
    const response = await post_cmd(new DataCommand("action-1", [arg1, arg2, ...]))
    // manipulate response obj

    // once we get here, action-1 is guaranteed to have received a response
    
    const data = await get_cmd(new DataCommand("action-2", [arg1, arg2, ...]))
    // manipulate data obj
}
```

Also note that so far `response` and `data` have been placeholder names; these can be anything you want as long as its readable and makes sense (of course, still following general JS variable conventions).

# Object List

Most elements in the database will be returned to the JS/web interface as objects. See [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object).

Most objects (teachers, projects, components, requests) have a `uuid` attached to them. This is a string that serves as a unique identifier to distinguish between two objects that might otherwise look the same (i.e. two students with the same name). Additionally, the `uuid` of an object will never change, even if (for example) the display name is changed. `uuid`s are guaranteed to be unique to the attached object. This is implied on every object, even if it is not written below.

When being returned by the webserver, objects will have a `type` string indicating what they are.

### Projects

```JS
{
    type: "project",
    
    name: "Project Name",
    groups: ["uuid1", "uuid2", ...],
    active: boolean // Teachers can't "delete" projects since I'm too lazy to add a "recycle bin"
    // but they can disable them which is BASICALLY the same thing
    // this attribute basically just tells the application whether the project "exists" or not
    // if this is false, pretend its deleted
}
```

### Groups

```JS
{
    type: "group",

    name: "Group X1",
    students: ["Pilliam Wark", "Dhruv Srivastava", "Daniel Shi", "Khang Truong"],
    requests: ["uuid1", "uuid2", ...],
    reports: ["uuid1", "uuid2", ...],
    inventory: [ inventoryItem1, inventoryItem2, ... ]
}
```

### Component

```JS
{
    // used for the catalog and for request forms, represents a general item (RasPi)

    type: "component",

    name: "Raspberry Pi Zero",
    image: "path/to/image/here", // images with databases are weird. This will be worked on!
    details: "Put a short description of the item here.",
    // the above is in HTML format. If you're setting the contents of a <p>, make sure to use
    // element.innerHTML instead of element.innerText.
    instances: [ "uuid1", "uuid2", ... ]
}
```

### Component Instance

```JS
{
    // used in group inventory and for return forms, represents an individual item (RasPi #16)
    type: "component-instance",

    component: "uuid of component",
    details: "Raspberry Pi - Labelled #16",
    available: true, // is a group using this?
    pendingReq: false, // is a group requesting this instance?
    condition: "good", // "good", "repair", "broken"
    group: "uuid of owned group" // disregard if available is false
}
```

### Request Form

```JS
{
    type: "request-form",

    date: "unique timestamp", // TODO! Don't worry about this field. I have some timestamp code from somewhere because timestamps are weird.

    component: "uuid of component",
    group: "uuid of requesting group",
    reason: "I want this component because it looks pretty neat.",

    status: "rejected", // "pending", "accepted", or "rejected"
    teacherMessage: "No. Are you stupid?",
}
```

### Return Form

```JS
{
    type: "return-form",

    date: "unique timestamp", // TODO

    componentInstance: "uuid of component instance",
    group: "uuid of returning group",
    details: "Oops, we accidentally broke this.",
    condition: "broken", // "good", "repair", "broken"

    status: "pending", // "pending", "received"
}
```

# Login Process

For students, something like this should work:

- `get-projects` on login
- Student selects their project
- `get-obj ["project", uuid]`.`groups`
- `get-obj-list ["group", group uuids]`
- Dropdown of each group`.name`
- Student chooses a group to login
- Save group UUID as a cookie
- Save a "logged in as student" cookie
- Good to go!

Teacher logins will be done later.

# GET Command List

| Command | Arguments | Description | Response |
| - | - | - | - |
| `get-obj` | `type`, `uuid` | Returns the object associated with the given UUID and type. | `{ success: bool, data: obj }` |
| `get-obj-list` | `type`, [`uuid`, `uuid`, ...] | Same as above, but works on a list of UUIDs of the same type. | `{ success: bool, data: [obj, obj, ...] }` |
| `get-projects` | *None* | Returns a list of projects. | `[ uuid1, uuid2, ... ]` |
| `get-catalog` | *None* | Returns a list of components. Note that this is global across projects and groups. | `[ uuid1, uuid2, ... ]` |

# POST Command List

| Command | Arguments | Description | Response |
| - | - | - | - |
| `send-request-form` | `component uuid`, `group uuid`, `group reason` | Sends a request form to the teacher on behalf of the group. | `{ success: bool, message: str }` |
| `send-return-form` | `component instance uuid`, `group uuid`, `group message`, `status` | Sends a return form to the teacher on behalf of the group. | `{ success: bool, message: str }` |

More will be added later (i.e. for teacher approval).