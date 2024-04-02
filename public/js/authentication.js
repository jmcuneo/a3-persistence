const LocalStrategy = require("passport-local").Strategy
const bcrypt = require("bcrypt")

function initialize(passport, getUserByName, getUserById){
    const authenticateUser =  async (username, password, done) => {
        const user = getUserByName(username)
        if (user == null) {
            return done(null, false, {message: "No user with that name"})
        }

        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
            }
            else{
                return done(null, false, {message: "Incorrect password"})
            }
        } catch(error){
            return done(error)
        }
    }

    passport.use("local", new LocalStrategy({usernameField: "username"}, authenticateUser))
    passport.serializeUser((user,done) => {
        done(null, user.id)
    })
    passport.deserializeUser((id,done) => {
        return done(null, getUserById(id))
    })
}

module.exports = initialize