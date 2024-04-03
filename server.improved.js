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
  { "game": "Genshin Impact", "name": "Azu", "uid": 999525821,  "server": "Test Server"},
  { "game": "Genshin Impact", "name": "Jim", "uid": 100000001,  "server": "CN" },
  { "game": "Genshin Impact", "name": "HelloWorld", "uid": 600000009,  "server": "US"}
]

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
    sendFile( response, "public/main.html" )
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
    let data = JSON.parse(dataString)

    switch(data.uid.charAt(0)){
      case '1':
        appdata.push({ "game": data.game, "name": data.name, "uid": data.uid, server: "CN"} );
            break;
      case '9':
        appdata.push({ "game": data.game, "name": data.name, "uid": data.uid, server: "Test Server"} );
        break;
      case '6':
        appdata.push({ "game": data.game, "name": data.name, "uid": data.uid, server: "US"} );
        break;
      case '7':
        appdata.push({ "game": data.game, "name": data.name, "uid": data.uid, server: "EU"} );
        break;
      default:
        appdata.push({ "game": data.game, "name": data.name, "uid": data.uid, server: "Other"} );
        break;
    }



    console.log(appdata)
    response.writeHead( 200, "OK", {"Content-Type": "application/json"})
    response.end(JSON.stringify(appdata))
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
