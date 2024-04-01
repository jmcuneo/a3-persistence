const //http = require( "http" ),
      //fs   = require( "fs" ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you"re testing this on your local machine.
      // However, Glitch will install it automatically by looking in your package.json
      // file.
      //mime = require( "mime" ),
      //dir  = "public/",
      port = 3000,
      dotenv = require('dotenv').config(),
      mongoose = require("mongoose"),
      bodyParser = require("body-parser"),
      session = require("express-session"),
      Student = require("./people/Student"),
      User = require("./people/User"),
      passport = require("passport"),
      LocalStrategy = require("passport-local").Strategy

const express = require("express")
const {MongoClient, ObjectId} = require("mongodb")

const studentData = []

const app = express();

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))
app.use(express.json())
// app.use(require("express-session")({
//   secret: "secret-key",
//   resave: false,
//   saveUninitialized: false
// }))
// app.use(passport.initialize())
// app.use(passport.session())

//passport.use(new LocalStrategy(User.authenticate()))
//passport.serializeUser(User.serializeUser())
//passport.deserializeUser(User.deserializeUser())


const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`
const client = new MongoClient(uri)

let studentdb = null

async function run() {
  try{
    await client.connect()
    studentdb = client.db("studentdb").collection("students")
    console.log("MongoDB connected successfully")

    app.listen(process.env.PORT || port, () => {
      console.log(`Server is running on port ${process.env.PORT || port}`)
    })
  }
  catch(error){
    console.error("Error connecting to MongoDB:", error)
  }
}

run().catch(console.error)

app.get("/login", passport.authenticate("local"), (req, res) => {
  res.redirect("/students")
})

app.get("/logout", (req, res) => {
  req.logout()
  res.redirect("/")
})

function isAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next()
  }
  res.redirect("/")
}

app.get("/studentData", async (req, res) => {
  try {
    if (studentdb){
      const students = await studentdb.find({}).toArray()
      res.json(students)
    }
    else{
      res.status(503).json({message: "MongoDB connection not established"})
    }
  }
  catch (error){
    console.error(error)
    res.status(500).json({message: "Internal Server Error"})
  }
})

app.post("/submit", async(req, res) => {
  try{
    const {name, credits} = req.body

    let classStanding, classOf

    if (credits > 108){
      classStanding = "Senior";
      classOf = 2024;
    }
    else if (credits > 72){
      classStanding = "Junior";
      classOf = 2025;
    }
    else if (credits > 36){
      classStanding = "Sophomore";
      classOf = 2026;
    }
    else{
      classStanding = "Freshman";
      classOf = 2027;
    }

    const student = {name, credits, classStanding, classOf}

    const existingStudent = await studentdb.findOne({name: name})

    if (existingStudent) {
      await studentdb.updateOne({name: name}, {$set: {credits: credits, classStanding: classStanding, classOf: classOf}})
      console.log("Student updated")
      res.json({message: "Student updated successfully"})
    }
    else {
      const result = await studentdb.insertOne(student)
      console.log("Student added")
      res.json({message: "Student added successfully", _id: result.insertedId })
    }
  }
  catch(error) {
    console.error(error)
    res.status(500).json({message: "Internal Server Error"})
  }
})

app.post("/delete", async (req, res) => {
  try {
    const result = await studentdb.deleteOne({
      name: req.body.name
    })
    console.log("Student deleted")
    res.json(result)
  }
  catch(error){
    console.error(error)
    res.status(500).json({message: "Internal Server Error"})
  }
})


