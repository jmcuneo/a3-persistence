

const express = require("express"),
      { MongoClient, ObjectId } = require("mongodb"),
      app = express()

app.use(express.static("public") )
app.use(express.json() )
require('dotenv').config();



const uri = `mongodb+srv://${process.env.MG_USER}:${process.env.PASS}@${process.env.HOST}`
// const uri = "mongodb+srv://lw11personal:kpFzC89wA3nUSFSH@cluster0.51gey7b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient( uri )
// await client.connect()
// let collection = await client.db("test_db_1").collection("test_collection")
// console.log("Pinged your deployment. You successfully connected to MongoDB!");

let collection = null

async function initDB() {
    await client.connect()
    collection = await client.db("test_db_1").collection("test_collection")
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
}

app.get('/', (req, res) => {
    res.redirect('/login.html');
})

// route to get all docs
app.get("/docs", async (req, res) => {
    if (collection !== null) {
    const docs = await collection.find({}).toArray()
    res.json( docs )
    }
})

app.get("/user_data", async (req, res) => {
    if (collection !== null) {
        if (current_user === null) {
            console.log("Not Logged In")
            res.status(401).json({message: "Not Logged In"})
        } else {
            const docs = await collection.find({"user": current_user["user"]}).toArray()
            res.json( docs )
        }
    }
})




let current_user = null


// Handle Login 
app.post('/login', async (req, res) => {

    if (collection === null) {
        console.log("Database not loaded")
        res.status(404).json({message: "Database not loaded"})
        return
    }
    const db_data = await collection.find({}).toArray()
    console.log("DB_DATA\t", db_data)
    const { username, password } = req.body;
  
    const user_obj = db_data.find(user => user.user === username);
    
    if (user_obj && user_obj["password"] === password) {
        res.json({ success: true, message: 'Login Successful' });
        current_user = user_obj
        res.status(200)
    } else if (user_obj && user_obj["password"] !== password){
        res.status(401).json({ success: false, message: 'Wrong Password' });
    } else if (!user_obj){
        new_db_item = {
            "user": username, 
            "password": password, 
            "ready": false, 
            "age": 0}
        let item_id = await collection.insertOne(new_db_item);
        console.log('Inserted document:', item_id.insertedId);
        // db_data.push({ "user": username, "password": password })
        res.status(401).json({ success: false, message: 'New account created, login again' });
    } 
});



app.post('/add_to_db', async (req,res) => {
    // console.log(req.body)
    if (current_user === null) {
        console.log("Not Logged In")
        res.status(401).json({message: "Not Logged In"})
    } else {
        item = {
            "user": current_user["user"], 
            "password": current_user["password"], 
            "ready": req.body["ready"], 
            "age": req.body["age"]}

        let item_id = await collection.insertOne(item);
        console.log('Inserted document:', item_id.insertedId);

        res.status(201).json({ message: 'Data received successfully' })
    }
})


app.post('/delete_from_db', async (req,res) => {
    console.log(req.body)

    // let item_id = await collection.insertOne(item);
    // console.log('Inserted document:', item_id.insertedId);

    const result = await collection.deleteOne({ _id: new ObjectId(req.body["_id"]) });
    if (result.deletedCount === 1) {
        res.status(200).json({ message: 'Data deleted successfully' });

        console.log('Successfully deleted one document.');
    } else {
        res.status(400).json({ message: 'Error while deleting' });

        console.log('No documents matched the query. Deleted 0 documents.');
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




initDB()
// serverGetUserData()
app.listen(process.env.PORT || 3000)