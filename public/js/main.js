// FRONT-END (CLIENT) JAVASCRIPT HERE

const get = function(){

  fetch( "/entries", {
    method:"GET"
  }).then((aResponse)=>{
    //console.log(aResponse)
    return aResponse.json();
  }).then((json)=>{
    console.log(json);
    loadTable(json);
  });

  return false;
}

const submit = async function( event ) {

  event.preventDefault();

  const reqInputs = document.querySelectorAll("input[required]");
  const numInputs = document.querySelectorAll("input[min]");
  let isValid = true;
  let allPositive = true;

  numInputs.forEach(function(input) {
    if (!(input.value >= 0)){
      allPositive = false
    }
  });

  reqInputs.forEach(function(input) {
    if(!input.value.trim()){
      isValid = false;
    }
  });

  if(!isValid){
    alert("Please fill out all required fields");
    return;
  } else if (!allPositive){
    alert("Fields cannot be negative");
    return;
  }

  const anEntry = {name: reqInputs[0].value, bodyWeight: reqInputs[1].value, squat: reqInputs[2].value, benchPress: reqInputs[3].value, deadLift: reqInputs[4].value};
  const body = JSON.stringify(anEntry);

  const response = await fetch( "/submit", {
    method:"POST",
    body
  }).then((aResponse)=>{
    console.log(aResponse);
  });

  get();

  return response;
}

const deleteEntry = async function( event ) {

  event.preventDefault();

  const input = document.getElementById("id");
  const anEntry = {_id: input.value};
  const body = JSON.stringify(anEntry);

  const response = await fetch( "/delete", {
    method:"POST",
    body
  }).then((aResponse)=>{
    console.log(aResponse);
  });

  get();

  return response;
}

const loadTable = function(entries){

  console.log(entries);

  const table = document.querySelector("#liftingDatabase");
  const header = document.querySelector("#categories");
  const template = document.querySelector("#entry");
  const categories = header.content.cloneNode(true);

  while (table.firstChild) {
    table.removeChild(table.firstChild);
  }

  table.append(categories);



  for(var i = 0; i < entries.length; i++){
    let lifter = entries[i];
    const entry = template.content.cloneNode(true);
    let data = entry.querySelectorAll("td");
    data[0].textContent = lifter._id;
    data[1].textContent = lifter.name;
    data[2].textContent = lifter.bodyWeight;
    data[3].textContent = lifter.squat;
    data[4].textContent = lifter.benchPress;
    data[5].textContent = lifter.deadLift;
    data[6].textContent = lifter.total;

    table.append(entry);
  }
//   entries.forEach((lifter) => {
//     const entry = template.content.cloneNode(true);
//     let data = entry.querySelectorAll("td");
//     data[0].textContent = lifter.name;
//     data[1].textContent = lifter.bodyWeight;
//     data[2].textContent = lifter.squat;
//     data[3].textContent = lifter.benchPress;
//     data[4].textContent = lifter.deadLift;
//     data[5].textContent = lifter.total;

//     table.append(entry);
//   });
}

window.onload = function() {
  get();
  const submitButton = document.querySelector(".submitButton");
  submitButton.onclick = submit;
  const deleteButton = document.querySelector(".deleteButton");
  deleteButton.onclick = deleteEntry;
}