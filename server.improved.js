//SERVER

//whole buncha requirements and imports. honestly idek how many of these i still need
const express = require("express");
const cookie = require("cookie-session");
const fs = require("fs");
const mime = require("mime");
const dir = "public/";
const port = 3000;
const render = require("render");
const appdata = [];
const app = express();
app.use( express.urlencoded({ extended:true }) )
app.set('view engine', 'ejs');

app.use( cookie({
  name: 'session',
  keys: ['key1', 'key2']
}))

const bodyParser = require("body-parser")
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

//setting up the database connections
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const loguri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`;
const logclient = new MongoClient(loguri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let collection = null;
let userCollection = null;

//login function, connects to database
//if the username isnt found, adds to collection and then approves login
//if the username does exist but the password doesnt, fails login
//if username and password match, then approves the login
app.post( '/login', async  (req,res)=> {
  const userCollection = await logclient.db("JacobsA3Database").collection("Users")
  const { username, password } = req.body;
  const user = await userCollection.findOne({ username });
  
  if (!user) {
    userCollection.insertOne({ username, password });
    //window.alert('New account created');
    req.session.login = true
    res.redirect(__dirname + '/public/login.html' );
  }
  else if (user.password !== password) {
    //window.alert('Incorrect password.');
    return res.sendFile( __dirname + '/public/login.html' )
  }
  else
  {
    req.session.login = true
    res.redirect( '/index.html?username=' + username)
  }
})

//logout request, sets the session to false
app.post('/logout', (req,res) => {
  req.session.login = false;
  res.sendStatus(200);
  
})

// add some middleware that always sends unauthenicaetd users to the login page
app.use( function( req,res,next) {
  if( req.session.login === true )
    next()
  else
    res.sendFile( __dirname + '/public/login.html' )
})

//run function to ping database, and ensure connection
async function run() {
  await client.connect()
  collection = await client.db("JacobsA3Database").collection("A3Dataset")
  await client.db("JacobsA3Database").command({ ping: 1 });
  console.log("Pinged your deployment. You successfully connected to MongoDB!");
  // route to get all docs
  app.get("/docs", async (req, res) => {
    if (collection !== null) {
      const docs = await collection.find({}).toArray()
      res.json( docs )
    }
  })
}

run();

//default pages, AKA login
app.get("/", (req, res) => {
  sendFile(res, "public/login.html");
});

//grabs the array
app.get("/docs", async (req, res) => {
    if (collection !== null) {
      const docs = await collection.find({}).toArray()
      res.json( docs )
    }
  })

app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status( 400 ).send()
  }
})

//submission request, adds the request data to the database 
app.post( '/submit', async (req,res) => {
  const myCollection = await client.db("JacobsA3Database").collection("A3Dataset");
  const combString = req.body.content;
  const strL = req.body.content.length;
  const username = req.body.username;
  const result = await myCollection.insertOne( {UserName : username,
                                                CombinedString : combString,
                                                StringLength : strL
                                                 } );
  res.json( result );
})

//finds sent id in database, and deletes document
app.post( '/delete', async (req,res) => {
  const myCollection = await client.db("JacobsA3Database").collection("A3Dataset");
  const result = await myCollection.deleteOne({ 
    _id:new ObjectId( req.body.content ) 
  })
  res.json( result )
})

//finds sent id in database, and edit document to new values
app.post( '/edit', async (req,res) => {
  const myCollection = await client.db("JacobsA3Database").collection("A3Dataset");
  const combString = req.body.content;
  const strL = req.body.content.length;
  const result = await myCollection.updateOne(
    { _id: new ObjectId( req.body.id ) },
    { $set:{ CombinedString:req.body.content,
             StringLength : strL}}
  )
  res.json( result )
})

app.use( express.static( 'public' ) );
app.use( express.static( 'views'  ) ); 
app.use(express.static("public") );

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

app.listen(port)