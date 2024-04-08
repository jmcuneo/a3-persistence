const express = require('express')
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const {create} = require("domain");
const app = express()
const port = process.env.PORT || 3000;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const mongoDB = "mongodb+srv://nguyenryan0903:JasonRyan2@a3-persistence.w6ebvsy.mongodb.net/?retryWrites=true&w=majority&appName=a3-persistence";

// Define Schema
const Schema = mongoose.Schema;
const User_Schema = new Schema({
  username: String,
  password: String,
  uuid: {
    type: String,
    default: uuidv4,
    unique: true
  },
});
const User = mongoose.model("User", User_Schema);

const Workout_Schema = new Schema({
  workout_title: String,
  workout_description: String,
  workout_type: String,
  uuid: {
    type: String,
    default: "",
    unique: false
  },
  date_created: {type: Date, required: false}
});
const Workout = mongoose.model("Workout", Workout_Schema);

// SETUP SERVER AND ROUTES
app.use(express.static(path.join(__dirname, './public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



app.post('/get_workouts', (req, res)=>{
  let dataString = ""

  req.on( "data", function( data ) {
    dataString += data
  })

  req.on( "end", async function() {
    let json = JSON.parse(dataString);

    try {
      const workouts = await Workout.find({uuid: json.uuid});
      res.status(200).json(workouts)
    } catch (error) {
      res.status(500).json({ message: 'Error fetching workouts' });
    }


  })
})

app.post('/login', (req, res)=>{
  let dataString = ""
  //Concats data as it is recieved
  req.on( "data", function( data ) {
    dataString += data
  })
  //data reaches its end
  req.on( "end", async function() {
    let json = JSON.parse(dataString);
    try{
      const users = await User.find({username: json.username});

      users.forEach(account => {
        if (account.password === json.password) {
          console.log("successfully logged in: " + account.uuid)
          res.status(200).json({ uuid: account.uuid });
        }
      })

    }
    catch {
      res.status(500);
    }
  })
})

app.post('/create_workout', (req, res)=>{
  let dataString = ""
  //Concats data as it is recieved
  req.on( "data", function( data ) {
    dataString += data
  })
  //data reaches its end
  req.on( "end", async function() {
    let json = JSON.parse(dataString);
    try{
      await createWorkout(json.title, json.description, json.type, json.uuid);

      console.log('workout created successfully ');
      res.status(200);
    }
    catch {
      console.error('Error creating workout');
      res.status(500);
    }
  })
})

app.post('/create_account', (req, res)=>{
  console.log("creating account")
  let dataString = ""
  //Concats data as it is recieved
  req.on( "data", function( data ) {
    dataString += data
  })
  //data reaches its end
  req.on( "end", async function() {
    let json = JSON.parse(dataString);
    console.log(json);
    try{
      const uniqueId = uuidv4();
      await User.create({ username: json.username, password: json.password, uuid: uniqueId });

      console.log('Account Created successfully ');
      res.status(200).json({uuid: uniqueId});
    }
    catch {
      console.error('Error Creating user:');
      res.status(500);
    }
  })
})

app.post('/edit_workout', (req, res)=>{
  let dataString = ""
  //Concats data as it is recieved
  req.on( "data", function( data ) {
    dataString += data
  })
  //data reaches its end
  req.on( "end", async function() {
    let json = JSON.parse(dataString);
    try{
      const workouts = await Workout.find({uuid: json.uuid})
      const element = workouts[json.postId];
      await Workout.findOneAndUpdate(element, {workout_title: json.title, workout_description: json.description, workout_type: json.type}, {upsert: false})
      console.log("Item edited");
      res.status(200);
      res.end();
    }
    catch {
      console.log("Error editing post")
      res.status(500);
      res.end()
    }
  })
})


app.post('/delete', (req, res)=>{
  let dataString = ""
  //Concats data as it is recieved
  req.on( "data", function( data ) {
    dataString += data
  })
  //data reaches its end
  req.on( "end", async function() {
    let json = JSON.parse(dataString);
    try{
      const workouts = await Workout.find({uuid: json.uuid})
      const ele_id = workouts[json.postId]._id;
      const item = await Workout.findByIdAndDelete(ele_id)
      console.log("Item deleted");
      res.status(200);
      res.end()
    }
    catch {
      console.log("Error deleting post")
      res.status(500);
      res.end()
    }
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

async function createWorkout(title, desc, type, sessionToken) {
  console.log("Session token: " + sessionToken);
  await Workout.create({ workout_title: title, workout_description: desc, workout_type: type, uuid: sessionToken });
  console.log("Workout Created");
}

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}
