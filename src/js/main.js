// FRONT-END (CLIENT) JAVASCRIPT HERE

const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()

  const date = document.querySelector( "#monthYear" );
  const rent = document.querySelector( "#rent" );
  const util = document.querySelector( "#util" );
  const food = document.querySelector( "#food" );
  const other = document.querySelector( "#other" );

  const json = {
    date: date.value,
    rent: rent.value,
    util: util.value,
    food: food.value,
    other: other.value
  };

  const body = JSON.stringify(json);

  const response = await fetch( "/newEntry", {
    method:"POST",
    body: body,
    headers: {"Content-Type": "application/json"}
  });

  const text = await response.text();
  const newInfo = JSON.parse(text);
  updateTable(newInfo);
}

const update = async function( id ) {
  const date = document.querySelector( "#monthYear" );
  const rent = document.querySelector( "#rent" );
  const util = document.querySelector( "#util" );
  const food = document.querySelector( "#food" );
  const other = document.querySelector( "#other" );

  const json = {
    id: id,
    date: date.value,
    rent: rent.value,
    util: util.value,
    food: food.value,
    other: other.value
  };

  const body = JSON.stringify(json);

  const response = await fetch( "/updateEntry", {
    method:"PUT",
    body: body,
    headers: {"Content-Type": "application/json"}
  });

  const text = await response.text();
  const newInfo = JSON.parse(text);
  updateRow(newInfo);
}

const remove = async function(id) {
  const json = {
    id: id
  }

  const body = JSON.stringify(json);

  const response = await fetch( "/deleteEntry", {
    method:"DELETE",
    body: body,
    headers: {"Content-Type": "application/json"}
  });

  deleteRow(id);
}

window.onload = function() {
  fetch( "/check", {
    method:"POST"
  }).then((result) => {
    if (result.status === 200) {
      initialData();
      const button = document.querySelector("button");
      button.onclick = submit;
    } else {
      window.location.replace(window.location.origin + "/invalid");
    }
  });
}

const updateTable = function (newInfo) {
  const table = document.querySelector("table");

  //Insert new row
  let row = table.insertRow(table.rows.length-1);
  row.id = newInfo._id;
  row.insertCell(0).innerText = newInfo.date;
  row.insertCell(1).innerText = "$" + newInfo.rent.toFixed(2);
  row.insertCell(2).innerText = "$" + newInfo.util.toFixed(2);
  row.insertCell(3).innerText = "$" + newInfo.food.toFixed(2);
  row.insertCell(4).innerText = "$" + newInfo.other.toFixed(2);
  row.insertCell(5).innerText = "$" + newInfo.total.toFixed(2);
  row.insertCell(6).innerText = "Update";
  row.cells[6].className = "Update";
  row.cells[6].onclick = () => update(row.id);
  row.insertCell(7).innerText = "Delete";
  row.cells[7].className = "Delete";
  row.cells[7].onclick = () => remove(row.id);

  //Update totals
  const totals = table.rows[table.rows.length-1];
  totals.cells[1].innerText = "$" + (parseInt(totals.cells[1].innerText.substring(1)) + newInfo.rent).toFixed(2);
  totals.cells[2].innerText = "$" + (parseInt(totals.cells[2].innerText.substring(1)) + newInfo.util).toFixed(2);
  totals.cells[3].innerText = "$" + (parseInt(totals.cells[3].innerText.substring(1)) + newInfo.food).toFixed(2);
  totals.cells[4].innerText = "$" + (parseInt(totals.cells[4].innerText.substring(1)) + newInfo.other).toFixed(2);
  totals.cells[5].innerText = "$" + (parseInt(totals.cells[5].innerText.substring(1)) + newInfo.total).toFixed(2);
}

const updateRow = function (newInfo) {
  const table = document.querySelector("table");
  console.log("Retrieved new info: ", newInfo);

  //Grab the row
  let row = document.getElementById(`${newInfo._id}`);
  console.log(row);
  const oldRent = parseInt(row.cells[1].innerText.substring(1));
  const oldUtil = parseInt(row.cells[2].innerText.substring(1));
  const oldFood = parseInt(row.cells[3].innerText.substring(1));
  const oldOther = parseInt(row.cells[4].innerText.substring(1));
  const oldTotal = parseInt(row.cells[5].innerText.substring(1));

  row.cells[0].innerText = newInfo.date;
  row.cells[1].innerText = "$" + newInfo.rent.toFixed(2);
  row.cells[2].innerText = "$" + newInfo.util.toFixed(2);
  row.cells[3].innerText = "$" + newInfo.food.toFixed(2);
  row.cells[4].innerText = "$" + newInfo.other.toFixed(2);
  row.cells[5].innerText = "$" + newInfo.total.toFixed(2);

  //Update totals
  const totals = table.rows[table.rows.length-1];
  totals.cells[1].innerText = "$" + (parseInt(totals.cells[1].innerText.substring(1)) + newInfo.rent - oldRent).toFixed(2);
  totals.cells[2].innerText = "$" + (parseInt(totals.cells[2].innerText.substring(1)) + newInfo.util - oldUtil).toFixed(2);
  totals.cells[3].innerText = "$" + (parseInt(totals.cells[3].innerText.substring(1)) + newInfo.food - oldFood).toFixed(2);
  totals.cells[4].innerText = "$" + (parseInt(totals.cells[4].innerText.substring(1)) + newInfo.other - oldOther).toFixed(2);
  totals.cells[5].innerText = "$" + (parseInt(totals.cells[5].innerText.substring(1)) + newInfo.total - oldTotal).toFixed(2);
}

const deleteRow = function (id) {
  const table = document.querySelector("table");

  //Grab the row
  let row = document.getElementById(`${id}`);
  const oldRent = parseInt(row.cells[1].innerText.substring(1));
  const oldUtil = parseInt(row.cells[2].innerText.substring(1));
  const oldFood = parseInt(row.cells[3].innerText.substring(1));
  const oldOther = parseInt(row.cells[4].innerText.substring(1));
  const oldTotal = parseInt(row.cells[5].innerText.substring(1));

  row.style.display = "none";

  //Update totals
  const totals = table.rows[table.rows.length-1];
  totals.cells[1].innerText = "$" + (parseInt(totals.cells[1].innerText.substring(1)) - oldRent).toFixed(2);
  totals.cells[2].innerText = "$" + (parseInt(totals.cells[2].innerText.substring(1)) - oldUtil).toFixed(2);
  totals.cells[3].innerText = "$" + (parseInt(totals.cells[3].innerText.substring(1)) - oldFood).toFixed(2);
  totals.cells[4].innerText = "$" + (parseInt(totals.cells[4].innerText.substring(1)) - oldOther).toFixed(2);
  totals.cells[5].innerText = "$" + (parseInt(totals.cells[5].innerText.substring(1)) - oldTotal).toFixed(2);
}

const initialData = async function() {
  const response = await fetch( "/userInfo", {
    method:"POST"
  });

  if (response.status === 200) {
    const text = await response.text();
    const data = JSON.parse(text);

    for (let i = 0; i < data.length; i++) {
      updateTable(data[i]);
    }
  }
}
