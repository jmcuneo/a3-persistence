// Purpose: This file is the improved version of the server.js file. It connects to the MongoDB database and performs CRUD operations on the cars collection. It also serves the static files in the public directory.
require('dotenv').config();
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json()); // Parse JSON bodies

const uri = process.env.MONGODB_URI;



const client = new MongoClient(uri);
let db;
async function startServer() {
  await client.connect();
  console.log("Connected successfully to MongoDB");
  db = client.db("4241database");// Replace "4241database" with your database name

  app.get('/data', async (req, res) => {
    try {
      const cars = await db.collection('cars').find({}).toArray();
      res.json(cars);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/add', async (req, res) => {
    try {
      const result = await db.collection('cars').insertOne(req.body);
      res.json({ status: 'success', insertedId: result.insertedId });
    } catch (err) {
      console.error("Failed to insert car:", err);
      res.status(500).json({ error: 'Failed to insert car' });
    }
  });

  // Update a car
  app.post('/update', async (req, res) => {
    try {
      const { _id, updatedData } = req.body;
      const filter = { _id: new ObjectId(_id) };
      const update = { $set: updatedData };
      const result = await db.collection('cars').updateOne(filter, update);
      if (result.modifiedCount === 0) {
        return res.status(404).json({ error: 'Car not found' });
      }
      res.json({ status: 'success' });
    } catch (err) {
      console.error("Failed to update car:", err);
      res.status(500).json({ error: 'Failed to update car' });
    }
  });
  

  // Delete a car
  app.post('/delete', async (req, res) => {
    try {
      const _id = req.body._id;
      const filter = { _id: new ObjectId(_id) };
      await db.collection('cars').deleteOne(filter);
      res.json({ status: 'success' });
    } catch (err) {
      console.error("Failed to delete car:", err);
      res.status(500).json({ error: 'Failed to delete car' });
    }
  });


  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}

startServer().catch(console.error);
