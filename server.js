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
  collection = await client.db("Assignment3DB").collection("PartRecord")
  login = await client.db("Assignment3DB").collection("LoginRecord")
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

var active_user = ""

// Try to do this without updating
app.post( '/add', async (req,res) => {
  weight = parseInt(req.body.new_quantity)*parseFloat(req.body.weight_per_unit)
  const result = await collection.insertOne( {part_name: req.body.part_name, new_material: req.body.new_material, new_quantity: req.body.new_quantity, weight: weight, related_user: active_user} )
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
  console.log(req.body.related_user)
  const result = await collection.find({related_user: active_user}).toArray()
  console.log(result)
  res.json( result )
})

app.post( '/login', async (req,res) => {
  const in_db = await login.find({username: req.body.username}).toArray()
  if(in_db.length == 0){
    const result = await login.insertOne(req.body)
    active_user = req.body.username
    res.json(result)
  }else{
    const result = await login.find({username: req.body.username, password: req.body.password}).toArray()
    if(result.length != 0){active_user = req.body.username}
    res.json(result)
  }
})

app.listen(3000)