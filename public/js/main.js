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

const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  const course = document.querySelector( "#class" ),
        task = document.querySelector("#task"),
        time = document.querySelector("#time"),
        json = {data: [course.value, task.value, time.value]
               },
        body = JSON.stringify(json)

  await fetch( "/submit", {
    method:"POST",
    body 
  })
  .then(response => response.json())
  .then(response => {
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
  })
}

window.onload = function() {
   const button = document.querySelector("button");
  button.onclick = submit;
  populateHeaders()
}