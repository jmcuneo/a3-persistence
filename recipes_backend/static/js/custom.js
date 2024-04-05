// FRONT-END (CLIENT) JAVASCRIPT HERE
/**
 * This function is called when the user clicks the submit button.
 * It will take the values from the form fields and send them to the server.
 * It sends a POST request to the server with the form data.
 * @param event The submit event.
 * @returns {Promise<void>}
 */
const submit = async function( event ) {
    // stop form submission from trying to load
    // a new .html page for displaying results...
    // this was the original browser behavior and still
    // remains to this day
    event.preventDefault();
    const FirstName = document.querySelector( "#FirstName" ),
        MiddleName = document.querySelector( "#MiddleName" ),
        LastName = document.querySelector( "#LastName" ),
        Email = document.querySelector( "#Email" ),
        StartLocation = document.querySelector( "#StartLocation" ),
        Destination = document.querySelector( "#Destination" ),
        Transport =document.querySelector("#transport-mode")
    json = {
        FirstName: FirstName.value,
        MiddleName: MiddleName.value,
        LastName: LastName.value,
        Email: Email.value,
        StartLocation: StartLocation.value,
        Destination: Destination.value,
        Transport: Transport.value,
    },
        body = JSON.stringify( json )
    console.log(body);
    const response = await fetch( "/submit", {
        method:"POST",
        body
    });
    const text = await response.text();
    display(JSON.parse(text));
    console.log( "text:" + JSON.parse(text) );
}

/**
 * This function is called when the user clicks the delete button.
 * It sends a DELETE request to the server with the uid of the item to delete.
 * @param uid Unique ID of the item to delete.
 * @returns {Promise<void>}
 */
async function del(uid){
    console.log(uid)
    const response = await fetch( "/submit", {
        method:"DELETE",
        body: JSON.stringify(uid)
    });
    const text = await response.text();
    display(JSON.parse(text));
}

/**
 * This function is called when the user clicks the update button.
 * @param uid Unique ID of the item to update.
 * @returns {Promise<void>}
 */
async function modify(uid) {
    console.log("hello" + document.getElementById("email_attribute"));
    document.getElementById("Email").value = uid.getAttribute("email_attribute");
    document.getElementById("StartLocation").value = uid.getAttribute("start_attribute");
    document.getElementById("Destination").value = uid.getAttribute("dest_attribute");
    document.getElementById("Confirm").style.display="block";
}

/**
 * This function gets the newData from the form fields and sends it to the display function.
 * @returns {Promise<void>}
 * @constructor
 */
async function NewData(){
    const FirstName = document.querySelector( "#FirstName" ),
        MiddleName = document.querySelector( "#MiddleName" ),
        LastName = document.querySelector( "#LastName" ),
        Email = document.querySelector( "#Email" ),
        StartLocation = document.querySelector( "#StartLocation" ),
        Destination = document.querySelector( "#Destination" ),
        Transport =document.querySelector("#transport-mode")
    json = {
        FirstName: FirstName.value,
        MiddleName: MiddleName.value,
        LastName: LastName.value,
        Email: Email.value,
        StartLocation: StartLocation.value,
        Destination: Destination.value,
        Transport: Transport.value,
    },
        body = JSON.stringify( json )
    const response = await fetch("/submit", {
        method: "PUT",
        body
    });
    const text = await response.text();
    document.getElementById("Confirm").style.display="none";
    display(JSON.parse(text));
    console.log("updated here for NewData"+JSON.stringify(text))
}

/**
 * This function displays the data in the table.
 * @param object The object to display in the table.
 * @returns {Promise<void>}
 */
async function display(object){
    console.log("updated here for display"+JSON.stringify(object));
    let table = document.querySelector("#data_body");
    let elements=""
    table.innerHTML=" "
    for(let i=0; i<object.length;i++){
        elements=`<td>${i}</td> <td>${object[i].FirstName}</td> <td>${object[i].MiddleName}</td>
        <td>${object[i].LastName}</td> <td >${object[i].Email}</td>
         <td id="start">${object[i].StartLocation}</td> <td id="dest"> ${object[i].Destination}</td>
         <td id="travel"> ${object[i].Transport}</td> <td> ${object[i].cost}</td>
         <td><button onclick="modify(this)" id="update" 
        ${object[i].Email ? `email_attribute="${object[i].Email}"` : ''}
        ${object[i].StartLocation ? `start_attribute="${object[i].StartLocation}"` : ''}
        ${object[i].Destination ? `dest_attribute="${object[i].Destination}"` : ''}
        ${object[i].Transport ? `transport_attribute="${object[i].Transport}"` : ''}
        >Update</button></td>

         <td><button del_attribute=${i} onclick="del(${i})" id="delete">Delete</button></td>`
        let entries = `<tr>${elements}</tr>`
        table.innerHTML += entries;
    }
}

/**
 * This function is called when the window loads.
 * It send a GET request to the server to get the data to display.
 * @returns {Promise<void>}
 */
window.onload = async function() {
    const button = document.querySelector("#Submit");
    button.onclick = submit;
    const response = await fetch("/display", {
        method: "GET",
    });
    const text = await response.text();
    display(JSON.parse(text));
}