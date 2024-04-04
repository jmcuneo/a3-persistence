// FRONT-END (CLIENT) JAVASCRIPT HERE
const prefix = "fas fa-"

window.onload = function() {   
  setUsername()
  getItemPool()
  getUserItems()
  newUser()
  radioButtonEvents()
  
  const btnCalculateValue = document.getElementById("calculate-value");
  btnCalculateValue.onclick = calculateValue;
  const gridIconPool = document.getElementById('item-pool');
  gridIconPool.onclick = addIcon;
  const gridInventory = document.getElementById('inventory');
  gridInventory.onclick = delIcon;
  const btnAddItem = document.getElementById('add-item');
  btnAddItem.onclick  = addOrModItem;
  const btnDelItem = document.getElementById('del-item');
  btnDelItem.onclick = delItem;  
}

async function radioButtonEvents(){
  const radioButtons = document.querySelectorAll('input[name="inventory-slots"]');
  radioButtons.forEach(function(radioButton) {
  radioButton.addEventListener("change", function(event) {
    changeNumSlots(event.target.nextElementSibling.textContent);
    });
  });
  
  const containerDiv = document.getElementById('number-of-inventory-slots');
  const labels = containerDiv.querySelectorAll('label');
  labels.forEach(function(label) {
    label.setAttribute("tabindex", "0");
    label.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        const value = label.querySelector('span').textContent;
        changeNumSlots(value);      
      }
    });
  });
};

function findAvailableSlots(){
  const inventory = document.getElementById("inventory");
  const inventorySlots = inventory.querySelectorAll(".inventory-slot");
  let result = [];
  
  for (let slot of inventorySlots) {
    if (slot.children.length === 0) {
      result.push(slot);
    }
  }
  return result;
}

async function changeNumSlots(value)
{
  const inventory = document.getElementById("inventory")
  const numOfCurrentSlots = inventory.querySelectorAll('.inventory-slot').length;
  const difference = value - numOfCurrentSlots
  let emptySlotDivs
  if(difference < 0){
    emptySlotDivs = findAvailableSlots();
    const numEmptySlots = emptySlotDivs.length;
    
    if(numEmptySlots < Math.abs(difference)){
        alert("Inventory too full to remove this number of slots. Please remove some items from inventory first")
        return;
    }
  }
    
  const response = await fetch("/changeNumSlots",{
  method: "POST",
  headers: {"Content-Type": "application/json"},
  body: JSON.stringify({ numSlots: value })});

  if (response.ok) {
    if(difference < 0){
      for(let i=0; i < Math.abs(difference); i++)
        emptySlotDivs[i].remove();
    }
    else
      for(let i=0; i < difference; i++){
        const inventorySlot = document.createElement("div");
        inventorySlot.className = "inventory-slot"
        inventory.appendChild(inventorySlot)
      }
  }
  else 
    console.error("Error:", response.statusText);
  revealResults()
}

async function newUser(){
  try{
    const response = await fetch("/newUser")
    const isNewUser = await response.json()
    
    if(!response.ok)
      throw new Error("Failed to check if new user")   
    
    if(isNewUser)
      alert("New User Registered. Welcome!")
  }
  catch(error){console.error("Error:", error.message);}
}

function removePrefix(string){
  string = string.substring(prefix.length);
  return string
}

async function getUserItems() {
  try {
    const response = await fetch("/getInventory")
    const data = await response.json();
    const inventory = document.getElementById("inventory")

    if (!response.ok) 
      throw new Error("Failed to fetch results");

    for(let i = 0; i < data.inventorySlots; i++){
      const inventorySlot = document.createElement("div");
      inventorySlot.className = "inventory-slot"
      inventory.appendChild(inventorySlot)
    }
    
    for(const item of data.inventory)
      createIcon(item.itemName, "inventory")
  }
  catch(error) {console.error("Error:", error.message);}
}

async function getItemPool(){
  try {   
    const itemPool = document.getElementById("item-pool");
    const response = await fetch("/getItemPool")
    
    if (!response.ok) 
      throw new Error("Failed to fetch results");
        
    const data = await response.json();
    for(const item of data){
      createIcon(item.itemName, "item-pool")
    }
  }
  catch (error) {console.error("Error:", error.message);}
}

async function setUsername(){
  try {
    const response = await fetch('/userdata');
    if (!response.ok)
      throw new Error(`Failed to fetch user data: ${response.status}`);
    
    const userData = await response.json();
    const text = document.getElementById('username')
    const text2 = document.getElementById('backend-data')
    
    text.innerText = text.innerText.replace('{{USERNAME}}', userData.githubProfile.username)
    text2.innerText = text2.innerText.replace('{{USERNAME}}', userData.githubProfile.username)
    userData.githubProfile.username
  } 
  catch (error) {console.error('Error fetching user data:', error);}
}

const calculateValue = async function( event )
{
  try {    
    const response = await fetch("/getResults")
    
    if (!response.ok)
      throw new Error("Failed to fetch results");
    
    const btnCalculateValue = document.getElementById("calculate-value");    
    const data = await response.json();
    const invValue = document.getElementById("inventory-value");
    const invWeight = document.getElementById("inventory-weight");
    
    let totalValue = 0
    let totalWeight = 0
    for(let i = 0; i < data.inventory.length; i++){
      totalValue += parseInt(data.inventory[i].value)
      totalWeight += parseInt(data.inventory[i].weight)
    }
    invValue.innerText = "Inventory Value: " + totalValue
    invWeight.innerText = "Inventory Weight: " + totalWeight
    invValue.style.display = "";
    invWeight.style.display = "";
    
    btnCalculateValue.innerText = "Re-calculate Value"
  }
  catch (error) {console.error("Error:", error.message);}
}

const revealResults = async function(){
  try {    
    const response = await fetch("/getResults")
    
    if (!response.ok) 
      throw new Error("Failed to fetch results");
    
    const data = await response.json();
    const results = document.getElementById("results");
    const resultsText = document.getElementById("results-text");
    
    const username = data.githubProfile.username
    const id = data.githubProfile.id
    const inventory = data.inventory
    const inventorySlots = data.inventorySlots
    
    let itemList = ""
    for(let i = 0; i < inventory.length; i++)
      itemList += "ItemName: " + inventory[i].itemName + " Value: " + inventory[i].value +" Weight: " + inventory[i].weight + "<br>" 
    const dataString = "Username: "+ username + "<br>" + "ID: " + id + "<br>" + "Inventory: " + "<br>" + itemList + "<br>" + "inventorySlots: " + inventorySlots
    resultsText.innerHTML = (dataString)
    results.style.display = "";
  }
  catch (error) {console.error("Error:", error.message);}
}

const addIcon = async function( event ){
  event.preventDefault()
  const icon = event.target
  const iconWrapper = icon.parentElement
  let iconName = iconWrapper.getAttribute("name")
  
  iconName = removePrefix(iconName)
  
  let availableSlot = findAvailableSlot() 
  if(availableSlot === false)
    return;
  
  const response = await fetch("/addIcon",{
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ addIcon: iconName })});

  if (response.ok) {
    iconWrapper.remove();
    availableSlot.appendChild(iconWrapper);
      revealResults();
  }
  else 
    console.error("Error:", response.statusText);
}

const delIcon = async function( event ){
  event.preventDefault()
  const icon = event.target
  const iconWrapper = icon.parentElement
  let iconName = iconWrapper.getAttribute("name")

  if(iconName === null)
    return;
  
  iconName = removePrefix(iconName)  
  const response = await fetch("/delIcon",{
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ delIcon: iconName })});

  if (response.ok) {
    iconWrapper.remove();
    let itemPool = document.getElementById("item-pool");
    itemPool.appendChild(iconWrapper);
    revealResults();
  } 
  else 
    console.error("Error:", response.statusText);
}

function verifyTextBox(iconName)
{
  if (iconName == ""){
    alert("Please type an object (Ex. <fish>)");
    return false;
  }
  return true;
}

function getInventoryItems() {
  const results = []
  const inventory = document.getElementById("inventory")
  
  const iconElements = inventory.querySelectorAll(`[class*="${prefix}"]`);

  for (const element of iconElements)   //Convert NodeList to array
      results.push(element.className)
  
  return results
}

function createIcon(iconName, location) {
  const icon = document.createElement("i");
  const iconDiv = document.createElement("div");
  const button = document.createElement("button");
  const br = document.createElement('br')
  
  icon.className = prefix + iconName;
  iconDiv.setAttribute("name", prefix + iconName);
  button.className = "icon-btn";
  button.name = iconName
  button.textContent = iconName; // Set the button text to iconName
  
  iconDiv.appendChild(icon);
  iconDiv.appendChild(br);
  iconDiv.appendChild(button);
  
  let iconLocation
  if(location === "inventory")
    iconLocation = findAvailableSlot() 
  else
    iconLocation = document.getElementById(location);
  iconLocation.appendChild(iconDiv);
}

async function displayNewData( itemName ) {
  try {    
    const response = await fetch(`/getResult?itemName=${itemName}`)
    
    if (!response.ok) 
      throw new Error("Failed to fetch results");
        
    const data = await response.json();
    const lblResult = document.getElementById("lbl-result");
    lblResult.innerText = JSON.stringify(data);    
  }
  catch (error) {console.error("Error:", error.message);}
}

const addOrModItem = async function( event ){
  event.preventDefault();
  const txt = document.getElementById("item-name");
  const iconName = (txt.value).toLowerCase();
  
  if (!verifyTextBox(iconName))
    return;
      
  let value
  let weight;
  while(!/^\d+$/.test(value)){
    value = prompt("Please enter an integer for the object's value")
    if(value === null)
        return          
  }
  while(!/^\d+$/.test(weight)){
    weight = prompt("Please enter an integer for the object's weight")
    if(weight === null)
      return
  }
  
  const response = await fetch("/addOrModItem",{
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ itemName: iconName , value: value, weight: weight })});
  
  if (response.ok){
    if(!itemInPool(iconName) && !itemInInventory(iconName))
      createIcon(iconName, "item-pool")
    displayNewData(iconName)
    revealResults();
  }
  else 
    console.error("Error:", response.statusText);
  txt.value = "";
}

const delItem = async function( event ){
  event.preventDefault() 
  const txt = document.getElementById('item-name');
  const iconName = (txt.value).toLowerCase();
  
  if (!verifyTextBox(iconName))
    return;

  const response = await fetch("/delItem",{
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ delItem: iconName})});
  try{
    if (response.ok){
      const itemPool = document.getElementById('item-pool')
      const wrapperToRemove = itemPool.querySelector(`[name="${prefix + iconName}"]`);
      console.log("TEST: ", wrapperToRemove)
      wrapperToRemove.remove();
      revealResults();
    }
    else
      alert("Deletion failed. Is the item in the item pool?\nThe Inventory does not count as the item pool")
  }
  catch{ alert(response.statusText)}
  txt.value = "";
}

const itemInPool = function(iconName){
  const iconClass = prefix + iconName;
  const iconPool = document.getElementById("item-pool");
  const iconElements = iconPool.querySelectorAll(`[class*="${prefix}"]`);
  
  for (const element of iconElements) 
    if (element.className === iconClass) 
      return true;
  return false;
}

const itemInInventory = function(iconName){
  const iconClass = prefix + iconName;
  const iconPool = document.getElementById("inventory");
  const iconElements = iconPool.querySelectorAll(`[class*="${prefix}"]`);
  
  for (const element of iconElements) 
    if (element.className === iconClass) 
      return true;
  return false;
}

function findAvailableSlot(){
  const inventory = document.getElementById("inventory");
  const inventorySlots = inventory.querySelectorAll(".inventory-slot");
  let result = false;
  
  for (let slot of inventorySlots) {
    if (slot.children.length === 0) {
      result = slot;
      break;
    }
  }
  return result;
}