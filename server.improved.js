const express = require( 'express' ),
      cookie  = require( 'cookie-session' ),
      { MongoClient, ObjectId } = require("mongodb"),
      hbs     = require( 'express-handlebars' ).engine,
      app     = express()

// FOR GLITCH OR OTHER SERVER: 
// const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`
// FOR TESTING
const uri = `mongodb+srv://austinwebwareuser:austinwebwareuser@webwareclustera3.utwkatb.mongodb.net/`

const client = new MongoClient( uri )

let collectionBooks = null
let collectionLogin = null
let currentUserLoggedIn = null

async function run() {
  await client.connect()
  collectionBooks = await client.db("webware").collection("books_read")
  collectionLogin = await client.db("webware").collection("users")
}

run()

// use express.urlencoded to get data sent by defaut form actions
// or GET requests
app.use( express.urlencoded({ extended:true }) )
//app.use( express.json() )

// we're going to use handlebars, but really all the template
// engines are equally painful. choose your own poison at:
// http://expressjs.com/en/guide/using-template-engines.html
app.engine( 'handlebars',  hbs() )
app.set(    'view engine', 'handlebars' )
app.set(    'views',       './views' )

app.use( express.static( 'public' ) )


// cookie middleware! The keys are used for encryption and should be changed
app.use( cookie({
  name: 'session',
  keys: ['key1', 'key2']
}))

app.post( '/login', async (req,res)=> {
  debugger
  // express.urlencoded will put your key value pairs 
  // into an object, where the key is the name of each
  // form field and the value is whatever the user entered
  
  const user = { username: req.body.username}
  const dbResult = await collectionLogin.findOne(user)

  if( dbResult === null) {

    collectionLogin.insertOne(req.body)
    req.session.login = true
    currentUserLoggedIn = req.body.username
    res.redirect( 'main.html' )

  } else {

    if(dbResult.password === req.body.password){

      req.session.login = true
      currentUserLoggedIn = req.body.username
      res.redirect( 'main.html' )

    } else {

      req.session.login = false
      res.render('index', { msg:'Your login failed! Please try again with a new username or a valid password.', layout:false })

    }
  }
})




app.get( '/', (req,res) => {
  res.render( 'index', { msg:'', layout:false })
})

// add some middleware that always sends unauthenicaetd users to the login page
app.use( function( req,res,next) {
  if( req.session.login === true )
    next()
  else
    res.render('index', { msg:'login failed, please try again', layout:false })
})

// middleware that checks if the database connection was successful
app.use( (req,res,next) => {
  if( collectionBooks !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})

app.get( '/index.html', ( req, res) => {

  res.render( 'index', { msg:'', layout:false })

})

app.get( '/main.html', ( req, res) => {

  res.render( 'main', { msg:'Success! You have logged in '+currentUserLoggedIn+"!", layout:false })

})

app.get( '/getPeople', async (req, res) => {

  const docs = await collectionBooks.find({username: currentUserLoggedIn}).toArray()
  res.end( JSON.stringify(docs) )

})


app.post( '/submitAdd', (req, res) => {
  // Pushes a new person to the people array using the parsed data
  let dataString = ""

  req.on( "data", function( data ) {
      dataString += data 
  })

  req.on( "end", async function() {
    // ... do something with the data here!!!
    let url = req.url;
    let data = JSON.parse( dataString )

    data.username = currentUserLoggedIn

    const result = await collectionBooks.insertOne( data)

    res.writeHead( 200, "OK", {"Content-Type": "text/plain" })
    res.end()
  })
})

app.post( '/submitRemove', (req, res) => {
  // Pushes a new person to the people array using the parsed data
  let dataString = ""

  req.on( "data", function( data ) {
      dataString += data 
  })

  req.on( "end", async function() {
    // ... do something with the data here!!!
    let url = req.url;
    let data = JSON.parse( dataString )

    const result = await collectionBooks.deleteOne({ 
      _id: new ObjectId( data.id ) 
    })

    res.writeHead( 200, "OK", {"Content-Type": "text/plain" })
    res.end()
  })
})

app.post( '/submitEdit', (req, res) => {
  // Pushes a new person to the people array using the parsed data
  let dataString = ""

  req.on( "data", function( data ) {
      dataString += data 
  })

  req.on( "end", async function() {
    // ... do something with the data here!!!
    let url = req.url;
    let data = JSON.parse( dataString )
    let nonEmptyFields = {}

    for (field in data){
      if(!(data[field] == '' || data[field] == null || field == "id")){
        nonEmptyFields[field] = data[field] 
      }
    }

    console.log(nonEmptyFields)

    const result = await collectionBooks.updateOne(
      { _id: new ObjectId( data.id ) },
      { $set:nonEmptyFields }
    )

    res.writeHead( 200, "OK", {"Content-Type": "text/plain" })
    res.end()
  })
})

app.listen( process.env.PORT || 3000 )

