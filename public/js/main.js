// FRONT-END (CLIENT) JAVASCRIPT HERE

const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()

  const inputName = document.querySelector( "#yourname");
  const inputCredits = document.querySelector("#yourcredits");

  const name = inputName.value.trim()
  const credits = parseInt(inputCredits.value.trim())

  if (name ==="" || isNaN(credits) || credits < 0){
    alert("Please enter a valid name and credits.")
    return
  }

  const json = {name: inputName.value, credits: inputCredits.value};
  const body = JSON.stringify(json);

  await fetch( "/submit", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body
  }).then(function(response){
    return response.json()
  }).then(function(json){
    console.log(json)

    inputName.value = ""
    inputCredits.value = ""

    fetchStudentData()
  })
}

const deleteStudent = async function (studentName){
  await fetch( "/delete", {
    method:"POST",
    headers:{
      "Content-Type": "application/json"
    },
    body: JSON.stringify({name: studentName})
  }).then(function(response){
    return response.json()
  }).then(function(json){
    console.log(json)

    fetchStudentData()
  })
}

const formatHeader = function(header){
  switch(header.toLowerCase()){
    case "name":
      return "Name"
    case "credits":
      return "Credits"
    case "classstanding":
      return "Class Standing"
    case "classof":
      return "Class Of"
    default:
      return header
  }
}
const fetchStudentData = async function(){
  const response = await fetch("/studentData")
  const studentData = await response.json()

  const studentTable = document.querySelector("#studentTable")
  studentTable.innerHTML = ""

  if (studentData.length > 0){
    const headers = Object.keys(studentData[0]).filter(header => header !== "_id")
    const headerRow = document.createElement("tr")

    headers.forEach(header => {
      console.log(header)
      const th = document.createElement("th")
      th.textContent = formatHeader(header)
      headerRow.appendChild(th)
    })
    studentTable.appendChild(headerRow)

    studentData.forEach(student => {
      const row = document.createElement("tr");
      headers.forEach(header => {
        const variable = document.createElement("td")
        variable.textContent = student[header]
        row.appendChild(variable)
      })

      const deleteButton = document.createElement("button")
      deleteButton.textContent = "Delete"
      deleteButton.classList.add("deletebutton")
      deleteButton.addEventListener("click", function(){
        deleteStudent(student.name)
      })
      row.appendChild(deleteButton)

      studentTable.appendChild(row)
    })
  }
}

window.onload = function() {
  const submitButton = document.querySelector("#submit");
  submitButton.onclick = submit;

  fetchStudentData()
}