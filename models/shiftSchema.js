const mongoose = require("mongoose");

const shiftSchema = new mongoose.Schema({
    id: {
        required: true,
        type: Number
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
    duration: {
        required: true,
        type: Number
    }
})

module.exports = mongoose.model('Data', shiftSchema)