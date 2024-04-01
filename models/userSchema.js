const mongoose = require("mongoose");
mongoose.set("debug", true);

const userData = new mongoose.Schema({
    user: String,
    idLast: String
})

const User = mongoose.model("user-data", userData, "user-data");


module.exports = User;