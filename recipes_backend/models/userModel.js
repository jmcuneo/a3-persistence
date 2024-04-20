const mongoose = require("mongoose")
const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please add the user name"],
    },
    // user_id: {
    //     type: Number,
    //     required: [true, "Please add the user id"]
    // },
    email: {
        type: String,
        required: [true, "Please add the user email"],
        unique: [true, "Email address already taken"],
    },
    password: {
        type: String,
        required: [true, "Please add the user password"],
    },
}, {
    timestamps: true,
});
module.exports = mongoose.model("User", userSchema);