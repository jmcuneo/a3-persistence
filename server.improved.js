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
app.use( cookie({
  name: 'session',
  keys: ['key1', 'key2'],
  username: ''
}))

//Database Code
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USERNAME}:${process.env.PASS}@${process.env.HOST}`;
const { parse } = require("path");
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let accounts
let data
let countAccounts
let countData
let currentUser

async function run(){
  await client.connect()
  const myDatabase = await client.db("CS4241")
  accounts = myDatabase.collection('Accounts')
  data = myDatabase.collection('Calculator')
  countAccounts = accounts.countDocuments()
  countData = accounts.countDocuments()
}

run()

app.use( express.json())
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Define a specific route for '/'
app.get('/', (req, res) => {
    res.sendFile('/public/login.html', { root: __dirname })
  });

app.post( '/login', async(req,res)=> {      //login post method
  let username = Object.values(req.body)[0];      //set username to first input
  let password = Object.values(req.body)[1];      //set password to second input 

  const dbUser = await accounts.findOne({ username: username })     //set dbUser to an existing user if one exists

  if (dbUser && dbUser.password === password) {     //if the username and password exist in the accounts database
    res.redirect( '/index.html' )       //send them to the calculator in index.html
    currentUser = dbUser._id.toString();      //set the string of the user's id to the user
    //console.log(currentUser);

    let currentData = await data.find({ user: currentUser }).toArray();       //the data in the calculator data database that matches with the current user    
    req.session.login = true                    //set user to logged in
    req.session.username = req.body.username;       //set the session user to the username from the html input
    //console.log(req.session.username)
   
}
else{         //if not a current user in the database
  await accounts.insertOne({ username: username, password: password });       //add the username and password to the accounts database
  const dbUser = username           //set the dbUser to the Username given 
  res.redirect( '/index.html' )       //redirect to the index.html (calculator)
  currentUser = dbUser._id.toString();         //set the string of the user's id to the user
  }
})

app.post('/addition', async (req, res) => {
  const num1 = parseFloat(req.body.num1)       //extracting the first number from clientData
  const num2 = parseFloat(req.body.num2)       //extracting the second number from clientData

  console.log("Received num1:", num1);
  console.log("Received num2:", num2);

  const result = (num1 + num2);      //add the two imputted numbers together + truncates
  await data.insertOne({ user: currentUser, result: result });       //add this result to the array of previous results
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ result: result }));        //send the result to the client
    }
);

app.post('/subtract', async (req, res) => {
  const num1 = parseFloat(req.body.num1)       //extracting the first number from clientData
  const num2 = parseFloat(req.body.num2)       //extracting the second number from clientData

  console.log("Received num1:", num1);
  console.log("Received num2:", num2);

  const result = (num1 - num2);      //subtract the two imputted numbers together + truncates
  await data.insertOne({ user: currentUser, result: result });       //add this result to the array of previous results
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ result: result }));        //send the result to the client
    }
);

app.post('/multiply', async (req, res) => {
  const num1 = parseFloat(req.body.num1)       //extracting the first number from clientData
  const num2 = parseFloat(req.body.num2)       //extracting the second number from clientData

  console.log("Received num1:", num1);
  console.log("Received num2:", num2);

  const result = (num1 * num2);      //multiply the two imputted numbers together + truncates
  await data.insertOne({ user: currentUser, result: result });       //add this result to the array of previous results
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ result: result }));        //send the result to the client
    }
);

app.post('/divide', async (req, res) => {
  const num1 = parseFloat(req.body.num1)       //extracting the first number from clientData
  const num2 = parseFloat(req.body.num2)       //extracting the second number from clientData

  console.log("Received num1:", num1);
  console.log("Received num2:", num2);

  const result = (num1 / num2);      //divide the two imputted numbers together + truncates
  await data.insertOne({ user: currentUser, result: result });       //add this result to the array of previous results
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ result: result }));        //send the result to the client
    }
);

app.get("/getPreviousResults", async (req, res) => {        //function to fetch the data from the particular user 
  try {
    const currentData = await data.find({ user: currentUser }).toArray();       //set current data to data from the database for the current user 
    res.status(200).json(currentData);    
  } catch (error) {       //error in getting results
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
})

app.post('/deleteResult', async (req, res) => {       //delete result function
  const result = await data.deleteOne({ _id:new ObjectId(req.body._id) });
  res.status(200).json( result );
});

app.post( '/editResult', async (req,res) => {       //edit existing data function
  const result = await data.updateOne(        //update the data
    { _id: new ObjectId( req.body._id ) },
    { $set:{ result:req.body.content}       //set new value
    })
  res.status(200).json( result )

  if (result.modifiedCount === 1) {     //check to make sure something was modified 
    res.status(200).json({ success: true });
  } else {
    res.status(500).json({ success: false, message: 'Failed to update result.' });      //if not, send error message
  }
})

app.post('/signOut', (req, res) => {      //sign out post for the sign out button
  req.session = null;       //set session to null
  res.sendStatus(200);      //send success
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