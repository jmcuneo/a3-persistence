const express = require("express"),
      { MongoClient, ObjectId } = require("mongodb"),
      app = express(),
      hbs     = require( 'express-handlebars' ).engine

app.use(express.static("public") )
app.use(express.json() )
app.use( express.urlencoded({ extended:true }) )

app.engine( 'handlebars',  hbs() )
app.set(    'view engine', 'handlebars' )
app.set(    'views',       './views' )

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`
const client = new MongoClient( uri )

let collection = null

async function run() {
  await client.connect()
  collection = await client.db("Assignment3DB").collection("PartRecord")
  login = await client.db("Assignment3DB").collection("LoginRecord")
  console.log("Connected!")

  // route to get all docs
  app.get("/docs", async (req, res) => {
    if (collection !== null) {
      const docs = await collection.find({}).toArray()
      res.json( docs )
    }
  })
}

run()

var logged_in = false
var active_user = ""

// Try to do this without updating
app.post( '/add', async (req,res) => {
  var weight = parseInt(req.body.new_quantity)*parseFloat(req.body.weight_per_unit)
  const result = await collection.insertOne( {part_name: req.body.part_name, new_material: req.body.new_material, new_quantity: req.body.new_quantity, weight: weight, related_user: active_user, robot_type: req.body.robot_type} )
  res.json( result )
})

app.post( '/remove', async (req,res) => {
  console.log(req.body.part_name)
  console.log(req.body.robot_type)
  const result = await collection.deleteOne( {$and: [{part_name: {$eq: req.body.part_name}}, {robot_type: {$eq: req.body.robot_type}}]} )
  res.json( result )
})

app.post( '/modify', async (req,res) => {
  var new_weight = parseInt(req.body.new_quantity)*parseFloat(req.body.weight_per_unit)
  const result = await collection.updateOne( {part_name: req.body.part_name, robot_type: req.body.robot_type}, {$set: {new_material: req.body.new_material, new_quantity: req.body.new_quantity, weight: new_weight}})
  res.json( result )
})

app.get('/receive', async (req, res) => {
  const result = await collection.find({related_user: active_user}).toArray()
  console.log(result)
  res.json( result )
})

app.post( '/login', async (req,res) => {
  const in_db = await login.find({username: req.body.username}).toArray()
  if(in_db.length == 0){
    const result = await login.insertOne(req.body)
    logged_in = true
    active_user = req.body.username
    res.render( 'data', {msg: 'New account created successfully!', layout: false} )
  }else{
    const result = await login.find({username: req.body.username, password: req.body.password}).toArray()
    if(result.length != 0){
      console.log(req.body.password)
      logged_in = true
      active_user = req.body.username
      res.redirect( 'data.html' )
    }else{
      console.log('inactive' + req.body.username)
      logged_in = false
      res.render( 'index', {msg: 'Incorrect login, please re-enter password', layout: false} )
    }
  }
})

app.get( '/', (req,res) => {
  res.render( 'index', { msg:'', layout:false })
})

// If not authenticated, users are sent to the login page
app.use( function( req,res,next) {
  if(logged_in === true)
    next()
  else
    res.render('index', { msg:'Please login with credentials to access the Part Calculator', layout:false })
})

app.get( '/data.html', ( req, res) => {
    res.render( 'data', { msg:'', layout:false })
})

app.listen(3000)