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
      var session = require('express-session');
      var GitHubStrategy = require('passport-github2').Strategy;

    
//No extra steps to serialize the user. Just use the whole object for simplicity.
passport.serializeUser(function(user, done) {
  done(null, user);
});

//See comment above.
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`

//Set up DB object
const clientDB = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let collection = null;

//Initialize DB connection
async function runDB() {
  await clientDB.connect()
  collection = await clientDB.db("datatest").collection("test")
}

runDB();

//When a post is submitted
const handlePost = function(request, response) {
  // If the user isn't logged in, don't do anything special.
    if(!request.session || !request.session.passport){
      return;
    }
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
      case "refresh":
        handleRefresh(response,data);
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

//When a request comes in to refresh (modify) an entry, update it in the DB and send back the new anagrams.
const handleRefresh = async function(response, data){
  var id = data.index;
  var currentValue = await collection.find({_id:new ObjectId(id)}).toArray();
  if(currentValue.length == 0){
    response.writeHead(409, "ERROR",{"Content-Type":"text/plain"});
    response.end();
  }else{
    let val = currentValue[0];
    let anagrams = anagram.getAnagrams(val.string,val.dict,4);
    await collection.updateOne({_id:new ObjectId(id)},{$set: {
      gram0:anagrams[0],
      gram1:anagrams[1],
      gram2:anagrams[2],
      gram3:anagrams[3]
    }});
    response.writeHead( 200, "OK", {"Content-Type": "text/plain" });
    response.end(JSON.stringify({anagrams:anagrams}));
  }
}

//Give the client all appdata associated with their user id.
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

//Set up OAuth for Github
//followed tutorial from https://github.com/cfsghost/passport-github/tree/master/examples/login
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_ID,
  clientSecret: process.env.GITHUB_SECRET,
  callbackURL: "https://a3-milojacobs.onrender.com/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      //Use the full user OBJ
      return done(null, profile);
    });
  }
));

//Passport and session setup
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());


app.get('/',function(req,res){
  if(req.user){
    // If we've successfully logged in, give the user the main page.
    res.sendFile(__dirname+'/public/index.html')
  }else{
    // Otherwise, redirect them to the login page.
    res.redirect('/login');
  }
})

//Login page
app.get('/login',function(req,res){
  res.sendFile(__dirname+'/public/login.html');
});

//Followed from https://github.com/cfsghost/passport-github/tree/master/examples/login
//Authenticate via Github.
app.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }),
  function(req, res){
    // The request will be redirected to GitHub for authentication, so this
    // function will not be called.
});

//Followed from https://github.com/cfsghost/passport-github/tree/master/examples/login
//Redirect back home once logged in
app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

//Modified from https://github.com/cfsghost/passport-github/tree/master/examples/login
//On logout, bring back to home page.
app.get('/logout', function(req, res){
  req.logout((res,req)=>{});
  res.redirect('/');
});

//Make sure DB is working
app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
});

//Use the public directory as static
app.use(express.static('public'));

//All post requests go through /submit.
app.post('/submit',handlePost);

// console.log(process.env.port);
app.listen(process.env.PORT);