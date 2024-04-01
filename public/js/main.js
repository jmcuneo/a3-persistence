// FRONT-END (CLIENT) JAVASCRIPT HERE
let tasks = []
let editIndex = -1

const renderTasks = function() {
  const table = document.querySelector("#tasks")
  table.innerHTML = ""
  const headerRow = document.createElement("tr")
  headerRow.innerHTML = `<th>Done</th><th>Task Name</th><th>Priority</th><th>Creation Date</th><th>Days Not Done</th>`
  table.appendChild(headerRow)

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i]
    const row = document.createElement("tr")
    if (i === editIndex) {
      const editForm = document.createElement("form")
      editForm.id = "editForm"
      editForm.onsubmit = async function (event) {
        event.preventDefault()
        const form = document.querySelector( "#editForm" )
        const formData = new FormData(form)
        const json = {}
        formData.forEach(function(value, key){
          json[key] = value;
        })
        json["_id"] = tasks[i]._id
        const body = JSON.stringify( json )
        const response = await fetch( "/tasks", {
          method:"PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: body,
        })

        editIndex = -1

        // console.log( response.json() )
        await updateTasks()
      }
      // table.appendChild(editForm)
      row.innerHTML = `<input type="checkbox" class="trollCheckbox"/><td><input name="taskName" type="text" form="editForm" value="${task.taskName}" required></td><td><input name="priority" type="number" form="editForm" value="${task.priority}" required></td><td><input name="creation_date" type="date" form="editForm" value="${task.creation_date}" required></td><td></td><input id="edit" type="submit" form="editForm" value="Submit"/>`
      row.appendChild(editForm)

      const cancelButton = document.createElement("button")
      cancelButton.innerHTML = "Cancel"
      cancelButton.onclick = function (event) {
        editIndex = -1
        renderTasks()
      }
      row.appendChild(cancelButton)
    }
    else {
      row.innerHTML = `<input type="checkbox" class="trollCheckbox"/><td>${task.taskName}</td><td>${task.priority}</td><td>${task.creation_date}</td><td>${task.days_not_done}</td>`

      const editButton = document.createElement("button")
      editButton.innerHTML = "Edit"
      editButton.onclick = function (event) {
        editIndex = i
        renderTasks()
      }
      row.appendChild(editButton)

      const deleteButton = document.createElement("button")
      deleteButton.innerHTML = "Delete"
      deleteButton.onclick = async function (event) {
        // event.preventDefault()
        const response = await fetch("/tasks", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({_id: tasks[i]._id})
        })

        // console.log( response.json() )
        await updateTasks()
      }
      row.appendChild(deleteButton)
    }

    table.appendChild(row)
  }

  const row = document.createElement("tr")
  const today = (new Date()).toISOString().split('T')[0]

  row.innerHTML = `<td><input type="checkbox" class="trollCheckbox"/></td><td><input name="taskName" type="text" form="addForm" placeholder="Task Name" required></td><td><input name="priority" type="number" form="addForm" placeholder="Priority" value="1" required></td><td><input name="creation_date" type="date" form="addForm" value="${today}" required></td><td></td><td><input id="add" type="submit" form="addForm" value="Add Task"/></td>`
  table.appendChild(row)

  const checkboxes = document.querySelectorAll('.trollCheckbox');
  checkboxes.forEach(function(checkbox) {
    checkbox.addEventListener('click', function(event) {
      event.preventDefault();
      alert("YOU MAY NOT COMPLETE THE TASK! This is a To Not-Do List, remember?");
    });
  });
}

const submit = async function (event) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()

  const form = document.querySelector( "#addForm" )
  const formData = new FormData(form)
  const json = {}
  formData.forEach(function(value, key){
    json[key] = value;
  });
  const body = JSON.stringify( json )

  const response = await fetch( "/tasks", {
    method:"POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: body,
  })

  // console.log( response.json() )
  await updateTasks()
}

window.onload = async function() {
  const form = document.querySelector( "#addForm" )
  form.onsubmit = submit

  await updateTasks()
}

const updateTasks = async function() {
  const response = await fetch("/tasks")
  tasks = await response.json()
  renderTasks()
}