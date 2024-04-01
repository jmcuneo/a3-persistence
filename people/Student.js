const mongoose = require("mongoose")

const student = new mongoose.Schema({
    name: {type: String},
    credits: {type: Number},
    classStanding: {type: String},
    classOf: {type: Number}
})

const Student = mongoose.model("Student", student)

module.exports = Student