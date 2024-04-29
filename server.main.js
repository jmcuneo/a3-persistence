const express = require("express");
const app = express();
const env = require("dotenv").config();
const path = require("path");

const https = require('https'),
  http = require('http')


var bodyParser = require("body-parser");


var db = require("./database")
var auth = require("./jwt")


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
/* passport.use(
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
); */

app.use(express.static(path.join(__dirname, "public")));
/* app.use(passport.initialize()); */
/* app.use(passport.session()); */

app.use(express.static("public"));
app.use(express.static("views"));

/* app.get(
  "/auth",
  passport.authenticate("github", { scope: ["user:email"] }),
  function (req, res) {
    //console.log('req made')
  }
); */
app.get("/.well-known/acme-challenge/9U-w4A3qkGMJV4RvyxHD_5DfmlqPs10gTplTTrY1_xo", (req, res) => {
  res.send("9U-w4A3qkGMJV4RvyxHD_5DfmlqPs10gTplTTrY1_xo.JnjgCrFUId2HcMMJIvR7NfXpoP-Ra5HmZZf2pQdmFFM").end();
})
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.post("/login/auth", (req, res) => {
  /* dba means database action!! */
  let dba = db.attemptLogin(req.body);
  dba.then(result => {
    if(result){
      const token = auth.generateAccessToken({ username: req.body.username })
      res.status(200).json(token);
    } else{
      res.status(400).send("bad login");
    }
  })
});
app.get('/auth/user-data', auth.authenticateToken, (req, res) => {
  console.log("success????")
})
app.post('/auth/user-data/add-cat', auth.authenticateToken, (req, res) =>{
  console.log(req.user.username,req.body);
  let dba = db.addCatDataByUsername(req.user.username, req.body)
  dba.then(result => {
    if(result){
      res.status(200).send({ message: "successfully added a cat"});
    }else {
      res.status(400).send({ message: "uhoh"});
    }
  })
});
app.post('/auth/user-data/delete-cat', auth.authenticateToken, (req, res) =>{
  console.log(req.user.username,req.body);
  let dba = db.deleteCatDataByUsername(req.user.username, req.body)
  dba.then(result => {
    if(result){
      res.status(200).send({ message: "successfully deleted a cat"});
    }else {
      res.status(400).send({ message: "uhoh"});
    }
  })
});
app.post('/auth/user-data/fetch-cats', auth.authenticateToken, (req, res) =>{
  console.log(req.user.username,req.body);
  console.log(req.user.file);
  let dba = db.getCatDataByUsername(req.user.username)
  dba.then(result => {
    if(result){
      console.log(result);
      res.status(200).send(result);
    }else {
      res.status(400).send({ message: "uhoh"});
    }
  })
});
/* 
  this wont work with this version of mongodb, im either just going to say fuck the whole thing or
  figure it out some other way
  app.post("/upload/image", storage.upload.single("avatar"), (req, res) => {
  const file = req.file

  // Respond with the file details
  res.send({
    message: "Uploaded",
    id: file.id,
    name: file.filename,
    contentType: file.contentType,
  })
}) */

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "register.html"))
});
app.get("/user-data", (req,res) => {
  res.sendFile(path.join(__dirname, "public", "user-data.html"))
})
app.post("/register/new-user", (req, res) => {
  let rsp = db.userExists(req.body);
  rsp.then(result => {
    console.log("reslu",result);
    if(result!=0){
      const token = auth.generateAccessToken({ username: req.body.username })
      res.status(200).json(token);
    } else{
      res.status(400).send("User Exists");
    }
  })
  .catch(err => {
    console.log("res",err);
    res.status(500).send("internal server error")
    
  });
})
/* app.get(
  "/auth/callback/github",
  passport.authenticate("github", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
); */


app.listen(80);
