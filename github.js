const express = require('express')
const app = express()
var GitHubStrategy = require('passport-github2').Strategy
const passport = require('passport')
const env = require('dotenv').config()
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/github/callback"
    },
    function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ githubId: profile.id }, function (err, user) {
        return done(err, user);
    });
    }
));

app.use(express.static('public'))
app.use(express.static('views'))

app.get("/auth", passport.authenticate('passport-github2'));


app.listen(process.env.PORT || 3000)

