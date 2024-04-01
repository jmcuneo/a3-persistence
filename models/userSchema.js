const mongoose = require("mongoose");
mongoose.set("debug", true);

const userData = new mongoose.Schema(
    { 
        user: { type: String, required: true },
        idLast: { type: Number, required: true }
    },
    {
        collection: "user-data"
    }
)

const User = mongoose.model("UserData", userData);

module.exports = User;