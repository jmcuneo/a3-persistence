const express = require('express'),
  {MongoClient, ObjectId} = require("mongodb"),
  app = express(),
  gpaData = [];

app.use(express.static('public'));
app.use(express.static('views'));
app.use(express.json());
require('dotenv').config();

const uri = `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@${process.env.HOST}`
const client = new MongoClient(uri)

let username = "test";
let password = "1234";
let collection = null
let data = null;
var gpa = 0.0;

app.use((req, res, next) => {
  if(collection !== null) {
    next();
  } else {
    res.status(503).send()
  }
});

app.listen(process.env.PORT || 3000);
checkLogin(username, password);

//DATABASE FUNCITONS
// Log into account
async function checkLogin(usernameAttempt, passwordAttempt)
{
  collection = await client.db("userdb").collection("users");

  if (collection !== null) {
    userData = await collection.findOne({username: usernameAttempt});
    if (userData !== null) {
      // User exists
      if (userData.password === password) {
        // Password correct
        console.log("Logging in")
        await client.db("gpadb").createCollection(usernameAttempt);
        collection = await client.db("gpadb").collection(usernameAttempt);
      }
      else {
        // Password incorrect
        console.log("Incorrect password");
      }
    }
    else {
      // User does not exist; create new user
      console.log("Creating new user");
      await collection.insertOne({username: usernameAttempt, password: passwordAttempt});
      await client.db("gpadb").createCollection(usernameAttempt);
      collection = await client.db("gpadb").collection(usernameAttempt);
    }
  }
}

// Obtain all data in the current collection
async function getData()
{
  // route to get all docs
  if (collection !== null) {
    data = await collection.find({}).toArray();
  }
  gpa = calculateGpa(data);
  return data;
}

// Add entry to the database
async function addToData(entry)
{
  const result = await collection.insertOne(entry);
}

// Remove entry from the database
async function deleteDataEntry(className)
{
  const result = await collection.deleteOne(
    {class: className});
}

// Update entry in the database
async function updateDataEntry(className, newData)
{
  const result = await collection.updateOne(
    {class: className},
    {$set: {class: newData.class, grade: newData.grade, credits: newData.credits}}
  );
}

// POST AND GET REQUESTS
// Add new element to the table
app.post('/submit', express.json(), async (req, res) => {
  await addToData(req.body);

  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(req.body));
});

// Adjust an element in the table
app.post('/adjust', express.json(), async (req, res) => {
  await updateDataEntry(req.body.class, req.body.data);

  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(req.body));
});

// Delete an element from the table
app.post('/delete', express.text(), async (req, res) => {
  await deleteDataEntry(req.body);

  res.writeHead(200, {'Content-Type': 'application/text'});
  res.end(JSON.stringify(req.body));
});

// Fetch data for the GPA table
app.get('/display', async (req, res) => {
  res.writeHead(200, {'Content-Type': 'application/text'});
  data = await getData();
  res.end(JSON.stringify(data));
});

// Fetch GPA value
app.get('/gpa', (req, res) => {
  res.writeHead(200, {'Content-Type': 'application/text'});
  let roundedGpa = Math.round(gpa * 100) / 100;
  res.end(roundedGpa.toString());
});

// Determine what the user's GPA is based on the provided info
const calculateGpa = function(jsonData)
{
  let totalPoints = 0;
  let totalCredits = 0;
  jsonData.forEach(entry => {
    let currentPoints = 0;
    let grade = entry.grade.toLowerCase();

    if (grade === "a") {
      currentPoints = 4;
    } else if (grade === "b") {
      currentPoints = 3;
    } else if (grade === "c") {
      currentPoints = 2;
    } else if (grade === "d") {
      currentPoints = 1;
    }

    let amountCredits = Number(entry.credits);
    currentPoints *= amountCredits;
    totalPoints += currentPoints;
    totalCredits += amountCredits;
  });
  return totalPoints / totalCredits;
}