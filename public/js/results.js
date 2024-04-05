const returnHome = async function(event ){
    //Change page bttn, should write to recieve url string
    const response = await fetch( "/html/home.html", {
      method:"GET",
    }).then(response => window.location.href = response.url).then(response => console.log(response.url))
  } 
  function editRow(button) {
    let row = button.parentNode.parentNode;
    let cells = row.getElementsByTagName("td");
    let name = cells[1].innerText;
    let breakfast = cells[2].innerText;
    let coffee = cells[3].innerText;

    //Replace the cell content with input fields for editing
    cells[1].innerHTML = '<input type="text" value="' + name + '">';
    cells[2].innerHTML = '<input type="text" value="' + breakfast + '">';
    cells[3].innerHTML = '<input type="text" value="' + coffee + '">';

    
    let editButton = row.querySelector("button");
    editButton.innerText = "Save";
    editButton.onclick = function() {
        saveRow(this);
    };
}

async function saveRow(button) {
  let row = button.parentNode.parentNode;
  let cells = row.getElementsByTagName("td");
  let newName = cells[1].querySelector("input").value;
  let newBreakfast = cells[2].querySelector("input").value;
  let newCoffee = cells[3].querySelector("input").value;

  // update the table cell content with the new values
  cells[1].innerHTML = newName;
  cells[2].innerHTML = newBreakfast;
  cells[3].innerHTML = newCoffee;

  let editButton = row.querySelector("button");
  editButton.innerText = "Edit";
  editButton.onclick = function() {
      editRow(this);
  };

  body = JSON.stringify({_id: cells[0].innerText, yourname: cells[1].innerText, breakfast: cells[2].innerText, coffee:cells[3].innerText})

  const response = await fetch( "/edit", {
    method:"POST",
    body: body
  }).then(response => response.json()).then(function(json){
    cells[4].innerHTML = json.data;
  }
  )

}

const remove = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  const input = document.querySelector( "#yourname" ),

        json = { username: localStorage.getItem("userName"),
          yourname: input.value,
          breakfast: parseInt(localStorage.getItem("Breakfast")),
          coffee: parseInt(localStorage.getItem("Coffee")),

        },
        body = JSON.stringify( json ) //turns to string and put through the network

  const response = await fetch( "/submit", {
    method:"POST",
    body 
  }).then(response => response.json()).then(function(json) {
    console.log(json)
  })


  let orderForm = document.getElementById("order");

  orderForm.remove();
}

async function deleteRow(button){
  let row = button.parentNode.parentNode;
  let cells = row.getElementsByTagName("td");
  body = JSON.stringify({_id:cells[0].innerHTML,})

  const response = await fetch( "/delete", {
    method:"POST",
    body: body
  }).then(row.parentNode.removeChild(row))
}


  window.onload = async function(){
    //the table will be filled in here

    body = JSON.stringify({username: localStorage.getItem('userName')})
    const response = await fetch( "/data", {
      method:"POST",
      body
    }).then(response => response.json()).then(function(json) {
      let tableBody = document.getElementById("Orders");
      console.log(json);
      let data = JSON.parse(json.data)
      for(index = 0; index < data.length; index++){
        
        let newRow = document.createElement("tr");
        let mem = data[index];

      
        // Fill the data
        newRow.innerHTML = `
          <td>${mem._id}</td>
          <td>${mem.yourname}</td>
          <td>${mem.breakfast}</td>
          <td>${mem.coffee}</td>
          <td>$${mem.cost}</td>
          <td><button onclick="editRow(this)">Edit</button></td>
          <td><button onclick="deleteRow(this)">Delete</button></td>`;

      
        // Append the row to the table body
        tableBody.appendChild(newRow);
      }
    })
  }