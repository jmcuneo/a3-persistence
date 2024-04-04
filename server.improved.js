//server.improved.js
//server-side code

const http = require( "http" ),
  fs   = require( "fs" ),
  // IMPORTANT: you must run `npm install` in the directory for this assignment
  // to install the mime library if you"re testing this on your local machine.
  // However, Glitch will install it automatically by looking in your package.json
  // file.
  mime = require( "mime" ),
  dir  = "public/",
  port = 3000,
  express = require('express'),
  session = require('express-session'),
  app = express()

require("dotenv").config();
const bodyParser = require('body-parser');

app.use( express.static( 'public' ) )
app.use( express.json() )
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: true }));

const users = {
  'user1': 'password1'
}

//Database Code
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.USERNAME}:${process.env.PASS}@${process.env.HOST}`;
const { ObjectId } = require('mongodb'); // Add this line to import ObjectId from MongoDB
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let collection = null

const sendFile = function( response, filename ) {
  const type = mime.getType( filename ) 

  fs.readFile( filename, function( err, content ) {

    // if the error = null, then we"ve loaded the file successfully
    if( err === null ) {

      // status code: https://httpstatuses.com
      response.writeHeader( 200, { "Content-Type": type })
      response.end( content )

    }else{

      // file not found, error code 404
      response.writeHeader( 404 )
      response.end( "404 Error: File Not Found" )

    }
  })
}

const middleware_post = (req, res, next) => {
  let dataString = ''

  req.on( 'data', function(data){
    dataString += data
  })

  req.on( 'end', function() {
    if(dataString){
      const clientData = JSON.parse(dataString)     //define client data
      num1 = parseFloat(clientData.num1),       //extracting the first number from clientData
      num2 = parseFloat(clientData.num2)        //extracting the second number from clientData
      index = parseInt(clientData.index)        //extracting the index from clientdata for the delete result in array case

      req.clientData = {
        num1: num1, 
        num2: num2,
        index: index
      }
    }
    next()
  })
}

app.use( middleware_post )

/*

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (users[username] && users[username] === password) {
      // Authentication successful, store user session
      req.session.authenticated = true;
      req.session.username = username;
      res.redirect('public/index.html'); // Redirect to main application page
  } else {
      // Authentication failed, redirect back to login page
      res.redirect('/login?error=1');
  }
});

// Main application route
app.get('/index', (req, res) => {
  if (req.session.authenticated) {
      res.sendFile('public/index.html'); // Serve the main application page
  } else {
      res.redirect('/login'); // Redirect to login if not authenticated
  }
});

app.get('/getLogin', (req, res) => {
  res.render( 'login', { msg:'', layout:false }); // Serve the login page
});

*/

async function run() {
  await client.connect()
  collection = await client.db("CS4241").collection("Calculator")
  const count = await collection.countDocuments() + 1

  // route to get all docs
  app.get("/getPreviousResults", async (req, res) => {
    const docs = await collection.find({}).toArray()
    const formattedDocs = docs.map(doc => ({ _id: doc._id, result: doc.result }))
    res.json(formattedDocs)
  })

  app.post('/addition', async (req, res) => {
    const { num1, num2 } = req.clientData;
    const result = (num1 + num2).toFixed(2);      //add the two imputted numbers together + truncates
    collection.insertOne({ count: count + 1, result: result });       //add this result to the array of previous results
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ result: result }));        //send the result to the client
  });
  
  app.post('/subtract', async (req, res) => {
    const { num1, num2 } = req.clientData;
    const result = (num1 - num2).toFixed(2);          //subtract the two imputted numbers together + truncates
    collection.insertOne({ count: count + 1, result: result });           //add this result to the array of previous results
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ result: result }));        //send the result to the client
  });
  
  app.post('/multiply', async (req, res) => {
    const { num1, num2 } = req.clientData;
    const result = (num1 * num2).toFixed(2);          //multiply the two imputted numbers together + truncates
    collection.insertOne({ count: count + 1, result: result });           //add this result to the array of previous results
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ result: result }));        //send the result to the client
  });
  
  app.post('/divide', async (req, res) => {
    const { num1, num2 } = req.clientData;
    const result = (num1 / num2).toFixed(2);          //divide the two imputted numbers together + truncates
    collection.insertOne({ count: count + 1, result: result });           //add this result to the array of previous results
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ result: result }));        //send the result to the client
  });
  
  app.post('/deleteResult', async (req, res) => {

    const result = await collection.deleteOne({ id:new ObjectId(req.body._id) });
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.status(200).json({ result: result });
  });

  
}

run()

app.listen( process.env.port || 3000 )