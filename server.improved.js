const express = require("express");
const fs = require("fs");
const mime = require("mime");

require('dotenv').config()

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`

const app = express();
const port = 3000;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let collection = null

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

let workoutDataArray = [];

app.use(async (req, res, next) => {
  try {
    if (collection !== null) {
      next();
    } else {
      throw new Error("MongoDB connection not yet established");
    }
  } catch (err) {
    console.error(err);
    res.status(503).send("Service Unavailable");
  }
});

app.post( '/add', async (req,res) => {
  const result = await collection.insertOne( req.body )
  res.json( result )
})

// assumes req.body takes form { _id:5d91fb30f3f81b282d7be0dd } etc.
app.post( '/remove', async (req,res) => {
  const result = await collection.deleteOne({
    _id:new ObjectId( req.body._id )
  })

  res.json( result )
})

app.post( '/update', async (req,res) => {
  const result = await collection.updateOne(
      { _id: new ObjectId( req.body._id ) },
      { $set:{ name:req.body.name } }
  )

  res.json( result )
})

app.use(express.static("public"));

app.use(express.json());

app.get("/", (req, res) => {
  sendFile(res, "public/index.html");
});

app.get("/workout_data", (req, res) => {
  res.json(workoutDataArray);
});

app.post("/workout_calorie_calculator", (req, res) => {
  const requestDataString = req.body;

  const startingTime = new Date("2024-01-01 " + requestDataString.starting_time);
  let endingTime = new Date("2024-01-01 " + requestDataString.ending_time);
  if (endingTime < startingTime) {
    endingTime = new Date("2024-01-02 " + requestDataString.ending_time);
  }
  let totalMinutes = (endingTime - startingTime) / (60000); // Convert milliseconds to minutes

  const totalWorkoutDuration = `${Math.floor(totalMinutes / 60)} hour ${totalMinutes % 60} minutes`;

  const estimated_calories = calcEstCaloriesBurned(
      requestDataString.workout_type,
      requestDataString.workout_intensity,
      totalMinutes
  );

  requestDataString.totalWorkoutDuration = totalWorkoutDuration;
  requestDataString.estimated_calories = estimated_calories;

  workoutDataArray.push(requestDataString);

  res.status(200).json(requestDataString);
});

app.put("/edit_row/:index", (req, res) => {
  const index = req.params.index;
  const requestDataString = req.body;

  workoutDataArray[index].starting_time = requestDataString.json.starting_time;
  workoutDataArray[index].ending_time = requestDataString.json.ending_time;
  workoutDataArray[index].workout_type = requestDataString.json.workout_type;
  workoutDataArray[index].workout_intensity = requestDataString.json.workout_intensity;
  const startingTime = new Date("2024-01-01 " + workoutDataArray[index].starting_time);
  let endingTime = new Date("2024-01-01 " + workoutDataArray[index].ending_time);
  if (endingTime < startingTime) {
    endingTime = new Date("2024-01-02 " + workoutDataArray[index].ending_time);
  }
  const totalMinutes = (endingTime - startingTime) / (60000); // Convert milliseconds to minutes
  workoutDataArray[index].estimated_calories = calcEstCaloriesBurned(
      workoutDataArray[index].workout_type,
      workoutDataArray[index].workout_intensity,
      totalMinutes
  );

  console.log(JSON.stringify(requestDataString))

  res.status(200).json(workoutDataArray[index]);
});

app.delete("/delete_row/:index", (req, res) => {
  const index = req.params.index;
  workoutDataArray.splice(index, 1);
  res.status(200).end();
});

function sendFile(res, filename) {
  const type = mime.getType(filename);
  fs.readFile(filename, (err, content) => {
    if (err === null) {
      res.header("Content-Type", type);
      res.end(content);
    } else {
      res.status(404).end("404 Error: File Not Found");
    }
  });
}

function calcEstCaloriesBurned(workoutType, workoutIntensity, workoutDurationMins) {
  let caloriesBurnedPerMin;

  switch (workoutType) {
    case "Soccer":
      caloriesBurnedPerMin = 8;
      break;
    case "Football":
      caloriesBurnedPerMin = 9;
      break;
    case "Boxing":
      caloriesBurnedPerMin = 8;
      break;
    case "Wrestling":
      caloriesBurnedPerMin = 9;
      break;
    default:
      caloriesBurnedPerMin = 0;
      break;
  }

  switch (workoutIntensity) {
    case "Low":
      caloriesBurnedPerMin *= 0.47;
      break;
    case "Medium":
      caloriesBurnedPerMin *= 0.75;
      break;
    case "High":
      caloriesBurnedPerMin *= 1.10;
      break;
    default:
      break;
  }

  return (caloriesBurnedPerMin * workoutDurationMins).toFixed(2);
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
