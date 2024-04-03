// FRONT-END (CLIENT) JAVASCRIPT HERE

const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  const name = document.querySelector( "#yourname" ),
        bday = document.querySelector( "#yourbday" ),
        cake = document.querySelector( "#yourcake" ),
        gift = document.querySelector('input[name="yourgift"]:checked'),
        json = { name: name.value, birthday: bday.value, preferredCake: cake.value, gift: gift.value},
        body = JSON.stringify( json )

  const response = await fetch( "/submit", {
    method:"POST",
    headers: {
      "Content-Type": 'application/json'
    },
    body 
  })
  const text = await response.text()
  console.log(text)
  emptyForms()
  loadData()
}



/**
 * function to get app data from server
 */
async function loadData() {
 
  const response = await fetch( "/docs", {
    method:"GET"
  })
  const text = await response.text()
  console.log("loaded data")

  // if data is sent back fill table with data
  fillTable(text);
}



/**
 * function to empty submit and update forms
 */
async function emptyForms() {
  const sname = document.querySelector( "#yourname" ),
        sbday = document.querySelector( "#yourbday" ),
        scake = document.querySelector( "#yourcake" ),
        sgift = document.querySelector('input[name="yourgift"]:checked')

  sname.value = ''
  sbday.value = ''
  scake.value = ''
  if(sgift) {
    sgift.checked = false
  }

  const _id = document.querySelector( "#_id" ),
        uname = document.querySelector( "#name" ),
        uage = document.querySelector( "#age" ),
        ubday = document.querySelector( "#bday" ),
        ucake = document.querySelector( "#cake" ),
        ugift = document.querySelector('input[name="gift"]:checked')

  _id.value = ''
  uname.value = ''
  uage.value = ''
  ubday.value = ''
  ucake.value = ''
  if(ugift) {
    ugift.checked = false
  }
}



/**
 * function to fill table with data
 * @param {*} text the app data sent from server in string form
 */
async function fillTable(text) {

  // get table and empty it
  var table = document.querySelector(" #datatable ");
  table.innerHTML = '';

  // parse data
  const data = JSON.parse(text);

  // iterate over each entry and add a new table row for each entry, new table cell for each attribute
  for(const elt of data) {

    var row = table.insertRow();
    var _idcell = row.insertCell();
    _idcell.id = "_idcell";
    var namecell = row.insertCell();
    namecell.id = "namecell";
    var agecell = row.insertCell();
    agecell.id = "agecell";
    var bdaycell = row.insertCell();
    bdaycell.id = "bdaycell";
    var cakecell = row.insertCell();
    cakecell.id = "cakecell";
    var giftcell = row.insertCell();
    giftcell.id = "giftcell";

    // for each entry add a delete button for that entry
    var del = document.createElement('button');
    del.type = "button";
    del.innerHTML = "delete";

    // set onclick event to call delete function
    del.onclick = (function(elt) {return function() {delEntry(elt);}})(elt);

    // add new elements and set their values
    row.appendChild(del);

    _idcell.innerHTML = elt._id;
    namecell.innerHTML = elt.name;
    agecell.innerHTML = elt.age;
    bdaycell.innerHTML = elt.birthday;
    cakecell.innerHTML = elt.preferredCake;
    giftcell.innerHTML = elt.gift;

    // set on click for each id cell to call fill entry function
    _idcell.onclick = (function(elt) {return function() {fillEntry(elt);}})(elt);
  }
}



/**
 * function to delete an entry from app data
 * @param {*} elt the entry to delete
 */
const delEntry = async function(elt) {

  // get the id to delete, add it to request, and make delete request to server
  const _id = elt._id,
        json = { "_id": _id },
        body = JSON.stringify( json )

  const response = await fetch( "/delete", {
    method:"DELETE",
    headers: {
      "Content-Type": 'application/json'
    },
    body 
  })

  // get server response and reload updated data
  const text = await response.text()
  console.log(text)
  emptyForms()
  loadData()
}



/**
 * function to fill the update form with an entry
 * @param {*} elt the entry to fill into the update form
 */
const fillEntry = async function(elt) {

  // get the html elements of the form
  const _id = document.querySelector( "#_id" ),
        name = document.querySelector( "#name" ),
        age = document.querySelector( "#age" ),
        bday = document.querySelector( "#bday" ),
        cake = document.querySelector( "#cake" ),
        gift = document.getElementsByName("gift")

  // update the element values to the selected entry values
  _id.value = elt._id
  name.value = elt.name
  age.value = elt.age
  bday.value = elt.birthday
  cake.value = elt.preferredCake
  for(let i = 0; i < gift.length; i++) {
    if(gift[i].value == elt.gift) {
      gift[i].checked = true
    }
  }
}



/**
 * function to udpate an entry in app data
 * @param {*} event 
 */
const updateEntry = async function( event ) {

  // don't allow enter to reload page
  event.preventDefault();

  // get the html elements of the update form, then create a new object and stringify it
  const _id = document.querySelector( "#_id" ),
        name = document.querySelector( "#name" ),
        bday = document.querySelector( "#bday" ),
        cake = document.querySelector( "#cake" ),
        gift = document.querySelector('input[name="gift"]:checked'),
        json = { _id: _id.value, name: name.value, birthday: bday.value, preferredCake: cake.value, gift: gift.value},
        body = JSON.stringify( json )

  // send string as a PATCH request to server
  const response = await fetch( "/update", {
    method:"PATCH",
    headers: {
      "Content-Type": 'application/json'
    },
    body 
  })

  // get reponse from server and reload updated data
  const text = await response.text()
  console.log(text)
  emptyForms()
  loadData()
}



function handleEnter(e) {
  if(e.keyCode) {
    if(e.keyCode == '13') {
      togglePopup();
    }
  }
}



function togglePopup() {
  var popup = document.getElementById("pageinfo");
  popup.classList.toggle("show");
  var link = document.getElementById("popuplink");
  link.classList.toggle("underline");
}



// on window load, set submit and update button onclick events, then load the app data
window.onload = function() {
  const submitBtn = document.querySelector("button#submit");
  submitBtn.onclick = submit;
  const updateBtn = document.querySelector("button#update");
  updateBtn.onclick = updateEntry;
  loadData();
}