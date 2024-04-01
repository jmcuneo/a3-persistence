const express = require("express");
const app = express();
const path = require("path");
const { v4: uuidv4 } = require("uuid");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// logger for all requests
app.use((req, res, next) => {
  console.log(`${req.method} request for ${req.url}`);
  next();
});

// dummy database
let todos = [
  {
    id: uuidv4(),
    title: "Learn React",
    completed: true,
    createdAt: new Date(),
  },
  {
    id: uuidv4(),
    title: "Learn Node",
    completed: false,
    createdAt: new Date(),
  },
  {
    id: uuidv4(),
    title: "Learn Express",
    completed: false,
    createdAt: new Date(),
  },
  {
    id: uuidv4(),
    title: "Learn MongoDB",
    completed: false,
    createdAt: new Date(),
  },
];

/* routes */

// Home route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Get all todos
app.get("/todos", (req, res) => {
  const todosWithTimeSinceAdded = todos.map((todo) => {
    const now = new Date();
    const createdAt = new Date(todo.createdAt);
    const timeSinceAdded = Math.floor((now - createdAt) / 1000 / 60); // in minutes
    return { ...todo, timeSinceAdded: `${timeSinceAdded} min ago` };
  });
  res.json(todosWithTimeSinceAdded);
});

// Create a new todo
app.post("/todos", (req, res) => {
  const newTodo = {
    id: uuidv4(),
    title: req.body.title,
    completed: req.body.completed || false,
    createdAt: new Date(),
  };
  todos.push(newTodo);
  res.json(newTodo);
  console.log("New todo created: ", newTodo);
});

// Delete a todo
app.delete("/todos/:id", (req, res) => {
  const id = req.params.id;
  const todoIndex = todos.findIndex((todo) => todo.id === id);
  if (todoIndex > -1) {
    const [deletedTodo] = todos.splice(todoIndex, 1);
    res.status(200).json({ message: "Todo deleted successfully" });
    console.log("Todo deleted: ", deletedTodo);
  } else {
    res.status(404).json({ message: "Todo not found" });
  }
});

// Toggle a todo
app.post("/todos/:id/toggle", (req, res) => {
  const id = req.params.id;
  const todo = todos.find((t) => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    res.json(todo);
    console.log("Todo status toggled: ", todo);
  } else {
    res.status(404).send("Todo not found");
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
