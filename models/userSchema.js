const mongoose = require("mongoose");
mongoose.set("debug", true);

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

const User = mongoose.model("user-data", userData, "user-data");


module.exports = User;