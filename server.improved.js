const http = require( "http" ),
      fs   = require( "fs" ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you"re testing this on your local machine.
      // However, Glitch will install it automatically by looking in your package.json
      // file.
      mime = require( "mime" ),
      dir  = "public/",
      port = 3000

const taskData = []

const server = http.createServer( function( request,response ) {
  if( request.method === "GET" ) {
    handleGet( request, response )    
  }else if( request.method === "POST" ){
    handlePost( request, response ) 
  } else if( request.method === "DELETE") {
    handleDelete(request, response)
  } else if (request.method === "PATCH") {
    handlePatch(request, response)
  }
})

// Get mode
const handleGet = function( request, response ) {
  const filename = dir + request.url.slice( 1 ) 
  if( request.url === "/" ) {
    sendFile( response, "public/index.html" )
  } else if(request.url === "/taskData/") {
    response.writeHead( 200, "OK", {"Content-Type": "text/plain" });
    response.end(JSON.stringify(taskData));
  } else {
    sendFile( response, filename );
  }
}

// Add mode
const handlePost = function( request, response ) {
  let dataString = ""
  request.on( "data", function( data ) {
      dataString += data 
  })
  request.on( "end", function() {
    let taskObject = JSON.parse( dataString );

    // Update id
    if(taskData.length == 0) {
      taskObject.id = 1;
    } else {
      taskObject.id = taskData[taskData.length-1].id + 1;
    }
    
    determinePriority(taskObject);

    // Push new object to taskData array
    taskData.push(taskObject);
    response.writeHead( 200, "OK", {"Content-Type": "text/plain" });
    response.end(JSON.stringify(taskData));
  })
}

// Delete mode
const handleDelete = function( request, response ) {
  let dataString = ""
  request.on( "data", function( data ) {
      dataString += data 
  })

  request.on( "end", function() {
    let taskObject = JSON.parse( dataString );
    taskData.splice(determineTaskIndex(taskObject), 1);
    response.writeHead( 200, "OK", {"Content-Type": "text/plain" });
    response.end(JSON.stringify(taskData));
  })
}

// Edit mode
const handlePatch = function( request, response ) {
  let dataString = ""
  request.on( "data", function( data ) {
      dataString += data 
  })
  request.on( "end", function() {
    let taskObject = JSON.parse( dataString );
    determinePriority(taskObject);
    // Update object
    taskData[determineTaskIndex(taskObject)] = taskObject;
    response.writeHead( 200, "OK", {"Content-Type": "text/plain" });
    response.end(JSON.stringify(taskData));
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

// Determine the index of the task in the array
function determineTaskIndex(taskObject) {
  let foundTask = false;
  let i = 0;
  while(foundTask === false && i < taskData.length) {
    if(taskData[i].id === taskObject.id) {
      foundTask = true;
      i--;
    }
    i++;
  }
  return i;
}

// Determines the priority based on duedate, importance, and the current date
function determinePriority(data) {
  let currentDate = new Date();

  //turn duedate into a date object
  let parts = data.duedate.split("/");
  let dueDate = new Date(parts[2], parts[0] - 1, parts[1]);

  // Convert both dates to UTC
  let utcDate1 = Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
  let utcDate2 = Date.UTC(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());

  // Calculate different in ms and then convert to days
  let diffDays = Math.floor(Math.abs(utcDate2 - utcDate1) / (1000 * 60 * 60 * 24));

  // Determine priority
  if((diffDays <= 2 && data.importance === "Yes") || (diffDays <= 1 && data.importance === "No")) {
    data.priority = 1;
  } else if((diffDays <= 3 && data.importance === "Yes") || (diffDays <= 2 && data.importance === "No")) {
    data.priority = 2;
  } else if((diffDays <= 4 && data.importance === "Yes") || (diffDays <= 3 && data.importance === "No")) {
    data.priority = 3;
  } else {
    data.priority = 4;
  }
}

server.listen( process.env.PORT || port )