const express = require( 'express' ),
      cookie  = require( 'cookie-session' ),
      hbs     = require( 'express-handlebars' ).engine,
      app     = express()


var people = [
  { "id": 1, "firstName": "Mark", "lastName": "Stevenson", "age": 23, "fullName": "Mark Stevenson" },
  { "id": 2, "firstName": "Tom", "lastName": "Sanford", "age": 30, "fullName": "Tom Sanford" },
  { "id": 3, "firstName": "Steve", "lastName": "Smith", "age": 14, "fullName": "Steve Smith" } 
]

var currentID = 4


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
    res.redirect( 'main.html' )
  }else{
    // cancel session login in case it was previously set to true
    req.session.login = false
    // password incorrect, send back to login page
    res.render('index', { msg:'login failed, please try again', layout:false })
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

app.get( '/main.html', ( req, res) => {
    res.render( 'main', { msg:'success you have logged in', layout:false })
})

app.get( '/getPeople', (req, res) => {
  res.end(JSON.stringify(people));
})


app.post( '/submitAdd', (req, res) => {
  // Pushes a new person to the people array using the parsed data
  let dataString = ""

  req.on( "data", function( data ) {
      dataString += data 
  })

  req.on( "end", function() {
    // ... do something with the data here!!!
    let url = req.url;
    let data = JSON.parse( dataString )

    console.log(dataString)

    let fullName = data.firstName+" "+data.lastName
    people.push({id: currentID, firstName: data.firstName, lastName: data.lastName, age: data.age, fullName: fullName})
    currentID = currentID + 1

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

  req.on( "end", function() {
    // ... do something with the data here!!!
    let url = req.url;
    let data = JSON.parse( dataString )

    console.log(dataString)

    for (let index = 0; index < people.length; index++){
      if (people[index].id == data.id){
        people.splice(index,1)
        break
      }
    }

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

  req.on( "end", function() {
    // ... do something with the data here!!!
    let url = req.url;
    let data = JSON.parse( dataString )

    console.log(dataString)

    for (let index = 0; index < people.length; index++){
      if (people[index].id == data.id){
        people[index].firstName = data.firstName;
        people[index].lastName = data.lastName;
        people[index].age = data.age;
        people[index].fullName = data.firstName + " " + data.lastName;
        break
      }
    }

    res.writeHead( 200, "OK", {"Content-Type": "text/plain" })
    res.end()
  })
})


app.listen( process.env.PORT || 3000 )

/**
const http = require( "http" ),
      fs   = require( "fs" ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you"re testing this on your local machine.
      // However, Glitch will install it automatically by looking in your package.json
      // file.
      mime = require( "mime" ),
      dir  = "public/",
      port = 3000

var currentID = 4

const server = http.createServer( function( request,response ) {
  if( request.method === "GET" ) {
    handleGet( request, response )    
  }else if( request.method === "POST" ){
    handlePost( request, response ) 
  }
})

const handleGet = function( request, response ) {
  const filename = dir + request.url.slice( 1 ) 

  if( request.url === "/" ) {
    sendFile( response, "public/index.html" )
  } else if (request.url === "/getPeople") {
    response.end(JSON.stringify(people));
  }else{
    sendFile( response, filename )
  }
}

const handlePost = function( request, response ) {
  let dataString = ""

  request.on( "data", function( data ) {
      dataString += data 
  })

  request.on( "end", function() {
    // ... do something with the data here!!!
    let url = request.url;
    let data = JSON.parse( dataString )

    if(url == "/submitAdd"){
      // Pushes a new person to the people array using the parsed data
      let fullName = data.firstName+" "+data.lastName
      people.push({id: currentID, firstName: data.firstName, lastName: data.lastName, age: data.age, fullName: fullName})
      currentID = currentID + 1
    } else if (url == "/submitRemove") {
      // Searches through the people list until it finds the matching ID
      for (let index = 0; index < people.length; index++){
        if (people[index].id == data.id){
          people.splice(index,1)
          break
        }
      }
    } else if (url == "/submitEdit"){
      // Searches through the people list until it finds the matching ID
      for (let index = 0; index < people.length; index++){
        if (people[index].id == data.id){
          people[index].firstName = data.firstName;
          people[index].lastName = data.lastName;
          people[index].age = data.age;
          people[index].fullName = data.firstName + " " + data.lastName;
          break
        }
      }
    }

    response.writeHead( 200, "OK", {"Content-Type": "text/plain" })
    response.end()
  })
}

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

server.listen( process.env.PORT || port )
 */
