// const express = require('express')
// const dotenv = require('dotenv') //for .env file
// const connectDb = require('./db')
// const exphbs = require('express-handlebars')
// //const passport = require('passport')
// const session = require('express-session')
// const path = require('path')
// const methodOverride = require('method-override')
// const bodyParser = require('body-parser');
// //const {Strategy: GitHubStrategy} = require("passport-github");
// const GitHubStrategy = require('passport-github').Strategy;

// //load the .env file in config, which contains personal information for connections
// dotenv.config({path: './config/.env'})

// connectDb()

// //passport config for github authentication
// require('./config/passport')(passport)


// const app = express()

// //body parser for middleware to handle form data
// app.use(express.urlencoded({extended:false}))
// app.use(bodyParser.urlencoded({extended:true}));
// app.use(express.json())

// //method override for PUT and DELETE
// app.use(methodOverride(function (req, res) {
//     if (req.body && typeof req.body === 'object' && '_method' in req.body) {
//         // look in urlencoded POST bodies and delete it
//         let method = req.body._method
//         delete req.body._method
//         return method
//     }
// }))

// //set handlebars and middleware
// app.engine('handlebars', exphbs.engine({defaultLayout: 'main', extname:'handlebars'}))
// app.set('view engine', 'handlebars')

// //sessions middleware
// app.use(session({
//     secret: 'cs4241a3-billingsystems',
//     resave: false,
//     saveUninitialized: false,
//     // cookie: { //store in server, not browser
//     //     httpOnly: true,
//     //     secure: false, //use http, so false
//     //     maxAge: 24*60*60*1000 //for one day
//     // }
// }))

// //set passport middleware
// app.use(passport.initialize())
// app.use(passport.session())

// app.use(express.static(path.join(__dirname, 'public')))

// //call the routes
// app.use('/auth', require('./routes/auth'))
// app.use('/', require('./routes/routes'))


// //set global var
// // app.use(function (req, res, next){
// //     res.locals.user = req.user || null
// //     next()
// // })

// // app.use(passport.initialize())
// // app.use(passport.session())
// // //for sessions
// // passport.serializeUser(function (user,cb){
// //     cb(null, user.id)
// // })
// // passport.deserializeUser(function (id,cb){
// //     cb(null, id)
// // })
// //
// //
// // //github
// // passport.use(new GitHubStrategy({
// //         clientID: process.env.GITHUB_ID,
// //         clientSecret: process.env.GITHUB_SECRET,
// //         callbackURL: "http://localhost:3000/auth/github/callback"
// //     },
// //     function(accessToken, refreshToken, profile, cb) {
// //     console.log(profile)
// //     cb(null, profile)
// //         //for mongodb
// //         // User.findOrCreate({ githubId: profile.id }, function (err, user) {
// //         //     return cb(err, user);
// //         // });
// //     }
// // ));
// //
// // app.get('/auth/github',
// //     passport.authenticate('github'));
// //
// // app.get('/auth/github/callback',
// //     passport.authenticate('github', { failureRedirect: '/login' }), //failure, redirect to login
// //     function(req, res) {
// //         // Successful authentication, redirect home.
// //         res.redirect('/');
// //     });


// app.listen( process.env.PORT || 3000 )

const express = require('express')
const dotenv = require('dotenv') //for .env file
const connectDb = require('./db')
const exphbs = require('express-handlebars')
// const passport = require('passport')
const session = require('express-session')
const path = require('path')
const methodOverride = require('method-override')
const bodyParser = require('body-parser');
//const {Strategy: GitHubStrategy} = require("passport-github");
const GitHubStrategy = require('passport-github').Strategy;

//load the .env file in config, which contains personal information for connections
dotenv.config({path: './config/.env'})

connectDb()

//passport config for github authentication
const passport = require('./config/passport');


const app = express()

//body parser for middleware to handle form data
app.use(express.urlencoded({extended:false}))
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json())

//method override for PUT and DELETE
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        let method = req.body._method
        delete req.body._method
        return method
    }
}))

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
app.use('/auth', require('./routes/auth'))
app.use('/', require('./routes/routes'))


//set global var
// app.use(function (req, res, next){
//     res.locals.user = req.user || null
//     next()
// })

// app.use(passport.initialize())
// app.use(passport.session())
// //for sessions
// passport.serializeUser(function (user,cb){
//     cb(null, user.id)
// })
// passport.deserializeUser(function (id,cb){
//     cb(null, id)
// })
//
//pas
// //github
// passport.use(new GitHubStrategy({
//         clientID: process.env.GITHUB_ID,
//         clientSecret: process.env.GITHUB_SECRET,
//         callbackURL: "http://localhost:3000/auth/github/callback"
//     },
//     function(accessToken, refreshToken, profile, cb) {
//     console.log(profile)
//     cb(null, profile)
//         //for mongodb
//         // User.findOrCreate({ githubId: profile.id }, function (err, user) {
//         //     return cb(err, user);
//         // });
//     }
// ));
//
// app.get('/auth/github',
//     passport.authenticate('github'));
//
// app.get('/auth/github/callback',
//     passport.authenticate('github', { failureRedirect: '/login' }), //failure, redirect to login
//     function(req, res) {
//         // Successful authentication, redirect home.
//         res.redirect('/');
//     });


app.listen( process.env.PORT || 3000 )