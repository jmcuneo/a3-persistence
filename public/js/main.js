// FRONT-END (CLIENT) JAVASCRIPT HERE
let tasks = [];
let editIndex = -1;

const renderTasks = function () {
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = "";

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const row = document.createElement("tr");
    if (i === editIndex) {
      const editForm = document.createElement("form");
      editForm.id = "editForm";
      editForm.onsubmit = async function (event) {
        event.preventDefault();
        const form = document.querySelector("#editForm");
        const formData = new FormData(form);
        const json = {};
        formData.forEach(function (value, key) {
          json[key] = value;
        });
        json["_id"] = tasks[i]._id;
        const body = JSON.stringify(json);
        const response = await fetch("/tasks", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: body,
        });

        editIndex = -1;

        // console.log( response.json() )
        await updateTasks();
      };
      // table.appendChild(editForm)
      row.innerHTML = `
        <td><input type="checkbox" class="trollCheckbox form-check-input"/></td>
        <td><input name="taskName" type="text" class="form-control" form="editForm" value="${task.taskName}" required></td>
        <td><input name="priority" type="number" class="form-control" form="editForm" value="${task.priority}" required></td>
        <td><input name="creation_date" type="date" class="form-control" form="editForm" value="${task.creation_date}" required></td>
        <td></td>
        <td>
          <div class="hstack gap-2">
            <button type="submit" form="editForm" class="btn btn-primary d-flex align-items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check me-1" viewBox="0 0 16 16">
                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
              </svg>
              Submit
            </button>
            <button class="btn btn-outline-primary d-flex align-items-center" onclick="cancel()">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x me-1" viewBox="0 0 16 16">
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
              </svg>
              Cancel
            </button>
          </div>
        </td>
      `;
      row.appendChild(editForm);
    } else {
      const editCB = `edit(${i})`;
      const delCB = `deleteTask(${i})`;
      row.innerHTML = `
        <td><input type="checkbox" class="trollCheckbox form-check-input"/></td>
        <td style="word-wrap: break-word;max-width: 30vw;">${task.taskName}</td>
        <td style="width: 10%;">${task.priority}</td>
        <td>${task.creation_date}</td>
        <td>${task.days_not_done}</td>
        <td>
          <div class="hstack gap-2">
            <button class="btn btn-outline-primary d-flex align-items-center" onclick="${editCB}">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil me-2" viewBox="0 0 16 16">
                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
              </svg>
              Edit
            </button>
            <button class="btn btn-outline-primary d-flex align-items-center" onclick="${delCB}">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash me-2" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
              </svg>
              Delete
            </button>
          </div>
        </td>
      `;
    }

    tbody.appendChild(row);
  }

  const row = document.createElement("tr");
  const today = new Date().toISOString().split("T")[0];

  row.innerHTML = `
    <td></td>
    <td><input name="taskName" type="text" class="form-control" form="addForm" placeholder="Task Name" required></td>
    <td><input name="priority" type="number" class="form-control" form="addForm" placeholder="Priority" value="1" required></td>
    <td><input name="creation_date" type="date" class="form-control" form="addForm" value="${today}" required></td>
    <td></td>
    <td>
      <button type="submit" form="addForm" class="btn btn-primary d-flex align-items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle me-2" viewBox="0 0 16 16">
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
        </svg>
        Add
      </button>
    </td>
  `;
  tbody.appendChild(row);

  const checkboxes = document.querySelectorAll(".trollCheckbox");
  checkboxes.forEach(function (checkbox) {
    checkbox.addEventListener("click", function (event) {
      event.preventDefault();
      alert(
        "YOU MAY NOT COMPLETE THE TASK! This is a To Not-Do List, remember?",
      );
    });
  });
};

const addTask = async function (event) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault();

  const form = document.querySelector("#addForm");
  const formData = new FormData(form);
  const json = {};
  formData.forEach(function (value, key) {
    json[key] = value;
  });
  const body = JSON.stringify(json);

  const response = await fetch("/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: body,
  });

  // console.log( response.json() )
  await updateTasks();
};

function cancel() {
  editIndex = -1;
  renderTasks();
}

function edit(i) {
  editIndex = i;
  renderTasks();
}

async function deleteTask(i) {
  // event.preventDefault()
  const response = await fetch("/tasks", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ _id: tasks[i]._id }),
  });

  // console.log( response.json() )
  await updateTasks();
}

window.onload = async function () {
  const form = document.querySelector("#addForm");
  form.onsubmit = addTask;

  await updateTasks();
};

const updateTasks = async function () {
  const response = await fetch("/tasks");
  tasks = await response.json();

  if (tasks.newUserCreated) {
    alert("New user created!");
    // delete tasks.newUserCreated
  }
  renderTasks();
};
