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
            <button type="submit" form="editForm" class="btn btn-primary">Submit</button>
            <button class="btn btn-outline-primary" onclick="cancel()">Cancel</button>
        </td>
      `;
      row.appendChild(editForm);
    } else {
      const editCB = `edit(${i})`;
      const delCB = `deleteTask(${i})`;
      row.innerHTML = `
        <td><input type="checkbox" class="trollCheckbox form-check-input"/></td>
        <td>${task.taskName}</td>
        <td>${task.priority}</td>
        <td>${task.creation_date}</td>
        <td>${task.days_not_done}</td>
        <td>
          <button class="btn btn-outline-primary" onclick="${editCB}">Edit</button>
          <button class="btn btn-outline-primary" onclick="${delCB}">Delete</button>
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
    <td><button type="submit" form="addForm" class="btn btn-primary">Add Task</button></td>
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
