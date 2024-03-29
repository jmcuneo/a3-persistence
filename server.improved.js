require('dotenv').config();

let db, scoresCollection;

const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();

const port = process.env.PORT || 3000;
const uri =
    `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri);

async function connectToDb() {
  await client.connect();
  db = client.db("a3Database");
  scoresCollection = db.collection("a3Collection");
  console.log("Connected to MongoDB");
}

connectToDb().catch(console.error);

// Middleware
app.use(express.static('public'));
app.use(express.json());


// Fetch scores
app.get('/get-scores', async (req, res) => {
  try {
    const scores = await scoresCollection.find().toArray();
    res.json(scores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Add a score
app.post('/add-score', async (req, res) => {
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
    //res.json({ status: "success" });
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
    //res.json({ status: "success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// server-side function to recalculate rankings
function calculateRankings(scores) {
  // Sort the scores in descending order
  scores.sort((a, b) => b.score - a.score);

  // Assign rankings
  scores.forEach((score, index) => {
    score.ranking = index + 1;
  });

  return scores;
}


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
