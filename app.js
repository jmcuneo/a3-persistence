require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files
app.use(express.static('public'));
app.use(express.json()); // for parsing application/json

const appdata = [
    { "Name": "think about toyota", "Description": "not to be confused with toy yoda", "Creation Date": "2024-03-13", "Priority": 1, "Recommended Deadline": "2024-03-14"},
    { "Name": "discuss honda", "Description": "honk honk", "Creation Date": "2024-03-13", "Priority": 2, "Recommended Deadline": "2024-03-15"},
    { "Name": "get a chicken", "Description": "i need a chicken so bad", "Creation Date": "2024-03-13", "Priority": 3, "Recommended Deadline": "2024-03-16"} 
];

// Write appdata to JSON file
function writeData() {
    fs.writeFileSync("public/data.json", JSON.stringify(appdata), err => {
      if (err) throw err;
      console.log("Data written to file");
    });
  }
  writeData();


app.get('/data.json', (req, res) => {
  // Hopefulle remove NS_BINDING_ABORTED error in firefox
  res.set('Cache-Control', 'no-cache');
  console.log("GET request received");
  res.sendFile(path.join(__dirname, 'public', 'data.json'));
});

app.post('/submit', (req, res) => {
  console.log("body:" , req.body);
  let data = req.body;
  // Check if the data already exists in the array. If it is, return an error
  for (let i = 0; i < appdata.length; i++) {
    if (appdata[i].Name === data.Name) {
      res.status(400).send("Name already exists");
      return;
    }
  }
  
  // Derive the recommended deadline from the priority and creation date
  let date = new Date(data["Creation Date"]);
  let recommendedDeadline = new Date(date);
  recommendedDeadline.setDate(date.getDate() + +data.Priority);
  data["Recommended Deadline"] = recommendedDeadline.toISOString().slice(0, 10);


  appdata.push(data);
  writeData();
  res.send("Data added successfully");
});

app.post('/delete', (req, res) => {
  let data = req.body;
  let found = false;
  // Look in array for data with the same name and remove it
  for (let i = 0; i < appdata.length; i++) {
    if (appdata[i].Name === data.Name) {
      found = true;
      appdata.splice(i, 1);
      break;
    }
  }
  writeData();
  if (found) {
    res.send("Data deleted successfully");
  } else {
    res.status(400).send("Name not found");
  }
});

app.post('/edit', (req, res) => {
  let data = req.body;

  for (let i = 0; i < appdata.length; i++) {
    if (appdata[i].Name === data.Name) {
      // Derive the recommended deadline from the priority and creation date
      let recommendedDeadline = new Date(data["Creation Date"]);
      recommendedDeadline.setDate(recommendedDeadline.getDate() + +data.Priority);
      data["Recommended Deadline"] = recommendedDeadline.toISOString().slice(0, 10);
      appdata[i] = data;
      writeData();
      res.send("Data edited successfully");
      return;
    }
  }

  res.status(400).send("Name not found");
});




app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})









// Mongo stuff below
// const {MongoClient, ServerApiVersion} = require('mongodb');
// const uri = "mongodb+srv://Darren:Thehello1969@a3-darrenni.jhgy5ne.mongodb.net/?retryWrites=true&w=majority&appName=a3-DarrenNi";
// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);

const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.DB_LINK);
  console.log("Connected to MongoDB");

  const kittySchema = new mongoose.Schema({
    name: String
  });
  
  // Note: methods must be added to the schema before compiling it with mongoose.model()
  kittySchema.methods.speak = function () {
    const greeting = this.name
      ? "Meow name is " + this.name
      : "I don't have a name";
    console.log(greeting);
  }
  
  const Kitten = mongoose.model('Kitten', kittySchema);
  
  const silence = new Kitten({ name: 'Silence' });
  console.log(silence.name); // 'Silence'
  
  const fluffy = new Kitten({ name: 'fluffy' });
  fluffy.speak(); // "Meow name is fluffy" 
  
  await fluffy.save();
  
  const kittens = await Kitten.find();
  console.log(kittens); 
}

