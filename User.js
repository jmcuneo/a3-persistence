const mongoose = require('mongoose');

const ToDoItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    creationDate: {
        type: String,
        default: false,
    },
    priority: {
        type: Number,
        required: false,
    },
    recommendedDeadline: {
        type: String,
        required: false,
    },
});

const UserSchema = new mongoose.Schema({
  authId: {
    type: String,
    required: true,
    unique: true,
  },
  toDoList: [ToDoItemSchema],
});

module.exports = mongoose.model('User', UserSchema);