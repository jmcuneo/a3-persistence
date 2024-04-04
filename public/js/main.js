// FRONT-END (CLIENT) JAVASCRIPT HERE
let rowNumber = 1;
let data;
let isAdded = false; //bool for getData and add to fix table
let isDeleted = false; //bool for getData and add to fix table
let isModified = false; //bool for getData and modify to fix table

function addRow(id, model, year, mpg, fuelTank){ //adds row to table
  let table = document.getElementById("table");
  let row = table.insertRow();

  let tillEmpty = mpg * fuelTank;

  let cell0 = row.insertCell(0);
  let cell1 = row.insertCell(1);
  let cell2 = row.insertCell(2);
  let cell3 = row.insertCell(3);
  let cell4 = row.insertCell(4);
  let cell5 = row.insertCell(5);

  cell0.innerHTML = id.toString();
  cell1.innerHTML = model;
  cell2.innerHTML = year.toString();
  cell3.innerHTML = mpg.toString();
  cell4.innerHTML = fuelTank.toString();
  cell5.innerHTML = tillEmpty.toString();
}


function updateDropDown(){
let dropDownDelete = document.getElementById("deleteID");
let dropDownModify = document.getElementById("modifyID");

//delete all options first
dropDownDelete.innerHTML = "";
dropDownModify.innerHTML = "";

for(let i = 1; i < rowNumber; i++) {
  let optionDelete = document.createElement("option");
  let optionModify = document.createElement("option");
  optionDelete.text = i.toString();
  optionModify.text = i.toString();
  dropDownDelete.add(optionDelete);
  dropDownModify.add(optionModify);
}
}
function updateIDs(){
  let table = document.getElementById("table");
  for(let i = 1; i <table.rows.length; i++){
    let row = table.rows[i];
    let cells = row.cells;
    cells[0].innerHTML = i;
  }
}

//Helper for capitalizing car name
function capitalFirstLetter(str){
  return str.charAt(0).toUpperCase() + str.slice(1);
}
const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  const input1 = document.querySelector( "#model" ),
      input2 = document.querySelector("#year"),
      input3 = document.querySelector("#mpg"),
      input4 = document.querySelector("#fuelLoad"),
      json = {Id: rowNumber, model: capitalFirstLetter(input1.value), year: input2.value, mpg: input3.value, fuelLoad: input4.value, tillEmpty: input3.value * input4.value},
      body = JSON.stringify(json)

  const response = await fetch( "/submit", {
    method:"POST",
    body 
  })

  if(isNaN(parseInt(json.year)) ||
      isNaN(parseInt(json.mpg)) ||
    isNaN(parseInt(json.fuelLoad))
  ) {

  } else{
    //addRow(json.Id, json.model, json.year, json.mpg, json.fuelLoad );
    data.push(json);
    //rowNumber++;
    isAdded = true;
    await getData();

  }

console.log(rowNumber)
  const text = await response.text();
  console.log( "text:", text )
}

const remove = async function (event) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()

  const inputID = document.querySelector("#deleteID"),
  json = {"id": inputID.value},
  body = JSON.stringify(json)
  const response = await fetch( "/remove", {
    method:"DELETE",
    body
  })

  const text = await response.text()

  console.log( "text:", text )

  if(isNaN(inputID.value)|| inputID.value === "" || parseInt(inputID.value) <= 0 || parseInt(inputID.value) > rowNumber){

  } else{

    //rowDelete(inputID.value)
    rowNumber--;
    data.splice(parseInt(inputID.value) - 1, 1);
    isDeleted = true;
    console.log(data)
    await getData();
  }
}
const modify = async function(event){
  event.preventDefault()

  isModified = true;

  const input0 = document.querySelector("#modifyID"),
      input1 = document.querySelector( "#model2" ),
      input2 = document.querySelector("#year2"),
      input3 = document.querySelector("#mpg2"),
      input4 = document.querySelector("#fuelLoad2"),
      json = {Id: input0.value, model: capitalFirstLetter(input1.value), year: input2.value, mpg: input3.value, fuelLoad: input4.value, tillEmpty: input3.value * input4.value},
      body = JSON.stringify(json)

  const response = await fetch( "/modify", {
    method:"PUT",
    body
  })

  const text = await response.text()

  console.log( "text:", text )

  if( isNaN(parseInt(json.Id)) ||
      parseInt(json.Id) <= 0 ||
      parseInt(json.Id) > rowNumber

  ) {
  } else{
    await getData().then(r => console.log("done"));
  }



}

const getData = async function() {
  rowNumber = 1;
  let table = document.getElementById("table");
  const response = await fetch( "/data", {
    method:"GET"
  }).then((response) => response.json()
  ).then((json) =>data =json)


  if(isDeleted){

    for(let i = data.length +1 ; i > 0; i--){
      table.deleteRow(i)
      updateIDs();
    }
    isDeleted = false;
  }

  if(isAdded){

    for(let i = data.length -1; i > 0; i--){
      table.deleteRow(i)
    }
    isAdded = false;
  }


  if(isModified){

    for(let i = data.length; i > 0; i--){
      table.deleteRow(i)
    }
    isModified = false;
  }

  console.log("len: " + data.length)
  for(let i = 0; i < data.length; i++){
    console.log(data[i].model)

    addRow(data[i].Id ,data[i].model, data[i].year, data[i].mpg, data[i].fuelLoad);
    rowNumber++
  }
  console.log(rowNumber)
  if(rowNumber > 1){
    updateDropDown();
  } else {
let dropDown = document.getElementById("deleteID");
    dropDown.innerHTML = "";

  }
 // console.log(data[data.length-1].Id)

  //const text = await response.text()

  //console.log( "text:", text )

}

window.onload = function() {
getData().then(r => console.log("stuff"));
  const submitButton = document.getElementById("submit");
  submitButton.onclick = submit;
  const deleteButton = document.getElementById("delete");
  deleteButton.onclick = remove;
  const modifyButton = document.getElementById("modify");
  modifyButton.onclick = modify;
}