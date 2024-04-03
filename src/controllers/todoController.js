const { v4: uuidv4 } = require("uuid");
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

const getTodos = (req, res) => {
  const todosWithTimeSinceAdded = todos.map((todo) => {
    const now = new Date();
    const createdAt = new Date(todo.createdAt);
    const timeSinceAdded = Math.floor((now - createdAt) / 1000 / 60); // in minutes
    return { ...todo, timeSinceAdded: `${timeSinceAdded} minutes ago` };
  });
  res.status(200).json(todosWithTimeSinceAdded);
};

const createTodo = (req, res) => {
  const newTodo = {
    id: uuidv4(),
    title: req.body.title,
    completed: req.body.completed || false,
    createdAt: new Date(),
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
  //   console.log("New todo created: ", newTodo);
};

const deleteTodo = (req, res) => {
  const id = req.params.id;
  const todoIndex = todos.findIndex((todo) => todo.id === id);
  if (todoIndex > -1) {
    const [deletedTodo] = todos.splice(todoIndex, 1);
    res.status(200).json({ message: "Todo deleted successfully" });
    // console.log("Todo deleted: ", deletedTodo);
  } else {
    res.status(404).json({ message: "Todo not found" });
  }
};

const toggleTodo = (req, res) => {
  const id = req.params.id;
  const todo = todos.find((t) => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    res.status(200).json(todo);
    // console.log("Todo status toggled: ", todo);
  } else {
    res.status(404).send("Todo not found");
  }
};

module.exports = {
  getTodos,
  createTodo,
  deleteTodo,
  toggleTodo,
};
