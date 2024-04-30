// const http = require( "http" ),
//       fs   = require( "fs" )
//       // IMPORTANT: you must run `npm install` in the directory for this assignment
//       // to install the mime library if you"re testing this on your local machine.
//       // However, Glitch will install it automatically by looking in your package.json
//       // file.
//       mime = require( "mime" ),
//       dir  = "public/",
//       port = 3000
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

const appdata = [
  { "assignment": "Quiz 1", "pointsEarned": 9, "pointsAvailable": 10, "grade": "90.00%" },
  { "assignment": "Quiz 2", "pointsEarned": 10, "pointsAvailable": 10, "grade": "100.00%" },
]

// const server = http.createServer( function( request,response ) {
//   if( request.method === "GET" ) {
//     handleGet( request, response )    
//   }else if( request.method === "POST" ) {
//     handlePost( request, response ) 
//   }else if( request.method === "DELETE" ) {
//     handleDelete( request, response )
//   }
// })

app.get('./index.html', (request, response) => {
    if( request.method === "GET" ) {
      handleGet( request, response )    
    }else if( request.method === "POST" ) {
      handlePost( request, response ) 
    }else if( request.method === "DELETE" ) {
      handleDelete( request, response )
    }
})

const handleGet = function( request, response ) {
  const filename = "/" + request.url.slice( 1 ) 

  if( request.url === "/" ) {
    response.redirect("/")
  }else if( request.url === "/appdata" ) {
    response.writeHead( 200, "OK", {"Content-Type": "text/plain" })
    response.end( JSON.stringify(appdata) )
  }else{
    // sendFile( response, filename )
  }
}

const handlePost = function( request, response ) {
  let dataString = ""

  request.on( "data", function( data ) {
      dataString += data 
  })

  request.on( "end", function() {

    var entry = JSON.parse( dataString )
    console.log(entry)

    var counter = 0
    var count = -1
    for(const a in appdata) {
      if(appdata[a].assignment === entry.assignment) {
        count = counter
      } else {
        counter++
      }
    }

    if(count !== -1) {
      appdata[count].pointsEarned = entry.pointsEarned
      appdata[count].pointsAvailable = entry.pointsAvailable

      let grade = parseFloat((entry.pointsEarned / entry.pointsAvailable) * 100).toFixed(2) + "%"
      appdata[count].grade = grade
    } else {
      let grade = parseFloat((entry.pointsEarned / entry.pointsAvailable) * 100).toFixed(2) + "%"
      entry.grade = grade

      appdata.push(entry)
    }

    response.writeHead( 200, "OK", {"Content-Type": "text/plain"})
    response.end("New entry added")
  })
}

const handleDelete = function( request, response ) {
  let dataString = ""

  request.on( "data", function( data ) {
    dataString += data
  })

  request.on( "end", function() {
    var entry = JSON.parse( dataString )

    var counter = 0
    var count = -1
    for(const a in appdata) {
      if(appdata[a].assignment === entry.assignment) {
        count = counter
      } else {
        counter++
      }
    }

    if(counter !== -1) {
      appdata.splice(count, 1)
      response.writeHead( 200, "OK", {"Content-Type": "text/plain"})
      response.end("Entry deleted")
    } else {
      response.writeHead( 400 )
      response.end("Entry not deleted")
    }
  })
}

// const sendFile = function( response, filename ) {
//    const type = mime.getType( filename ) 

//    fs.readFile( filename, function( err, content ) {

//      // if the error = null, then we"ve loaded the file successfully
//      if( err === null ) {

//        // status code: https://httpstatuses.com
//        response.writeHeader( 200, { "Content-Type": type })
//        response.end( content )

//      }else{

//        // file not found, error code 404
//        response.writeHeader( 404 )
//        response.end( "404 Error: File Not Found" )

//      }
//    })
// }

// // server.listen( process.env.PORT || port )
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
})
