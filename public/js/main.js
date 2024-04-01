// FRONT-END (CLIENT) JAVASCRIPT HERE

const calculate = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  const inputClass = document.querySelector( "#class" ),
    inputGrade = document.querySelector( "#grade" ),
    inputCredits = document.querySelector( "#credits" ),
    json = { class: inputClass.value, grade: inputGrade.value, credits: inputCredits.value },
    body = JSON.stringify( json )

  const response = await fetch( "/calculate", {
    method:"POST",
    body 
  }).then(function (response) {
    return response.json();
  }).then(function(json){
    document.getElementById("gpa").innerHTML = json;
  })

  inputClass.value = ""
  inputGrade.value = ""
  inputCredits.value = ""

  const appdataResponse = await fetch("/appdata", {
    method: "GET",
  });

  const appdata = await appdataResponse.json()
  updateTable(appdata)
} 

const updateTable = function (appdata) {
  const dataTable = document.getElementById("dataTable")
  dataTable.innerHTML = ""

  const headers = dataTable.insertRow(0)
  headers.insertCell(0).textContent = "ID"
  headers.insertCell(1).textContent = "Class"
  headers.insertCell(2).textContent = "Grade"
  headers.insertCell(3).textContent = "Credits"
  headers.insertCell(4).textContent = "GPA"

  appdata.forEach((entry, index) => {
    const fillCells = dataTable.insertRow(index + 1)
    fillCells.insertCell(0).textContent = entry.id
    fillCells.insertCell(1).textContent = entry.class
    fillCells.insertCell(2).textContent = entry.grade
    fillCells.insertCell(3).textContent = entry.credits
    fillCells.insertCell(4).textContent = entry.currentGPA
  })
}

const deleteID = async function( event ) {

  event.preventDefault()
  
  const inputID = document.querySelector( "#delete" ),
   json = { id : inputID.value }, 
   body = JSON.stringify( json )

  const response = await fetch( "/calculate", {
    method:"DELETE",
    body 
  }).then(function (response) {
    if (response.status === 204) {
      inputID.value = ""
      const nothingInArray = []
      updateTable(nothingInArray)
      return;
    }
    return response.json();
  }).then(function(json){
    console.log(json)
    if(json === undefined){
      json = 0
    }
    document.getElementById("gpa").innerHTML = json;
  })

  inputID.value = ""
  
  const appdataResponse = await fetch("/appdata", {
    method: "GET",
  });

  const appdata = await appdataResponse.json()
  updateTable(appdata)
} 


const modifyID = async function( event ) {
  event.preventDefault()
  
  const inputID = document.querySelector("#idModify"),
    inputClass = document.querySelector( "#classModify" ),
    inputGrade = document.querySelector( "#gradeModify" ),
    inputCredits = document.querySelector( "#creditsModify" ),
    json = { class: inputClass.value, grade: inputGrade.value, credits: inputCredits.value,  id : inputID.value },
    body = JSON.stringify( json )

  const response = await fetch( "/calculate", {
    method:"PUT",
    body 
  }).then(function (response) {
    return response.json();
  }).then(function(json){
    document.getElementById("gpa").innerHTML = json;
  })

  inputID.value = ""
  inputClass.value = ""
  inputGrade.value = ""
  inputCredits.value = ""
  
  const appdataResponse = await fetch("/appdata", {
    method: "GET",
  });

  const appdata = await appdataResponse.json();
  updateTable(appdata);
} 

window.onload = function() {
  const calculate_button = document.querySelector("#calculate_button")
  calculate_button.onclick = calculate
  const delete_button = document.querySelector("#delete_button")
  delete_button.onclick = deleteID
  const modify_button = document.querySelector("#modify_button")
  modify_button.onclick = modifyID

  const appdataResponse = fetch("/appdata", {
    method: "GET",
  })
  .then(a => a.json())
  .then(data => updateTable(data))

  const gpaResponse = fetch("/gpa", {
    method: "GET",
  })
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    const gpa = data.gpa; 
    document.getElementById("gpa").innerHTML = `${gpa}`;
  });
}
