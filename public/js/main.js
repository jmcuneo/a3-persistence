const submit = async function (event) {
  event.preventDefault();

  const taskInput = document.querySelector("#task");
  const priorityInput = document.querySelector("#priority");
  const addToTopCheckbox = document.querySelector("#addToTop");

  const json = {
    task: taskInput.value,
    priority: priorityInput.value,
    addToTop: addToTopCheckbox.checked,
  };

  const body = JSON.stringify(json);

  await fetch("/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });

  taskInput.value = "";

  await updateTaskList();
};

let taskData = [];

const updateTaskList = async function () {
  const response = await fetch("/docs");
  const data = await response.json();

  taskData = data;

  const list = document.querySelector("#list");
  list.innerHTML = "";

  data.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = `div-${index}`;

    const li = document.createElement("li");
    li.id = `li-${index}`;
    li.className = div.className;
    li.textContent = item.task;

    const edit = document.createElement("button");
    edit.innerText = "edit";
    edit.id = `editButton-${index}`;
    edit.className = div.className;
    edit.addEventListener("click", editSubmit);

    const del = document.createElement("button");
    del.innerText = "delete";
    del.id = `delButton-${index}`;
    del.className = "button error";
    del.addEventListener("click", delSubmit);

    const priorityP = document.createElement("p");
    priorityP.id = `priority-${index}`;
    priorityP.className = div.className;
    priorityP.innerText = "Priority: " + item.priority;

    div.appendChild(li);
    div.appendChild(edit);
    div.appendChild(del);
    div.appendChild(priorityP);
    list.appendChild(div);
  });
};

window.onload = function () {
  const button = document.querySelector("button");
  button.onclick = submit;

  updateTaskList();
};

const delSubmit = async function (event) {
  event.preventDefault();

  const delButtonId = event.target.id;
  const index = parseInt(delButtonId.split("-")[1]);

  await fetch("/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ _id: taskData[index]._id }),
  });

  const delDiv = document.querySelector(".div-" + index);
  delDiv.remove();
};

const editSubmit = async function (event) {
  event.preventDefault();

  const editButtonId = event.target.id;
  const index = editButtonId.split("-")[1];
  const editLi = document.querySelector("li#li-" + index);
  const oldText = editLi.textContent;

  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.value = oldText;

  const prioritySelect = document.createElement("select");
  prioritySelect.id = "priority-select-" + index;
  prioritySelect.innerHTML = `
      <option value="Low">Low</option>
      <option value="Medium">Medium</option>
      <option value="High">High</option>
  `;

  const submit = document.createElement("button");
  submit.textContent = "Update";
  submit.id = "submit-" + editButtonId.id;
  submit.className = "button primary";

  editLi.textContent = "";
  editLi.appendChild(editInput);
  editLi.appendChild(prioritySelect);
  editLi.appendChild(submit);

  submit.addEventListener("click", async function (event) {
    event.preventDefault();

    const newText = editInput.value;
    const newPriority = prioritySelect.value;

    editLi.textContent = newText;

    editInput.remove();
    submit.remove();

    const priorityP = document.querySelector("#priority-" + index);
    priorityP.innerText = "Priority: " + newPriority;

    await fetch("/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: taskData[index]._id,
        task: newText,
        priority: newPriority,
      }),
    });
  });
};
