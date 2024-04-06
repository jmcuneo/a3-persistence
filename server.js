/* Setup code for express, handlebars, and MongoDB */
const express = require("express"),
      { MongoClient, ObjectId } = require("mongodb"),
      app = express(),
      cookie = require('cookie-session'),
      hbs = require('express-handlebars').engine

app.use(express.static("public"))
app.use(express.static("views"))
app.use(express.json())
app.use( express.urlencoded({extended: true}))

app.engine( 'handlebars', hbs())
app.set('view engine', 'handlebars')
app.set('views', './views')

app.use(cookie({
  name: 'session',
  keys: ['key1', 'key2']
}))

/* Code to connect to the MongoDB database with the specific cluster credentials and collection names */
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`
const client = new MongoClient(uri)

let collection = null
let login = null

async function run() {
  await client.connect()
  collection = await client.db("Assignment3DB").collection("PartRecord")
  login = await client.db("Assignment3DB").collection("LoginRecord")
  console.log("Connected!")

  // route to get all docs
  app.get("/docs", async (req, res) => {
    if (collection !== null) {
      const docs = await collection.find({}).toArray()
      res.json(docs)
    }
  })
}

run()

var active_user = ""

/* Adds a new part entry to the database (collection) PartRecord with all its specified fields and the related_user*/
app.post('/add', async (req,res) => {
  var weight = parseInt(req.body.new_quantity)*parseFloat(req.body.weight_per_unit)
  const result = await collection.insertOne({part_name: req.body.part_name, new_material: req.body.new_material, new_quantity: req.body.new_quantity, weight: weight, related_user: active_user, robot_type: req.body.robot_type})
  res.json(result)
})

/* Modifies a part entry in the database (collection) PartRecord with all its specified fields and the related_user (and recomputes weight)*/
app.post('/modify', async (req,res) => {
  var new_weight = parseInt(req.body.new_quantity)*parseFloat(req.body.weight_per_unit)
  const result = await collection.updateOne({part_name: req.body.part_name, robot_type: req.body.robot_type}, {$set: {new_material: req.body.new_material, new_quantity: req.body.new_quantity, weight: new_weight}})
  res.json(result)
})

/* Deletes a part entry from the database (collection) PartRecord based on its part_name, the related_user, and the robot_type*/
app.post('/remove', async (req,res) => {
  const result = await collection.deleteOne({$and: [{part_name: {$eq: req.body.part_name}}, {robot_type: {$eq: req.body.robot_type}}]})
  res.json(result)
})

/* Gets the table of all part entries related to the current user from the database */
app.get('/receive', async (req, res) => {
  const result = await collection.find({related_user: active_user}).toArray()
  res.json(result)
})

/* Depending on the case, searches the LoginRecord collection and sometimes updates the LoginRecord collection
 * Case 1: Search LoginRecord returns no matching username: add new user to LoginRecord
 * Case 2: Search LoginRecord returns matching username but password does not match: render Login Page with incorrect password error
 * Case 3: Search LoginRecord returns mtching username and password: render data page with that user's part entry data
 */
app.post('/login', async (req,res) => {
  const in_db = await login.find({username: req.body.username}).toArray()
  if(in_db.length == 0){
    await login.insertOne(req.body)
    req.session.login = true
    active_user = req.body.username
    res.render('data', {msg: 'New account created successfully!', layout: false})
  }else{
    const result = await login.find({username: req.body.username, password: req.body.password}).toArray()
    if(result.length != 0){
      req.session.login = true
      active_user = req.body.username
      res.redirect('data.html')
    }else{
      req.session.login = false
      res.render('index', {msg: 'Incorrect login, please re-enter password', layout: false})
    }
  }
})

/* Gets the Login Page via the '/' URL */
app.get('/', (req,res) => {
  res.render('index', {msg: '', layout: false})
})

/* Sends unauthenticated users to the Login Page with a related error message */
app.use(function(req, res, next) {
  if(req.session.login === true)
    next()
  else
    res.render('index', {msg:'Please login with credentials to access the Part Calculator', layout:false })
})

/* Gets the data.html page */
app.get('/data.html', (req, res) => {
    res.render('data', {msg: '', layout: false})
})

app.listen(3000)