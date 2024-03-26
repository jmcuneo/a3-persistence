// FRONT-END (CLIENT) JAVASCRIPT HERE

var taskData = [];
editMode = -1;

// Getting data from the server
const loadData = async function() {
  const response = await fetch( "/taskData/", {
    method:"GET"
  }).then(async function(response) {
    console.log("HELLO");
    taskData = JSON.parse(await response.text());
  })
  displayResults();
}

loadData();

// When submit button is hit to add or edit data
const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  if(validateForm()) {
    let task = document.querySelector( "#task" );
    let classi = document.querySelector( "#class" );
    let duedate = document.querySelector( "#duedate" );
    let importance = document.querySelector( "#importance" );

    let json = {};
    // Determine if this is an edit or an add
    if(editMode > 0) {
      json = {id: editMode, task: task.value, class: classi.value, duedate: duedate.value, importance: importance.value, priority: 0};
      const body = JSON.stringify( json );
      const response = await fetch( "/submit", {
        method:"PATCH",
        body
      }).then(async function(response) {
        taskData = JSON.parse(await response.text());
      })
      
    } else {
      json = {id: editMode, task: task.value, class: classi.value, duedate: duedate.value, importance: importance.value, priority: 0};
      const body = JSON.stringify( json );
      const response = await fetch( "/submit", {
        method:"POST",
        body
      }).then(async function(response) {
        taskData = JSON.parse(await response.text());
      })
    }

    // Clear inputs
    document.getElementById("task").value = "";
    document.getElementById("class").value = "";
    document.getElementById("duedate").value = "";
    document.getElementById("importance").value = "";

    displayResults();
    editMode = -1;
  }
}

window.onload = function() {
  const button = document.querySelector("#submit-button");
  button.onclick = submit;
}

displayResults();

// Displays up to date results in the table
function displayResults() {
  let tbody = document.querySelector("#data-table tbody");
  // Clear tbody by setting to an empty string
  tbody.innerHTML = "";

  // Iterate over the list of objects
  taskData.forEach(function(data) {
    // Create a new table row
    let row = document.createElement("tr");

    // Create table cells and fill them with object properties
    let taskCell = document.createElement("td");
    taskCell.textContent = data.task;
    row.appendChild(taskCell);

    let classCell = document.createElement("td");
    classCell.className = "table-center";
    classCell.textContent = data.class;
    row.appendChild(classCell);

    let duedateCell = document.createElement("td");
    duedateCell.className = "table-center";
    duedateCell.textContent = data.duedate;
    row.appendChild(duedateCell);

    let importanceCell = document.createElement("td");
    importanceCell.className = "table-center";
    importanceCell.textContent = data.importance;
    row.appendChild(importanceCell);

    let priorityCell = document.createElement("td");
    priorityCell.className = "table-center";
    priorityCell.textContent = data.priority;
    row.appendChild(priorityCell);

    let editCell = document.createElement("td");
    editCell.className = "table-center";
    let editButton = document.createElement("input");
    editButton.type = "button";
    editButton.className = "button";
    editButton.value = "Edit";
    editButton.onclick = function() {editElement(data);};
    editCell.appendChild(editButton);

    let deleteButton = document.createElement("input");
    deleteButton.type = "button";
    deleteButton.className = "button";
    deleteButton.value = "Delete";
    deleteButton.onclick = function() {deleteElement(data);};
    editCell.appendChild(deleteButton);

    row.appendChild(editCell);

    // Append the row to the table body dependent on priority level (higher priority goes higher)
    
    // If nothing is in the table
    if(tbody.children[0] == null) {
      tbody.appendChild(row);
    } else {
      let i = 0;
      let check = true;
      while(check && i < tbody.children.length) {
        if(Number(tbody.children[i].children[4].textContent) >= Number(row.children[4].textContent)) {
          tbody.insertBefore(row, tbody.children[i]);
          check = false;
        }      
        i++;
      }

      // If the new child is the last element
      if(check === true) {
        tbody.appendChild(row);
      }
    }
  });
}

// Deletes the specified element
const deleteElement = async function(data) {
  data.mode = 2;
  const body = JSON.stringify( data );
  const response = await fetch( "/delete", {
    method:"DELETE",
    body
  }).then(async function(response) {
    taskData = JSON.parse(await response.text());
  })
  displayResults();
}

// Allows edits to the specified element
function editElement(data) {
  document.getElementById("task").value = data.task;
  document.getElementById("class").value = data.class;
  document.getElementById("duedate").value = data.duedate;
  document.getElementById("importance").value = data.importance;

  editMode = data.id;
  data.mode = 1;
}

// Validates the format of the submission before submitting
function validateForm() {
  let dateInput = document.getElementById("duedate");
  let datePattern = /^\d{2}\/\d{2}\/\d{4}$/;
  let importanceInput = document.getElementById("importance");
  // Checks date format
  if (!datePattern.test(dateInput.value)) {
    alert("Please enter the date in MM/DD/YYYY format.");
    return false;
  }

  // Checks importance input
  if(!(importanceInput.value === "No" || importanceInput.value === "Yes")) {
    alert("Please enter 'Yes' or 'No'");
    return false;
  }
  return true;
}