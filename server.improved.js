//server.improved.js
//server-side code

const http = require( "http" ),
  fs   = require( "fs" ),
  // IMPORTANT: you must run `npm install` in the directory for this assignment
  // to install the mime library if you"re testing this on your local machine.
  // However, Glitch will install it automatically by looking in your package.json
  // file.
  mime = require( "mime" ),
  dir  = "public/",
  port = 3000,
  express = require('express'),
  app = express()

require("dotenv").config();

app.use( express.static( 'public' ) )
app.use( express.json() )

//Database Code
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.USERNAME}:${process.env.PASS}@${process.env.HOST}`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let collection = null

async function run() {
  await client.connect()
  collection = await client.db("CS4241").collection("Calculator")

  // route to get all docs
  app.get("/getPreviousResults", async (req, res) => {
    const docs = await collection.find({}).toArray()
    res.json( docs )
  })

  app.post('/addition', async (req, res) => {
    const { num1, num2 } = req.clientData;
    const result = (num1 + num2).toFixed(2);      //add the two imputted numbers together + truncates
    const count = await collection.countDocuments();
    collection.insertOne({ count: count + 1, result: result });       //add this result to the array of previous results
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ result: result }));        //send the result to the client
  });
  
  app.post('/subtract', async (req, res) => {
    const { num1, num2 } = req.clientData;
    const result = (num1 - num2).toFixed(2);          //subtract the two imputted numbers together + truncates
    const count = await collection.countDocuments();
    collection.insertOne({ count: count + 1, result: result });           //add this result to the array of previous results
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ result: result }));        //send the result to the client
  });
  
  app.post('/multiply', async (req, res) => {
    const { num1, num2 } = req.clientData;
    const result = (num1 * num2).toFixed(2);          //multiply the two imputted numbers together + truncates
    const count = await collection.countDocuments();
    collection.insertOne({ count: count + 1, result: result });           //add this result to the array of previous results
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ result: result }));        //send the result to the client
  });
  
  app.post('/divide', async (req, res) => {
    const { num1, num2 } = req.clientData;
    const result = (num1 / num2).toFixed(2);          //divide the two imputted numbers together + truncates
    const count = await collection.countDocuments();
    collection.insertOne({ count: count + 1, result: result });           //add this result to the array of previous results
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ result: result }));        //send the result to the client
  });
  
  app.post('/deleteResult', async (req, res) => {
    const index = req.clientData.index
    const result = await collection.deleteOne({  count: index });
    if (result.deletedCount === 1) {
      res.status(200).send("Result deleted.");
    } else {
      res.status(404).send("Result not found.");
    }
  });
}

run()

const middleware_post = (req, res, next) => {
  let dataString = ''

  req.on( 'data', function(data){
    dataString += data
  })

  req.on( 'end', function() {
    if(dataString){
      const clientData = JSON.parse(dataString)     //define client data
      num1 = parseFloat(clientData.num1),       //extracting the first number from clientData
      num2 = parseFloat(clientData.num2)        //extracting the second number from clientData
      index = parseInt(clientData.index)        //extracting the index from clientdata for the delete result in array case

      req.clientData = {
        num1: num1, 
        num2: num2,
        index: index
      }
    }
    next()
  })
}

app.use( middleware_post )

app.listen( process.env.port || 3000 )