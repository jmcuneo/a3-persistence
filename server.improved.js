const http = require( "http" ),
      fs   = require( "fs" ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you"re testing this on your local machine.
      // However, Glitch will install it automatically by looking in your package.json
      // file.
      mime = require( "mime" ),
      dir  = "public/",
      port = 3000

const appdata = [
  { "yourname": "To-Do:" }
]

const server = http.createServer( function( request,response ) {
  if( request.method === "GET" ) {
    handleGet( request, response )    
  }else if( request.method === "POST" ){
    handlePost( request, response ) 
  } else if( request.method === "DELETE" ) {
    handleDelete( request, response )
  } else if (request.method === "PUT") {
    handlePut(request, response)
  }
})

const handleGet = function( request, response ) {
  const filename = dir + request.url.slice( 1 ) 

  if( request.url === "/" ) {
    sendFile( response, "public/index.html" )
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
     console.log( JSON.parse( dataString ) )
    appdata.push(JSON.parse(dataString))

    response.writeHead( 200, "OK", {"Content-Type": "text/plain" }) //"text/plain"
    response.end(JSON.stringify(appdata))
  })
}

const handleDelete = function( request, response ) {
  let dataString = ""

  request.on( "data", function( data ) {
      dataString += data 
  })

  request.on( "end", function() {
    const delItem = JSON.parse(dataString).index

    appdata.splice(delItem, 1)

    response.writeHead( 200, "OK", {"Content-Type": "text/plain" }) //"text/plain"
    response.end(JSON.stringify(appdata))
  })
}

const handlePut = function(request, response) {
  let dataString = ""

  request.on("data", function(data) {
    dataString += data
  });

  request.on("end", function() {
    const { index, newText, newPriority } = JSON.parse(dataString)

    
    if (index >= 0 && index < appdata.length) {
      
      appdata[index].yourname = newText
      //also update priority if text if the first character is changed
      appdata[index].priority = newPriority
    }
  

    response.writeHead(200, "OK", { "Content-Type": "application/json" })
    response.end(JSON.stringify(appdata))
  });
};

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
