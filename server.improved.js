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
  // path = require('path'),
  { MongoClient, ObjectId } = require("mongodb")

app.use( express.static( 'public' ) )
app.use( express.json() )

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.PASS}@${process.env.HOST}`
const client = new MongoClient( uri )

let collection = null

async function run() {
  await client.connect()
  collection = await client.db("datatest").collection("test")

  // route to get all docs
  app.get("/docs", async (req, res) => {
    if (collection !== null) {
      const docs = await collection.find({}).toArray()
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

app.get('/tasks', function(req, res) {
  res.writeHead( 200, "OK", {"Content-Type": "application/json"})
  res.end( JSON.stringify( appdata ) )
});

app.post('/tasks', function(req, res) {
  const task = req.body
  task.priority = Number(task.priority)
  task.days_not_done = Math.floor((new Date() - new Date(task.creation_date)) / (1000 * 60 * 60 * 24))

  let i = 0;
  while (i < appdata.length && appdata[i].priority > task.priority) {
    i++;
  }
  appdata.splice(i, 0, task);

  console.log( appdata )

  res.writeHead( 200, "OK", {"Content-Type": "application/json"})
  res.end( JSON.stringify( appdata ) )
})

app.put('/tasks', function(req, res) {
  const json = req.body
  const task = {
    taskName: json.taskName,
    // turn priority into a number
    priority: Number(json.priority),
    creation_date: json.creation_date,
    days_not_done: Math.floor((new Date() - new Date(json.creation_date)) / (1000 * 60 * 60 * 24)),
  }

  appdata.splice(json.index, 1)
  console.log( appdata )

  let i = 0;
  while (i < appdata.length && appdata[i].priority > task.priority) {
    i++;
  }
  appdata.splice(i, 0, task);

  console.log( "APSLICE" )
  console.log( appdata )

  res.writeHead( 200, "OK", {"Content-Type": "application/json"})
  res.end( JSON.stringify( appdata ) )
})

app.delete('/tasks', function(req, res) {
  const json = req.body
  appdata.splice(json.index, 1)
  console.log( appdata )

  res.writeHead( 200, "OK", {"Content-Type": "application/json"})
  res.end( JSON.stringify( appdata ) )
})

app.listen( process.env.PORT || 3000 )
