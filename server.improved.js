require('dotenv').config()

const appdata = [
  {
    taskName: "Find my lost goldfish",
    priority: 100,
    creation_date: "2014-09-15",
  },
  {
    taskName: "Finish Assignment 2",
    priority: 5,
    creation_date: "2024-03-18",
  },
  {
    taskName: "Make WPI schedule",
    priority: -100,
    creation_date: "2024-03-10",
  },
]

// Calculate derived field, days_not_done, for default tasks
appdata.forEach( task => {
  task.days_not_done = Math.floor((new Date() - new Date(task.creation_date)) / (1000 * 60 * 60 * 24))
})

const express    = require('express'),
  app        = express(),
  { MongoClient, ObjectId } = require("mongodb")

app.use( express.static( 'public' ) )
app.use( express.json() )

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.PASS}@${process.env.HOST}`
const client = new MongoClient( uri )

let collection = null

async function run() {
  await client.connect()
  collection = await client.db("datatest").collection("test")

  app.get("/tasks", async (req, res) => {
    if (collection !== null) {
      const docs = await collection.find({}).sort({priority: -1}).toArray()
      res.json( docs )
    }
  })
}

run()

app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})

app.post('/tasks', async function(req, res) {
  const task = req.body
  task.priority = Number(task.priority)
  task.days_not_done = Math.floor((new Date() - new Date(task.creation_date)) / (1000 * 60 * 60 * 24))

  const result = await collection.insertOne( req.body )
  res.json( result )
})

app.put('/tasks', async function(req, res) {
  const json = req.body
  const task = {
    taskName: json.taskName,
    // turn priority into a number
    priority: Number(json.priority),
    creation_date: json.creation_date,
    days_not_done: Math.floor((new Date() - new Date(json.creation_date)) / (1000 * 60 * 60 * 24)),
  }

  const result = await collection.updateOne(
    { _id: new ObjectId( json._id ) },
    {
      $set: {
        taskName: task.taskName,
        priority: task.priority,
        creation_date: task.creation_date,
        days_not_done: task.days_not_done,
      }
    }
  )

  res.json( result )
})

app.delete('/tasks', async function(req, res) {
  const result = await collection.deleteOne({
    _id:new ObjectId( req.body._id )
  })

  res.json( result )
})

app.listen( process.env.PORT || 3000 )
