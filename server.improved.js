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
  //session = require('express-session'),
  app = express()

require("dotenv").config();
const bodyParser = require('body-parser');

app.use( express.static( 'public' ) )
app.use( express.json())
//app.use(session({
//  secret: 'your_secret_key',
//  resave: false,
//  saveUninitialized: true
//}));

app.use(bodyParser.urlencoded({ extended: true }));

const users = {
  'user1': 'password1'
}

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

/*

const middleware_post = async (req, res, next) => {
  if(req.method === 'POST'){
    let dataString = ''

    req.on( 'data', function(data){
      dataString += data
    })

    req.on( 'end', function() {
      if (dataString){
        const clientData = JSON.parse(dataString)     //define client data

        num1 = parseFloat(clientData.num1)       //extracting the first number from clientData
        num2 = parseFloat(clientData.num2)       //extracting the second number from clientData
        index = parseInt(clientData.index)
        id = parseInt(client.id) 
        content = parseInt(client.content)

        req.clientData = {
          num1: num1, 
          num2: num2,
          index: index,
          id: id,
          content: content
        }
  
      }
      next();
    })
  }
  else {
    next();
  }
}

app.use( middleware_post )
*/

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
  
app.listen( process.env.port || 3000 )