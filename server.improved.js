const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const app = express();
const path = require("path");

const uri = "mongodb+srv://jbarbosawpi:goatgoat@cluster1.ak3xdfs.mongodb.net/";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
let dataCollection;

async function run() {
  try {
    await client.connect();
    dataCollection = client.db("mydatabase").collection("tasks");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Could not connect to DB:", error);
  }
}
run().catch(console.error);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "dummyuser" && password === "password") {
    res.redirect("/page.html");
  } else {
    res.status(401).send("Invalid username or password. Please try again.");
  }
});

app.post("/submit", async (req, res) => {
  await dataCollection.insertOne(req.body);
  const data = await dataCollection.find().toArray();
  res.json(data);
});

app.get("/get", async (req, res) => {
  const data = await dataCollection.find().toArray();
  res.json(data);
});

app.post("/delete", async (req, res) => {
  await dataCollection.deleteOne({ _id: new ObjectId(req.body._id) });
  const data = await dataCollection.find().toArray();
  res.json(data);
});

app.post("/update", async (req, res) => {
  const { _id, task, priority, dueDate } = req.body;
  try {
    await dataCollection.updateOne(
      { _id: new ObjectId(_id) }, 
      { $set: { task: task, priority: priority, dueDate: dueDate } }
    );
    const updatedData = await dataCollection.find().toArray();
    res.json(updatedData);
  } catch (error) {
    console.error("Failed to update task:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running...");
});
