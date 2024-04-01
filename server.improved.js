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
  { "model": "toyota", "year": 1999, "mpg": 23, "EOL": 2077},
  { "model": "honda", "year": 2004, "mpg": 30, "EOL": 2060},
  { "model": "ford", "year": 1987, "mpg": 14, "EOL": 2049} 
]

const calculateEOL = (year, mpg) => {
  let new_val = year + mpg;
  new_val = new_val - (year % mpg);

  return new_val;
}

const server = http.createServer( function( request,response ) {
  if( request.method === "GET" ) {
    handleGet( request, response )    
  }else if( request.method === "POST" ){
    handlePost( request, response ) 
  }else if( request.method === "DELETE"){
    handleDelete( request, response)
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
    //console.log( JSON.parse( dataString ) )
    let json_data = JSON.parse(dataString);
    
    json_data.EOL = calculateEOL(json_data.year, json_data.mpg);

    appdata.push(json_data);
    appdata.forEach( (value) => console.log(value));

    response.writeHead( 200, "OK", {"Content-Type": "text/plain" })
    response.end(JSON.stringify(appdata))
  })
}

const handleDelete = function( request, response ) {
  let dataString = ""

  request.on( "data", function( data ) {
      dataString += data 
  })

  request.on( "end", function() {
    //console.log( JSON.parse( dataString ) )
    let json_data = JSON.parse(dataString);
    let delNumber = json_data.number;
    console.log(delNumber);
    const index = delNumber;
  if (index > -1 ) { 
    appdata.splice(index, 1); 
    response.writeHead( 200, "OK", {"Content-Type": "text/plain" })
    response.end(JSON.stringify(appdata))
  } else {
    response.writeHead( 410, "Gone", {"Content-Type": "text/plain" })
    response.end("There was nothing to delete!");
  }

    
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
