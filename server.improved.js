const uri = "mongodb+srv://jackweinstein808:ieiVz7K19MdkPRQb@a3persistence.ilydjmx.mongodb.net/?retryWrites=true&w=majority&appName=a3Persistence";

const express = require("express"),
      { MongoClient, ObjectId } = require("mongodb"),
      app = express()

app.use(express.static("public") )
app.use(express.json() )

const client = new MongoClient( uri )

let collection = null

async function run() {
  await client.connect()
  collection = await client.db("foodLogData").collection("collection1")
  // route to get all docs
  app.get("/docs", async (req, res) => {
    //console.log("Collection: " + collection);
    if (collection !== null) {
      try { // Wrap in try-catch for error handling      
        const docs = await collection.find({}).toArray(); // Use 'await'
        //console.log("DOCS:", docs);  // This log should now show docs
        res.json(docs);
      } catch (error) {
        console.error("Error fetching docs:", error);
        res.status(500).send("Error retrieving documents"); 
      } 
    }
  });
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

app.delete('/delete', async (req, res) => {
  const itemId = req.body.itemId;  
  try {
    // Directly create ObjectId from the string ID
    const objectId = new ObjectId(itemId);
    const deleteResult = await collection.deleteOne({ _id: objectId });

    console.log("Received itemID:", itemId); 
    console.log("Type of itemID:", typeof itemId);

    if (deleteResult.deletedCount === 1) {
      res.status(200).send("Document deleted");
    } else {
      res.status(404).send("Document not found");
    }
  } catch (error) {
    console.error("Error deleting document:", error);
    res.status(500).send("Error deleting document");
  }
});

app.post('/edit-item', async (req, res) => {
  const itemId = req.body.itemId;
  const updatedData = req.body; 
  delete updatedData.itemId;  // Remove itemId from the update object

  try {
    /*
    const objectId = ObjectId.createFromTime(parseInt(itemId, 16) / 1000);
    const updateResult = await collection.updateOne({ _id: objectId }, { $set: updatedData });
    */
    const updateResult = await collection.updateOne({ _id: new ObjectId(itemId) }, { $set: updatedData });

    if (updateResult.modifiedCount === 1) {
      res.status(200).send("Document updated");
    } else {
      res.status(404).send("Document not found");
    }
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).send("Error updating document");
  }
});

run()
app.listen(3000)