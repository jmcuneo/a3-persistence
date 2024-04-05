const express = require("express");
const { MongoClient } = require('mongodb');
const app = express();
const path = require("path");


const keys = require('./configs/keys');
//mongo
const uri = keys.mongodb.uri;
const client = new MongoClient( uri );
let  collection = null;
let collectionSuggest = null;
let collectionAuth = null;

//Conennect to mongo
async function run() {
  await client.connect()
  collection = await client.db("a3-db").collection("a3Collection")
  collectionSuggest = client.db("a3-db").collection("a3Suggest")
  collectionAuth = client.db("a3-db").collection("a3Auth");

  // route to get all docs
  app.get("/docs", async (req, res) => {
    if (collection !== null) {
      const docs = await collection.find({}).toArray()
      res.json( docs )
    }
  })
  app.get("/docsSuggest", async (req, res) => {
    if (collectionSuggest !== null) {
      const docsSuggest = await collectionSuggest.find({}).toArray()
      res.json( docsSuggest )
    }
  })
};
run();

//start cookies/passport
const cookieSession = require('cookie-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github');


app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: ['yes'] //[keys.session.cookieKey]
}));
app.use(passport.initialize());
app.use(passport.session());


//stuff github userId in cookie
passport.serializeUser((user, done) => {
  //await startDb(); // Ensure allusers is initialized
  
  done(null, user.githubId); // Serialize user with a unique identifier
  console.log('serializing: ', user);
});

passport.deserializeUser(async (id, done) => {
  const user = await collectionAuth.findOne({ "githubId": id }); // Find user by ID
  console.log("user in deserialize:", user);
  console.log("id in deserialize:", id);
  done(null, user);
  } 
);

passport.use(new GitHubStrategy({
  clientID: keys.github.clientID,
  clientSecret: keys.github.clientSecret,
  callbackURL: "/auth/github/redirect"
}, async (accessToken, refreshToken, profile, done) => {
  const currentUser = await collectionAuth.findOne({githubId: profile.id});
  if(currentUser){
      console.log('user is: ', currentUser);
      done(null, currentUser);
  } else{
      const userInfo = {
          username: profile.displayName,
          githubId: profile.id
      }
      const newUser = await collectionAuth.insertOne(userInfo);
      console.log('new user: ', newUser);
      done(null, newUser);
  }
}));


// Routes
app.get('/login', (req, res) =>{
  res.render('login')
})

app.get('/auth/github', passport.authenticate('github', {
  scope: ['profile']
}));


//callback route for github -> tell passport to give us the profile info from the code
app.get('/auth/github/redirect', passport.authenticate('github'), (req, res) => {
  res.redirect('/profile/');
});

// Secret route
app.get('/profile', (req, res) => {
  res.send(`profile: ` + req.user.username);
});

/////////////////////////////////////////////////////////////////////////////////////
app.use(express.json()); //middleware for json


// Serve static files from the 'public' directory
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
app.use(express.static(path.join(__dirname, 'public')));

//arrays
const appdata = [];
const suggestdata = [];

//check mongo connection
app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
});

//Handle Submit
app.post("/submit", express.json(), async (req, res) => {
  console.log(req.body);
  let data = req.body;
  console.log(data);
  var entry = {
    name: data.name,
    item: data.item,
    price: data.price,
    qty: data.qty, 
    cost: data.price * data.qty
  };
  appdata.push(entry);
  console.log("req: ", entry);
  const result = await collection.insertOne(entry)
  let bothArrays = {
    appdata: appdata,
    suggestdata: suggestdata
  };
  req.json = JSON.stringify(bothArrays);
  res.send(req.json);
});

//Handle Remove
app.post("/remove", express.json(), async (req, res) => {
  //get data to remove

  const indexToRemove = req.body.entryIndex;
  console.log("index to remove NaN: ", isNaN(indexToRemove))
  console.log("index to remove: ", indexToRemove)
  
  // Check if indexToRemove is valid/
  
  if (isNaN(indexToRemove) || indexToRemove < 0 || indexToRemove >= appdata.length) {
    return res.status(400).send(JSON.stringify("Invalid index"));
  }


  // Get data to remove from appdata array using index
  const remove = appdata[indexToRemove];
  console.log("appdata: ", appdata)
  console.log("item to remove: ", remove);
  
  // Use the attribute 'name' of the object to remove data from MongoDB
  const result = await collection.deleteOne({"name": remove.name, "item": remove.item, "_id": remove._id})
  
  console.log(result);
  appdata.splice(indexToRemove, 1); // Remove the entry from the array
  console.log("Updated appdata: ", appdata);

  res.send(appdata);
});

//Handle Refresh
app.post("/refresh", (req, res) => {
  let bothArrays = {
    appdata: appdata,
    suggestdata: suggestdata,
  };
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(bothArrays));
});

//Handle Suggest
app.post("/suggest", express.json(), async (req, res) => {
  console.log(req.body);
  let data = req.body;
  console.log(data);
  var entry = {
    Sitem: data.Sitem,
    Sqty: data.Sqty, 
  };
  suggestdata.push(entry);
  console.log("req: ", entry);
  const result = await collectionSuggest.insertOne(entry)
  res.send(JSON.stringify(suggestdata));
});

//Handle Bring
app.post("/bring", express.json(), async (req, res) => {
  const indexToRemove = req.body.suggestIndex;
  //console.log("index to remove NaN: ", isNaN(indexToRemove))
  //console.log("index to remove: ", indexToRemove)
  
  // Check if indexToRemove is valid/
  
  if (isNaN(indexToRemove) || indexToRemove < 0 || indexToRemove >= suggestdata.length) {
    return res.status(400).send(JSON.stringify("Invalid index"));
  }
  const remove = suggestdata[indexToRemove];
  const newData = {name:"", item: suggestdata[indexToRemove].Sitem, price: "",qty: suggestdata[indexToRemove].Sqty};
  suggestdata.splice(indexToRemove, 1); // Remove the entry from the array
  appdata.push(newData);
  console.log("index: ", indexToRemove);
  console.log("Updated suggestdata: ", suggestdata);
  console.log("after bring, updated appdata: ", appdata);

  const moveSuggest = await collectionSuggest.deleteOne({"Sitem": remove.Sitem, "Sqty": remove.Sqty, "_id": remove._id});
  const addToAppdata = collection.insertOne(newData);
    //send client both arrays -> make a new object, with both objects array inside (better way to do this??)
    let bothArrays = {
      appdata: appdata,
      suggestdata: suggestdata
    };
    req.json = JSON.stringify(bothArrays);
    res.send(req.json);
});


app.listen(process.env.PORT || 3000);
