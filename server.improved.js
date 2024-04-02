// require() function use cases that allow for managing dependencies used throughout the file

require('dotenv').config()

const express = require("express");
const session = require('express-session');
const passport = require('passport');
const fs = require("fs");
const mime = require("mime");
const GitHubStrategy = require('passport-github').Strategy;
const { ObjectId, MongoClient, ServerApiVersion } = require('mongodb');
const connectEnsureLogin = require("connect-ensure-login")
const {ensureLoggedIn} = require("connect-ensure-login");

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`
const app = express();
const port = 3000;

// Configuring middleware used by the express routes

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: `${process.env.SECRETKEY}`,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: null }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.header('Cache-Control', 'no-store');
  next();
});

app.engine("html", require("ejs").renderFile)
app.set("view engine", "html")

// Defining client constant for the MongoDB database

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let collection = null
let collection2 = null

// Function given by MongoDB to run the database

async function run() {
  try {
    await client.connect();
    // Sending a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged deployment. Successfully connected to MongoDB!");
    collection = await client.db("Workout_Data").collection("workouts");
    collection2 = await client.db("Workout_Data").collection("users");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}).catch(console.error);

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

app.use(express.static("public"));

// Using the passport.js library to implement GitHub authentication using OAuth

passport.use(new GitHubStrategy({
      clientID: process.env.CLIENTID,
      clientSecret: process.env.CLIENTSECRET,
      callbackURL: "https://a3-klaudiofusha.glitch.me/auth/github/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      const user = {
        githubId: profile.id,
        username: profile.username,
        accessToken: accessToken,
        refreshToken: refreshToken,
        profile: profile
      };

      // Saving the user to MongoDB database


      collection2.insertOne(user, (err, result) => {
        if (err) {
          return done(err);
        }
        // Pass the user object to the done callback
        done(null, user);
      });
      if (accessToken) {
        return done(null, profile);
      } else {
        return done(new Error('Could not authenticate user'));
      }

      return done(null, profile);
    }
));

// Routes that check whether the user is authenticated through OAuth

app.get('/auth/github/',
    passport.authenticate('github'));

app.get('/auth/github/callback',
    passport.authenticate('github',
        { failureRedirect: '/login' }),
    async (req, res) => {
      if (!req.user) {
        return res.status(401).send('Could not authenticate user');
      }else {
        res.redirect('/');
      }
    }
);


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

// Middleware that automatically redirects to the OAuth login upon visiting the home page

app.get("/", ensureLoggedIn("/login.html") ,(req, res) => {
   //res.render("/views/index.html")
    sendFile(res, "views/index.html")
 });

// Route that allows the user to logout

app.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/login.html")
  })
})

// Handles posting workouts to the database

app.post( '/add', async (req,res) => {
  console.log("Reached function");
  console.log(req.body);

  const startingTime = new Date("2024-01-01 " + req.body.starting_time);
  let endingTime = new Date("2024-01-01 " + req.body.ending_time);
  if (endingTime < startingTime) {
    endingTime = new Date("2024-01-02 " + req.body.ending_time);
  }
  let totalMinutes = (endingTime - startingTime) / (60000); // Convert milliseconds to minutes

  const totalWorkoutDuration = `${Math.floor(totalMinutes / 60)} hour ${totalMinutes % 60} minutes`;

  const estimated_calories = calcEstCaloriesBurned(
      req.body.workout_type,
      req.body.workout_intensity,
      totalMinutes
  );

  req.body.totalWorkoutDuration = totalWorkoutDuration;
  req.body.estimated_calories = estimated_calories;
  req.body._id = await client.db("Workout_Data").collection(req.session.passport.user.id).insertOne(req.body);

  res.json( req.body )
})

// Handles deleting workouts from the database

app.delete( '/remove', async (req,res) => {
  console.log(req.body)
  const result = await client.db("Workout_Data").collection(req.session.passport.user.id).deleteOne({
    _id:new ObjectId( req.body.workout_id )
  })

  console.log(result)
  res.json( result )
})

// Handles editing workouts that are stored in the database

app.put( '/update', async (req,res) => {

  const startingTime = new Date("2024-01-01 " + req.body.json.starting_time);
  let endingTime = new Date("2024-01-01 " + req.body.json.ending_time);
  if (endingTime < startingTime) {
    endingTime = new Date("2024-01-02 " + req.body.json.ending_time);
  }
  let totalMinutes = (endingTime - startingTime) / (60000); // Convert milliseconds to minutes

  const estimated_calories = calcEstCaloriesBurned(
      req.body.json.workout_type,
      req.body.json.workout_intensity,
      totalMinutes
  );

  req.body.json.estimated_calories = estimated_calories

  await client.db("Workout_Data").collection(req.session.passport.user.id).updateOne(
      { _id: new ObjectId( req.body.json.workout_id ) },
      { $set:{ starting_time:req.body.json.starting_time,
          ending_time:req.body.json.ending_time,
          workout_type:req.body.json.workout_type,
          workout_intensity:req.body.json.workout_intensity,
          estimated_calories:estimated_calories } }
  )

  console.log(req.body)
  res.json( req.body.json )
})

// Handles getting workouts from the database

app.get("/workout_data", async (req, res) => {
  try {
    const data = await client.db("Workout_Data").collection(req.session.passport.user.id).find().toArray();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
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

/*This function computes the logic for the derived field in the table. Based on the workout type, intensity, and duration in minutes, it is able to give you an estimate for calories burned.*/

function calcEstCaloriesBurned(workoutType, workoutIntensity, workoutDurationMins) {
  let caloriesBurnedPerMin;

  /*Stats gain from the Jamaica Hospital Medical Center's - Health Beat website & Captain Calculator*/
  switch (workoutType) {
    case "Soccer":
      caloriesBurnedPerMin = 8; // Calories burned per minute for soccer
      break;
    case "Football":
      caloriesBurnedPerMin = 9; // Calories burned per minute for football
      break;
    case "Boxing":
      caloriesBurnedPerMin = 8; // Calories burned per minute for boxing
      break;
    case "Wrestling":
      caloriesBurnedPerMin = 9; // Calories burned per minute for wrestling
      break;
    default:
      caloriesBurnedPerMin = 0;
      break;
  }

  /*The intensities might not be completely accurate, but they are close*/
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

