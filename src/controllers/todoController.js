const Todo = require("../models/todoModel");

const getTodos = async (req, res) => {
  try {
    // Fetch todos specific to the user
    const todos = await Todo.find({ user: req.user });
    const todosWithTimeSinceAdded = todos.map((todo) => {
      const now = new Date();
      const createdAt = new Date(todo.createdAt);
      const timeSinceAdded = Math.floor((now - createdAt) / 1000 / 60); // in minutes
      return {
        ...todo.toObject(),
        timeSinceAdded: `${timeSinceAdded} minutes ago`,
      };
    });
    res.status(200).json(todosWithTimeSinceAdded);
  } catch (error) {
    res.status(500).json({ message: "Error fetching todos", error: error });
  }
};

const createTodo = async (req, res) => {
  try {
    const { title, completed } = req.body;
    const newTodo = new Todo({
      title,
      completed,
      user: req.user, // Set the user ID for the new todo
    });
    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(400).json({ message: "Error creating todo", error: error });
  }
};

const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTodo = await Todo.findOneAndDelete({
      _id: id,
      user: req.user,
    });
    if (deletedTodo) {
      res.status(200).json({ message: "Todo deleted successfully" });
    } else {
      res.status(404).json({ message: "Todo not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting todo", error: error });
  }
};

const toggleTodo = async (req, res) => {
  try {
    const { id } = req.params;
    // Ensure that only the todo belonging to the user is toggled
    const todo = await Todo.findOne({ _id: id, user: req.user });
    if (todo) {
      todo.completed = !todo.completed;
      await todo.save();
      res.status(200).json(todo);
    } else {
      res.status(404).send("Todo not found");
    }
  } catch (error) {
    res.status(500).send("Error toggling todo status");
  }
};

module.exports = {
  getTodos,
  createTodo,
  deleteTodo,
  toggleTodo,
};
