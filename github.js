const express = require("express");
const app = express();
var GitHubStrategy = require("passport-github2").Strategy;
const passport = require("passport");
const env = require("dotenv").config();
var session = require("express-session");
const path = require("path");

var util = require("util");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var partials = require("express-partials");
var db = require("./database")

app.set("trust proxy", 0); // trust first proxy
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);
app.use(partials());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:3001/auth/callback/github",
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOrCreate({ githubId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  )
);

app.use(express.static(path.join(__dirname, "public")));
app.use(passport.initialize());
/* app.use(passport.session()); */

app.use(express.static("public"));
app.use(express.static("views"));

app.get(
  "/auth",
  passport.authenticate("github", { scope: ["user:email"] }),
  function (req, res) {
    //console.log('req made')
  }
);
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "register.html"))
});

app.post("/register/new-user", (req, res) => {
  let rsp = db.userExists(req.body);
  rsp.then(result => {
    if(result){
      res.sendStatus(200);
    } else{
      res.status(400).send("User Exists");
    }
  });
})
app.get(
  "/auth/callback/github",
  passport.authenticate("github", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);
app.listen(process.env.PORT || 3001);
