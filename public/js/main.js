const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;

const app = express();
const port = 3000;
const mongoUrl = "mongodb://localhost:27017"; // Your MongoDB connection URL
const dbName = "JacobsA3Database"; // Your MongoDB database name
const collectionName = "A3Dataset"; // Your MongoDB collection name

app.use(bodyParser.json());

// Connect to MongoDB
let db;

MongoClient.connect(mongoUrl, { useUnifiedTopology: true }, (err, client) => {
  if (err) {
    console.error("Error connecting to MongoDB:", err);
    return;
  }
  console.log("Connected to MongoDB successfully");
  db = client.db(dbName);
});

// Route for GET requests
app.get("/getArray", async (req, res) => {
  try {
    const result = await db.collection(collectionName).find().toArray();
    res.json(result);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).send("Internal server error");
  }
});

// Route for POST requests
app.post("/submit", async (req, res) => {
  const combinedString = req.body.string;
  try {
    await db.collection(collectionName).insertOne({ combinedString });
    res.send("Submitted!");
  } catch (err) {
    console.error("Error adding data:", err);
    res.status(500).send("Internal server error");
  }
});

app.post("/add", async (req, res) => {
  const combinedString = req.body.string;
  try {
    await db.collection(collectionName).insertOne({ combinedString });
    res.send("Added!");
  } catch (err) {
    console.error("Error adding data:", err);
    res.status(500).send("Internal server error");
  }
});

app.post("/delete", async (req, res) => {
  const index = req.body.index;
  try {
    await db.collection(collectionName).deleteOne({ _id: ObjectId(index) });
    res.send("Deleted!");
  } catch (err) {
    console.error("Error deleting data:", err);
    res.status(500).send("Internal server error");
  }
});

app.post("/edit", async (req, res) => {
  const index = req.body.index;
  const content = req.body.content;
  try {
    await db.collection(collectionName).updateOne(
      { _id: ObjectId(index) },
      { $set: { combinedString: content } }
    );
    res.send("Edited!");
  } catch (err) {
    console.error("Error editing data:", err);
    res.status(500).send("Internal server error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
