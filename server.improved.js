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
  cookie = require('cookie-session'), 
  path = require('path'), 
  bodyParser = require('body-parser');

require("dotenv").config();

const app = express();

app.use( express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use( cookie({
  name: 'session',
  keys: ['key1', 'key2'],
  username: ''
}))

app.use( express.static(path.join(__dirname, 'public')))

// Middleware to serve login page before any other page if not authenticated
const serveLoginIfNotAuthenticated = (req, res, next) => {
  // If not authenticated and not trying to access the login page
  if (!req.session.login && req.path !== '/login') {
    res.redirect('/login');
  } else {
    next();
  }
};

// Apply the middleware to all routes
app.use(serveLoginIfNotAuthenticated);

app.post( '/login', (req,res)=> {
  // express.urlencoded will put your key value pairs 
  // into an object, where the key is the name of each
  // form field and the value is whatever the user entered
  console.log( req.body )
  
  // below is *just a simple authentication example* 
  // for A3, you should check username / password combos in your database
  if( req.body.username === 'user1' && req.body.password === 'password1' || req.body.username === 'user2' && req.body.password === 'password2') {
    // define a variable that we can check in other middleware
    // the session object is added to our requests by the cookie-session middleware
    req.session.login = true
    req.session.username = req.body.username;
    console.log(req.session.username)
    
    // since login was successful, send the user to the main content
    // use redirect to avoid authentication problems when refreshing
    // the page or using the back button, for details see:
    // https://stackoverflow.com/questions/10827242/understanding-the-post-redirect-get-pattern 
    res.redirect( '/' )
  }else{
    // password incorrect, redirect back to login page
    res.sendFile(__dirname + '/public/login.html')
  }
})

// Default route handler
app.use('/', (req, res, next) => {
  // Check if user is authenticated, if not, redirect to login
  if (req.session.login===true) {
    next()
  } else {
    // User is authenticated, redirect to main content
    res.sendFile(__dirname + '/public/index.html');
  }
});

app.get('/login', (req, res) => {
  sendFile(res, (__dirname + '/public/login.html'));
});

//Database Code
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.USERNAME}:${process.env.PASS}@${process.env.HOST}`;
const { ObjectId } = require('mongodb'); // Add this line to import ObjectId from MongoDB
const { parse } = require("path");
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.get('/', (req, res)=>{
  sendFile(res, 'public/login.html')
})

app.post('/addition', async (req, res) => {
  const collection = await client.db("CS4241").collection("Calculator")
  const count = ( await collection.countDocuments()) + 1
  const num1 = parseFloat(req.body.num1)       //extracting the first number from clientData
  const num2 = parseFloat(req.body.num2)       //extracting the second number from clientData

  console.log("Received num1:", num1);
  console.log("Received num2:", num2);

  const result = (num1 + num2);      //add the two imputted numbers together + truncates
  collection.insertOne({ count: count + 1, result: result });       //add this result to the array of previous results
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ result: result }));        //send the result to the client

    }
);

app.post('/subtract', async (req, res) => {
  const collection = await client.db("CS4241").collection("Calculator")
  const count = ( await collection.countDocuments()) + 1
  const num1 = parseFloat(req.body.num1)       //extracting the first number from clientData
  const num2 = parseFloat(req.body.num2)       //extracting the second number from clientData

  console.log("Received num1:", num1);
  console.log("Received num2:", num2);

  const result = (num1 - num2);      //add the two imputted numbers together + truncates
  collection.insertOne({ count: count + 1, result: result });       //add this result to the array of previous results
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ result: result }));        //send the result to the client

    }
);

app.post('/multiply', async (req, res) => {
  const collection = await client.db("CS4241").collection("Calculator")
  const count = ( await collection.countDocuments()) + 1
  const num1 = parseFloat(req.body.num1)       //extracting the first number from clientData
  const num2 = parseFloat(req.body.num2)       //extracting the second number from clientData

  console.log("Received num1:", num1);
  console.log("Received num2:", num2);

  const result = (num1 * num2);      //add the two imputted numbers together + truncates
  collection.insertOne({ count: count + 1, result: result });       //add this result to the array of previous results
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ result: result }));        //send the result to the client

    }
);

app.post('/divide', async (req, res) => {
  const collection = await client.db("CS4241").collection("Calculator")
  const count = ( await collection.countDocuments()) + 1
  const num1 = parseFloat(req.body.num1)       //extracting the first number from clientData
  const num2 = parseFloat(req.body.num2)       //extracting the second number from clientData

  console.log("Received num1:", num1);
  console.log("Received num2:", num2);

  const result = (num1 / num2);      //add the two imputted numbers together + truncates
  collection.insertOne({ count: count + 1, result: result });       //add this result to the array of previous results
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ result: result }));        //send the result to the client

    }
);

// route to get all docs
app.get("/getPreviousResults", async (req, res) => {
  const collection = await client.db("CS4241").collection("Calculator")
  const count = collection.countDocuments() + 1
  const docs = await collection.find({}).toArray()
  const formattedDocs = docs.map(doc => ({ _id: doc._id, result: doc.result }))
  res.json(formattedDocs)
})

app.post('/deleteResult', async (req, res) => {
  const collection = await client.db("CS4241").collection("Calculator")
  const count = collection.countDocuments() + 1
  const result = await collection.deleteOne({ _id:new ObjectId(req.body._id) });
  res.status(200).json( result );
});

app.post( '/editResult', async (req,res) => {
  const collection = await client.db("CS4241").collection("Calculator")
  const count = collection.countDocuments() + 1
  const result = await collection.updateOne(
    { _id: new ObjectId( req.body._id ) },
    { $set:{ result:req.body.content}
    })
  res.status(200).json( result )
})

app.post('/signOut', (req, res) => {
  req.session = null;
  res.sendStatus(200); 
});

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
  
app.listen( process.env.PORT || 3000 )