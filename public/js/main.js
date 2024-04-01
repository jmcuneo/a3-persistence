// FRONT-END (CLIENT) JAVASCRIPT HERE
// credit to: https://www.valentinog.com/blog/html-table/
let returnedArray;

function generateTableHead(table, data) {
  let thead = table.createTHead();
  let row = thead.insertRow();
  for (let key of data) {
    let th = document.createElement("th");
    let text = document.createTextNode(key);
    th.appendChild(text);
    row.appendChild(th);
  }
}

function generateTable(table, data) {
  for (let element of data) {
    let row = table.insertRow();
    for (key in element) {
      let cell = row.insertCell();
      let text = document.createTextNode(element[key]);
      cell.appendChild(text);
    }
  }
}

const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  const input_model = document.querySelector( "#model" ),
        input_year = document.querySelector( "#year" ),
        input_mpg = document.querySelector( "#mpg" ),
        json = { model: input_model.value,
                year: Number(input_year.value),
                mpg: Number(input_mpg.value) },
        body = JSON.stringify( json )

  const response = await fetch( "/submit", {
    method:"POST",
    headers: {'Content-Type': 'application/json'},
    body 
  })

  const text = await response.text()
  
  let returnedArray = JSON.parse(text);
  console.log( "text:", returnedArray );
  createTable(returnedArray);
}

const erase = async function( event ) {
  event.preventDefault()

  const valueToDel = { "number" : document.getElementById("row").value };

  const response = await fetch( "/submit", {
    method:"DELETE",
    body: JSON.stringify(valueToDel) 
  })
  const text = await response.text()
  let returnedArray = JSON.parse(text);
  console.log( "text:", returnedArray );
  createTable(returnedArray);
}

const createTable = function(array) {
  let table = document.querySelector("table");
  let data = Object.keys(array [0]);
  generateTable(table, array);
  generateTableHead(table, data);
}

window.onload = function() {
   const button_submit = document.getElementById("submit");
   const button_delete = document.getElementById("erase");
  button_submit.onclick = submit;
  button_delete.onclick = erase;
  
}