const http = require( "http" ),
      fs   = require( "fs" ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you"re testing this on your local machine.
      // However, Glitch will install it automatically by looking in your package.json
      // file.
      mime = require( "mime" ),
      dir  = "public/",
      port = 3000

const studentData = []

const server = http.createServer( function( request,response ) {
  if( request.method === "GET" ) {
    handleGet(request, response)
  }
  else if( request.method === "POST" ){
    handlePost( request, response ) 
  }

})

const handleGet = function( request, response ) {
  const filename = dir + request.url.slice( 1 ) 

  if( request.url === "/" ) {
    sendFile(response, "public/index.html")
  }
  else if (request.url === "/studentData"){
    response.writeHead(200, {'Content-Type': 'application/json'})
    response.end(JSON.stringify(studentData))
  }
  else{
    sendFile( response, filename )
    // const html = `
    //   <html><body>
    //   ${appdata.map(item => JSON.stringify(item))}
    //   </body>
    //   </html>
    // `
    // response.end(html)
  }
}

const handlePost = function( request, response ) {
  if( request.url === "/delete" ) {
    handleDelete(request, response)
    return;
  }

  let dataString = ""

  request.on( "data", function( data ) {
      dataString += data 
  })

  request.on( "end", function() {
    //console.log( JSON.parse( dataString ) )
    const jsonData = JSON.parse(dataString);

    const studentExistsIndex = studentData.findIndex(student => student.yourname === jsonData.yourname)
    let classStanding, classOf;
    const credits = parseInt(jsonData.yourcredits);

    if (credits > 108){
      classStanding = "Senior";
      classOf = 2024;
    }
    else if (credits > 72){
      classStanding = "Junior";
      classOf = 2025;
    }
    else if (credits > 36){
      classStanding = "Sophomore";
      classOf = 2026;
    }
    else{
      classStanding = "Freshman";
      classOf = 2027;
    }

    if (studentExistsIndex !== -1){
      studentData[studentExistsIndex].yourcredits = parseInt(jsonData.yourcredits)
      studentData[studentExistsIndex].classStanding = classStanding
      studentData[studentExistsIndex].classOf = classOf
    }
    else{
      const updatedData = {...jsonData, classStanding, classOf};
      studentData.push(updatedData)
    }

    console.clear()
    console.log(studentData)

    // ... do something with the data here!!!
    // const html = `
    //   <html><body>
    //   ${appdata.map(item => JSON.stringify(item))}
    //   </body>
    //   </html>
    // `

    response.writeHead( 200, "OK", {"Content-Type": "text/plain" })
    response.end(JSON.stringify(studentData))
  })
}

const handleDelete = function(request, response){
  console.log("Received delete request")
  let dataString = ""

  request.on("data", function (data){
    dataString += data;
  })

  request.on("end", function(){

    console.log("Received delete request data:", dataString)
    const jsonData = JSON.parse(dataString)
    const studentIndex = studentData.findIndex(student => student.yourname === jsonData.yourname)

    if (studentIndex !== -1) {
      studentData.splice(studentIndex, 1)
    }

    console.clear()
    console.log(studentData)

    response.writeHead(200, "OK", {"Content-Type": "text/plain"})
    response.end(JSON.stringify(studentData))
  })


}

const sendFile = function( response, filename ) {
   const type = mime.getType( filename ) 

   fs.readFile( filename, function( err, content ) {

     // if the error = null, then we"ve loaded the file successfully
     if( err === null ) {

       // status code: https://httpstatuses.com
       response.writeHead( 200, { "Content-Type": type })
       response.end( content )

     }else{

       // file not found, error code 404
       response.writeHead( 404 )
       response.end( "404 Error: File Not Found" )

     }
   })
}

server.listen( process.env.PORT || port )
