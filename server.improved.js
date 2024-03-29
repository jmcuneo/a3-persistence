const http = require( "http" ),
      fs   = require( "fs" ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you"re testing this on your local machine.
      // However, Glitch will install it automatically by looking in your package.json
      // file.
      mime = require( "mime" ),
      dir  = "public/",
      port = 3000

let appdata = []

const server = http.createServer( function( request,response ) {
  if( request.method === "GET" ) {
    handleGet( request, response )    
  }else if( request.method === "POST" ){
    handlePost( request, response ) 
  }
  else if (request.method === "DELETE") {
    handleDelete(request, response);
  }
})

/*
  Function for server-side calculated field
  Sorts tasks in the server by their due date (newest first) 
  then assigns them a priority based on their sorted index
*/
const assignItemPriorities = function() {
    appdata.sort((a,b) => Date.parse(a.date) - Date.parse(b.date));

    for(let i = 0; i < appdata.length; i++){
      appdata[i].priority = i+1;
    }
}

const handleGet = function( request, response ) {
  const filename = dir + request.url.slice( 1 ) 

  if( request.url === "/" ) {
    sendFile( response, "public/index.html" )
  }
  else if(request.url === "/appdata") {
    sendAppData(response);
  }
  else{
    sendFile( response, filename )
  }
}

const handlePost = function( request, response ) {
  let dataString = ""

  request.on( "data", function( data ) {
      dataString += data 
  })

  request.on( "end", function() {
    let dataReceived = JSON.parse(dataString); // convert string received to JSON object

    let data = {
      name: dataReceived.name,
      date: dataReceived.date,
      color: dataReceived.color
    }

    appdata.push(data); // store data received in the server

    assignItemPriorities(); // server-side calculation performed here

    response.writeHead( 200, "OK", {"Content-Type": "text/plain" })
    response.end("test")
  })
}

const handleDelete = function( request, response ) {
  let dataString = ""

  request.on( "data", function( data ) {
      dataString += data 
  })

  request.on( "end", function() {
    data = parseInt(dataString); // convert string received to JSON object
    appdata.splice(data, 1); // remove 1 item at the index specified in the response body
    assignItemPriorities();

    response.writeHead( 200, "OK", {"Content-Type": "text/plain" })
    response.end("test")
  })
}

// sends a json representation of the current server storage
const sendAppData = function( response ) {
  response.writeHeader( 200, { "Content-Type": "application/json" })
  response.end( JSON.stringify(appdata) )
}

// sends specified file on the server, if found
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
