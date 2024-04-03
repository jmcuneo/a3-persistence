const express = require("express"),
      { MongoClient, ObjectId } = require("mongodb"),
      dotenv = require('dotenv').config({ path: "./.env" }),
      cookie  = require( 'cookie-session' ),
      app = express()

app.use( express.urlencoded({ extended:true }) )
app.use( express.static('public') )
app.use( express.json() )

app.use( cookie({
  name: 'session',
  keys: ['key1', 'key2']
}))



// function for checking login post
app.post( '/login', (req,res)=> {

  console.log( req.body )
  
  if( req.body.password === 'admin' && req.body.username === 'admin') {

    req.session.login = true
    
    // password and username correct, redirect to main
    res.json({ login: true, msg: 'Login Success'})
  } else {

    // password or username incorrect, login fail
    res.json({ login: false, msg: 'Login Failed'});
  }
})



// route get requests for main
app.get( '/main', ( req, res) => {
  res.sendFile( __dirname + '/public/main.html' )
})

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`
const client = new MongoClient( uri )

let collection = []



// connect to db
async function run() {
  await client.connect()
  collection = await client.db("webware-db").collection("a3-collection")

  // route to get all docs
  app.get("/docs", async (req, res) => {
    if (collection !== null) {
      const docs = await collection.find({}).toArray()
      res.json( docs )
    }
  })
}



// middleware to ensure db connection
app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})



// function for submit post
app.post( '/submit', async (req,res) => {

  // for an entry we need to parse the bday string and then calculate age
  const bdayString = req.body.birthday;
  const bdayParts = bdayString.split("/");
  const bday = new Date(parseInt(bdayParts[2]), parseInt(bdayParts[0]) - 1, parseInt(bdayParts[1]));
  const today = new Date();

  let age = today.getFullYear() - bday.getFullYear();
  const month = today.getMonth() - bday.getMonth();
  if(month < 0 || (month === 0 && today.getDate() < bday.getDate())) {
    age--;
  }

  // after calculating age insert new entry into collection
  const result = await collection.insertOne( {
    "name": req.body.name,
    "birthday": req.body.birthday,
    "age": age,
    "preferredCake": req.body.preferredCake,
    "gift": req.body.gift
  })

  // return result
  res.json( result )
})



// function for delete call
app.delete('/delete', async (req, res) => {

  // use id to delete from collection
  const result = await collection.deleteOne( {
    "_id": new ObjectId(req.body._id)
  })

  // return result
  res.json( result )
})



// function for patch call
app.patch('/update', async (req, res) => {

  // for an updated entry we need to parse the bday string and then calculate age incase it was changed
  const bdayString = req.body.birthday;
  const bdayParts = bdayString.split("/");
  const bday = new Date(parseInt(bdayParts[2]), parseInt(bdayParts[0]) - 1, parseInt(bdayParts[1]));
  const today = new Date();

  let age = today.getFullYear() - bday.getFullYear();
  const month = today.getMonth() - bday.getMonth();
  if(month < 0 || (month === 0 && today.getDate() < bday.getDate())) {
    age--;
  }

  // after calculating age, create an update query with new info
  let query = { "_id": new ObjectId(req.body._id) }
  let newvals = { $set: { "name": req.body.name,
                          "birthday": req.body.birthday,
                          "age": age,
                          "preferredCake": req.body.preferredCake,
                          "gift": req.body.gift}}

  const result = await collection.updateOne( query, newvals )

  // return the result
  res.json( result )

})

run()

app.listen(3000)
