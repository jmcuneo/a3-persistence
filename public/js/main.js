let editID;

const rpe_chart = {
  1: {
    10: 100,
    9.5: 97.8,
    9: 95.5,
    8.5: 93.9,
    8: 92.2,
    7.5: 90.7,
    7: 89.2,
    6.5: 87.8,
    6: 86.3
  },
  2: {
    10: 95.5,
    9.5: 93.9,
    9: 92.2,
    8.5: 90.7,
    8: 89.2,
    7.5: 87.8,
    7: 86.3,
    6.5: 85,
    6: 83.7
  },
  3: {
    10: 92.2,
    9.5: 90.7,
    9: 89.2,
    8.5: 87.8,
    8: 86.3,
    7.5: 85,
    7: 83.7,
    6.5: 82.4,
    6: 81.1
  },
  4: {
    10: 89.2,
    9.5: 87.8,
    9: 86.3,
    8.5: 85,
    8: 83.7,
    7.5: 82.4,
    7: 81.1,
    6.5: 79.9,
    6: 78.6
  },
  5: {
    10: 86.3,
    9.5: 85,
    9: 83.7,
    8.5: 82.4,
    8: 81.1,
    7.5: 79.9,
    7: 78.6,
    6.5: 77.4,
    6: 76.2
  },
  6: {
    10: 83.7,
    9.5: 82.4,
    9: 81.1,
    8.5: 79.9,
    8: 78.6,
    7.5: 77.4,
    7: 76.2,
    6.5: 75.1,
    6: 73.9
  },
  7: {
    10: 81.1,
    9.5: 79.9,
    9: 78.6,
    8.5: 77.4,
    8: 76.2,
    7.5: 75.1,
    7: 73.9,
    6.5: 72.3,
    6: 70.7
  },
  8: {
    10: 78.6,
    9.5: 77.4,
    9: 76.2,
    8.5: 75.1,
    8: 73.9,
    7.5: 72.3,
    7: 70.7,
    6.5: 69.4,
    6: 68
  },
  9: {
    10: 76.2,
    9.5: 75.1,
    9: 73.9,
    8.5: 72.3,
    8: 70.7,
    7.5: 69.4,
    7: 68,
    6.5: 66.7,
    6: 65.3
  },
  10: {
    10: 73.9,
    9.5: 72.3,
    9: 70.7,
    8.5: 69.4,
    8: 68,
    7.5: 66.7,
    7: 65.3,
    6.5: 64,
    6: 62.6
  },
  11: {
    10: 70.7,
    9.5: 69.4,
    9: 68,
    8.5: 66.7,
    8: 65.3,
    7.5: 64,
    7: 62.6,
    6.5: 61.3,
    6: 59.9
  },
  12: {
    10: 68,
    9.5: 66.7,
    9: 65.3,
    8.5: 64,
    8: 62.6,
    7.5: 61.3,
    7: 59.9,
    6.5: 58.6,
    6: 57.4
  }
}

function calculateResults(weight, rpe, reps) {
  const estimatedMax = weight / rpe_chart[reps][rpe];
  const results = {};

  for (let reps = 1; reps <= 12; reps++) {
    results[reps] = {};

    for (let rpe = 6; rpe <= 10; rpe += 0.5) {
      const estimatedWeight = estimatedMax * rpe_chart[reps][rpe];

      results[reps][rpe] = estimatedWeight;
    }
  }
  return results;
}
// Function to put array values into a specified table
function populateTable(tableId, dataArray, rep) {
  var table = document.getElementById(tableId);
  var tbody = table.querySelector("tbody");
  tbody.innerHTML = "";
  for (var i = 10; i >= 6; i = i - 0.5) {
    var row = tbody.insertRow();
    var rpeCell = row.insertCell();
    var percentageCell = row.insertCell();
    var weightCell = row.insertCell();
    rpeCell.innerHTML = i;
    percentageCell.innerHTML = rpe_chart[rep][i].toFixed(2) + "%";
    weightCell.innerHTML = dataArray[rep][i].toFixed(2);
  }
}

const loadTable = (data) => {
  const table = document.querySelector('#result-table')
  for (let i = 1; i <= 12; i++) {
    var tableId = "table" + i;
    populateTable(tableId, data, i);
  }
};



const submit = async function (event) {
  event.preventDefault();
  const weight = document.querySelector("#weight").value;
  const rpe = document.querySelector("#rpe").value;
  const reps = document.querySelector("#reps").value;

  const date = new Date;
  let results = calculateResults(weight, rpe, reps)
  loadTable(results);
  const oneRM = results[1][10];
  const json = {
    weight: weight,
    reps: reps,
    rpe: rpe,
    oneRM: oneRM,
    date: date,
  };

  const body = JSON.stringify(json)

  const response = await fetch("/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body
  })

  const text = await response.text()

  await displayAllEntries();

  return false;
};

async function displayAllEntries() {

  await fetch('/docs')
    .then(response => response.json())
    .then(data => {
      const entriesBody = document.getElementById('entries-body');
      entriesBody.innerHTML = ''; // Clear previous entries
      const tableRows = entriesBody.getElementsByTagName('tr');
      const rowCount = tableRows.length;
      for (let x = rowCount - 1; x > 0; x--) {
        existingTableBody.removeChild(tableRows[x]);
      }
      console.log('Appdata from server:', data);
      for (let i = 0; i < data.length; i++) {
        const entry = data[i]
        const row = document.createElement('tr');
        const oneRM = entry.oneRM.toFixed(2)
        row.innerHTML = `
      <td>${entry.userID}</td>
      <td>${entry.weight}</td>
      <td>${entry.reps}</td>
      <td>${entry.rpe}</td>
      <td>${oneRM}</td>
      <td>${new Date(entry.date).toLocaleDateString()}</td>
      <td>
        <button class="modify-btn" onclick="modifyEntry('${entry._id}', '${entry.userID}', ${entry.weight},${entry.reps},${entry.rpe}, '${entry.date}')">Modify</button>
        <button class="delete-btn" onclick="deleteEntry('${entry._id}')">Delete</button>
      </td>
    `;
        entriesBody.appendChild(row);
    }
  })
}

const modifyEntry = function (entryid, entryname, entryweight, entryreps, entryrpe, entrydate){
  editID = entryid;
  document.getElementById("editform").style.display = 'block';
  document.getElementById("editname").value = entryname;
  document.getElementById("editweight").value = entryweight;
  document.getElementById("editreps").value = entryreps;
  document.getElementById("editrpe").value = entryrpe;
  document.getElementById("editdate").valueAsDate = new Date();
}

const saveEdit = async function ( event ){
  event.preventDefault()

  const entryid = editID,
  entryname = document.querySelector( "#editname" ).value,
  entryweight = document.querySelector( "#editweight" ).value,
  entryreps = document.querySelector( "#editreps" ).value,
  entryrpe = document.querySelector( "#editrpe" ).value,
  entrydate = document.querySelector('#editdate').value;
  const oneRM = (entryweight*100 / rpe_chart[entryreps][entryrpe])

  const json = {
    id:entryid,
    name: entryname,
    weight: entryweight,
    reps: entryreps,
    rpe: entryrpe,
    oneRM: oneRM,
    date: entrydate,
  },
      body = JSON.stringify( json )

  const response = await fetch( "/edit", {
      method:"POST",
      headers: {
          "Content-Type": "application/json"
      },
      body
  })

  cancel(event);
  await displayAllEntries();
}

const cancel = function ( event ){
  event.preventDefault()

  document.getElementById("editform").style.display = 'none';
  document.getElementById("editname").value = '';
  document.getElementById("editweight").value = '';
  document.getElementById("editreps").value = '';
  document.getElementById("editrpe").value = '';
  document.getElementById("editdate").value = '';

  editID = ""

}

const deleteEntry = async function (deleteId){

  const json = {
      "deleteId": deleteId,
  }
  const body = JSON.stringify(json)
  const response = await fetch( "/delete", {
      method:"POST",
      headers: {
          "Content-Type": "application/json"
      },
      body
  })

  // const text = await response.text()
  await displayAllEntries();
}

async function createTables() {
  // Create a container div
  var tablesContainer = document.getElementById("tablesContainer");

  // Create 12 tables
  for (var i = 1; i <= 12; i++) {
    var table = document.createElement("table");
    table.id = "table" + i; // Set ID for each table
    if (i === 1) {
      table.style.display = "block"; // Show the first table by default
    } else {
      table.style.display = "none"; // Hide other tables by default
    }

    // Create table header
    var thead = table.createTHead();
    var headerRow = thead.insertRow();
    var rpeHeader = headerRow.insertCell();
    var percentageHeader = headerRow.insertCell();
    var weightHeader = headerRow.insertCell();
    rpeHeader.innerHTML = "RPE";
    percentageHeader.innerHTML = "% of 1RM";
    weightHeader.innerHTML = "Weight";

    // Create table body 
    var tbody = table.createTBody();
    for (var j = 1; j <= 9; j++) {
      var row = tbody.insertRow();
      var rpeCell = row.insertCell();
      var percentageCell = row.insertCell();
      var weightCell = row.insertCell();
      rpeCell.innerHTML = 10.5 - j * 0.5;
      percentageCell.innerHTML = "75%";
      weightCell.innerHTML = "100kg";
    }

    // Append table to the container
    tablesContainer.appendChild(table);
  }

  // Add event listeners to rep buttons
  for (var k = 1; k <= 12; k++) {
    var repButton = document.getElementById("rep" + k);
    repButton.addEventListener("click", function () {
      var tableNumber = parseInt(this.value);
      // Hide all tables
      for (var l = 1; l <= 12; l++) {
        document.getElementById("table" + l).style.display = "none";
      }
      // Show the corresponding table
      document.getElementById("table" + tableNumber).style.display = "block";
    });
  }
}


window.onload = function () {
  displayAllEntries()
  createTables()
  const button = document.querySelector("#calculate");
  button.onclick = submit;
  document.querySelector("#cancelbutton").onclick = cancel;
  document.querySelector("#savebutton").onclick = saveEdit;
}