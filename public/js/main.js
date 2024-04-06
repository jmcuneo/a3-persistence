// FRONT-END (CLIENT) JAVASCRIPT HERE

//This function is called when data is being entered into the table through the text boxes
const submit = async function(event) {

    //this checks to make sure thre is at least a first and last name entered
    const form = document.querySelector("#addForm");
    if (!form.checkValidity()) {
        event.preventDefault()
        alert("Some information is missing. Please make sure there is at least a first name and a last name entered.");
        return;
    }
    event.preventDefault();

    highestId++
    idsInUse.push(highestId);

    //this assigns the input values into variables
    const input =
        inputFirstName = document.querySelector("#firstName");
    inputMiddleName = document.querySelector("#middleName");
    inputLastName = document.querySelector("#lastName");

    //this creates the json
    json = { 
        id: highestId, 
        mongoUserId: mongoUserId,
        firstName: capFirstLetter(inputFirstName.value), 
        middleName: capFirstLetter(inputMiddleName.value), 
        lastName: capFirstLetter(inputLastName.value) 
    },
    body = JSON.stringify(json)

    // this is the response to the server
    const response = await fetch("/submit", {
        method: "POST",
        body
    })

    const data = await response.json()
    console.log(data)

    //this calls the add table function so the table can be properly formatted with the new name
    addTable(data.id, data.firstName, data.middleName, data.lastName, data.initial)
    rowNum++
}

capFirstLetter = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

let rowNum = 1
let currTable = [];

//the add table function take sthe information passed in, assigns them to variables and inserts them into cells
function addTable(id, fn, mn, ln, i) {
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

    updateDropdown();

}

//get data returns the data currently saved in the server
const getData = async function() {

    const response = await fetch("/data", {
    // const response = await fetch(`/data?userId=${userId}`, {
            method: "GET"
        })
        .then((response) => response.json())
        .then(jsonData => {
            return jsonData;
        });

    console.log(response)
}

//remove reads the id in the remove text bo and sends a delete request to the server
const remove = async function(event) {

    event.preventDefault()

    const deleteId = document.querySelector("#deleteId")

    if (!deleteId.value || !idsInUse.includes(parseInt(deleteId.value))) {
        alert("Please enter a valid ID to delete.");
        return;
    }

    const json = { id: deleteId.value }
    const body = JSON.stringify(json)

    await fetch("/delete", {
            method: "DELETE",
            body: body,
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((response) => response.json())
        .then((response) => {
            console.log(response);
            //once the data is removed from the server, it calls removeTable so the table can be updated on the front end
            if (response.status === 'success') {
                removeTable(parseInt(deleteId.value))

                const i = idsInUse.indexOf(parseInt(deleteId.value)); // Find the index of the ID in the array
                if (i !== -1) {
                    idsInUse.splice(i, 1); // Remove the ID from the array
                }
            } 
        })
        console.log("end of delete on client")
}

const modify = function(event) {
    console.log("modify function called")
    
    // $('#modifyModal').modal('hide');

        const modifyId = document.querySelector("#dropdownMenuButton").innerText.split(' - ')[0];
        const modifyFirstName = document.querySelector("#modifyFirstName")
        const modifyMiddleName = document.querySelector("#modifyMiddleName")
        const modifyLastName = document.querySelector("#modifyLastName")
    
        console.log("modifyID = "+ modifyId)
    
        const dropdown = document.querySelector("#dropdownMenuButton");
        if (!modifyId || !modifyFirstName.value || !modifyLastName.value) {
            alert("Some information is missing. Please make sure there is at least an ID, a first name and a last name entered.");
            return;
        }
    
        const json = { 
            id: parseInt(modifyId), 
            firstName: capFirstLetter(modifyFirstName.value), 
            middleName: capFirstLetter(modifyMiddleName.value), 
            lastName: capFirstLetter(modifyLastName.value) 
        }
        const body = JSON.stringify(json)

        fetch("/modify", {
            method: "PUT",
            body: body,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => response.json())
        .then((response) => {
            console.log(response);
            if (response.status === 'success') {
                modifyTable(response.id, response.firstName, response.middleName, response.lastName)
                $("#modifyModal").modal("hide")
            }
            
        })

    // console.log("button is pressed")
    
 
}

// Modify table function to update the table on the front end
function modifyTable(id, fn, mn, ln) {
    console.log("modifyTable function called")
    let table = document.getElementById("table");
    for (let i = 0; i < table.rows.length; i++) {
        if (id === parseInt(table.rows[i].cells[0].innerHTML)) {
            table.rows[i].cells[1].innerHTML = fn;
            table.rows[i].cells[2].innerHTML = mn;
            table.rows[i].cells[3].innerHTML = ln;
            table.rows[i].cells[4].innerHTML = fn[0] + mn[0] + ln[0];
            break;
        }
    }

    // Update the currTable array
    const i = currTable.findIndex(function(temp) {
        return temp.id === id;
    })

    if (i !== -1) {
        currTable[i].firstName = fn;
        currTable[i].middleName = mn;
        currTable[i].lastName = ln;
    }

    console.log(currTable.slice());

    updateDropdown();
}



//remove table takes the tabls, finds the row that has a corresponding id with the passed in id and deletes the row
function removeTable(id) {
    let table = document.getElementById("table");
    let del = parseInt(id);

    for (let i = 0; i < table.rows.length; i++) {
        if (id === parseInt(table.rows[i].cells[0].innerHTML)) {
            table.deleteRow(i)
            break;
        }
    }

    //const i is used to find the corresponding id on the client side version of the table and remove it from console so the current table can be printed there
    const i = currTable.findIndex(function(temp) {
        return temp.id === id;
    })

    if (i !== -1) {
        currTable.splice(i, 1)
    }

    console.log(currTable.slice());

    updateDropdown();

}

mongoUserId = document.cookie.split('=')[1];    

let idsInUse = [];
let highestId = 0;



function updateDropdown() {
    // Select the table
    var table = document.getElementById('table');

    // Select the dropdown button
    var dropdownButton = document.getElementById('dropdownMenuButton');

    // Select the dropdown menu
    var dropdownMenu = document.querySelector('.dropdown-menu');

    // Clear the dropdown menu
    dropdownMenu.innerHTML = '';

    for (let i = 1; i < table.rows.length; i++) {
        let id = table.rows[i].cells[0].innerText;
        let firstName = table.rows[i].cells[1].innerText;
        let middleName = table.rows[i].cells[2].innerText;
        let lastName = table.rows[i].cells[3].innerText;
        let initial = table.rows[i].cells[4].innerText;

        let fullName = `${id} - ${firstName} ${middleName} ${lastName} - ${initial}`;
        let shortName = `${id} - ${firstName} ${lastName}`;

        let dropdownItem = document.createElement("a");
        dropdownItem.className = "dropdown-item";
        dropdownItem.href = "#";
        dropdownItem.innerText = fullName;

        dropdownItem.dataset.fullName = fullName;
        dropdownItem.dataset.shortName = shortName;
    
        dropdownItem.addEventListener("click", function(event) {
            event.preventDefault();

            dropdownButton.innerText = this.dataset.shortName;
        });

        dropdownMenu.appendChild(dropdownItem);
    }
}

//this onload function checks to see when either new data or delete button are removes
window.onload = async function() {

    console.log("window.onload called");

    // const modifyForm = document.querySelector("#submitModifications");
    const modifyForm = document.querySelector("#modifyForm");
    console.log(modifyForm)
    modifyForm.onsubmit = function (event) {
        event.preventDefault();
        modify(event)
    }

    
//     const submitModificationsButton = document.querySelector("#submitModifications");
// submitModificationsButton.onsubmit = async function(event) {
//   event.preventDefault();
//   console.log("modifyForm.onsubmit called");
//   await modify(event);
// };

    const createButton = document.querySelector("#newButton");
    createButton.onclick = submit;

    const deleteButton = document.querySelector("#deleteButton")
    deleteButton.onclick = remove;

    // fetch('/data')
    fetch(`/data?userId=${mongoUserId}`)
        .then(response => response.json())
        .then(dataArray => {
            if (Array.isArray(dataArray) && dataArray.length > 0) {
                for (let i = 0; i < dataArray.length; i++) {
                    const curr = dataArray[i]
                    addTable(curr.id, curr.firstName, curr.middleName, curr.lastName, curr.initial)

                    if (curr.id > highestId) {
                        highestId = curr.id;
                    }
                    idsInUse.push(curr.id);
                }
            }
        })
        updateDropdown();
}




