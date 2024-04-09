var compression = require('compression')
const express = require("express");
const { MongoClient } = require('mongodb');
const app = express();
const path = require("path");

app.use(compression())

const keys = require('./configs/keys');
//mongo
const uri = keys.mongodb.uri;
const client = new MongoClient( uri );
let  collection = null;
let collectionSuggest = null;
let collectionUsers = null;

//Conennect to mongo
async function run() {
  await client.connect()
  collection = await client.db("a3-db").collection("a3Collection")
  collectionSuggest = client.db("a3-db").collection("a3Suggest")
  collectionUsers = await client.db("a3-db").collection("a3Auth");

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
  keys: [keys.session.cookieKey]
}));
app.use(passport.initialize());
app.use(passport.session());


//stuff github userId in cookie
passport.serializeUser((user, done) => {
  done(null, user.githubId); // Serialize user with a unique identifier
});

passport.deserializeUser(async (id, done) => {
  const user = await collectionUsers.findOne({ "githubId": id }); // Find user by ID
  done(null, user);
  } 
);

passport.use(new GitHubStrategy({
  clientID: keys.github.clientID,
  clientSecret: keys.github.clientSecret,
  callbackURL: "/auth/github/redirect"
}, async (accessToken, refreshToken, profile, done) => {
  const currentUser = await collectionUsers.findOne({githubId: profile.id});
  if(currentUser){
      console.log('user is: ', currentUser);
      done(null, currentUser);
  } else{
      const userInfo = {
          username: profile.displayName,
          githubId: profile.id
      }
      const newUser = await collectionUsers.insertOne(userInfo);
      console.log('new user: ', newUser);
      done(null, newUser);
  }
}));


// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
app.use(express.static(path.join(__dirname, 'public')));

app.get('/logout', (req, res) => {
  console.log("log out successful");
  req.logout();
  res.redirect('/');
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
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/////////////////////////////////////////////////////////////////////////////////////
app.use(express.json()); //middleware for json

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
  console.log("cookie: ", req.user.username);
  console.log(req.body);
  let data = req.body;
  console.log(data);
  for(let i = 0; i < appdata.length; i++){
    if(data.item == appdata[i].item){
      console.log("item already logged!");
      res.send(JSON.stringify("Item already logged!"));
      return;
    } 
  }
  var entry = {
    tableId: (appdata.length + 1),
    name: req.user.username,
    item: data.item,
    price: data.price,
    qty: data.qty, 
    cost: data.price * data.qty
  };
  console.log("length ", (appdata.length + 1));
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
  // Check if indexToRemove is valid/
  
  if (isNaN(indexToRemove) || indexToRemove < 0 || indexToRemove >= appdata.length) {
    return res.status(400).send(JSON.stringify("Invalid index"));
  }

  //check if the user has the authority to remove the item
  if(appdata[indexToRemove].name != req.user.username){
    console.log("you cannot remove other peoples data");
    res.send(JSON.stringify("You cannot remove other user's items"));
  } 
  else {
    const remove = appdata[indexToRemove];  

  // Use the attribute 'name' of the object to remove data from MongoDB
  const result = await collection.deleteOne({"name": remove.name, "item": remove.item, "_id": remove._id})
  
  console.log(result);
  appdata.splice(indexToRemove, 1); // Remove the entry from the array
  res.send(appdata);
  }
  
});

let mongoDataLoaded = false;
let suggestMongoLoaded = false

app.post("/refresh", express.json(), async (req, res) => {
  if (!mongoDataLoaded) {
    // Load all data from MongoDB only if it hasn't been loaded before
    const mongoData = await collection.find({}).toArray();
    for(let i = 0; i < mongoData.length; i++){
       if(mongoData[i].name != req.user.username){
        mongoData[i].cost = "";
        //how to limit what user sees here???
      }
      appdata.push(mongoData[i]);
    }
    if (!suggestMongoLoaded) {
      const mongoDataSuggest = await collectionSuggest.find({}).toArray();
      for(let j = 0; j < mongoDataSuggest.length; j++){
        suggestdata.push(mongoDataSuggest[j]);
      }
    mongoDataLoaded = true; // Set the flag to true to indicate data has been loaded
    suggestMongoLoaded = true;
  }
}
  else{
    console.log("mongo already loaded");
  }
  let bothArrays = {
    appdata: appdata,
    suggestdata: suggestdata,
  }
  console.log("Suggest data:", bothArrays.suggestdata)
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
  let repeat = 0;
  for(let i = 0; i < appdata.length; i++){
    if(appdata[i].item == entry.Sitem){
      console.log("repeat", repeat);
      repeat++;
    }
  }
  if(repeat > 0){
    console.log("cannot add suggestion");
    res.send(JSON.stringify("This item is already logged!"));
  }else{
    suggestdata.push(entry);
    console.log("req: ", entry);
    const result = await collectionSuggest.insertOne(entry)
    res.send(JSON.stringify(suggestdata));
  }
  
});

const getindex = function(data){
  let index;
  console.log("index on init: ", index);
  for(let i = 0; i < appdata.length; i++){
    // console.log("name assoc with item: ", appdata[i].username);
    // console.log("req.user.name: ", req.user.username);
    if(appdata[i].item == data.ogItem){
      index = i;
    }
  }
  console.log("after loop index: ", index);
  return index;
}
app.post("/edit", express.json(), async (req, res) => {
  let data = req.body;
  const index = getindex(data);

    if(index == undefined){
      console.log("No item exists");
      res.send(JSON.stringify("Enter a valid item"));
      return;
    }

  if (data.edit === "item") {
    const filter = { item: data.ogItem }; // Filter to find the document by the original item
    const foundItem = await collection.findOne(filter);

    if (foundItem && foundItem.name === req.user.username) {
        // The item is found, and the associated name matches req.user.username
        const updateFilter = { _id: foundItem._id }; // Filter to update the found item
        const update = { $set: { item: data.newitem } }; // Update operation to set the new item

        // Use updateOne to update the document matching the filter
        const result = await collection.updateOne(updateFilter, update);

        console.log("mongo: ", result);
        appdata[index].item = data.newitem;
    } else {
        // Either the item is not found or the associated name doesn't match
        console.log("Item not found or unauthorized to update.");
        res.send(JSON.stringify("Item not found or unauthorized to update."));
        return;
    }
    
  }
  if (data.edit === "qty") {
    const filter = { item: data.ogItem }; // Filter to find the document by the original item
    const foundItem = await collection.findOne(filter);

    if (foundItem && foundItem.name === req.user.username) {
        // The item is found, and the associated name matches req.user.username
        const updateFilter = { _id: foundItem._id }; // Filter to update the found item
        const update = { $set: { qty: data.newitem } }; // Update operation to set the new item

        // Use updateOne to update the document matching the filter
        const result = await collection.updateOne(updateFilter, update);

        console.log("mongo: ", result);
        appdata[index].qty = data.newitem;
    } else {
        // Either the item is not found or the associated name doesn't match
        console.log("Item not found or unauthorized to update.");
        res.send(JSON.stringify("Item not found or unauthorized to update."));
        return;
    }
    
  }
  if (data.edit === "price") {
    const filter = { item: data.ogItem }; // Filter to find the document by the original item
    const foundItem = await collection.findOne(filter);

    if (foundItem && foundItem.name === req.user.username) {
        // The item is found, and the associated name matches req.user.username
        const updateFilter = { _id: foundItem._id }; // Filter to update the found item
        const update = { $set: { 
          price: data.newitem,
          cost: ((parseInt(data.newitem)) * appdata[index].qty)
         } 
        }; // Update operation to set the new item
        
        // Use updateOne to update the document matching the filter
        const result = await collection.updateOne(updateFilter, update);

        console.log("mongo: ", result);
        appdata[index].price = data.newitem;
    } else {
        // Either the item is not found or the associated name doesn't match
        console.log("Item not found or unauthorized to update.");
        res.send(JSON.stringify("Item not found or unauthorized to update."));
        return;
    }
    
  }
  console.log("appdata array new: ", appdata);
  res.send(JSON.stringify(appdata));
});
  

//Handle Bring
app.post("/bring", express.json(), async (req, res) => {
  const indexToRemove = req.body.suggestIndex;
  // Check if indexToRemove is valid/
  const name = req.user.username;
  if (isNaN(indexToRemove) || indexToRemove < 0 || indexToRemove >= suggestdata.length) {
    return res.status(400).send(JSON.stringify("Invalid index"));
  }
  const remove = suggestdata[indexToRemove];
  const newData = {tableId: (appdata.length + 1), name: name, item: suggestdata[indexToRemove].Sitem, price: "",qty: suggestdata[indexToRemove].Sqty, cost:""};
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
