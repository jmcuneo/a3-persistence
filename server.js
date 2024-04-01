const express = require("express"),
      { MongoClient, ObjectId } = require("mongodb"),
      dotenv = require('dotenv').config({ path: "./.env" }),
      app = express()

app.use(express.static("public") )
app.use(express.json() )

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`
const client = new MongoClient( uri )

let collection = []

async function run() {
  await client.connect()
  collection = await client.db("webware-db").collection("a3-collection")

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

app.post( '/submit', async (req,res) => {

  // for an entry we need to parse the bday string and then calculate age
  const bdayString = req.body.birthday;
  const bdayParts = bdayString.split("/");
  const bday = new Date(parseInt(bdayParts[2]), parseInt(bdayParts[0]) - 1, parseInt(bdayParts[1]));
  const today = new Date();

  let age = today.getFullYear() - bday.getFullYear();
  const month = today.getMonth() - bday.getMonth();
  if(month < 0 || (month === 0 && today.getDate() < bday.getDate())) {
    age--;
  }

  const result = await collection.insertOne( {
    "name": req.body.name,
    "birthday": req.body.birthday,
    "age": age,
    "preferredCake": req.body.preferredCake
  })

  res.json( result )
})

app.delete('/delete', async (req, res) => {

  const result = await collection.deleteOne( {
    "_id": new ObjectId(req.body._id)
  })

  res.json( result )
})

app.patch('/update', async (req, res) => {

  // for an entry we need to parse the bday string and then calculate age
  const bdayString = req.body.birthday;
  const bdayParts = bdayString.split("/");
  const bday = new Date(parseInt(bdayParts[2]), parseInt(bdayParts[0]) - 1, parseInt(bdayParts[1]));
  const today = new Date();

  let age = today.getFullYear() - bday.getFullYear();
  const month = today.getMonth() - bday.getMonth();
  if(month < 0 || (month === 0 && today.getDate() < bday.getDate())) {
    age--;
  }

  let query = { "_id": new ObjectId(req.body._id) }
  let newvals = { $set: { "name": req.body.name,
                          "birthday": req.body.birthday,
                          "age": age,
                          "preferredCake": req.body.preferredCake}}

  const result = await collection.updateOne( query, newvals )

  res.json( result )

})

run()

app.listen(3000)
