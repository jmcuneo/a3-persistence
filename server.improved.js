const express = require("express");
//const { MongoClient } = require('mongodb');
const app = express();
const path = require("path");
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');

const passportSetup = require('./configs/passport-setup');
const keys = require('./configs/keys');
const { run } = require('./mongo.js');
const { client } = require('./mongo.js');
const cookieSession = require('cookie-session');
const passport = require('passport');
//var session = require('express-session');

app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: [keys.session.cookieKey]
}));


app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

app.use(session({
  secret: 'paperscissorsrock',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true }
}));
app.use(passport.initialize());
app.use(passport.session());


app.use(express.json()); //middleware for json


// Serve static files from the 'public' directory
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
app.use(express.static(path.join(__dirname, 'public')));


let collection = null

async function startServer() {
  const db = await run(); // Get database connection
  // Your server setup code here
  collection = db.collection("a3Collection")
  const collectionSuggest = db.collection("a3Suggest")

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
  return client.db('a3-db');
};


startServer();

module.exports = { app };
/*
//const uri = "mongodb+srv://ngcleary:45Richfield@cluster0.yywwl2c.mongodb.net/?retryWrites=true&w=majority";
const uri = keys.mongodb.uri;
const client = new MongoClient( uri )
module.exports = client;

let collection = null

async function run() {
  await client.connect()
  collection = await client.db("a3-db").collection("a3Collection")
  collectionSuggest = client.db("a3-db").collection("a3Suggest")
  //collectionAuth = client.db("a3-db").collection("a3Auth");

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
  //return client.db('a3-db');
};*/
//run();





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
