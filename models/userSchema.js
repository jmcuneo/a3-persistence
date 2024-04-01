const mongoose = require("mongoose");

const userData = new mongoose.Schema({
    user: {
        required: true,
        type: String
    },
    idLast: {
        required: true,
        type: String
    },
})

const User = mongoose.model("user-data", userData);


module.exports = User;