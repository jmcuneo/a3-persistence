const fs   = require( "fs" ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you're testing this on your local machine.
      // However, Glitch will install it automatically by looking in your package.json
      // file.
      mime = require( "mime" ),
      anagram = require("./anagram"),
      dir  = "public/",
      port = 3000,
      express = require("express"),
      app = express();

      // var express = require('express');
      var passport = require('passport');
      var util = require('util');
      var session = require('express-session');
      var bodyParser = require('body-parser');
      var methodOverride = require('method-override');
      var GitHubStrategy = require('passport-github2').Strategy;
      var partials = require('express-partials');

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`

const clientDB = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let collection = null;

async function runDB() {
  await clientDB.connect()
  collection = await clientDB.db("datatest").collection("test")

  // // route to get all docs
  // app.get("/docs", async (req, res) => {
  //   if (collection !== null) {
  //     const docs = await collection.find({userId:req.session.passport.user.id}).toArray()
  //     // const docs = await collection.find({}).toArray()
  //     res.json( docs )
  //   }
  // })
}

runDB();

const handlePost = function(request, response) {
  // console.log(request.session);
    let userId = request.session.passport.user.id;
    // console.log("HANDLING POST");
    let data = request.body;
    console.log("DATA",data);
    var type = data.type;
    switch(type){
      //Entry is a new anagram request
      case "anagram":
        handleNewEntry(response,data,userId);
        break;
      //Entry is a request to remove a specific anagram.
      case "remove":
        handleRemove(response,data);
        break;
      //Entry is a request to get all current appdata.
      case "getAll":
        handleGetAll(response,userId);
        break;
    }
}

//When a new anagram request comes, sends back the new appdata entry.
const handleNewEntry = async function(response,data,userId){
  var string = data.string;
  var dict = data.dict;
  var anagrams = anagram.getAnagrams(string,dict,4);
  //Send this back as a unique identifier, which will allow the client to delete entries.
  let nextData = {
    userId:userId,
    string:string,
    dict:dict,
    gram0:anagrams[0],
    gram1:anagrams[1],
    gram2:anagrams[2],
    gram3:anagrams[3]
  };
  const result = await collection.insertOne(nextData);
  nextData.id = result.insertedId;
  //TODO: Use result in some way
  console.log(anagrams);

  response.writeHead( 200, "OK", {"Content-Type": "text/plain" });
  response.end(JSON.stringify(nextData));
}

//When a request comes in to remove, remove it from appdata and send back the ID the server removed.
const handleRemove = async function(response, data){
  var removeVal = data.index;
  const result = await collection.deleteOne({
    _id:new ObjectId(removeVal)
  });
  response.writeHead( 200, "OK", {"Content-Type": "text/plain" });
  response.end(JSON.stringify(result));
}

//Give the client all appdata
const handleGetAll = async function(response,userId){
  if(collection===null){
    response.writeHead(409, "ERROR",{"Content-Type":"text/plain"});
    response.end();
  }else{
    response.writeHead( 200, "OK", {"Content-Type": "text/plain" });
    const docs = await collection.find({userId:userId}).toArray()
    response.end(JSON.stringify(docs));
  }
}

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_ID,
  clientSecret: process.env.GITHUB_SECRET,
  callbackURL: "https://a3-milojacobs.onrender.com/auth/github/callback"
},
function(accessToken, refreshToken, profile, done) {
  // asynchronous verification, for effect...
  process.nextTick(function () {
    
    // To keep the example simple, the user's GitHub profile is returned to
    // represent the logged-in user.  In a typical application, you would want
    // to associate the GitHub account with a user record in your database,
    // and return that user instead.
    return done(null, profile);
  });
}
));


app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());


app.get('/',function(req,res){
  if(req.user){
    // console.log(req.user);
    res.sendFile(__dirname+'/public/index.html')
  }else{
    res.redirect('/login');
  }
})

app.get('/login',function(req,res){
  res.sendFile(__dirname+'/public/login.html');
});

app.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }),
  function(req, res){
    // The request will be redirected to GitHub for authentication, so this
    // function will not be called.
});

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout((res,req)=>{});
  res.redirect('/');
});

app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
});

app.use(express.static('public'));

app.post('/submit',handlePost);

console.log(process.env.port);
app.listen(process.env.PORT);