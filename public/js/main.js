// FRONT-END (CLIENT) JAVASCRIPT HERE

var taskData = [];
editMode = false;
editData = null;

// Getting data from the server
const loadData = async function() {
  const response = await fetch( "/taskData/", {
    method:"GET"
  }).then(async function(response) {
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
    let duedateString = document.querySelector( "#duedate" );
    // Change date into a Date object
    const [year, month, day] = duedateString.value.split("-");
    let duedate = new Date(year, month-1, day);
    let importance = "";
    const importanceRadios = document.getElementsByName("importanceRadios");
    // Check which radio is checked
    importanceRadios.forEach(radio => {
      if (radio.checked) {
        importance = radio.value;
      }
    });

    let json = {};
    // Determine if this is an edit or an add
    if(editMode) {
      json = {_id: editData._id, username: "", task: task.value, class: classi.value, duedate: duedate, importance: importance, priority: 0};
      const body = JSON.stringify( json );
      const response = await fetch( "/patch", {
        method:"PATCH",
        body
      }).then(async function(response) {
        taskData = JSON.parse(await response.text());
        editData = null;
        location.reload();
      })
    // Add mode
    } else {
      json = {_id: -1, username: "", task: task.value, class: classi.value, duedate: duedate, importance: importance, priority: 0};
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

    displayResults();
    editMode = false;
  }
}

window.onload = function() {
  const submitButton = document.querySelector("#submit-button");
  submitButton.onclick = submit;
}

displayResults();

// Displays up to date results in the table
function displayResults() {
  let tbody = document.querySelector("#data-table tbody");
  // Clear tbody by setting to an empty string
  tbody.innerHTML = "";

  // Iterate over the list of objects
  taskData.forEach(function(data) {
    if(typeof data === 'string') {
      document.querySelector("#username-name").textContent = data;
    } else {
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

      //Change due date into specified format (day month year)
      const duedate = new Date(data.duedate);
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      const formattedDate = duedate.getDate() + " " + monthNames[duedate.getMonth()] + " " + duedate.getFullYear();

      duedateCell.textContent = formattedDate;
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


      // Button group
      const div = document.createElement('div');
      div.classList.add('btn-group');
      div.setAttribute('role', 'group');

      // Edit button
      let editButton = document.createElement("input");
      editButton.type = "button";
      editButton.className = "btn btn-secondary";
      editButton.value = "Edit";
      editButton.onclick = function() {editElement(data);};
      div.appendChild(editButton);

      // Delete button
      let deleteButton = document.createElement("input");
      deleteButton.type = "button";
      deleteButton.className = "btn btn-secondary";
      deleteButton.value = "Delete";
      deleteButton.onclick = function() {deleteElement(data);};
      div.appendChild(deleteButton);

      // Append buttons to group and group to cell
      editCell.appendChild(div);
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
    }
  });
}

// Deletes the specified element
const deleteElement = async function(data) {
  const body = JSON.stringify( data );
  const response = await fetch( "/delete", {
    method:"DELETE",
    body
  }).then(async function(response) {
    taskData = JSON.parse(await response.text());
    location.reload();
  })
  displayResults();
}

// Allows edits to the specified element
function editElement(data) {
  document.getElementById("task").value = data.task;
  document.getElementById("class").value = data.class;

  const duedate = new Date(data.duedate);
  // Get day, month, and year components
  let day = duedate.getDate();
  let month = duedate.getMonth() + 1;
  const year = duedate.getFullYear();

  // Check if day needs a leading 0
  if(day < 10) {
    day = "0" + day;
  }
  // Check if month needs a leading 0
  if(month < 10) {
    month = "0" + month;
  }

  const formattedDate = year + "-" + month + "-" + day;
  document.getElementById("duedate").value = formattedDate;

  const importanceRadios = document.getElementsByName('importanceRadios');
  importanceRadios.forEach(radio => {
    if(radio.value === data.importance) {
      radio.checked = true;
    } else {
      radio.checked = false;
    }
  });

  editData = data;
  editMode = true;
}

// Validates the format of the submission before submitting
function validateForm() {
  //TODO add in to make sure something gets placed for each field
  return true;
}