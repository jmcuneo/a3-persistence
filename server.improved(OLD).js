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
  { "username": "Bashar", "score": 2000, "time": 100, "scoreOverTime": 20, "date": "1/10/2024", "ID": 1},
  { "username": "Tim", "score": 4000, "time": 90, "scoreOverTime": 44.4, "date": "9/8/2023", "ID": 2 },
  { "username": "Emma", "score": 3000, "time": 70, "scoreOverTime": 42.9, "date": "10/2/2022", "ID": 3}
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
    sendFile(response, "public/index.html")
  }
    else if (request.url === "/appdata")
    {
      let content = JSON.stringify(appdata);

      response.writeHead( 200, "OK", {'Content-Type': 'application/json'})
      response.end(content)
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
    console.log( JSON.parse( dataString ) )

    // ... do something with the data here!!!

    let newData = JSON.parse((dataString))
    console.log(newData)

    let replaceData = false;
    let replaceIndex = 0;

    for(let i = 0; i < appdata.length; i++)
    {
      if(newData.username === appdata[i].username)
      {
        replaceData = true;
        replaceIndex = i;
      }
    }


    if(replaceData)
    {
      appdata[replaceIndex].score = newData.score;
      appdata[replaceIndex].time = newData.time;
      appdata[replaceIndex].scoreOverTime = Math.round((newData.score / newData.time) * 10) / 10;
    }
    else
    {
      let curDate = new Date()
      newData.scoreOverTime = Math.round((newData.score / newData.time) * 10) / 10;
      newData.date = (curDate.getMonth() + 1) + "/" + curDate.getDate() + "/" + curDate.getFullYear()
      newData.ID = appdata.length + 1;

      appdata.push(newData)
      console.log(newData)
    }



    response.writeHead( 200, "OK", {"Content-Type": "text/plain" })
    response.end("test")
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
