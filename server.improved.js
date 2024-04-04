const express = require("express");
const cookie  = require( "cookie-session" );
const fs = require("fs");
const mime = require("mime");
const dir = "public/";
const port = 3000;

const appdata = [];
const app = express();
app.use( express.urlencoded({ extended:true }) )

// cookie middleware! The keys are used for encryption and should be
// changed
app.use( cookie({
  name: 'session',
  keys: ['key1', 'key2']
}))


const bodyParser = require("body-parser")
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let collection = null;

//-----------------------------------------------------------------------------



app.post( '/login', (req,res)=> {
  debugger
  // express.urlencoded will put your key value pairs 
  // into an object, where the key is the name of each
  // form field and the value is whatever the user entered
  console.log( req.body )
  
  // below is *just a simple authentication example* 
  // for A3, you should check username / password combos in your database
  if( req.body.password === 'test' ) {
    // define a variable that we can check in other middleware
    // the session object is added to our requests by the cookie-session middleware
    req.session.login = true
    
    // since login was successful, send the user to the main content
    // use redirect to avoid authentication problems when refreshing
    // the page or using the back button, for details see:
    // https://stackoverflow.com/questions/10827242/understanding-the-post-redirect-get-pattern 
    res.redirect( 'index.html' )
  }else{
    // cancel session login in case it was previously set to true
    req.session.login = false
    // password incorrect, send back to login page
    res.render('login', { msg:'login failed, please try again', layout:false })
  }
})



// add some middleware that always sends unauthenicaetd users to the login page
app.use( function( req,res,next) {
  if( req.session.login === true )
    next()
  else
    res.render('login', { msg:'login failed, please try again', layout:false })
})

app.get( '/main.html', ( req, res) => {
    res.render( 'index', { msg:'success you have logged in', layout:false })
})

//-----------------------------------------------------------------------------

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

app.get("/docs", async (req, res) => {
    if (collection !== null) {
      const docs = await collection.find({}).toArray()
      res.json( docs )
    }
  })



app.get("/", (req, res) => {
  sendFile(res, 'public/login.html');
});

app.post("/", (req, res) => {
  const finalData = req.body;
  const method = finalData.method;

  if (method === "/delete") {
    const targetIndex = finalData.index;
    appdata.splice(targetIndex, 1);
    res.send("Bye bye!");
  } else if (method === "/add") {
    appdata.push(finalData.string);
    res.send("Added/Submitted!");
  } else if (method === "/edit") {
    appdata[finalData.index] = finalData.content;
    res.send("Edited!");
  } else {
    res.status(400).send("Yikes");
  }
});



app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})

app.post( '/submit', async (req,res) => {
  const myCollection = await client.db("JacobsA3Database").collection("A3Dataset");
  const combString = req.body.content;
  const strL = req.body.content.length;
  //console.log(strL)
  const result = await myCollection.insertOne( {CombinedString : combString,
                                                StringLength : strL} );
  
  res.json( result );
  //console.log("Combined string is: " + JSON.stringify(req.body))
  //console.log(req.body)
})

// assumes req.body takes form { _id:5d91fb30f3f81b282d7be0dd } etc.
app.post( '/delete', async (req,res) => {
  const myCollection = await client.db("JacobsA3Database").collection("A3Dataset");
  //console.log(req.body.content)
  const result = await myCollection.deleteOne({ 
    _id:new ObjectId( req.body.content ) 
  })
  
  res.json( result )
})

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


/*app.get("/", (req, res) => {
  sendFile(res, "public/index.html");
});*/

/*app.get("/getArray", (req, res) => {
  res.json(collection);
});*/