/*
 * A function that sends a POST request to the server with the part entry to add to appdata
 * if the part with part_name exists, modify the entry instead of adding a new entry
 */
const add = async function(event){
  event.preventDefault()
  
  const input = document.querySelectorAll("#add_part, #add_material, #add_quantity, #add_weight"),
        json = {part_name: input.item(0).value, new_material: input.item(1).value, new_quantity: input.item(2).value,
        weight_per_unit: input.item(3).value},
        body = JSON.stringify(json)

    fetch( '/add', {
    method:'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body
  })
  .then( response => response.json() )
  .then( json => {
      console.log( json )
      constructTable()
    })
};

/* Placeholder modify until I can combine them? */
const modify = async function(event){
  event.preventDefault()
  
  const input = document.querySelectorAll("#modify_part, #modify_material, #modify_quantity, #modify_weight"),
        json = {part_name: input.item(0).value, new_material: input.item(1).value, new_quantity: input.item(2).value,
        weight_per_unit: input.item(3).value},
        body = JSON.stringify(json)

    fetch( '/modify', {
    method:'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body
  })
  .then( response => response.json() )
  .then( json => {
      console.log( json )
      constructTable()
    })
};

/*
 * A function that sends a POST request to the server with the part to remove from appdata
 * identified by the Part Name input field (part_name)
 */
const remove = async function(event){
  event.preventDefault()

  const input = document.querySelector("#remove_part"),
        json = {part_name: input.value},
        body = JSON.stringify(json)

    fetch( '/remove', {
    method:'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body
  })
  .then( response => response.json() )
  .then( json => { 
      console.log( json ) 
      constructTable()
    })
};

/*
 * A function that sends a POST request to the server with the part to remove from appdata
 * identified by the Part Name input field (part_name)
 */
const login = async function(event){
  event.preventDefault()
  
  const input = document.querySelectorAll("#check_username, #check_password"),
        json = {username: input.item(0).value, password: input.item(1).value},
        body = JSON.stringify(json)

   const response = await fetch( '/login', {
    method:'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body
  })
  
  const result = await response.json()
      console.log( result ) 
      if(result.length == 0){
        console.log("Incorrect password")
        displayError()
      }else if (result.acknowledged == true){
        console.log("Creating new user")
        await displayNewLogin()
        window.location.assign('https://a3-briannasahagian.glitch.me/data.html')
      }else{
        console.log("Signing in")
        window.location.assign('https://a3-briannasahagian.glitch.me/data.html')
      }
    };


const displayNewLogin = async function(event){
  var login_message = document.getElementById("message")
  login_message.innerHTML = "<div class = text-success>New User</div>"
  return new Promise(r => setTimeout(r, 2000))
}

const displayError = async function(event){
  var login_message = document.getElementById("message")
  login_message.innerHTML = "<div class = text-danger>Incorrect Password</div>"
}
/*
 * A function that sends a GET request to the server for the appdata array
 * in order to pass the current content of the array (and in turn the server) to the client
 * @return: The parsed response from the server containing the array data
 */
const receive = async function() {
  const response = await fetch( '/receive', {method:'GET'})
  const entries = await response.text()
  console.log("Fetched Table:", entries)
  return JSON.parse(entries)
}

/* A function that rebuilds the table content from the received appdata array */
const constructTable = async function() {
  entries = await receive()
  console.log(entries)
  htmlString = ""

  for(let i = 0; i < entries.length; i++){
    row = "<tr><td>" +  entries[i].part_name + "</td><td>" + entries[i].new_material + "</td><td>" + entries[i].new_quantity + "</td><td>" + entries[i].weight + "</td></tr>"
    htmlString += row
  }

  table_body = document.getElementById("table_body")
  table_body.innerHTML = htmlString
}

/* 
 * A function that runs everytime the window is loaded (navigating to page or refreshing)
 * Supports the add() and remove() POST request functions
 * Supports the receive() GET request function indirectly through constructTable()
 */
window.onload = function() {
  if(window.location.href === 'https://a3-briannasahagian.glitch.me/data.html'){
    const add_button = document.getElementById("add_button");
    const remove_button = document.getElementById("remove_button");
    const modify_button = document.getElementById("modify_button");
    add_button.onclick = add;
    remove_button.onclick = remove;
    modify_button.onclick = modify;
    constructTable()
  }else{
    const login_button = document.getElementById("login_button");
    login_button.onclick = login;
  }
}