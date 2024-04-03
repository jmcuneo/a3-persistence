/*
const express = require('express');
const fs = require('fs');
const mime = require('mime');
const app = express();
const port = process.env.PORT || 3000;

const appdata = [
  {
    title: "The Seven Husbands of Evelyn Hugo",
    author: "Taylor Jenkins",
    totalPages: 400,
    currentPage: 15,
    pagesLeft: 385
  }
];

app.use(express.static('public'));

app.get('/', (req, res) => {
  sendFile(res, 'public/index.html');
});

app.get('/getResponses', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(appdata));
});

app.post('/submit', express.json(), (req, res) => {
  const newData = req.body;
  appdata.push(newData);
  updatePagesLeft();
  res.sendStatus(200);
});

app.post('/delete', express.json(), (req, res) => {
  const deletingResponse = req.body.deletingResponse;
  appdata.splice(deletingResponse, 1);
  res.sendStatus(200);
});

function updatePagesLeft() {
  for (let i = 0; i < appdata.length; i++) {
    const response = appdata[i];
    response.pagesLeft = response.totalPages - response.currentPage;
  }
}

function sendFile(response, filename) {
  const type = mime.getType(filename);
  fs.readFile(filename, (err, content) => {
    if (err === null) {
      response.setHeader('Content-Type', type);
      response.end(content);
    } else {
      response.status(404).send('404 Error: File Not Found');
    }
  });
}
*/

require('dotenv').config()

const express = require("express"),
      { MongoClient, ObjectId } = require("mongodb"),
      app = express()

app.use(express.static("public") )
app.use(express.json() )

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`
const client = new MongoClient( uri )

let collection = null

async function run() {
  await client.connect()
  collection = await client.db("booksDatabase").collection("books")

  // route to get all docs
  app.get("/getResponses", async (req, res) => {
    if (collection !== null) {
      
      const docs = await collection.find({}).toArray()
      res.json( docs )
      
    }
  })

  app.post( "/submit", async (req,res) => {
    const result = await collection.insertOne( req.body )
    res.json( result )
  })

  // assumes req.body takes form { _id:5d91fb30f3f81b282d7be0dd } etc.
  app.post( "/delete", async (req,res) => {
    const result = await collection.deleteOne({ 
      _id:new ObjectId( req.body._id ) 
    })
    
    res.json( result )
  })
}



run()

app.listen(3000)


