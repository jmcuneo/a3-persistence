const http = require( "http" ),
    fs   = require( "fs" ),
    // IMPORTANT: you must run `npm install` in the directory for this assignment
    // to install the mime library if you"re testing this on your local machine.
    // However, Glitch will install it automatically by looking in your package.json
    // file.
    mime = require( "mime" ),
    dir  = "public/",
    port = 3000

let appdata = [
  // I am doing a simple arcade game score tracker
  { "playerName": "Jane", "score": 1800, "gameDate": "2024-03-20", "ranking": 1 },
  { "playerName": "Smith", "score": 1000, "gameDate": "2024-03-21", "ranking": 2 },
  { "playerName": "Zesh", "score": 600, "gameDate": "2024-03-21", "ranking": 3 }
];

const server = http.createServer( function( request,response ) {
  if (request.method === "GET" && request.url === "/get-scores") {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify(appdata));
  }
  else if( request.method === "GET" ) {
    handleGet( request, response )
  }
  else if( request.method === "POST" ){
    handlePost( request, response )
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
    let receivedData = JSON.parse(dataString);

    // add a score
    if (receivedData.action === "add") {
      //receivedData.ranking = appdata.length + 1;
      appdata.push(receivedData);
    }

    // delete a score
    else if (receivedData.action === "delete") {
      appdata = appdata.filter(item => item.playerName !== receivedData.playerName);
    }

    // modify a score
    else if (receivedData.action === "modify") {
      if (receivedData.index >= 0 && receivedData.index < appdata.length) {
        const score = appdata[receivedData.index];
        score.playerName = receivedData.playerName;
        score.score = receivedData.score;
        score.gameDate = receivedData.gameDate;
      }
    }

    // reorganize the datasets
    recalculateRankings();

    response.writeHead( 200, "OK", {"Content-Type": "application/json" })
    response.end(JSON.stringify(appdata));
  });
}

/**
 * calculate ranking based on scores and reorganize the datasets
 */
function recalculateRankings() {
  appdata.sort((a, b) => b.score - a.score);
  appdata.forEach((item, index) => {
    item.ranking = index + 1;
  });
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