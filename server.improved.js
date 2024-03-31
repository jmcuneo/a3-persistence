const express = require("express"),
    { MongoClient, ObjectId } = require("mongodb"),
    app = express()

app.use(express.static("public") )
app.use(express.static("views") )
app.use(express.json() )

app.get('/favicon.ico', (req, res) => res.status(204));


//const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`
const uri = `mongodb+srv://nwhalen:V6AsuKm0gTYCLsSJ@$cluster0.3fakrji.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient( uri )

let collection = null

async function run() {
  try {
    await client.connect();
    collection = client.db("projectDatabase").collection("Collection0");
    // Send a ping to confirm a successful connection
    await client.db("projectDatabase").command({ping: 1});
    console.log();
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("Err : ", error);
  }

}

run()

app.listen(3000)

// route to get all docs
app.get("/docs", async (req, res) => {
  if (collection !== null) {
    const docs = await collection.find({}).toArray()
    res.json( docs )
  }
})

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

app.post( '/remove', async (req,res) => {
  const projectName = req.body.name;
  const result = await collection.deleteOne({ name: projectName });

  res.json( result )

  if (result.deletedCount === 1) {
    res.status(200).json({ message: 'Project removed successfully' });
  } else {
    res.status(404).json({ error: 'Project not found' });
  }
})

app.post( '/update', async (req,res) => {
  const result = await collection.updateOne(
      { _id: new ObjectId( req.body._id ) },
      { $set:{ name:req.body.name } }
  )

  res.json( result )
})
