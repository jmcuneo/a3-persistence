// FRONT-END (CLIENT) JAVASCRIPT HERE
// credit to: https://www.valentinog.com/blog/html-table/
let returnedArray;
let currID;



const submit = async function (event) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  const input_model = document.querySelector("#model"),
    input_year = document.querySelector("#year"),
    input_mpg = document.querySelector("#mpg"),
    json = {
      model: input_model.value,
      year: Number(input_year.value),
      mpg: Number(input_mpg.value)
    },
    body = JSON.stringify(json)

  const response = await fetch("/add", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body
  })
  alert("Successfully submitted!")
  location.reload()

}

const erase = async function () {

  const response = await fetch("/remove", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({_id: currID})
  })
  const text = await response.text()
  let returnedArray = JSON.parse(text);
  console.log("text:", returnedArray);

  alert("Successfully deleted!")
  location.reload()
}

const view = async function () {
  document.getElementById("view").style.display = "none"
  const response = await fetch("/docs", { method: "GET" })

  const text = await response.text()

  let returnedArray = JSON.parse(text);
  console.log("text:", returnedArray);
  createTable(returnedArray);
}

const update = async function () {

  const input_model = document.querySelector("#model"),
    input_year = document.querySelector("#year"),
    input_mpg = document.querySelector("#mpg"),
    json = {
      _id: currID,
      model: input_model.value,
      year: Number(input_year.value),
      mpg: Number(input_mpg.value)
    },
    body = JSON.stringify(json)

  const response = await fetch("/update", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body
  })

  alert("Successfully updated!")
  location.reload()
}



function generateTableHead(table, data) {
  let thead = table.createTHead();
  let row = thead.insertRow();
  let test = ""
 
  for (let key of data) {
      let th = document.createElement("th");
      if (key !== "_id"){
        test = key
      }
      let text = document.createTextNode(test);
     
      th.appendChild(text);
      row.appendChild(th);
    
  }
}

function generateTable(data) {
  let table = document.createElement("table")
  let insertHere = document.getElementById("insertTable")
  
  table.className = "lobster-regular"

  for (let element of data) {
    let row = table.insertRow();
    let currRoundID;
    for (key in element) {
      let cell = row.insertCell();
      if (key === "_id") {
        let del = document.createElement("button")
        currRoundID = element[key]
        del.id = currRoundID
        del.class = "delete"
        del.onclick = function(){
          currID = del.id
          erase()
        }
        del.appendChild(document.createTextNode("delete"))
        cell.appendChild(del)
      } else {
        let text = document.createTextNode(element[key]);
        cell.appendChild(text);
      }
    }
    cell = row.insertCell()
    let upd = document.createElement("button")
    upd.id = currRoundID
    upd.class = "update"
    upd.onclick = function () {
      currID = upd.id
      console.log(currID)
      update()
    }
    upd.appendChild(document.createTextNode("update"))
    cell.appendChild(upd)
  }
  insertHere.appendChild(table)
}

const createTable = function (array) {
  generateTable(array);
  let data = Object.keys(array[0]);
  let table = document.querySelector("table");
  generateTableHead(table, data);
}


window.onload = function () {
  const button_submit = document.getElementById("submit");
  //const button_view = document.getElementById("view")
  
  button_submit.onclick = submit;
  view()
  //button_view.onclick = view;
  
  


}