const { MongoClient, ServerApiVersion } = require("mongodb");
const env = require("dotenv").config();
const uri = `mongodb+srv://ibixler:${process.env.DB_PW}@webware-a3-ibixler.fj4jqxh.mongodb.net/?retryWrites=true&w=majority&appName=webware-a3-ibixler`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

exports.userExists = async function (data) {
  try {
    await client.connect();

    const database = client.db("Catabase");
    const collection = database.collection("Login");
    const query = { username: data.username };
    const items = await collection.find(query).toArray();

    if (items.length == 0) {
      await collection.insertOne(data);
      return 1; 
    } else {
      return 0; 
    }
  } catch (error) {
    console.error("Error in userExists:", error);
    return 0; 
  } finally {
    client.close();
  }
};
exports.createUser = async function (data, collection) {
  try {
    await collection.insertOne(data).toArray(function (err, result) {
      if (err) throw err;
      console.log(result);
    });
  } finally {
    await client.close();
  }
};
exports.attemptLogin = async function (data) {
  try {
    await client.connect();

    const database = client.db("Catabase");
    const collection = database.collection("Login");
    const query = { username: data.username };
    const items = await collection.find(query).toArray();

    if (items.length == 0) {
      console.log("hey no users");
      return 0; 
    } else {
      console.log(items);
      if(items[0].password === data.password) return 1;
      return 0; 
    }
  } catch (error) {
    console.error("Error in userExists:", error);
    return 0; 
  } finally {
    client.close();
  }
};
/* 
async function run() {
  try {
    const database = client.db('Catabase');
    const movies = database.collection('Login');
    // Query for a movie that has the title 'Back to the Future'
    const query = { username: "ivy" };
    const movie = await movies.findOne(query);
    console.log(movie);
    // Connect the client to the server	(optional starting in v4.7)
    /* await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("Catabase").command({ ping: 1 });
    var dbo = client.db("Catabase");
    var query = { username: "ivy" };
    await dbo.collection("Login").find(query).toArray(function(err, result){
      if (err) throw err;
      console.log(result);
    })
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
MongoClient.connect(uri, function(err, db) {
  if (err) throw err;
  var dbo = db.db("Catabase");
  var query = { username: "ivy" };
  dbo.collection("Login").find(query).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    db.close();
  });
});
run().catch(console.dir);
 */
