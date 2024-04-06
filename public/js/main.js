window.onload = function () {
  const form = document.getElementById("input-form");
  form.onsubmit = submit;
  const [today] = new Date().toISOString().split('T')

  const dateInput = document.getElementById('calendar');
  dateInput.setAttribute('min', today);
  dateInput.setAttribute('value', today);
}



const submit = async function (event) {
  event.preventDefault()
  const form = document.getElementById("input-form")
  if (form.checkValidity()) {
    //send form data, then get user associated data back
    const input = document.getElementById("task-input").value
    const dueDate = document.getElementById("calendar").value
    const json = { "task": input, "creationDate": new Date().toISOString().split("T")[0], "dueDate": dueDate }
    const body = JSON.stringify(json)

    const response = await fetch("/add-task", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body
    })
    const allTasks = await response.json()
    populateTaskTable(allTasks)
  } else {
    console.log("did not validate")
  }
}

const tableDeleteButton = async function (buttonTarget) {
  //we only allow unique tasks so this is fine
  let row = buttonTarget.closest("tr")
  let taskText
  if (row) {
    taskText = row.cells[1].textContent;
  } else {
    throw new Error("button without task")
  }

  const options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ "task": taskText }),
  };

  const response = await fetch("/delete-task", options)

  if (response.ok) {
    const dataJson = await response.json()
    populateTaskTable(dataJson)
  }
}

function populateTaskTable(tasks) {
  const tableHeaders = ["", "Task", "Creation date", "Due date", "Days left"]
  const tableHeader = document.getElementById("task-table-header")
  const tableBody = document.getElementById("task-table-body")

  if (tableHeader.innerHTML.trim() === "") {
    let tr = document.createElement("tr")
    tableHeaders.forEach(header => {
      let th = document.createElement("th")
      th.setAttribute("scope", "col")
      th.setAttribute("class", header.toLowerCase().replace(" ", "-"))
      th.textContent = header;
      tr.appendChild(th)
    });
    tableHeader.appendChild(tr)
  }

  tableBody.innerHTML = ""

  tasks.forEach(obj => {
    let tr = document.createElement("tr")

    let delButtonCell = document.createElement('td')
    let deleteButton = document.createElement('button')
    deleteButton.onclick = function (event) {
      tableDeleteButton(event.target)
    }
    deleteButton.textContent = "Delete row"
    deleteButton.setAttribute("class", "del-button")
    delButtonCell.appendChild(deleteButton)
    tr.appendChild(delButtonCell)

    Object.values(obj).forEach(val => {
      let td = document.createElement("td");
      td.textContent = val
      tr.appendChild(td)
    })
    tableBody.appendChild(tr)
  })
}


