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

  console.log("DROPDOWN",dropdown.value);
  //Asynchronous network request
  const response = await fetch( "/submit", {
    method:"POST",
    headers: { 'Content-Type': 'application/json' },
    body 
  });

  const res = await response.json();
  // console.log(res);
  res.elements = addRow([res.string,res.dict,res.gram0,res.gram1,res.gram2,res.gram3],res.id);
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

const refresh = async function(event, index){
  event.preventDefault();
  const response = await fetch("/submit",{
    method:"POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type:"refresh",
      index:index,
    })
  });
  const res = await response.json();
  let searchResult = getLocalAppDataEntry(index);
  if(searchResult !== undefined){
    for(let i = 2; i < 6; i++){
      searchResult.entry.elements[0].children[i].innerHTML = res.anagrams[i-2];
    }
    localAppData[searchResult.index].gram0 = res.anagrams[0];
    localAppData[searchResult.index].gram1 = res.anagrams[1];
    localAppData[searchResult.index].gram2 = res.anagrams[2];
    localAppData[searchResult.index].gram3 = res.anagrams[3];
  }
}


const submitButton = document.querySelector("#submit");
submitButton.onclick=submit;
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
  // for(let i = table.children.length-1; i >= 8; i--){
  //   table.children[i].remove();
  // }
  for(let i = table.children[1].children.length-1; i >= 0; i--){
    table.children[1].children[i].remove();
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
  let newRow = document.createElement("tr");
  newRow.setAttribute('scope','row');
  // var newElements = [];
  for(let i = 0; i < anagrams.length; i++){
    let anagramEntry = document.createElement('td');
    anagramEntry.innerHTML=anagrams[i];
    newRow.appendChild(anagramEntry);
    // newElements.push(anagramEntry);
  }
  let penultimateColumn = document.createElement('td');
  let deleteButton = document.createElement('button');
  deleteButton.setAttribute('aria-label','delete');
  // deleteButton.innerHTML = "Remove";
  deleteButton.setAttribute('class','delete');
  deleteButton.onclick = (event)=>{remove(event,index)};
  penultimateColumn.appendChild(deleteButton);
  newRow.appendChild(penultimateColumn);
  // newElements.push(penultimateColumn);
  let lastColumn = document.createElement('td');
  let refreshButton = document.createElement('button');
  // deleteButton.innerHTML = "Remove";
  refreshButton.setAttribute('class','refresh');
  deleteButton.setAttribute('aria-label','refresh');
  refreshButton.onclick = (event)=>{refresh(event,index)};
  lastColumn.appendChild(refreshButton);
  newRow.appendChild(lastColumn);
  table.children[1].appendChild(newRow);
  // newElements.push(lastColumn);
  
  return [newRow];
}

//Pull from the server as soon as the page is loaded.
updateAllData();
//Refresh the data every 10 seconds.
setInterval(updateAllData,10000);