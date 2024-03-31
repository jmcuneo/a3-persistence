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
  collection = await client.db("Assignment3DB").collection("A3Collection")
  console.log("Connected!")

  // route to get all docs
  app.get("/docs", async (req, res) => {
    if (collection !== null) {
      const docs = await collection.find({}).toArray()
      res.json( docs )
    }
  })
}

run()

app.post( '/add', async (req,res) => {
  weight = parseInt(req.body.new_quantity)*parseFloat(req.body.weight_per_unit)
  const result = await collection.insertOne( {part_name: req.body.part_name, new_material: req.body.new_material, new_quantity: req.body.new_quantity, weight: weight} )
  res.json( result )
})

app.post( '/remove', async (req,res) => {
  const result = await collection.deleteOne( {part_name: req.body.part_name} )
  res.json( result )
})

app.post( '/modify', async (req,res) => {
  new_weight = parseInt(req.body.new_quantity)*parseFloat(req.body.weight_per_unit)
  const result = await collection.updateOne( {part_name: req.body.part_name}, {$set: {new_material: req.body.new_material, new_quantity: req.body.new_quantity, weight: new_weight}})
  res.json( result )
})

app.get('/receive', async (req, res) => {
  const result = await collection.find().toArray()
  console.log(result)
  res.json( result )
})

app.listen(3000)