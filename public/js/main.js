// FRONT-END (CLIENT) JAVASCRIPT HERE

/**
 * creates an object and sends object to server side
 * serverside sends back an array or JSON objects
 * uses array from server to create HTML table
 */
const submit = async function (event) {
  // stop form submission from trying to load a new .html page for displaying results...
  // this was the original browser behavior and still remains to this day
  event.preventDefault();

  const nameInput = document.querySelector("#yourname");
  const itemInput = document.querySelector("#youritem");
  const priceInput = document.querySelector("#itemPrice");
  const qtyInput = document.querySelector("#numItems");

  document.getElementById("yourname").focus(); //put cursor in first box

  //make sure all fields complete
  if (
    isEmpty(nameInput.value) ||
    isEmpty(itemInput.value) ||
    isEmpty(qtyInput.value)
  ) {
    alert(
      "Please fill out all fields. If the price is unknown, you may leave it blank."
    );
    return;
  }

  const newEntry = createEntry(
    nameInput.value,
    itemInput.value,
    priceInput.value,
    qtyInput.value
  );

  const response = await fetch("/submit", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(newEntry),
  });
  console.log(response.body);
  const text = await response.json();
  //const appdata = text.appdata;
  //const suggestdata = text.suggestdata;
  //const justAdded = appdata[appdata.length - 1];

  /*for (let i = 0; i < suggestdata.length; i++) {
    if (suggestdata[i].Sitem == justAdded.item && suggestdata[i].Sqty == justAdded.qty) {
      bring(i);
      remove(appdata.length);
      console.log("item removed from bring and added to appdata: ", suggestdata[i]);
    }
  };*/

  //makeGuestList(appdata);
  console.log("type of text submit: ", typeof(text))
  addToTable(text);
  
  resetTextBoxes();
  console.log("submit: ", text);
};

/**
 * Check the array and compare to the name just entered - if name already in the array, do not add to list
 * If the name is not in the array, add to list -> use set for uniqeness
 */
const makeGuestList = function (array) {
  const uniqueNamesSet = new Set();
  const list = document.getElementById("guestList");
  list.innerHTML = ""; // Clear the existing list if needed
  array.forEach((obj) => {
    if (!uniqueNamesSet.has(obj.name)) {
      // Check if the name already exists in the set
      uniqueNamesSet.add(obj.name); // Add the name to the set
      const li = document.createElement("li");
      li.innerHTML = obj.name; // Use the name property of the object
      list.appendChild(li);
    }
  });
};

//entry object
const createEntry = function (name, item, price, qty) {
  const entry = {
    name: name,
    item: item,
    price: price,
    qty: qty
  };
  console.log(entry);
  return entry;
};

const createSuggest = function (item, qty) {
  const suggest = {};
  suggest.Sitem = item;
  suggest.Sqty = qty;
  return suggest;
};

const clearSuggest = function (array) {
  console.log(!!document.getElementById("suggestRow"));
  if (!!document.getElementById("suggestRow")) {
    for (let i = 0; i < array.length - 1; i++) {
      console.log("clearingtable. length: ", array.length);
      document.getElementById("suggestRow").remove();
    }
  } else {
    return;
  }
};
const makeTable = function (array) {
  console.log(`table array:`)
  console.log(array)
  //check if table is empty
  for (let j = 0; j < array.length; j++) {
    const entry = array[j];
    //console.log("suggest row: ", JSON.stringify(entry.Sitem));
    const table = document.getElementById("tableSuggest");
    const row = `<tr id="suggestRow">
              <td>${entry.Sitem}</td>
              <td>${entry.Sqty}</td>
              <td><button class="bring">Bring</button></td>
            </tr>`;
    table.insertAdjacentHTML("beforeend", row);
    //eventlistener
    const bringButton = table.querySelector(".bring:last-child");
    bringButton.addEventListener("click", function (event) {
      event.preventDefault();
    });
  }
};
/**
 * Adds row to HTML table
 * creates an event listener for each button created - can get index from click
 */
const addToTable = function (entry) {  
  const table = document.getElementById("table");
  const row = `<tr id="entryRow">
                <td>${entry.name}</td>
                <td>${entry.item}</td>
                <td>${entry.qty}</td>
                <td>${entry.cost}</td>
                <td><button class="remove">Remove</button></td>
              </tr>`;
  table.insertAdjacentHTML("beforeend", row);
  //eventlistener
  const removeButton = table.querySelector(".remove:last-child");
  removeButton.addEventListener("click", function (event) {
    event.preventDefault();
  });
  resetTextBoxes();
};

// Set input boxes to empty - user does not have to delete previous entry
const resetTextBoxes = function () {
  document.querySelector("#yourname").value = "";
  document.querySelector("#youritem").value = "";
  document.querySelector("#itemPrice").value = "";
  document.querySelector("#numItems").value = "";
  document.querySelector("#suggestItem").value = "";
  document.querySelector("#suggestQty").value = "";
};

//check if input box is empty
function isEmpty(str) {
  return !str || str.length === 0;
}

/**
 * send empty data to server
 * server sends back current appdata array
 * rebuild the table using add to table and looping through each element in array
 */
const refreshPage = async function () {
  const response = await fetch("/refresh", {
    method: "POST",
    body: "",
  });
  const text = await response.json();
  const appdata = text.appdata;
  const suggestdata = text.suggestdata;
  for (let i = 0; i < appdata.length; i++) {
    addToTable(appdata[i]);
  }
  makeGuestList(appdata);
  clearSuggest(suggestdata);
  makeTable(suggestdata);
  document.getElementById("yourname").focus(); //put cursor in first input box
  console.log("refresh page: done");
};

/**
 * send the index of the entry user wants to delete from array
 * server sends updated array back
 * clear table called to remove the row
 */
const remove = async function (entryIndex) {
  const reqObj = {entryIndex: entryIndex}
  const response = await fetch("/remove", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(reqObj)
  });
  console.log("entry index: ", entryIndex);
  console.log("type of entryIndex: ", typeof(entryIndex))
  const text = await response.json();
  console.log("remove: ", text);
  clearTable(text);
};

//clear the table and guest list and rebuild from new array
const clearTable = function (text) {
  for (let i = 0; i <= text.length; i++) {
    document.getElementById("entryRow").remove();
    if (document.getElementById("guestName") != undefined) {
      document.getElementById("guestName").remove();
    }
  }
  refreshPage();
};

const suggest = async function (event) {
  // stop form submission from trying to load a new .html page for displaying results...
  // this was the original browser behavior and still remains to this day
  event.preventDefault();

  const itemSuggest = document.querySelector("#suggestItem");
  const qtySuggest = document.querySelector("#suggestQty");

  //make sure all fields complete

  const newSuggest = createSuggest(itemSuggest.value, qtySuggest.value);

  const response = await fetch("/suggest", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(newSuggest),
  });
  //const text = await response.json();
  const text = await response.json();
  const justAdded = text[text.length - 1];
  console.log("type of text suggest: ", typeof(text))
  console.log("suggestdata: ", text);
  clearSuggest(text);
  makeTable(text); //implement second table
  console.log("suggest:", text);
  resetTextBoxes();
};

const bring = async function (entryIndex) {
  const response = await fetch("/bring", {
    method: "POST",
    body: JSON.stringify(entryIndex),
  });
  const text = await response.json();
  const appdata = text.appdata;
  const suggestdata = text.suggestdata;
  addToTable(appdata[appdata.length - 1]);
  console.log(suggestdata);

  for (let i = 0; i <= suggestdata.length; i++) {
    console.log("clearingtable");
    document.getElementById("suggestRow").remove();
  }
  clearSuggest(suggestdata);
  makeTable(suggestdata);
  console.log("Bring this item: ", text);
};

window.onload = function () {
  refreshPage();
  const button = document.getElementById("submit");
  button.onclick = submit;

  const suggestButton = document.getElementById("suggest");
  suggestButton.onclick = suggest;
  //event listener
  document.addEventListener("click", function (event) {
    event.preventDefault();
    //check if there are any elements to remove
    if (event.target && event.target.classList.contains("remove")) {
      //use event listener to get the index and use to call remove
      const entryIndex = event.target.closest("tr").rowIndex - 1; // Subtract 1 because of table header
      remove.onclick = remove(entryIndex);
    }
    //check if there are any elements to remove
    if (event.target && event.target.classList.contains("bring")) {
      //use event listener to get the index and use to call remove
      const suggestIndex = event.target.closest("tr").rowIndex - 1; // Subtract 1 because of table header
      bring.onclick = bring(suggestIndex);
    }
  });
};

//if someone adds something that is in suggestdat -> remove from suggest data??
