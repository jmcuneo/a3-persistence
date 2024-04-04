const express = require( 'express' );
const { MongoClient, ObjectId } = require("mongodb");
const GitHubStrategy = require("passport-github").Strategy;
const passport = require("passport");
const session = require("express-session");
const app = express();

app.use(express.static("public") );
app.use(express.static("views") );
app.use(express.json() );

app.use(session({
  secret: process.env.SESSION_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 24 * 60 * 60 * 1000 //1 Day
  },
}))

app.use(passport.initialize());
app.use(passport.session());

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient( uri )

const collection = client.db("myDatabase").collection("myCollection0");
const userCollection = client.db("myDatabase").collection("users");
const itemPool = client.db("myDatabase").collection("itemPool");

//SERIALIZE USER INTO SESSION
passport.serializeUser(function(user, cb) {
  const existingUser = userCollection.findOne({ 'githubProfile.id': user.id });
  const isNewUser = !existingUser;

  cb(null, user.id)
})

passport.deserializeUser(function(id, cb) {
  cb(null, id)
})

//Middleware to check if logged in
const isAuth = (req,res,next)=>{
  if(req.user)
    next()
  else
    res.redirect('/login')
}

//GITHUB AUTH
passport.use(new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "https://a3-jaysoncaissie.glitch.me/auth/github/callback"
  },
  async function(accessToken, refreshToken, profile, cb) {
    try {
      await client.connect();
      
      let user = await userCollection.findOne({ 'githubProfile.id': profile.id })
      if (!user) {
        user = { 
          githubProfile: profile,
          inventory: [],
          inventorySlots: 2,
          newUser: true,
        };
        await userCollection.insertOne(user);
      }
      return cb(null, profile);
    } catch(err) {
      return cb(err, null);
    }
  }
));

app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  }
);

app.get('/', isAuth, (req, res) => {
  res.sendFile(__dirname + '/')
})

app.get('/login', (req, res) =>{
  if(req.user)
    return res.redirect("/");
  res.sendFile(__dirname + '/views/login.html')
})

app.get('/logout', (req, res) =>{
  req.logOut()
  res.redirect("/login")
})

app.get('/newUser', async(req, res) =>{
  let isNewUser = true
  const user = await userCollection.findOne({ 'githubProfile.id': req.user });
  if(user.isNewUser === undefined)
    isNewUser = false
  else
    await userCollection.updateOne(
      { 'githubProfile.id': req.user },
      { $unset: { isNewUser: false } });
  res.json(isNewUser)
})

app.get('/userdata', async(req, res) =>{
  try{
    const user = await userCollection.findOne({ 'githubProfile.id': req.user });
        
    if(!user)
      return res.status(404).json({ error: "User not found" });
    res.json(user)
  } 
  catch(error){
    const errorMsg = ("Failed to get user data. ", error);
    console.error(errorMsg);
    res.status(500).json( errorMsg )
  }
})

app.post('/addOrModItem', async(req, res) =>{
  const dataObject = req.body
  let item = await itemPool.findOne({ itemName : dataObject.itemName })
  if(!item)
    await itemPool.insertOne(dataObject);
  else
    await itemPool.updateOne(
      { itemName: dataObject.itemName }, 
      { $set: { value: dataObject.value, weight: dataObject.weight }})
  res.status(200).send()
})

app.post('/', async(req, res) =>{
  const item = await itemPool.findOne({ itemName : res.body.addIcon });
  
  await userCollection.updateOne(
    { github: req.user }, 
    { $addToSet: { inventory: item } });
  await itemPool.deleteOne({ itemName: item.itemName });
  res.status(200).send()
})

app.get('/getResults', async(req, res) =>{
  const user = await userCollection.findOne({ 'githubProfile.id': req.user });
  res.json(user)
})

app.get('/getResult', async(req, res) =>{
  const itemName = req.query.itemName;
  const item = await itemPool.findOne({ itemName : itemName });
  res.json(item)
})

app.post('/delItem', async(req, res) =>{
  const dataObject = req.body
  const item = await itemPool.findOne({ itemName : dataObject.delItem })
  if(!item)
    return res.status(404).json({ error: "Item not found" });
  else
    await itemPool.deleteOne({ itemName: dataObject.delItem })
  res.status(200).send()
})

app.post('/changeNumSlots', async(req, res) =>{
  const user = await userCollection.findOne({ 'githubProfile.id': req.user });
  await userCollection.updateOne(
    { 'githubProfile.id': req.user },
    { $set: { inventorySlots: req.body.numSlots }})
  res.status(200).send()
})

app.post('/addIcon', async(req, res) =>{
  const user = await userCollection.findOne({ 'githubProfile.id': req.user });
  const item = await itemPool.findOne({ itemName: req.body.addIcon });
  await userCollection.updateOne(
    { 'githubProfile.id': req.user },
    { $addToSet: { inventory: item } });
  await itemPool.deleteOne({ itemName: req.body.addIcon });
  res.status(200).send()
})

app.post('/delIcon', async(req, res) =>{
  const user = await userCollection.findOne({ 'githubProfile.id': req.user });
  const item = await user.inventory.find(item => item.itemName === req.body.delIcon)
  await itemPool.insertOne(item);
  await userCollection.updateOne(
    { 'githubProfile.id' : req.user }, 
    { $pull: { inventory: item } });
  res.status(200).send()
})

app.get('/getInventory', async(req, res) =>{
  const user = await userCollection.findOne({ 'githubProfile.id': req.user });
  res.json( {inventory: user.inventory, inventorySlots: user.inventorySlots })
})

app.get('/getItemPool', async(req, res) =>{
  try{
    let allItems = await itemPool.find({}).toArray();
    res.json(allItems)
  }
  catch(error){
    console.error("Error retrieving items: ", error);
    res.status(500).json({ error: "Internal server error"})
  }
})

async function run() {
  await client.connect();

  app.get("/docs", async(req, res) => {
    if(collection !== null) {
      const docs = await collection.find({}).toArray()
      res.json( docs )
    } 
    else
    res.status(503).send("Service Unavailable: MongoDB collection not initialized")
  })
}

app.use( (req,res,next) => {
  if( collection !== null ) 
    next()
  else
    res.status( 503 ).send()
  })

app.listen(3000, () => { console.log("Server is listening on port 3000");  })