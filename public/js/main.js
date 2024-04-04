//THIS SHOULD WORK
const submit = async function (event) {
  event.preventDefault()

  const frontString = document.querySelector("#frontstring").value, //getting string values from text input fields
    backString = document.querySelector("#backstring").value,
    concatenatedString = frontString + ' ' + backString, //putting the inputs together into one string variable
    stringLength = concatenatedString.length;
  let body = JSON.stringify({content: concatenatedString}) //creating body, which will contain the desired method and required data, in this case submit and the string
  const response = await fetch("/submit", { //POST the body
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/json"
    }
  })
  updateTable(); //update the table after submission
}

async function deleteEntry(id){
  const method = "/delete";
  let body = JSON.stringify({content:id});
  const response = await fetch("/delete", {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/json"
    }
  })
  updateTable();
}

async function editEntry(id, entry){
  const method = "/edit";
  let body = JSON.stringify({id:id, content:entry });
  const response = await fetch("/edit", {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/json"
    }
  })
  updateTable();
}
//updateTable function
async function updateTable() {
  //get the current state of the array from the server
  const response = await fetch("/docs")
  let currentDatabase = await response.json();
  const tableElement = document.getElementById('responseTable'); //located the table element in the HTML
  tableElement.innerHTML = ''; // Clear existing table contents

  tableElement.innerHTML = ''; // Clear existing table contents

  // Create table headers
  const headerRow = document.createElement('tr');
  const headers = ['String ID', 'CombinedString', 'String Length', 'Edit', 'Delete']; // Adjust these according to your data fields
  headers.forEach(headerText => {
    const headerCell = document.createElement('th');
    headerCell.textContent = headerText;
    headerRow.appendChild(headerCell);
  });
  tableElement.appendChild(headerRow);

  // Populate table rows with data from MongoDB collection
  currentDatabase.forEach((entry, index) => {
    const row = tableElement.insertRow(-1);
    // Iterate over each field in the entry
    Object.keys(entry).forEach((key, idx) => {
      const cell = row.insertCell();
      cell.textContent = entry[key];
    });

    // Add a cell for the edit button
    const editCell = row.insertCell();
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', function () {
      const newInput = prompt('Enter new value: ');
      editEntry(entry._id, newInput);
    });
    editCell.appendChild(editButton);

    // Add a cell for the delete button
    const deleteCell = row.insertCell();
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function () {
      deleteEntry(entry._id)
    });
    deleteCell.appendChild(deleteButton);
  });
  
}



window.onload = function () {
  updateTable();
  const button = document.querySelector("button");
  button.onclick = submit;
}