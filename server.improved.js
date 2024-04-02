if (process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}

const port = 3000
const express = require("express")
const {MongoClient, ObjectId} = require("mongodb")
const passport = require("passport")
const session = require("express-session")
const RedisStore = require("connect-redis")
const bcrypt = require("bcrypt")
const flash = require("express-flash")

const bodyParser = require("body-parser")
const app = express();

const initializePassport = require("./public/js/authentication")

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))
app.use(express.json())
app.set("view-engine", "html")
app.use(express.urlencoded({extended: false}))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

initializePassport(
    passport,
    name => userdb.find(user => user.username === name),
    id => userdb.find(user => user._id === id)
)

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`
const client = new MongoClient(uri)

let studentdb = null
let userdb = null
let authorized = false
let userdblocal = []
let currName = ""

async function run() {
  try{
    await client.connect()
    studentdb = client.db("studentdb").collection("students")
    userdb = client.db("studentdb").collection("users")
    console.log("MongoDB database connected successfully")

    app.listen(process.env.PORT || port, () => {
      console.log(`Server is running on port ${process.env.PORT || port}`)
    })

  }
  catch(error){
    console.error("Error connecting to MongoDB:", error)
  }
}

run().catch(console.error)


function isAuthenticated(req, res, next){
  if (authorized){
    return next()
  }

  res.redirect("/")
}

function isNotAuthenticated(req, res, next){
  if (authorized){
    res.redirect("/app.html")
  }
  next()
}

app.get("/", (req, res)=>{
  if (authorized){
    res.redirect("app.html")
  }
})

app.get("/app", /*isAuthenticated,*/(req, res) =>{
  if(authorized){
    res.redirect("/app.html")
  }
  else{
    res.redirect("/")
  }

})

app.get("/login", /*isNotAuthenticated, */(req, res) => {
  if (authorized){
    res.redirect("/app.html")
  }
  else{
    res.redirect("/")
  }

})

app.post("/login", /*isNotAuthenticated, *//*passport.authenticate("local", */async (req, res) =>{
  try{
    const {name, password} = req.body

    const existingUser = userdblocal.find(user=> user.name === name)
    if(existingUser){
      const isPasswordCorrect = await bcrypt.compare(password, existingUser.hashedPassword)
      if (isPasswordCorrect){
          authorized = true
          req.session.isAuthenticated = true
          currName = name

          return res.redirect("/app.html")
      }
      else{
        console.log("Invalid username or password1")
        return res.status(400).json({message: "Error: Invalid username or password"})
      }
    }
    else{
      console.log("Invalid username or password2")
      return res.status(400).json({message: "Error: Invalid username or password"})
    }
  }
  catch(error){
    console.error(error)
    res.redirect("/")
  }

})//)

app.get("/register", /*isNotAuthenticated,*/(req, res) => {
  if(authorized){
    res.redirect("/app.html")
  }
  else{
    res.redirect("/register.html")
  }

})

app.post("/register", /*isNotAuthenticated, */async(req, res) => {
  try{
    const {name, password} = req.body

    const hashedPassword = await bcrypt.hash(password, 10)

    //const existingUser = await userdb.findOne({username: req.body.name})
    const existingUser = userdblocal.find(user=> user.name === name)
    if (existingUser) {
      console.log("Username already exists")
      return res.status(400).json({message: "Error: Username already exists"})
    }

    //const result = await userdb.insertOne({username: req.body.name, hashPass: hashedPassword})
    const result = userdblocal.push({name, hashedPassword})
    console.log("User added")
    res.json({message: "User added successfully", name: name})
  }
  catch{
    res.redirect("/register.html")
  }
})

app.get("/logout", (req, res) => {
  //req.logout()
  authorized = false
  res.redirect("/")
})


app.get("/studentData", async (req, res) => {
  try {
    if (studentdb){
      const studentData = await studentdb.find({}).toArray()
      res.json({studentData, currName})
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


