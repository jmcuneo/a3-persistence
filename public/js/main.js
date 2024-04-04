//main.js
//client-side code

//function to delete a given entry in the server array with the previous results
const deleteResult = async function(id) {
  const body = JSON.stringify({_id: id})
    const response = await fetch('/deleteResult', {
      method: "POST",
      body: body,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    updateTable();
};

//function to update the table to reflect the fetch from the server side array
const updateTable = async function() {          
  const response = await fetch("/getPreviousResults");    //fetch the array
    if (response.ok) {        //if array can be accessed
      const previousResults = await response.json();      // array of previous results
      const previousResultsTable = document.getElementById('previousResults');        //define table
      const tbody = previousResultsTable.querySelector('tbody');                      //define table body
      tbody.innerHTML = '';         //clear the content in the body
                    
      previousResults.forEach((result, index) => {        //loop through the fetched array
          const row = document.createElement('tr');       //define row
          const cellIndex = document.createElement('td'); //define index
          cellIndex.textContent = (index + 1);            //set index number to the element in the html
          const cellResult = document.createElement('td');  //define result
          cellResult.textContent = result.result;           //fetch the result from each array entry and set it to the element content

          const cellDelete = document.createElement('td');            //define the cell for delete button
          const deleteButton = document.createElement('button');      // create the delete button
          deleteButton.textContent = 'Delete';                        //"delete" text inside of the button
          deleteButton.addEventListener('click', async function() {         //create an event handler for when the button is clicked that links to the deleteResult() function above
            deleteResult(result._id);
          });
          cellDelete.appendChild(deleteButton);                       //add the delete button to the cell for delete button

          row.appendChild(cellIndex);     //add the of the index cell to the row
          row.appendChild(cellResult);    //add the of the result cell to the row
          row.appendChild(cellDelete);    //add the of the delete cell to the row
          tbody.appendChild(row);         //add the row to the defined table
      });
  }
}

//addition function
const addition = async function( event ) { 
  event.preventDefault()

  const num1 = document.querySelector('#num1').value,     //get num1 from the first input box
  num2 = document.querySelector('#num2').value,           //get num2 from the second input box
  json = { operation: 'addition', num1: num1, num2: num2},      //define the payload
  body = JSON.stringify( json )                                 //stringify payload

  const response = await fetch( "/addition", {
    method: "POST",       //post method
    body: body
  })

  const responseData = await response.json()  // Get the response

  const resultElement = document.querySelector('#result')        //define the result element on the screen
  resultElement.textContent = "Result: " + JSON.stringify(responseData.result)     //assign the client side element to the result from the response

  updateTable()
}

//subtraction function
const subtract = async function( event ) {        
  event.preventDefault()

  const num1 = document.querySelector('#num1').value,
  num2 = document.querySelector('#num2').value,
  json = { operation: 'subtract', num1: num1, num2: num2},
  body = JSON.stringify( json )

  const response = await fetch( "/subtract", {
    method: "POST",
    body: body 
  })

  const responseData = await response.json()

  const resultElement = document.querySelector('#result')
  resultElement.textContent = "Result: " + JSON.stringify(responseData.result) 

  updateTable()
}

//multiplication function
const multiply = async function( event ) {
  event.preventDefault()

  const num1 = document.querySelector('#num1').value,
  num2 = document.querySelector('#num2').value,
  json = { operation: 'multiply', num1: num1, num2: num2},
  body = JSON.stringify( json )

  const response = await fetch( "/multiply", {
    method: "POST",
    body: body 
  })

  const responseData = await response.json()

  const resultElement = document.querySelector('#result')
  resultElement.textContent = "Result: " + JSON.stringify(responseData.result) // Use the plain text response

  updateTable()
}

//division function
const divide = async function( event ) {
  event.preventDefault()

  const num1 = document.querySelector('#num1').value,
  num2 = document.querySelector('#num2').value,
  json = { operation: 'divide', num1: num1, num2: num2},
  body = JSON.stringify( json )

  const response = await fetch( "/divide", {
    method: "POST",
    body: body 
  })

  const responseData = await response.json()

  const resultElement = document.querySelector('#result')
  resultElement.textContent = "Result: " + JSON.stringify(responseData.result) // Use the plain text response

  updateTable()
}

window.onload = async function() {      //on page load

  //await fetch("/getLogin", {
  //  method: "GET"
  //})

  updateTable();      //update table

  const addButton = document.querySelector("#addButton")    //create an add button on the screen
  addButton.onclick = addition                              //map the button to the addition function

  const subtractButton = document.querySelector("#subtractButton")  //create an subtract button on the screen
  subtractButton.onclick = subtract                                 //map the button to the subtraction function

  const multiplyButton = document.querySelector("#multiplyButton")    //create an multiply button on the screen
  multiplyButton.onclick = multiply                                   //map the button to the multiplication function

  const divideButton = document.querySelector("#divideButton")        //create an divide button on the screen
  divideButton.onclick = divide                                       //map the button to the division function

}
