const express = require('express')
const dotenv = require('dotenv') //for .env file
const connectDb = require('./db')
const exphbs = require('express-handlebars')
const passport = require('passport')
const session = require('express-session')
const path = require('path')
//const {Strategy: GitHubStrategy} = require("passport-github");
const GitHubStrategy = require('passport-github').Strategy;

//load the .env file in config, which contains personal information for connections
dotenv.config({path: './config/.env'})

//passport config for github authentication
//require('./config/passport')(passport)

connectDb()

const app = express()


//set handlebars and middleware
app.engine('handlebars', exphbs.engine({defaultLayout: 'main', extname:'handlebars'}))
app.set('view engine', 'handlebars')

//sessions middleware
app.use(session({
    secret: 'cs4241a3-billingsystems',
    resave: false,
    saveUninitialized: false,
    cookie: { //store in server, not browser
        httpOnly: true,
        secure: false, //use http, so false
        maxAge: 24*60*60*1000 //for one day
    }
}))

//set passport middleware
app.use(passport.initialize())
app.use(passport.session())

app.use(express.static(path.join(__dirname, 'public')))

//call the routes
app.use('/', require('./routes/routes'))

app.use(passport.initialize())
app.use(passport.session())
//for sessions
passport.serializeUser(function (user,cb){
    cb(null, user.id)
})
passport.deserializeUser(function (id,cb){
    cb(null, id)
})


//github
passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
        callbackURL: "http://localhost:3000/auth/github/callback"
    },
    function(accessToken, refreshToken, profile, cb) {
    console.log(profile)
    cb(null, profile)
        //for mongodb
        // User.findOrCreate({ githubId: profile.id }, function (err, user) {
        //     return cb(err, user);
        // });
    }
));

app.get('/auth/github',
    passport.authenticate('github'));

app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }), //failure, redirect to login
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });


app.listen( process.env.PORT || 3000 )