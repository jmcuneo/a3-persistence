/*
 * A function that sends a POST request to the server with the part entry to add to the database
 * The request fields include part_name, material, quantity, weight_per_unit, and the robot_type (Antweight or Beetleweight),
 * where material and robot_type are limited by the presented options
 */
const add = async function(event){
  event.preventDefault()
  
  const input = document.querySelectorAll("#add_part, #add_material, #add_quantity, #add_weight, input[name = robot_type]:checked"),
        json = {part_name: input.item(0).value, new_material: input.item(1).value, new_quantity: input.item(2).value,
        weight_per_unit: input.item(3).value, robot_type: input.item(4).value},
        body = JSON.stringify(json)

    fetch( '/add', {
    method:'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body
  })
  .then( response => response.json() )
  .then( json => {
      console.log( json )
      constructTable("Antweight", "table_body_ant")
      constructTable("Beetleweight", "table_body_beetle")
    })
};

/*
 * A function that sends a POST request to the server with the part entry to modify within the database
 * The request fields include part_name, material, quantity, weight_per_unit, and the robot_type (Antweight or Beetleweight),
 * where material and robot_type are limited by the presented options
 */
const modify = async function(event){
  event.preventDefault()
  
  const input = document.querySelectorAll("#add_part, #add_material, #add_quantity, #add_weight, input[name = robot_type]:checked"),
        json = {part_name: input.item(0).value, new_material: input.item(1).value, new_quantity: input.item(2).value,
        weight_per_unit: input.item(3).value, robot_type: input.item(4).value},
        body = JSON.stringify(json)

    fetch( '/modify', {
    method:'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body
  })
  .then( response => response.json() )
  .then( json => {
      console.log( json )
      constructTable("Antweight", "table_body_ant")
      constructTable("Beetleweight", "table_body_beetle")
    })
};

/*
 * A function that sends a POST request to the server with the part entry to remove from the database
 * identified by the part_name input field
 */
const remove = async function(event){
  event.preventDefault()

  const input = document.querySelectorAll("#remove_part, input[name = r_robot_type]:checked"),
        json = {part_name: input.item(0).value, robot_type: input.item(1).value},
        body = JSON.stringify(json)

    fetch( '/remove', {
    method:'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body
  })
  .then( response => response.json() )
  .then( json => { 
      console.log( json ) 
      constructTable("Antweight", "table_body_ant")
      constructTable("Beetleweight", "table_body_beetle")
    })
};

/*
 * A function that sends a GET request to the server for the table data in array format
 * in order to pass the current content of the array (and in turn the server) to the client
 * @return: The parsed response from the server containing the array data
 */
const receive = async function() {
  const response = await fetch( '/receive', {method:'GET'})
  const entries = await response.text()
  console.log("Fetched Table:", entries)
  return JSON.parse(entries)
}

/* A function that rebuilds the table content from the received array of part entries
 * @param: The robot_type to filter the data by (to create either Antweight or Beetleweight table)
 * @param: The id of the table to populate (table_body_ant or table_body_beetle)
*/
const constructTable = async function(robot_type, id) {
  var entries = await receive()
  console.log(entries)
  var htmlString = ""

  for(let i = 0; i < entries.length; i++){
    if(entries[i].robot_type === robot_type){
      var row = "<tr><td>" +  entries[i].part_name + "</td><td>" + entries[i].new_material + "</td><td>" + entries[i].new_quantity + "</td><td>" + entries[i].weight + "</td></tr>"
      htmlString += row
    }
  }

  var table_body = document.getElementById(id)
  table_body.innerHTML = htmlString
}

/* 
 * A function that runs everytime the window is loaded (navigating to page or refreshing)
 * Supports the add(), modify() and remove() POST request functions
 * Supports the receive() GET request function indirectly through constructTable() calls for both tables
 */
window.onload = function() {
    const add_button = document.getElementById("add_button");
    const remove_button = document.getElementById("remove_button");
    const modify_button = document.getElementById("modify_button");
    add_button.onclick = add;
    remove_button.onclick = remove;
    modify_button.onclick = modify;
    constructTable("Antweight", "table_body_ant")
    constructTable("Beetleweight", "table_body_beetle")
}