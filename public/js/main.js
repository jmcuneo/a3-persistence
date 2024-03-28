// FRONT-END (CLIENT) JAVASCRIPT HERE

//This function is called when data is being entered into the table through the text boxes
const submit = async function( event ) {

    //this checks to make sure thre is at least a first and last name entered
    const form = document.querySelector("#addForm");
    if (!form.checkValidity()) {
        event.preventDefault()
        alert("Some information is missing. Please make sure there is at least a first name and a last name entered.");
        return;
    }
    event.preventDefault();

    //this function auto capitalizes the first letter of a word
    function capFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    highestId++

    //this assigns the input values into variables
  const input =
    inputFirstName = document.querySelector("#firstName");
    inputMiddleName = document.querySelector("#middleName");
    inputLastName = document.querySelector("#lastName");

    //this creates the json
    json = {id: highestId, firstName: capFirstLetter(inputFirstName.value), middleName: capFirstLetter(inputMiddleName.value), lastName: capFirstLetter(inputLastName.value)},
    body = JSON.stringify( json )

    //this is the response to the server
  const response = await fetch( "/submit", {
    method:"POST",
    body
  })

    const data = await response.json()
    console.log(data)

    //this calls the add table function so the table can be properly formatted with the new name
  addTable(data.id, data.firstName, data.middleName, data.lastName, data.initial)
    rowNum++
}

let rowNum= 1
let currTable = [];

//the add table function take sthe information passed in, assigns them to variables and inserts them into cells
function addTable(id, fn, mn, ln, i){
    let table = document.getElementById("table");
    let row = table.insertRow();

    let ID = row.insertCell()
    let firstName = row.insertCell();
    let middleName = row.insertCell();
    let lastName = row.insertCell();
    let initial = row.insertCell();

    ID.innerHTML = id;
    firstName.innerHTML = fn;
    middleName.innerHTML = mn;
    lastName.innerHTML = ln;
    initial.innerHTML = i;

    //currTable is used as a way for client console to be able to print the saved names
    currTable.push({
        id,
        firstName: fn,
        middleName: mn,
        lastName: ln,
        initial: i
    });

    console.log(currTable.slice())
}

//get data returns the data currently saved in the server
const getData = async function() {

    const response = await fetch("/data", {
        method: "GET"
    })
        .then((response) => response.json())
        .then(jsonData => {
            return jsonData;
        });

    console.log(response)
}

//remove reads the id in the remove text bo and sends a delete request to the server
const remove = async function( event ) {
    event.preventDefault()

    const deleteId = document.querySelector( "#deleteId")
    const json = { id: deleteId.value}
    const body = JSON.stringify( json )

    await fetch( "/delete", {
        method:"DELETE",
        body: body,
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then ((response)=>response.json())
        .then ((response)=>{
            console.log(response);
            //once the data is removed from the server, it calls removeTable so the table can be updated on the front end
            if (response.status === 'success') {
                removeTable(parseInt(deleteId.value))
            }
        })
}

//remove table takes the tabls, finds the row that has a corresponding id with the passed in id and deletes the row
function removeTable(id) {
    let table = document.getElementById("table");
    let del = parseInt(id);

    for (let i = 0; i < table.rows.length; i++){
        if (id === parseInt(table.rows[i].cells[0].innerHTML)){
            table.deleteRow(i)
            break;
        }
    }

    //const i is used to find the corresponding id on the client side version of the table and remove it from console so the current table can be printed there
    const i = currTable.findIndex(function(temp){
        return temp.id === id;
    })

    if (i !== -1){
        currTable.splice(i,1)
    }

    console.log(currTable.slice());

}

let highestId = 0;

//this onload function checks to see when either new data or delete button are removes
window.onload = async function() {

    const createButton = document.querySelector("#newButton");
    createButton.onclick = submit;

    const deleteButton = document.querySelector("#deleteButton")
    deleteButton.onclick = remove;

    //this secctipn of the onload is how the table is able to persist if the page refreshes, it calls for the data on the server and if its there, it repopulates the table by calling addTable
    fetch('/data')
        .then(response => response.json())
        .then(dataArray => {
            if (Array.isArray(dataArray) && dataArray.length > 0){
                for (let i = 0; i < dataArray.length; i++){
                    const curr = dataArray[i]
                    addTable(curr.id, curr.firstName, curr.middleName, curr.lastName, curr.initial)

                    if (curr.id > highestId) {
                        highestId = curr.id;
                    }
                }
            }
        })
}