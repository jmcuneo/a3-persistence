// FRONT-END (CLIENT) JAVASCRIPT HERE

let appdata = [];

const submit = async function (event) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()

  // making sure no inputs were left blank
  let inputs = document.querySelectorAll("input");
  let foundEmpty = false;
  for(let i = 0; i < inputs.length; i++) {
    if(inputs[i].value.length < 1) {
      foundEmpty = true;
    }
  }

  if(foundEmpty) {
      alert("You must give the task a name and complete due date");
  }
  else{
      let click = new Audio("add.mp3");
      click.play();

      const nameInput = document.querySelector("#task-name"),
      dateInput = document.querySelector("#task-date"),
      colorInput = document.querySelector("#task-color"),
      json = {
        name: nameInput.value,
        date: dateInput.value,
        color: colorInput.value
      },
      body = JSON.stringify(json)
  
    const response = await fetch("/submit", {
      method: "POST",
      body
    })
  
    syncClientData();
  }
}

// syncs client data with the JSON data from the server
const syncClientData = async function () {
  const response = await fetch("/appdata", {
    method: "GET"
  })

  appdata = JSON.parse(await response.text());

  // update table
  constructTable();
}

// sends request to delete an item to the server
const deleteItem = async function (event) {
  let ding = new Audio("delete.wav");
  ding.play();

  const response = await fetch("/delete", {
    method: "DELETE",
    body: event.target.getAttribute("index")
  })

  // resync and update table
  syncClientData();
}

// create table from data retrieved from server
const constructTable = function () {
  let listLength = appdata.length;
  let tbody = document.getElementById("table-items");
  tbody.innerHTML = ""; // wiping table body before refreshing it
  
  // add the data for each item in appdata to the table
  for(let i = 0; i < listLength; i++) {
    let listItem = appdata[i];
    let tr = document.createElement("tr");
    tr.setAttribute("style", "color: black; background-color: ".concat(listItem.color));

    // add task name
    let td = document.createElement("td");
    td.innerHTML = listItem.name;
    tr.appendChild(td);

    // add task due date
    td = document.createElement("td");
    td.innerHTML = listItem.date;
    tr.appendChild(td);

    // add priority
    td = document.createElement("td");
    td.innerHTML = listItem.priority;
    tr.appendChild(td);

    // add delete button
    td = document.createElement("td");
    button = document.createElement("button");
    button.innerHTML = "Remove";
    button.setAttribute("index", i);
    button.onclick = deleteItem;
    td.appendChild(button);
    tr.appendChild(td);

    tbody.appendChild(tr);
  }
}

window.onload = function () {
  // set up submit button functionality
  const button = document.querySelector("#submit-button");
  button.onclick = submit;

  // get data from server and populate table
  syncClientData();
}