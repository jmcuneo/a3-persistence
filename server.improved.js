require('dotenv').config();

let db, scoresCollection, usersCollection;

const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const session = require('express-session');
const app = express();
const path = require('path');

const port = process.env.PORT || 3000;
const uri =
    `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri);

async function connectToDb() {
  try {
    await client.connect();

    db = client.db("a3Database");
    scoresCollection = db.collection("a3Collection");
    usersCollection = db.collection("users");
    console.log("Connected to MongoDB");

    await dummyUsers();
  } catch (error) {
    console.error("Could not connect to DB:", error);
  }
}
connectToDb().catch(console.error);

// test for authentication, use this to log in
async function dummyUsers() {
  try {
    const usersToAdd = [
      { username: "admin1", password: "admin1" },
      { username: "admin2", password: "admin2" },
    ];
    // check if dummy users already exist before adding
    const existingUser = await usersCollection.findOne({ username: usersToAdd[0].username });
    if (!existingUser) {
      await usersCollection.insertMany(usersToAdd);
      console.log("Dummy users added");
    }
  } catch (error) {
    console.error("Dummy users could not be added:", error);
  }
}

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

// serve login page
app.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('/app');
  } else {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
  }
});

// serve the main application page
app.get('/app', checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'app.html'));
});

// Log in
app.post('/login', async (req, res) => {
  const {username, password} = req.body;
  let user = await usersCollection.findOne({username});

  if (user) {
    if (password === user.password) {
      req.session.user = { username };
      res.json({ loggedIn: true, message: "Login successfully!" });
    } else {
      res.json({ loggedIn: false, message: "Wrong password" });
    }
  } else {
    await usersCollection.insertOne({ username, password });
    req.session.user = { username };
    res.json({ loggedIn: true, message: "Account created and logged in successfully!" });
  }
});

// Log out
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.json({ loggedOut: true, message: "Logout successfully!" });
});


// helper function to check if the user is logged in
function checkAuth(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
}

// status check
app.get('/status', (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, username: req.session.user.username });
  } else {
    res.json({ loggedIn: false });
  }
});


// Fetch scores
app.get('/get-scores', checkAuth, async (req, res) => {
  try {
    const scores = await scoresCollection.find().toArray();
    res.json(scores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Add a score
app.post('/add-score', checkAuth, async (req, res) => {
  try {
    await scoresCollection.insertOne(req.body);

    const scores = await scoresCollection.find().toArray();
    // recalculate rankings
    const rankedScores = calculateRankings(scores);
    res.json(rankedScores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Delete a score
app.post('/delete-score', async (req, res) => {
  try {
    await scoresCollection.deleteOne({ _id: new ObjectId(req.body._id) });

    const scores = await scoresCollection.find().toArray();
    const rankedScores = calculateRankings(scores);
    res.json(rankedScores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Modify a score
app.post('/modify-score', async (req, res) => {
  try {
    await scoresCollection.updateOne(
        { _id: new ObjectId(req.body._id) },
        { $set: { playerName: req.body.playerName, score: req.body.score, gameDate: req.body.gameDate } }
    );
    const scores = await scoresCollection.find().toArray();
    const rankedScores = calculateRankings(scores);
    res.json(rankedScores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// server-side function to recalculate rankings
function calculateRankings(scores) {
  scores.sort((a, b) => b.score - a.score);

  scores.forEach((score, index) => {
    score.ranking = index + 1;
  });

  return scores;
}


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
