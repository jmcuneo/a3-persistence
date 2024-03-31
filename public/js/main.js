// FRONT-END (CLIENT) JAVASCRIPT HERE


function getGenre(formType) {
  var genres = document.getElementsByName(formType);
 
  for (i = 0; i < genres.length; i++) {
    if (genres[i].checked)
      return genres[i].value
    }

  return null
}


// Function that will return the list of people stored in the server
var getBooks = async function () {

  // Makes the get request to get the array of people from the server
  var response = await fetch ( "/getPeople", {
    method:"GET"
  })

  // Parses the returned data into a readable format
  var text = await response.text();
  let books = JSON.parse(text);

  // Returns to the function caller
  return books
}

// Function that will submit a post request adding a person to the list in the server
const submitAdd = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault();

  // Takes the first and last name of the person as well as their age
  const input = document.querySelectorAll( "#title, #author, #pagenum, #dateread" ),
        genreSelect = getGenre('genre')
        json = { bookTitle: input[0].value, author: input[1].value, genre: genreSelect, pageCount: input[2].value, dateCompleted: input[3].value },
        body = JSON.stringify( json );

  // Makes the post request with the body data
  const response = await fetch( "/submitAdd", {
    method:"POST",
    body 
  })

  // Resets the forms to clear the values and then refreshes the table data to reflect changes
  const text = await response.text();
  document.getElementById("formOne").reset();
  addDataToTable();

};

// Function that will submit a post request removing a person from the list in the server
const submitRemove = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault();

  // Takes the ID to remove the user from the list
  const input = document.querySelector( "#id" ),
        json = { id: input.value},
        body = JSON.stringify( json );

  // Makes the post request with the body data
  const response = await fetch( "/submitRemove", {
    method:"POST",
    body 
  });

  // Resets the forms to clear the values and then refreshes the table data to reflect changes
  const text = await response.text();
  document.getElementById("formTwo").reset();
  addDataToTable();
};

// Function that will submit a post request modifying a person from the list in the server
const submitEdit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault();

  // Takes the first and last name of the person as well as their age
  const input = document.querySelectorAll( "#idEdit, #titleEdit, #authorEdit, #pagenumEdit, #datereadEdit" ),
        genreSelect = getGenre('genreEdit')
        json = { id: input[0].value, bookTitle: input[1].value, author: input[2].value, genre: genreSelect, pageCount: input[3].value, dateCompleted: input[4].value },
        body = JSON.stringify( json );

  // Makes the post request with the body data
  const response = await fetch( "/submitEdit", {
    method:"POST",
    body 
  })

  // Resets the forms to clear the values and then refreshes the table data to reflect changes
  const text = await response.text();
  document.getElementById("formThree").reset();

  addDataToTable();

};


// Adds the onclick functionality to all buttons on the site and the respective function
// calls once the buttons are clicked as well as builds the table displaying the people data

window.onload = function() {
    // Retrieves the button for adding people and directs its onclick functionality to the submitAdd function
    const buttonAdd = document.querySelector("#buttonAdd");
    buttonAdd.onclick = submitAdd;

    // Retrieves the button for deleting people and directs its onclick functionality to the submitRemove function
    const buttonRemove = document.querySelector("#buttonRemove");
    buttonRemove.onclick = submitRemove;

    // Retrieves the button for modifying people and directs its onclick functionality to the submitEdit function
    const buttonEdit = document.querySelector("#buttonEdit");
    buttonEdit.onclick = submitEdit;

    // Retireves the people table itself for building the table with the list from the server

    addDataToTable();
};

// Function that retrieves the people data from the server and uses for loops
// to build an HTML table's rows out with said data
async function addDataToTable(table){
  table = document.querySelector("#booksTable");
  table.innerHTML = "";

  let booksRead = await getBooks();
  let columnNames = ["ID", "Book Title", "Author", "Genre", "Page Count", "Date Completed", "Username"]
  let tableHead = table.createTHead();
  let row = tableHead.insertRow();

  // For each person in the list, it builds out a row with that entry
  for (let book of booksRead){
    let row = table.insertRow();
    row.setAttribute("scope", "row")

    for (const property in book) {
      let data = row.insertCell();
      let content = document.createTextNode(book[property]);
      data.appendChild(content);
    }
  }

  // Adds the table headers (column names)
  for (let name of columnNames){
    let th = document.createElement("th");
    let cName = document.createTextNode(name);
    th.setAttribute("scope","col")
    th.appendChild(cName);
    row.appendChild(th);
  }
};

