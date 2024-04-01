const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const user = new mongoose.Schema({
    username: {type: String, unique: true},
    password: {type: String}
})

user.pre("save", async function(next) {
    const user = this
    if (!user.isModified("password")) return next()
    try{
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt)
        next()
    }
    catch(error){
        return next(error)
    }
})

user.statics.authenticate = async function(username, password){
    const user = await this.findOne({username})
    if (!user){
        throw new Error("User not found")
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch){
        throw new Error("Incorrect password")
    }
    return user
}

user.statics.serializeUser = function(user, done) {
    done(null, user.id)
}

user.statics.deserializeUser = function(id, done){
    this.findById(id, function(error, user) {
        done(error, user)
    })
}


const User = mongoose.model("User", user)

module.exports = User