// FRONT-END (CLIENT) JAVASCRIPT HERE

// Triggers upon site load
window.onload = function()
{
  getData();
  const submitButton = document.getElementById("submit");
  submitButton.onclick = submit;
  const adjustButton = document.getElementById("adjust");
  adjustButton.onclick = updateEntry;
  const deleteButton = document.getElementById("delete");
  deleteButton.onclick = deleteEntry;
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
  const response = await fetch("/submit",
  {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: body
  });

  getData();
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
  const response = await fetch("/adjust",
  {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: body
  });

  getData();
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
  const response = await fetch("/delete",
  {
    method: "POST",
    body: body
  });

  getData();
}

// Obtain the GPA table data from the server 
const getData = async function()
{
  let response = await fetch("/display",
  {
    method: "GET",
  });

  const text = await response.text();
  buildTable(JSON.parse(text));
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