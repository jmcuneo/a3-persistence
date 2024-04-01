// FRONT-END (CLIENT) JAVASCRIPT HERE

// Submit the form data to the server
const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()

  const dateString = document.getElementById("date"),
    creationDate = new Date(dateString.value),
    creationDateFormatted = creationDate.toISOString().slice(0, 10);
  
  const name = document.getElementById("name"),
    description = document.getElementById("description"),
    priority = document.getElementById("priority"),
    json = {name: name.value, description: description.value, creationDate: creationDateFormatted, priority: priority.value, recommendedDeadline: ""},
    body = JSON.stringify(json)

  const response = await fetch( "/submit", {
    method:"POST",
    headers: {
      "Content-Type": "application/json"
    },
    body 
  })

  if(response.ok) {
    console.log("Data submitted successfully");
  } else {
    console.log("Error: ", response.status, response.statusText);
    alert("Error: Name already exists");
  }


  //const text = await response.text()
  //console.log("text:", text);
  getResults(event);
}

// Delete form data with the value of the key (name)
async function deleteData(event) {
  event.preventDefault();
  const name = document.getElementById("name"),
        json = {"name": name.value},
        body = JSON.stringify(json);

  const response = await fetch("/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body
  });

  if(response.ok) {
    console.log("Data deleted successfully");
  } else {
    console.log("Error: ", response.status, response.statusText);
    alert("Error: Name not found");
  }
  getResults(event);
}

async function editData(event) {
  event.preventDefault();
  const date = new Date(document.getElementById("date").value);
  const name = document.getElementById("name"),
        description = document.getElementById("description"),
        creationDate = date.toISOString().slice(0,10),
        priority = document.getElementById("priority"),
        json = {name: name.value, description: description.value, creationDate: creationDate, priority: priority.value, recommendedDeadline: ""},
        body = JSON.stringify(json);

  const response = await fetch("/edit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body
  });

  if(response.ok) {
    console.log("Data edited successfully");
  } else {
    console.log("Error: ", response.status, response.statusText);
    alert("Error: Name not found");
  }
  getResults(event);
}

// Get the results of stored data from the server
async function getResults(event) {
  let data = {};
  try {
    event.preventDefault();
  }
  catch (error) {
    //console.log("No event");
  }

  try {
    const response = await fetch("/data", {
      method: "GET"
    });
    const text = await response.text();
    data = JSON.parse(text);
    console.log(data);
  }
  catch (error) {
    console.log("Error: ", error);
    return;
  }
  
  // Display data on table
  let table = document.getElementById("table");
  table.innerHTML = "";
  let header = table.createTHead();
  let row = header.insertRow(0);
  let cell = row.insertCell(0);
  cell.textContent = "Name";
  cell = row.insertCell(1);
  cell.textContent = "Description";
  cell = row.insertCell(2);
  cell.textContent = "Creation Date";
  cell = row.insertCell(3);
  cell.textContent = "Priority";
  cell = row.insertCell(4);
  cell.textContent = "Recommended Deadline";
  for (let i = 0; i < data.length; i++) {
    row = table.insertRow(i+1);
    cell = row.insertCell(0);
    cell.textContent = data[i].name;
    cell = row.insertCell(1);
    cell.textContent = data[i].description;
    cell = row.insertCell(2);
    cell.textContent = data[i].creationDate;
    cell = row.insertCell(3);
    cell.textContent = data[i].priority;
    cell = row.insertCell(4);
    cell.textContent = data[i].recommendedDeadline;
  }
  

}

var currentUser = {};

async function getUserProfile(event) {
  try {
  const response = await fetch("/user", {
    method: "GET"
  });
  const text = await response.text();
  console.log(text);
  currentUser = JSON.parse(text);
  }
  catch (error) {
    console.log("Error: ", error);
  }

}



// Load functions when the window loads
window.onload = function() {
  
  
  try {
    const submitButton = document.getElementById("starter");
    const editButton = document.getElementById("edit");

      // Make sure form is valid when submitted
    submitButton.addEventListener('click', function(event) {
    let form = document.querySelector('form');
    if (!form.checkValidity()) {
      event.preventDefault();
      alert('Please fill out all required fields correctly.');
    } else {
      submit(event);
    }
    });
    editButton.addEventListener('click', function(event) {
      let form = document.querySelector('form');
      if (!form.checkValidity()) {
        event.preventDefault();
        alert('Please fill out all required fields correctly.');
      } else {
        editData(event);
      }
    });

    // Add event listeners to buttons
    const deleteButton = document.getElementById("delete");
    deleteButton.onclick = deleteData;
    const resultButton = document.getElementById("getResults");
    resultButton.onclick = getResults;
    

    getResults();
    getUserProfile();
  }
  catch (error) {}
}