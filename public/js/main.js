// FRONT-END (CLIENT) JAVASCRIPT HERE

// Triggers upon site load
window.onload = function()
{
  let page = window.location.pathname;
  if (page === "/") {
    // On login page (index)
    const loginButton = document.getElementById("login");
    loginButton.onclick = login;
    const incorrectLabel = document.getElementById("incorrect");
    incorrectLabel.innerHTML = ""
  } else if (page === "/calculator.html") {
    // On calculator page
    getGpaData();
    const submitButton = document.getElementById("submit");
    submitButton.onclick = submit;
    const adjustButton = document.getElementById("adjust");
    adjustButton.onclick = updateEntry;
    const deleteButton = document.getElementById("delete");
    deleteButton.onclick = deleteEntry;
  }
}

// Login to the user's account
const login = async function(event)
{
  event.preventDefault(event);

  const usernameInput = document.querySelector("#username");
  const passwordInput = document.querySelector("#password");

  if (usernameInput.value === "" || passwordInput.value === "")
  {
    return;
  }
  const json = {username: usernameInput.value, password: passwordInput.value};
  const body = JSON.stringify(json);
  
  const response = await fetch("/login",
  {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: body
  });

  const text = await response.text();
  if (text === "true") {
    // Login successful
    window.location.href = "/calculator.html";
  } else {
    // Login unsuccessful
    const incorrectLabel = document.getElementById("incorrect");
    incorrectLabel.innerHTML = "The password you entered was incorrect."
  }
}

// Submit a new entry to the GPA data
const submit = async function(event) 
{
  event.preventDefault();
  
  const classInput = document.querySelector("#class");
  const gradeInput = document.querySelector("#grade");
  const creditsInput = document.querySelector("#credits");

  // Ensure a correct value
  if (classInput.value === "" || gradeInput.value === "" || 
    creditsInput.value === "" || isNaN(Number(creditsInput.value)))
  {
    return;
  }

  const json = {class: classInput.value, grade: gradeInput.value, credits: creditsInput.value};
  const body = JSON.stringify(json);
  let response = await fetch("/submit",
  {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: body
  });

  getGpaData();
}

// Adjust a table entry
const updateEntry = async function(event)
{
  event.preventDefault(event);

  const rowCount = document.getElementsByClassName("row").length;
  if (rowCount <= 0)
  {
    return;
  }

  const classInput = document.querySelector("#class");
  const gradeInput = document.querySelector("#grade");
  const creditsInput = document.querySelector("#credits");

  const editInput = document.querySelector("#edit");
  const newInfo = {class: classInput.value, grade: gradeInput.value, credits: creditsInput.value};
  const json = {class: editInput.value, data: newInfo};

  const body = JSON.stringify(json);
  let response = await fetch("/adjust",
  {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: body
  });

  getGpaData();
}

// Delete a table entry
const deleteEntry = async function(event)
{
  event.preventDefault(event);

  const rowCount = document.getElementsByClassName("row").length;
  if (rowCount <= 0)
  {
    return;
  }

  const editInput = document.querySelector("#edit");
  const body = editInput.value;
  let response = await fetch("/delete",
  {
    method: "POST",
    body: body
  });

  getGpaData();
}

// Obtain the GPA table data from the server 
const getGpaData = async function()
{
  let response = await fetch("/display",
  {
    method: "GET",
  });

  const text = await response.text();
  if (text !== null) buildTable(JSON.parse(text));
}

// Optain the GPA value from the server
const getGpa = async function()
{
  let response = await fetch("/gpa",
  {
    method: "GET",
  });

  const text = await response.text();
  displayGpa(text);
}

// Create the GPA table with current data
const buildTable = function(data)
{
  let table = document.getElementById("table");
  while (table.rows.length > 1)
  {
    table.deleteRow(1);
  }

  for (let i = 0; i < data.length; i++)
  {
    addToTable(data[i]);
  }
}

// Add a new entry to the GPA data table
const addToTable = function(newData)
{
  // Initialize table info
  let table = document.getElementById("table");
  let numRows = table.rows.length;
  let row = table.insertRow(numRows);
  row.className = "row";

  // Create cels
  let classCell = row.insertCell(0);
  classCell.innerHTML = newData.class;
  let gradeCell = row.insertCell(1);
  gradeCell.innerHTML = newData.grade.toUpperCase();
  let creditsCell = row.insertCell(2);
  creditsCell.innerHTML = newData.credits;

  // Upadte the GPA
  getGpa();
}

// Display the GPA value on screen
const displayGpa = function(gpaValue)
{
  let gpaText = document.getElementById("gpa");
  gpaText.innerHTML = `GPA: ${gpaValue}`;
}