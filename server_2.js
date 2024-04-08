const express = require("express"),
      { MongoClient, ObjectId } = require("mongodb"),
      app = express()

app.use(express.static("public") )
app.use(express.json() )
require('dotenv').config();



const uri = `mongodb+srv://${process.env.MG_USER}:${process.env.PASS}@${process.env.HOST}`
// const uri = "mongodb+srv://lw11personal:kpFzC89wA3nUSFSH@cluster0.51gey7b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient( uri )

let collection = null

async function run() {
  await client.connect()
  collection = await client.db("test_db_1").collection("test_collection")
  console.log("Pinged your deployment. You successfully connected to MongoDB!");


  // route to get all docs
  app.get("/docs", async (req, res) => {
    if (collection !== null) {
      const docs = await collection.find({}).toArray()
      res.json( docs )
    }
  })
}

app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})

app.post( '/add', async (req,res) => {
  const result = await collection.insertOne( req.body )
  res.json( result )
})

run()

app.listen(process.env.PORT || 3000)