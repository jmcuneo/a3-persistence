const passport = require('passport');
const GitHubStrategy = require('passport-github');
const keys = require('./keys');
const { run } = require('../mongo.js');

passport.serializeUser((user, done) => {
    //Take piece of info from user to send
    done(null, user._id); //send the idea and put into cookie

})

passport.deserializeUser((id, done) => {
    users.findOne({"id": id}).then((user) => {
        done(null, user.id);
    })
})

const storeUserInfo = async function(userData, done) {
    const db = await run(); // Get database connection
    const users = db.collection("collectionAuth")
    //check if user already exists
    const currentUser = await users.findOne({githubId: userData.githubId});
    if(currentUser){
        //already have user
        console.log('user is: ', currentUser);
        done(null, currentUser); //null is error
    } else{
        //create new
        const newUser = await users.insertOne(userData);
        console.log('new user: ', newUser);
        done(null, newUser);
    }
    /*
    try {
        // Insert user data into MongoDB
        await users.insertOne(userData);
        console.log('User data stored in MongoDB: ', userData);
    } catch (error) {
        console.error('Error storing user data in MongoDB:', error);
    }*/
}
module.exports = { storeUserInfo };
passport.use(new GitHubStrategy({
    clientID: keys.github.clientID,
    clientSecret: keys.github.clientSecret,
    callbackURL: "/auth/github/redirect"
  }, (accessToken, refreshToken, profile, done) => {
    //check if user already exists in mongodb
    const userInfo = {
        unsername: profile.displayName,
        githubId: profile.id
    }
    storeUserInfo(userInfo, done);
  })

);


