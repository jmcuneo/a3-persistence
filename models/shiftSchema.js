const mongoose = require("mongoose");

const shiftSchema = new mongoose.Schema({
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

module.exports = mongoose.model('ShiftSchema', shiftSchema)