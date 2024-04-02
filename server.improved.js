const express = require("express");
const fs = require("fs");
const mime = require("mime");
const dir = "public/";
const port = 3000;

const appdata = [];
const app = express();
app.use( express.static( 'public' ) );
app.use( express.static( 'views'  ) ); 
app.use(express.static("public") );
app.use(express.json() );

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let collection = null;

async function run() {
  await client.connect()
  collection = await client.db("JacobsA3Database").collection("A3Dataset")
  await client.db("JacobsA3Database").command({ ping: 1 });
  console.log("Pinged your deployment. You successfully connected to MongoDB!");
  // route to get all docs
  app.get("/docs", async (req, res) => {
    if (collection !== null) {
      const docs = await collection.find({}).toArray()
      res.json( docs )
    }
  })
}

run();


app.get("/getArray", (req, res) => {
  res.json(appdata);
});

app.post("/", (req, res) => {
  const finalData = req.body;
  const method = finalData.method;

  if (method === "/delete") {
    const targetIndex = finalData.index;
    appdata.splice(targetIndex, 1);
    res.send("Bye bye!");
  } else if (method === "/add" || method === "/submit") {
    appdata.push(finalData.string);
    res.send("Added/Submitted!");
  } else if (method === "/edit") {
    appdata[finalData.index] = finalData.content;
    res.send("Edited!");
  } else {
    res.status(400).send("Yikes");
  }
});



app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})

app.post( '/submit', async (req,res) => {
  const result = await collection.insertOne( req.body )
  res.json( result )
})



app.listen(port)


/*app.get("/", (req, res) => {
  sendFile(res, "public/index.html");
});*/