// FRONT-END (CLIENT) JAVASCRIPT HERE

const submit = function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()

  const title = document.getElementById("title").value
  const author = document.getElementById("author").value
  const totalPages = document.getElementById("totalPages").value
  const currentPage = document.getElementById("currentPage").value

  //exit func if inputs are not valid
  if (!validateInputs()){
    return  
  }

  const json = {
    title: title,
    author: author,
    totalPages: totalPages,
    currentPage: currentPage
  };

  const body = JSON.stringify(json)

  fetch( "/submit", {
    method:"POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body 
  })
    .then(function(response){
      addRow()
      clearForm()
    })
    

  //const text = await response.text()
  //console.log( "text:", text)
}

//adds json object to table as a new row
function addRow(){
  const table = document.getElementById("bookTable")

  table.innerHTML =
    "<tr><th>Title</th><th>Author</th><th>Total Pages</th><th>Current Page</th><th>Pages Left</th><th>Delete?</th></tr>";
  fetch("/getResponses", {
    method: "GET",
  })
    .then((response) => response.json())
    .then(function (json) {
      let index = 0;
      for (let response of json) {
        
        //create row
        response.responseNum = index;
        let row = table.insertRow(-1)
        let title = row.insertCell(0)
        let author = row.insertCell(1)
        let totalPages = row.insertCell(2)
        let currentPage = row.insertCell(3)
        let pagesLeft = row.insertCell(4)
        let deleteButton = row.insertCell(5)
        
        //fill cells with values
        title.innerHTML = response.title
        author.innerHTML = response.author
        totalPages.innerHTML = response.totalPages
        currentPage.innerHTML = response.currentPage
        pagesLeft.innerHTML = response.pagesLeft
        deleteButton.innerHTML = `<button id='deleteButton' class="rounded-box" onclick=deleteRow(${index})>Delete</button>`

        index++;
      }})
}

//checks to see if all form inputs are valid
function validateInputs(){
  const title = document.getElementById("title").value.trim()
  const author = document.getElementById("author").value.trim()
  const totalPages = document.getElementById("totalPages").value.trim()
  const currentPage = document.getElementById("currentPage").value.trim()

  //check if any field is empty
  if (title === '' || author === '' || totalPages === '' || currentPage === '') {
    alert("All fields are required.")
    return false
  }

  //check if totalPages and currentPage are integers
  if (!Number.isInteger(Number(totalPages)) || !Number.isInteger(Number(currentPage))) {
    alert("Total Pages and Current Page must be integers.")
    return false
  }

  //check that current page is less than total pages
  if (Number(currentPage) > Number(totalPages)){
    alert("Current Page must be less than Total Pages.")
    return false
  }

  return true
}

//clears the form once the form is submitted
function clearForm() {
  document.getElementById("title").value = ""
  document.getElementById("author").value = ""
  document.getElementById("totalPages").value = ""
  document.getElementById("currentPage").value = ""
}

//deletes a row based on the index number
function deleteRow(index){
  const json = {
    deletingResponse: index
  }

  const body = JSON.stringify(json)

  fetch("/delete", {
    method:"POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body
  })
    .then(function(){
      addRow()
    })
}


window.onload = function() {
  const button = document.querySelector("button")
  button.onclick = submit
  addRow()
}