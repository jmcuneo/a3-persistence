//Done with help from Web dev Simplified Node.js Passport Login System Tutorial
const crypto = require("crypto")
const LocalStrategy = require("passport-local").Strategy

function initialize(passport, getUserByUsername) {
    const authenticateUser = async (username, password, done) => {
        const user = await getUserByUsername(username)
        //returns userSchema-like object
        if (user == null) {
            return done(null, false, { message: "Username does not exist" })
        }
        try {
            const hashedPassword = crypto.scryptSync(password, user.salt, 64)
            const doPasswordsMatch = crypto.timingSafeEqual(
                Buffer.from(user.hashedPassword, 'hex'),
                hashedPassword
            );

            if (doPasswordsMatch) {
                done(null, user)
            } else {
                done(null, false, { message: "Incorrect password" })
            }
        } catch (e) {
            done(e)
        }
    }
    passport.use(new LocalStrategy({ usernameField: "username", passwordField: "password" }, authenticateUser))
    //just using username to identify users. doesnt allow renaming in the future
    passport.serializeUser((user, done) => {
        console.log(`user: ${JSON.stringify(user)}`)
        done(null, user.username)
    })
    passport.deserializeUser(async (username, done) => {
        const user = await getUserByUsername(username)

        console.log(`${username}: ${user}`)

        return done(null, user)
    })
}

module.exports = initialize