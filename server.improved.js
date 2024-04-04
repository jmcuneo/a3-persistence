const http = require( "http" ),
      fs   = require( "fs" ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you"re testing this on your local machine.
      // However, Glitch will install it automatically by looking in your package.json
      // file.
      mime = require( "mime" ),
      dir  = "public/",
      port = 3000;
const EDIT_DELAY = 1000 * 60; // 60 second delay before editing again

let colors = [];
for(let k = 0; k < 100; k++) {
  colors.push("#FFFFFF");
}

let recentList = [];
let countdown = [];

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
  } else if (request.url === "/readGrid") {
    response.writeHead( 200, "OK", {"Content-Type": "text/plain" })
    response.end(JSON.stringify({colors: colors, recent: recentList }));
  } else {
    sendFile( response, filename )
  }
}

const handlePost = function( request, response ) {
  let dataString = ""

  request.on( "data", function( data ) {
      dataString += data 
  })

  request.on( "end", function() {
    const userData = JSON.parse(dataString);

    if(!userData.color.match("^#[0-9a-f]{6}$") || userData.name === "" || userData.name.match("^\\s+$") || userData.x < 0 || userData.x >= 10 || userData.y < 0 || userData.y >= 10) {
      response.writeHead( 200, "OK", { "Content-Type": "text/plain" });
      response.end(JSON.stringify({ result: "invalid"}));
      return;
    }

    cleanCountdown(); // Ensures that only values are ones that cannot edit
    const search = countdown.find(u => u.name === userData.name);
    const readTime = new Date();
    if(search) {
      response.writeHead( 200, "OK", { "Content-Type": "text/plain" });
      response.end(JSON.stringify({ result: "deny", extra: EDIT_DELAY - (readTime.getTime() - search.lastSubmitted.getTime()) }));
      return;
    }

    const coord = { x: userData.x, y: userData.y };

    countdown.push({ name: userData.name, lastSubmitted: readTime });
    recentList.push({ name: userData.name, lastSubmitted: readTime, color: userData.color, coord: coord });
    while(recentList.length > 20) {
      recentList.shift();
    }

    colors[coord.x * 10 + coord.y] = userData.color;

    response.writeHead( 200, "OK", { "Content-Type": "text/plain" });
    response.end(JSON.stringify({ result: "accept"}));
  })
}

function cleanCountdown() {
  const readTime = new Date();
  for(let i = countdown.length - 1; i >= 0; i--) {
    if(readTime.getTime() - countdown[i].lastSubmitted.getTime() >= EDIT_DELAY) {
      countdown.splice(i);
    }
  }
}

const sendFile = function( response, filename ) {
   const type = mime.getType( filename ) 

   fs.readFile( filename, function( err, content ) {

     // if the error = null, then we"ve loaded the file successfully
     if( err === null ) {
       // status code: https://httpstatuses.com
       response.writeHeader( 200, { "Content-Type": type })
       response.end( content )
     } else {

       // file not found, error code 404
       response.writeHeader( 404 )
       response.end( "404 Error: File Not Found" )

     }
   })
}

server.listen( process.env.PORT || port );