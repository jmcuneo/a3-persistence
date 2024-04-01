// Fetch and display todos
const updateTodos = async () => {
  const response = await fetch("/todos");
  const todosFromServer = await response.json();
  clientTodos = todosFromServer;

  const todosList = document.getElementById("todos-list");
  todosList.innerHTML = "";

  clientTodos.forEach((todo) => {
    const todoItem = document.createElement("li");

    // Checkbox
    const checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.checked = todo.completed;
    checkBox.addEventListener("change", () => toggleTodo(todo.id));

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "x";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.onclick = () => deleteTodo(todo.id);

    // Todo title
    const titleSpan = document.createElement("span");
    titleSpan.textContent = todo.title;
    titleSpan.classList.add("todo-title");

    // Creation date
    const createdAtSpan = document.createElement("span");
    createdAtSpan.textContent = `Created at: ${new Date(todo.createdAt).toLocaleString()}`;
    createdAtSpan.classList.add("todo-created-at");

    // Time since added
    const timeSinceAddedSpan = document.createElement("span");
    timeSinceAddedSpan.textContent = todo.timeSinceAdded;
    timeSinceAddedSpan.classList.add("todo-time-since-added");

    todoItem.appendChild(checkBox);
    todoItem.appendChild(titleSpan);
    todoItem.appendChild(deleteBtn);
    todoItem.appendChild(createdAtSpan);
    todoItem.appendChild(timeSinceAddedSpan);
    todosList.appendChild(todoItem);
  });
};


// Toggle todo completion status
const toggleTodo = async (id) => {
  const response = await fetch(`/todos/${id}/toggle`, { method: "POST" });
  if (response.ok) {
    updateTodos();
  }
};

// Add a new todo (taking in a title)
const addTodo = async (newTitle) => {
  const response = await fetch("/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: newTitle, completed: false }),
  });

  if (response.ok) {
    updateTodos();
  }
};

// delete a todo
const deleteTodo = async (id) => {
  const response = await fetch(`/todos/${id}`, { method: "DELETE" });
  if (response.ok) {
    updateTodos();
  }
};

// Form submission event listener
document.getElementById("form").addEventListener("submit", function (event) {
  event.preventDefault();
  const newTitle = document.getElementById("input").value;

  // Call the addTodo function to submit the new title
  if (newTitle.trim() !== "") {
    addTodo(newTitle);
    document.getElementById("input").value = "";
  }
});

updateTodos();
