// FRONT-END (CLIENT) JAVASCRIPT HERE

//Submit an anagram
const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  const input = document.querySelector( "#string" ),
        dropdown = document.querySelector("#dropdown"),
        json = { type:"anagram",string: input.value, dict:dropdown.value },
        body = JSON.stringify( json );

  console.log(dropdown.value);
  //Asynchronous network request
  const response = await fetch( "/submit", {
    method:"POST",
    headers: { 'Content-Type': 'application/json' },
    body 
  });

  const res = await response.json();
  console.log(res);
  res.elements = addRow([res.string,res.gram0,res.gram1,res.gram2,res.gram3],res.id);
  localAppData.push(res);
}

//Find an entry by ID
function getLocalAppDataEntry(id){
  for(var i = 0; i < localAppData.length; i++){
    if(localAppData[i]._id===id){
      return {index:i,entry:localAppData[i]};
    }
  }
  return undefined;
}

//Remove an entry both from the server and HTML
const remove = async function(event,index){
  event.preventDefault();
  const response = await fetch("/submit",{
    method:"POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type:"remove",
      index:index
    })
  });
  //Just in case of errors, confirm with the server before removing from the client.
  const res = await response.json();
  console.log("Remove Received");
  console.log(res);
  if(res.deletedCount>0){
    console.log(localAppData);
    let searchResult = getLocalAppDataEntry(index);
    console.log(searchResult);
    if(searchResult !== undefined){
      for(let i = 0; i < searchResult.entry.elements.length; i++){
        searchResult.entry.elements[i].remove();
      }
      localAppData.splice(searchResult.index,1);
    }
  }
}


const submitButton = document.querySelector("#submit");
const table = document.querySelector("#table");
var localAppData = [];

//Call to fully sync with the server.
const updateAllData = async function(){
  const response = await fetch("/submit",{
    method:"POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type:"getAll"
    })
  });
  const res = await response.json();
  console.log(res);
  for(let i = table.children.length-1; i >= 7; i--){
    table.children[i].remove();
  }
  localAppData = [];
  for(let i = 0; i < res.length; i++){
    let item = res[i];
    let elements = addRow([item.string,item.dict,item.gram0,item.gram1,item.gram2,item.gram3],item._id);
    //Save where the HTML element is stored for removal later.
    item.elements=elements;
    localAppData.push(item);
  }
}

//Add a new set of anagrams to the rows. This just updates the HTML, localAppData needs separate updating.
function addRow(anagrams, index){
  // For accessing element to delete by index
  var newElements = [];
  for(let i = 0; i < anagrams.length; i++){
    let anagramEntry = document.createElement('span');
    anagramEntry.innerHTML=anagrams[i];
    table.appendChild(anagramEntry);
    newElements.push(anagramEntry);
  }
  let lastColumn = document.createElement('span');
  let deleteButton = document.createElement('button');
  // deleteButton.innerHTML = "Remove";
  deleteButton.setAttribute('class','delete');
  deleteButton.onclick = (event)=>{remove(event,index)};
  lastColumn.appendChild(deleteButton);
  table.appendChild(lastColumn);
  newElements.push(lastColumn);
  return newElements;
}

//Pull from the server as soon as the page is loaded.
updateAllData();
//Refresh the data every 10 seconds.
setInterval(updateAllData,10000);