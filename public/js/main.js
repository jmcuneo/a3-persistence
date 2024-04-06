//CLIENT

//use these to scrub username from url to use in data display
const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get("username");
const submit = async function (event) {
  event.preventDefault();

  const frontString = document.querySelector("#frontstring").value, //getting string values from text input fields
    backString = document.querySelector("#backstring").value,
    concatenatedString = frontString + " " + backString, //putting the inputs together into one string variable
    stringLength = concatenatedString.length,
    user = username;
  let body = JSON.stringify({ content: concatenatedString, username: user }); //creating body, which will contain the desired method and required data, in this case submit and the string
  const response = await fetch("/submit", {
    //POST the body
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/json",
    },
  });
  updateTable(); //update the table after submission
};

//logout function, awaits the response to then redirect user to login page
const logOut = async function (event) {
  event.preventDefault();
  const response = await fetch("/logout", {
    //POST the body
    method: "POST",
  });
  if (response.ok) {
    window.location.href = "/public/login.html";
  }
};

//delete function, grabs the id value for the document
//passes them to server to handle deletion
//then updates the table
async function deleteEntry(id) {
  const method = "/delete";
  let body = JSON.stringify({ content: id });
  const response = await fetch("/delete", {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/json",
    },
  });
  updateTable();
}

//edit fucntion, grabs the id value for the document, and the entry from popup
//passes them to server to handle edit
//then updates the table
async function editEntry(id, entry) {
  const method = "/edit";
  let body = JSON.stringify({ id: id, content: entry });
  const response = await fetch("/edit", {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/json",
    },
  });
  updateTable();
}

//update table function, called everytime the user performs an action
async function updateTable() {
  
  //gets the array, database, and table
  const response = await fetch("/docs");
  let currentDatabase = await response.json();
  const tableElement = document.getElementById("responseTable"); 
  tableElement.innerHTML = "";

  //creates the headers for the table elements
  const headerRow = document.createElement("tr");
  const headers = ["CombinedString", "String Length", "Edit", "Delete"]; 
  headers.forEach((headerText) => {
    const headerCell = document.createElement("th");
    headerCell.textContent = headerText;
    headerRow.appendChild(headerCell);
  });
  tableElement.appendChild(headerRow);

  //grab entries from the database
  currentDatabase.forEach((entry, index) => {
    //ignores entires that don't match username (pulled from url)
    if (entry.UserName === username) {
      const row = tableElement.insertRow(-1);
      const combinedStringCell = row.insertCell();
      combinedStringCell.textContent = entry.CombinedString;
      const stringLengthCell = row.insertCell();
      stringLengthCell.textContent = entry.StringLength;

      //edit button
      const editCell = row.insertCell();
      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.addEventListener("click", function () {
        const newInput = prompt("Enter new value: ");
        editEntry(entry._id, newInput);
      });
      editCell.appendChild(editButton);

      //delete button
      const deleteCell = row.insertCell();
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", function () {
        deleteEntry(entry._id);
      });
      deleteCell.appendChild(deleteButton);
    }
  });
}

//onloading display, basically just handles the submit and logout buttons so that they call proper functions
window.onload = function () {
  updateTable();
  const button = document.getElementById("submitButton");
  const logButton = document.getElementById("logoutButton");
  if (button) {
    button.onclick = submit;
  }
  if (logButton) {
    logButton.onclick = logOut;
  }
};
