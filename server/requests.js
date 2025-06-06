function timeDiffMS(newt, oldt) {
  return newt - oldt;
}

function timeDiffS(newt, oldt) {
  return timeDiffMS(newt, oldt) / 1000;
}

function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
  var nameEQ = name + "=";
  var cookies = document.cookie.split(";");
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    while (cookie.charAt(0) == " ") {
      cookie = cookie.substring(1, cookie.length);
    }
    if (cookie.indexOf(nameEQ) == 0) {
      return cookie.substring(nameEQ.length, cookie.length);
    }
  }
  return undefined;
}

const SERVER_URL = "https://smcs2027pfp.pythonanywhere.com/";
//const SERVER_URL = "http://127.0.0.1:5000";

//var CLIENT_UUID = prompt("Enter a UUID (DEBUG):")
/*
SESSION_TOKEN = getCookie("SESSION_TOKEN");
if (SESSION_TOKEN == undefined) {
  SESSION_TOKEN = generateUUID();
  setCookie("SESSION_TOKEN", CLIENT_UUID, 365);
}*/

/* Credits: https://stackoverflow.com/questions/105034/how-do-i-create-a-guid-uuid */
function generateUUID() {
  // Public Domain/MIT
  var d = new Date().getTime(); //Timestamp
  var d2 =
    (typeof performance !== "undefined" &&
      performance.now &&
      performance.now() * 1000) ||
    0; //Time in microseconds since page-load or 0 if unsupported
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = Math.random() * 16; //random number between 0 and 16
    if (d > 0) {
      //Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      //Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

class DataCommand {
  constructor(cmdName, args) {
    this.cmdName = cmdName;
    this.args = args;
  }

  to_json() {
    return JSON.stringify({
      cmdName: this.cmdName,
      args: this.args,
    });
  }
}
function deepJsonify(obj) {
  if (typeof obj === "string") {
    try {
      const parsed = JSON.parse(obj);
      return deepJsonify(parsed);
    } catch (e) {
      return obj; // Not JSON, return as-is
    }
  } else if (Array.isArray(obj)) {
    return obj.map(deepJsonify);
  } else if (obj && typeof obj === "object") {
    const newObj = {};
    for (const [key, value] of Object.entries(obj)) {
      newObj[key] = deepJsonify(value);
    }
    return newObj;
  }
  return obj;
}

async function post_cmd(cmd) {
  try {
    const response = await fetch(SERVER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        username: "SMCS_PFP",
        password: "ThreeComponentsAhead",
      },
      body: cmd.to_json(),
    });
    const json = await response.json();
    return deepJsonify(json);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function get_cmd(cmd) {
  try {
    const response = await fetch(
      SERVER_URL +
        `?${new URLSearchParams({ cmdName: cmd.cmdName, args: cmd.args })}`,
    );
    const json = await response.json();
    return deepJsonify(json);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function calculate_ping() {
  send_time = new Date();
  return get_cmd(new DataCommand("ping", [])).then((json) =>
    Math.round(new Date().getTime() - send_time.getTime()),
  );
}
