// FRONT-END (CLIENT) JAVASCRIPT HERE
const submit = async function (event) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()

  const frontString = document.querySelector("#frontstring").value, //getting string values from text input fields
    backString = document.querySelector("#backstring").value,
    concatenatedString = frontString + ' ' + backString; //putting the inputs together into one string variable
    var method = "/submit"; //creating method flag
    let body = JSON.stringify({method: method, string : concatenatedString} ) //creating body, which will contain the desired method and required data, in this case submit and the string
  const response = await fetch("/submit", { //POST the body
    method: "POST",
    body : body
  })

  //const text = await response.text();
  updateTable(); //update the table after submission
}

//addData function for adding to array
//takes in the combined string
//POSTs to server with request to add function to add string to array
async function addData(combinedString){
  const method = "/add";
  const response = await fetch("/add", {
    method: "POST",
    body: JSON.stringify({method: method , string: combinedString})
  })
  updateTable();
}

//updateTable function
//this function handles all displaying
//fetches the current array from the server
//iterates over the array, creating new rows for each data entry
async function updateTable() {
  //get the current state of the array from the server
  const response = await fetch("/getArray")
  let currentArray = await response.json();
  //console.log("Hola!");
  //console.log(currentArray);

  
  const tableElement = document.getElementById('responseTable'); //located the table element in the HTML
  //let count = 0;
  tableElement.innerHTML = ''; //clear existing table contents

   //create table headers
   const headerRow = document.createElement('tr');
   const headers = ['Entry Number', 'Combined String', 'String Length', 'Delete', 'Edit'];
   headers.forEach(headerText => {
     const headerCell = document.createElement('th');
     headerCell.textContent = headerText;
     headerRow.appendChild(headerCell);
   });
   tableElement.appendChild(headerRow);
 
   //for each loop which populates table
   currentArray.forEach((entry, index) => {
     const row = document.createElement('tr');
 
     //left-most column (cal)
     const cell1 = document.createElement('td');
     cell1.textContent = index + 1; // Index starts from 0, so add 1 for display
     row.appendChild(cell1);
 
     //2nd column which will add the entry
     const cell2 = document.createElement('td');
     cell2.textContent = entry;
     row.appendChild(cell2);
 
     //3rd column which is the length of the string, calculated here
     const cell3 = document.createElement('td');
     cell3.textContent = entry.length;
     row.appendChild(cell3);
 
     //4th column delete button creation
     const cell4 = document.createElement('td');
     const deleteButton = document.createElement('button');
     deleteButton.textContent = 'Delete';
     deleteButton.addEventListener('click', function () {
       deleteEntry(index);
     });
     cell4.appendChild(deleteButton);
     row.appendChild(cell4);
 
     //5ht column edit button creation
     const cell5 = document.createElement('td');
     const editButton = document.createElement('button');
     editButton.textContent = 'Edit';
     editButton.addEventListener('click', function () {
      const newInput = prompt('Enter new value: ');
      editEntry(index, newInput);
     });
     cell5.appendChild(editButton);
     row.appendChild(cell5);
 
     //append the new row to the table element
     tableElement.appendChild(row);
   });
}

//delete entry function
//takes in the index of row to be deleted
//POSTs to server with a request to delete array at index
//updates table afterwards
async function deleteEntry(index){
  const method = "/delete";
  //const markedString = currentArray[index];
  const response = await fetch("/delete", {
    method: "POST",
    body: JSON.stringify({method: method , index: index})
  })
  updateTable();
}

//update entry function
//takes in the index of row to be edited
//POSTs to server with a request to edit array at index with new data
//updates table afterwards
async function editEntry(index, content){
  const method = "/edit";
  const response = await fetch("/edit", {
    method: "POST",
    body: JSON.stringify({method: method , index: index, content: content})
  })
  updateTable();
}



window.onload = function () {
  updateTable();
  const button = document.querySelector("button");
  button.onclick = submit;
}