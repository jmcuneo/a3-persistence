const express = require("express");
const router = express.Router();
const todoCtrl = require("../controllers/todoController");

router.get("/", todoCtrl.getTodos);
router.post("/", todoCtrl.createTodo);
router.delete("/:id", todoCtrl.deleteTodo);
router.post("/:id/toggle", todoCtrl.toggleTodo);

module.exports = router;
