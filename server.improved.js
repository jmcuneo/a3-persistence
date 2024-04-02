const express    = require('express'),
      cookie     = require('cookie-session')
      app        = express()

require('dotenv').config({path: '.env'})

const { MongoClient, ObjectId } = require('mongodb')
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`
const client = new MongoClient( uri )
let collection = null

app.use( express.static( 'public' ) )
app.use( express.static( 'views'  ) )
app.use( express.json() )
app.use( cookie({
  name: 'session',
  keys: ['ihave', 'depression'],
  login: false
}))

async function run() {
  await client.connect()
  collection = await client.db("sample_mflix").collection("number-data")

  // route to get all docs
  app.get("/docs", async (req, res) => {
    if (collection !== null) {
      const docs = await collection.find({}).toArray()
      res.json( docs )
    }
  })
}

app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status(503).send()
  }
})


app.post( '/login', async (req,res)=> {
  let data = req.body
  let userCollection = await client.db("sample_mflix").collection("user-info")
  let userCheck = userCollection.findOne({username: data.username})

  if(userCheck) {
    req.session.login = true
    res.redirect( 'index.html' )
  }else{
    // password incorrect, redirect back to login page
    res.sendFile( __dirname + '/public/index.html' )
  }
})


// const handleGet = function( request, response ) {
//   const filename = dir + request.url.slice( 1 ) 

//   if( request.url === "/" || request.url.includes("?")) {
//     //Weird bug was popping up here with extra GET requests being sent after data was modified
//     //No idea where the requests were coming from or why (I tried a lot of debugging on both client and server sides)
//     //To get any modification to work I had to hardcode in the "?" check
//     //Found this sunday night so I couldn't ask professor or TAs about it
//     sendFile( response, "public/index.html" )
//   }else{
//     sendFile( response, filename )
//   }
// }


app.post( '/refresh', async (req, res) => {
  const result = await collection.find({}).toArray()
  res.json(result)
})

app.post( '/submit', async (req, res) => {
  let data = req.body
  console.log(data)

  let output = eval(data.val1 + data.op + data.val2) //Get correct answer
  let guess = false
  if(data.guess == output){ //If user guessed, evaluate that guess 
    guess = true
  } else if (data.guess == ''){
    guess = null
  }

  let newData = {val1: parseInt(data.val1), val2: parseInt(data.val2), op: data.op, output, guess}
  collection.insertOne(newData)
  const result = await collection.find({}).toArray()
  res.json(result)
})

//Delete an item from the table
function deleteData (request, response) {
  let dataString = ""

  request.on( "data", function( data ) {
      dataString += data 
  })

  request.on("end", function(){
    data = JSON.parse(dataString) //Data is just the index of the entry to remove
    console.log("Index for deletion: " + data)
    let removed = appdata.splice(data, 1) //Remove from table
    console.log(removed)
    sendData(response) //Send data back to client
  } )
}

app.post( '/remove', async (req, res) => {
  let data = req.body.id
  let query = { _id: ObjectId.createFromHexString(data)}
  let deletion = await collection.deleteOne(query)
  const result = await collection.find({}).toArray()
  res.json(result)
})

app.post( '/modify', async (req, res) => {
  let data = req.body
  let query = {_id: ObjectId.createFromHexString(data.id)}
  let oldData = await collection.findOne(query) //Get currently stored data in server
  let comboData = combineData(data, oldData) //Combine old and new data

  //If the user didnt assign a correct value, calculate it
  if (comboData.output == null || comboData.output == '') {
    comboData.output = eval(comboData.val1 + comboData.op + comboData.val2) 
  }
  
  collection.replaceOne(query, comboData) //Replace old server data 
  const result = await collection.find({}).toArray()
  res.json(result)
})

//Combine old and new data
function combineData (mod, old) {
  //New instance to store info
  let newData = {val1: null, val2: null, op: null, output: null, guess: null}
  if (mod.output != null) {
    //If user assigned a new answer, assign here
    newData.output = mod.output
  }

  //Get the most recent values of first value, second value, and the operator
  newData.val1 = pickData(mod, old, "val1")
  newData.val2 = pickData(mod, old, "val2")
  newData.op = pickData(mod, old, "op")

  return newData
}

//Pick the most recent data from old and new
function pickData (mod, old, valType) {
  //If data exists in most recent entry (mod), use that
  if (mod[valType] != null && mod[valType] != '') {
    return mod[valType]
  } else { //Otherwise default to old data
    return old[valType]
  }
}

run()
app.listen(process.env.PORT)