let refreshLoopId = undefined;

const submit = async function( event, x, y ) {
  event.preventDefault()
  const submission = {
    color: document.querySelector("#color-selector").value,
    x: x,
    y: y
  };

  const body = JSON.stringify(submission);

  const response = await fetch("/submit", {
    method:"POST",
    body 
  }).then(response => response.json());

  switch(response.result) {
    case "accept":
      logStatus("Successfully colored tile! Must wait one minute before coloring another.");
      updateGrid();
      return;
    case "deny":
      logStatus(`It has not been a minute yet! Time remaining: ${Math.ceil(response.extra / 1000)} seconds`, "#FFFF33");
      return;
    case "invalid":
      logStatus("Invalid data recieved!", "#FF3333");
      return;
    default:
      logStatus("Unknown server response!");
      return;
  }
}

async function updateGrid() {
  if(refreshLoopId) {
    clearTimeout(refreshLoopId);
  }

  const response = await fetch("/read-grid", { method: "GET" })
    .then(response => response.json());
  const colors = response.colors;
  const mostRecent = response.recent;

  const grid = document.getElementById("draw-plane");

  for(let i = 0; i < 100; i++) {
    grid.children[i].style.backgroundColor = colors.find(c => c.x == Math.floor(i / 10) && c.y == i % 10).color;
  }

  const recentList = document.querySelector("#change-list");
  let recentChildren = [];

  for(let i = 0; i < mostRecent.length; i++) {
    const user = mostRecent[i];

    const name = document.createElement("h3");
    name.textContent = user.name;

    const color = document.createElement("span");
    color.classList.add("change-color", "center");
    color.style.backgroundColor = user.color;

    const colorText = document.createElement("p");
    colorText.textContent = `${user.x}, ${user.y}`;
    color.appendChild(colorText);

    const label = document.createElement("p");
    label.textContent = "Changed:";

    const time = document.createElement("p");
    time.textContent = convertToReadableTime(new Date(user.updatedAt));

    const wrapper = document.createElement("div");
    wrapper.classList.add("change");
    wrapper.appendChild(name);
    wrapper.appendChild(color);
    wrapper.appendChild(label);
    wrapper.appendChild(time);

    recentChildren.push(wrapper);
  }

  recentList.replaceChildren(...recentChildren.reverse());
  //refreshLoopId = setTimeout(updateGrid, 10000);
}

let editingTimer = undefined;
function logStatus(msg, color = "#FFFFFF") {
  if(editingTimer) {
    clearTimeout(editingTimer);
  }

  const msgText = document.querySelector("#status-msg");
  msgText.textContent = msg;
  msgText.style.color = color;
  msgText.classList.add("editing");

  editingTimer = setTimeout(() => { msgText.classList.remove("editing"); editingTimer = undefined; }, 1000);
}

function convertToReadableTime(time) {
  let timeSince = new Date() - time;
  
  if(timeSince < 1000) {
    return "now";
  }

  let outputTerms = [];
  let temp = Math.floor(timeSince / (1000 * 60 * 60 * 24 * 7 * 52)); //years
  outputTerms.push(timeHelper(temp, "year"));
  timeSince -= temp * (1000 * 60 * 60 * 24 * 7 * 52);
  temp = Math.floor(timeSince / (1000 * 60 * 60 * 24 * 7)); //weeks
  outputTerms.push(timeHelper(temp, "week"));
  timeSince -= temp * (1000 * 60 * 60 * 24 * 7);
  temp = Math.floor(timeSince / (1000 * 60 * 60 * 24)); //days
  outputTerms.push(timeHelper(temp, "day"));
  timeSince -= temp * (1000 * 60 * 60 * 24);
  temp = Math.floor(timeSince / (1000 * 60 * 60)); //hours
  outputTerms.push(timeHelper(temp, "hour"));
  timeSince -= temp * (1000 * 60 * 60);
  temp = Math.floor(timeSince / (1000 * 60)); //minutes
  outputTerms.push(timeHelper(temp, "minute"));
  timeSince -= temp * (1000 * 60);
  temp = Math.floor(timeSince / (1000)); //seconds
  outputTerms.push(timeHelper(temp, "second"));

  return outputTerms.filter(t => t !== "").join(", ") + " ago";
}

function timeHelper(value, str) {
  if(value === 0) {
    return "";
  }
  else if (value === 1) {
    return `${value} ${str}`;
  }
  else {
    return `${value} ${str}s`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector("#draw-plane");

  for(let i = 0; i < 100; i++) {
    const x = Math.floor(i / 10);
    const y = i % 10;

    const gridButton = document.createElement("div");
    gridButton.classList.add("grid");
    gridButton.onclick = (e) => submit(e, x, y);
    grid.appendChild(gridButton);
  }

  updateGrid();

  document.querySelector("#log-out").onclick = () => {
    document.cookie = "username" + "=; max-age=0";
    document.cookie = "password" + "=; max-age=0";
    window.open("/index.html", "_self");
  }
});