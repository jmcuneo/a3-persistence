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

  { name: "John", id: "1", addedDate: new Date(), count: 1},
  { name: "Paul", id: "2", addedDate: new Date(), count: 1},
  { name: "George", id: "3", addedDate: new Date(), count: 1},
  { name: "Paul", id: "4", addedDate: new Date(), count: 2}
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
    sendFile( response, "public/index.html" )
  }
  // api 
  else if( request.url === "/api/getdata" ) {
    response.writeHead( 200, "OK", {"Content-Type": "text/plain"})
    response.end( JSON.stringify( appdata ) )
  }
  else{
    sendFile( response, filename )
  }
}

const handlePost = function( request, response ) {
  if (request.url === "/api/delete") {
    let dataString = ""
    request.on( "data", function( data ) {
      dataString += data 
    })
    request.on( "end", function() {
      dataString = JSON.parse( dataString )
      console.log(dataString)
      appdata.splice(appdata.findIndex(x => x.id === dataString.row.id), 1)
      response.writeHead( 200, "OK", {"Content-Type": "text/plain" })
      if (appdata.findIndex(x => x.id === dataString.row.id) === -1) {
        response.end(JSON.stringify({success: true}))
      } else {
        response.end(JSON.stringify({success: false}))
      }

    })
    return
  }

  if (request.url === "/api/edit") {
    let dataString = ""
    request.on( "data", function( data ) {
      dataString += data 
    })
    request.on( "end", function() {
      dataString = JSON.parse( dataString )
      console.log(dataString)
      appdata[appdata.findIndex(x => x.id === dataString.row.id)].name = dataString.row.newName
      response.writeHead( 200, "OK", {"Content-Type": "text/plain" })
      response.end(JSON.stringify({success: true}))
    })
    return
  }


  let dataString = ""

  request.on( "data", function( data ) {
      dataString += data 
  })

  request.on( "end", function() {
    // generate a random number for the ID
    // this is a simple way to generate a unique id
    // for our data
    dataString = JSON.parse( dataString )
    dataString.id = Math.random().toString(36).substr(2, 9)
    dataString.addedDate = new Date()
    let count = 0;
    for (let i = 0; i < appdata.length; i++) {
      if (appdata[i].name.toLowerCase() === dataString.name.toLowerCase()) {
        count++;
      }
    }
    count++;
    dataString.count = count;
// add the data to our data array
    appdata.push( dataString )
    console.log( dataString )
    
    response.writeHead( 200, "OK", {"Content-Type": "text/plain" })
    response.end(JSON.stringify(dataString))
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
