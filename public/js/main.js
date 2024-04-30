// FRONT-END (CLIENT) JAVASCRIPT HERE

const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  const assignment = document.querySelector( "#assignment" ),
        pointsEarned = document.querySelector( "#pointsEarned" ),
        pointsAvailable = document.querySelector( "#pointsAvailable" ),
        json = { assignment: assignment.value, pointsEarned: pointsEarned.value, pointsAvailable: pointsAvailable.value },
        body = JSON.stringify(json)

  const response = await fetch( "/submit", {
    method:"POST",
    body 
  })

  const text = await response.text()
  console.log( text )
  getData()
  calculateTotalGrade()
  clearForm()
}

async function clearForm() {
  const assignment2 = document.querySelector( "#assignment" ),
        pointsEarned2 = document.querySelector( "#pointsEarned" ),
        pointsAvailable2 = document.querySelector( "#pointsAvailable" )

  assignment2.value = ''
  pointsEarned2.value = ''
  pointsAvailable2.value = ''
}

async function getData() {
  const response = await fetch( "/appdata", {
    method: "GET"
  })
  const text = await response.text()
  console.log("Data retrieved")

  createTable(text)
}

async function createTable(d) {
  var table = document.querySelector("#datatable")
  table.innerHTML = ''
  const data = JSON.parse(d)

  var titles = table.insertRow()
  const assignment3 = titles.insertCell()
  assignment3.innerHTML = "Assignments"
  const pointsEarned3 = titles.insertCell()
  pointsEarned3.innerHTML = "Points Earned"
  const pointsAvailable3 = titles.insertCell()
  pointsAvailable3.innerHTML = "Points Available"
  const grade = titles.insertCell()
  grade.innerHTML = "Grade"

  for(const entry of data) {
    var row = table.insertRow()
    var assignmentCell = row.insertCell()
    assignmentCell.id = "assignmentCell"
    var pointsEarnedCell = row.insertCell()
    pointsEarnedCell.id = "pointsEarnedCell"
    var pointsAvailableCell = row.insertCell()
    pointsAvailableCell.id = "pointsAvailableCell"
    var gradeCell = row.insertCell()
    gradeCell.id = "gradeCell"

    var deleteButton = document.createElement('button')
    deleteButton.type = "button"
    deleteButton.innerHTML = "Delete"
    
    deleteButton.onclick = function(){deleteEntry(entry);};

    row.appendChild(deleteButton)

    assignmentCell.innerHTML = entry.assignment
    pointsEarnedCell.innerHTML = entry.pointsEarned
    pointsAvailableCell.innerHTML = entry.pointsAvailable
    gradeCell.innerHTML = entry.grade
  }
}

async function calculateTotalGrade() {
  const response = await fetch( "/appdata", {
    method: "GET"
  })
  const text = await response.text()

  const data = JSON.parse(text)

  var count = 0;
  var count2 = 0;
  for(const entry of data) {
    count += parseInt(entry.pointsEarned)
    count2 += parseInt(entry.pointsAvailable)
  }

  let averageGrade = parseFloat((count / count2) * 100).toFixed(2) + "%"
  count = 0;
  count2 = 0
  
  var table = document.querySelector("#avggrade")
  table.innerHTML = ''
  var row = table.insertRow()
  const title = row.insertCell()
  title.innerHTML = "Average Grade:"
  const avg = row.insertCell()
  avg.innerHTML = averageGrade
}

async function deleteEntry(entry) {
  const assignment = entry.assignment,
        json = { "assignment": assignment },
        body = JSON.stringify(json)

  const response = await fetch( "", {
    method:"DELETE",
    body
  })

  const text = await response.text()
  console.log(text)
  clearForm()
  getData()
  calculateTotalGrade()
}

window.onload = function() {
  const submitButton = document.querySelector("button#submit");
  submitButton.onclick = submit;
  getData()
  calculateTotalGrade()
}