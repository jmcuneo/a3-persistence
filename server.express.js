
const express    = require('express'),
      app        = express(),
      cookie    = require('cookie-session'),
      port       = 3000,
      dotenv = require('dotenv'),
      compression = require('compression')


app.use(compression())
dotenv.config()

app.use( express.static( 'public' ) )
app.use( express.static( 'views'  ) )
app.use( express.json() )
app.use(express.urlencoded({ extended: true }))



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}/?retryWrites=true&w=majority&appName=Cluster0`
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let collection = null

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     collection = await client.db("myDatabase").collection("myCollection0")
//     // Send a ping to confirm a successful connection
//     await client.db("myDatabase").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);

async function run() {
  await client.connect()
  collection = client.db("myDatabase").collection("myCollection0")

  await client.db("myDatabase").command({ ping: 1 });
  console.log("Pinged your deployment. You successfully connected to MongoDB!");

  // route to get all docs
  app.get("/docs", async (req, res) => {
    if (collection !== null) {
      const docs = await collection.find({}).toArray()
      res.json( docs )
    }
  })

  //middleware to check connection
  app.use( (req,res,next) => {
    if( collection !== null ) {
      next()
    }else{
      res.status( 503 ).send()
    }
  })

  //route to insert a todo
  app.post( '/submit', async (req,res) => {
    const result = await collection.insertOne( req.body )
    //console.log (result)
    res.json( result )
  })

  //route to remove a todo
  app.post( '/delete', async (req,res) => {
    //console.log(req.body._id)
    const result = await collection.deleteOne({ 
      _id:new ObjectId(req.body._id)
    })
    
    res.json( result )
  })

  //route to update a todo
  app.post( '/update', async (req,res) => {
    //console.log(req.body)
    const { _id, task, priority } = req.body
    const result = await collection.updateOne(
      { _id: new ObjectId(_id) },
      { $set: { task: task, priority: priority } }
    );
  
    res.json( result )
  })
}
run()


app.use( cookie({
  name: 'session',
  keys: ['key1', 'key2']
}))

app.post( '/login', (req,res)=> {
  // express.urlencoded will put your key value pairs 
  // into an object, where the key is the name of each
  // form field and the value is whatever the user entered
  //console.log( req.body )
  
  // below is *just a simple authentication example* 
  // for A3, you should check username / password combos in your database
  if( req.body.username === process.env.USER && req.body.password === process.env.PASS ) {
    // define a variable that we can check in other middleware
    // the session object is added to our requests by the cookie-session middleware
    req.session.login = true
    
    // since login was successful, send the user to the main content
    // use redirect to avoid authentication problems when refreshing
    // the page or using the back button, for details see:
    // https://stackoverflow.com/questions/10827242/understanding-the-post-redirect-get-pattern 
    res.redirect( 'main.html' )
  }else{
    // password incorrect, redirect back to login page
    res.sendFile( __dirname + '/public/index.html' )
  }
})

// add some middleware that always sends unauthenicaetd users to the login page
app.use( function( req,res,next) {
  if( req.session.login === true )
    next()
  else
    res.sendFile( __dirname + '/public/index.html' )
})


// const handlePost = function( request, response ) {
//     let dataString = ""
  
//     request.on( "data", function( data ) {
//         dataString += data 
//     })
  
//     request.on( "end", function() {
//       //console.log( JSON.parse( dataString ) )
//       const json = JSON.parse(dataString)

//       if (json.addToTop) {
//         appdata.unshift(json)
//     } else {
//         appdata.push(json)
//     }
  
//       response.writeHead( 200, "OK", {"Content-Type": "application/json" }) //"text/plain"
//       response.end(JSON.stringify(appdata))
//     })
// }

// app.post('/submit', handlePost)

// const handleDelete = function( request, response ) {
//     let dataString = ""
  
//     request.on( "data", function( data ) {
//         dataString += data 
//     })
  
//     request.on( "end", function() {
//       const delItem = JSON.parse(dataString).index
  
//       appdata.splice(delItem, 1)
  
//       response.writeHead( 200, "OK", {"Content-Type": "text/plain" }) 
//       response.end(JSON.stringify(appdata))
//     })
// }

// app.delete('/delete/:index', handleDelete)

// const handlePut = function(request, response) {
//     let dataString = ""
  
//     request.on("data", function(data) {
//       dataString += data
//     });
  
//     request.on("end", function() {
//       const { index, newText, newPriority } = JSON.parse(dataString)
  
      
//       if (index >= 0 && index < appdata.length) {
        
//         appdata[index].task = newText
//         //also update priority text if the first character is changed
//         appdata[index].priority = newPriority
        
//       }
    
  
//       response.writeHead(200, "OK", { "Content-Type": "application/json" })
//       response.end(JSON.stringify(appdata))
//     })
// }

// app.put('/put/:index', handlePut)




app.listen( process.env.PORT || port )
