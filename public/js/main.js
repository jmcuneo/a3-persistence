// FRONT-END (CLIENT) JAVASCRIPT HERE

const headers = ["Class", "Task", "Due", "Date Added"]

const populateHeaders = function()
{
  tableHead = document.getElementById("dataHead")
  tableHead.innerHTML = ""
  headers.forEach(element => {
    let cell = document.createElement("th")
    cell.textContent = element
    tableHead.appendChild(cell)
  })
}

const populateTable = async function(response)
{
  response = await response.json()
  console.log(response)
  table = document.getElementById("dataBody")
  table.innerHTML = ""
  populateHeaders()
  response.forEach(rowData => {
    let row = document.createElement("tr")

    rowData.forEach(cellData => {
      let cell = document.createElement("td")
      cell.textContent = cellData
      row.appendChild(cell)
    })
    table.appendChild(row)
  })
}

const clear = async function (event) {
  console.log("CLEARING")
  if(event)
  {
    event.preventDefault()
  }

  await fetch("/clear", {
    method: "POST"
  }).then(response => {
    populateTable(response)
  })
}

const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  const course = document.querySelector( "#class" ),
        task = document.querySelector("#task"),
        time = document.querySelector("#time"),
        includeTime = document.getElementById("includeTime")
        json = {data: [course.value, task.value, time.value, includeTime.checked]
               },
        body = JSON.stringify(json)

  await fetch( "/submit", {
    method:"POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body 
  })
  .then(response => {
    populateTable(response)
  })
}

window.onload = function () {
  const submitButton = document.getElementById("submitButton");
  submitButton.onclick = submit;
  const clearButton = document.getElementById("clearButton");
  clearButton.onclick = clear;
  
  fetch("/update", {
    method: "POST"
  }).then(response => populateTable(response))
}