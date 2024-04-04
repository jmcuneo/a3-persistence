const express = require('express'),
  app = express()

require('dotenv').config()
const appdata = [
  { "model": "toyota", "year": 1999, "mpg": 23, "EOL": 2077 },
  { "model": "honda", "year": 2004, "mpg": 30, "EOL": 2060 },
  { "model": "ford", "year": 1987, "mpg": 14, "EOL": 2049 }
]

app.use(express.static('public'))
app.use(express.json())

//DATABASE CONNECTION START
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`;

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


  await client.connect();

  collection = await client.db("Cars").collection("myCars");

  app.get("/docs", async (req, res) => {
    if (collection !== null) {
      const docs = await collection.find({}).toArray()
      res.json(docs)
    }
  })
}
run()

app.use((req, res, next) => {
  if (collection !== null) {
    next()
  } else {
    res.status(503).send()
  }
})

app.post('/add', async (req, res) => {
  let temp = req.body
  temp.EOL = calculateEOL(temp.year, temp.mpg)
  const result = await collection.insertOne(temp)
  res.json(result)
})

app.post('/remove', async (req, res) => {
  const result = await collection.deleteOne({
    _id: new ObjectId(req.body._id)
  })

  res.json(result)
})

app.post('/update', async (req, res) => {
  const result = await collection.updateOne(
    { _id: new ObjectId(req.body._id) },
    { $set: { model: req.body.model,
      year: req.body.year, 
      mpg: req.body.mpg,
      EOL: calculateEOL(req.body.year, req.body.mpg)} }
  )

  res.json(result)
})
//DATABASE CONNECTION END


const calculateEOL = (year, mpg) => {
  let new_val = year + mpg;
  new_val = new_val - (year % mpg);

  return new_val;
}

app.post('/submit', (req, res) => {
  req.body.EOL = calculateEOL(req.body.year, req.body.mpg)
  appdata.push(req.body)
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(appdata))
})

app.delete('/submit', (req, res) => {
  let index = Number(req.body.number)
  if (index > -1) {
    appdata.splice(index, 1)
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(appdata))
  } else {
    res.writeHead(410, { 'Content-Type': 'text/plain' })
    res.end("There was nothing to delete!")
  }
})

app.listen(3000)