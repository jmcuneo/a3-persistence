const mongoose = require("mongoose");

const shiftData = new mongoose.Schema({
    id: {
        required: true,
        type: Number
    },
    user: {
        required: true,
        type: String
    },
    date: {
        required: true,
        type: String
    },
    start: {
        required: true,
        type: String
    },
    end: {
        required: true,
        type: String
    },
})

const Shift = mongoose.model("shifts", shiftData, "shifts");


module.exports = Shift;