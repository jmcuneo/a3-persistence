const { MongoClient } = require('mongodb');
const path = require("path");
const keys = require('./configs/keys');
//const uri = "mongodb+srv://ngcleary:45Richfield@cluster0.yywwl2c.mongodb.net/?retryWrites=true&w=majority";
const uri = keys.mongodb.uri;
const client = new MongoClient( uri );


//let collection = null

async function run() {
    await client.connect()
    return client.db('a3-db');
};
module.exports = { run, client};


  //collection = await client.db("a3-db").collection("a3Collection")
  //collectionSuggest = client.db("a3-db").collection("a3Suggest")
  //collectionAuth = client.db("a3-db").collection("a3Auth");

  // route to get all docs
  /*
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
  return client.db('a3-db');
};*/
//run();