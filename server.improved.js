require("dotenv").config();

let dataCollection, userCollection, currentUser;

// set up database
const express = require("express"),
  { MongoClient, ObjectId } = require("mongodb"),
  session = require("express-session"),
  app = express(),
  path = require("path");

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();

    dataCollection = client.db("myFavoriteDatabase").collection("myCollection0");
    userCollection = client.db("myFavoriteDatabase").collection("myCollection1");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Could not connect to DB:", error);
  }
}
run().catch(console.error);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  })
);


// switch pages
app.get("/", (req, res) => {
  if (req.session.user) {
    res.redirect("/app");
  } else {
    res.sendFile(path.join(__dirname, "public", "login.html"));
  }
});

app.get("/app", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "app.html"));
});


// login/logout info
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  let user = await userCollection.findOne({ username });
  

  if (user) {
    if (password === user.password) {
      res.json({ loggedIn: true});
      req.session.user = { username };
      currentUser= req.session.user.username;
    } else {
      res.json({ loggedIn: false, message: "Incorrect username or password, please try again." });
    }
  } else {
    await userCollection.insertOne({ username, password });
    req.session.user = { username };
  }
});

app.get("/username", async (req,res) => {
  res.json({currUser: currentUser});
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.json({ loggedOut: true, message: "Logging out..." });
});


// handle POST
app.post("/submit", async (req, res) => {
    await dataCollection.insertOne(req.body);
    const data = await dataCollection.find().toArray();
    res.json(data);
});

// handle GET
app.get("/get", async (req, res) => {
    const data = await dataCollection.find().toArray();
    res.json(data);
});

// handle DELETE
app.post("/delete", async (req, res) => {
    await dataCollection.deleteOne({ _id: new ObjectId(req.body._id) });
    const data = await dataCollection.find().toArray();
    res.json(data);
});

//handle UPDATE in app.js

app.listen(process.env.PORT || 3000);
