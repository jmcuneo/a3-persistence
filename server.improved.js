// const http = require( "http" ),
//       fs   = require( "fs" ),
//       // IMPORTANT: you must run `npm install` in the directory for this assignment
//       // to install the mime library if you"re testing this on your local machine.
//       // However, Glitch will install it automatically by looking in your package.json
//       // file.
//       mime = require( "mime" ),
//       dir  = "public/",
//       port = 3000
require('dotenv').config();
const express = require("express"),
    { MongoClient, ObjectId } = require("mongodb"),
    app = express()
var taskData = []


app.use(express.static("public") )
app.use(express.json() )

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`
const client = new MongoClient( uri )

let collection = null

async function run() {
  await client.connect()
  collection = await client.db("taskDatabase").collection("taskCollection")
  // route to get all docs
  app.get("/taskData/", async (request, response) => {
    if (collection !== null) {
      taskData = await collection.find({}).toArray()
      //response.json( docs )
      response.writeHead( 200, { 'Content-Type': 'application/json'});
      response.end(JSON.stringify(taskData));
    }
  })
}

app.use( (request,response,next) => {
  if( collection !== null ) {
    next()
  }else{
    response.status( 503 ).send()
  }
})


app.post( '/submit', async (request,response) => {
  let dataString = ""
  request.on( "data", function( data ) {
      dataString += data 
  })
  request.on( "end", function() {
    let taskObject = JSON.parse( dataString );
    taskObject._id = new ObjectId();
    determinePriority(taskObject);

    // Push new object to taskData array
    taskData.push(taskObject);
    collection.insertOne(taskObject);
    response.writeHead( 200, { 'Content-Type': 'application/json'});
    response.end(JSON.stringify(taskData));
  })
})


app.delete( "/delete", async (request, response) => {
  let dataString = ""
  request.on( "data", function( data ) {
      dataString += data 
  })

  request.on( "end", function() {
    let taskObject = JSON.parse( dataString );
    collection.deleteOne({ 
      _id:new ObjectId( taskObject._id ) 
    })

    response.writeHead( 200, { 'Content-Type': 'application/json'});
    response.end(JSON.stringify(taskData));
  })
})

app.patch( "/patch", async (request, response) => {
  let dataString = ""
  request.on( "data", function( data ) {
      dataString += data 
  })
  request.on( "end", function() {
    let taskObject = JSON.parse( dataString );
    determinePriority(taskObject);
    // Update object
    collection.updateOne(
      { _id: new ObjectId( taskObject._id ) },
      { $set:{task:taskObject.task, 
              class:taskObject.class, 
              duedate:taskObject.duedate, 
              importance:taskObject.importance, 
              priority:taskObject.priority}}
    )
    response.writeHead( 200, { 'Content-Type': 'application/json'});
    response.end(JSON.stringify(taskData));
    })
})

run()







      












// // Get mode
// const handleGet = function() {
//   app.get("/taskData/", async (request, response) => {
//     if (collection !== null) {
//       taskData = await collection.find({}).toArray()
//       //response.json( docs )
//       response.writeHead( 200, { 'Content-Type': 'application/json'});
//       response.end(JSON.stringify(taskData));
//     }
//   })
// }

// // Add mode
// const handlePost = function( request, response ) {
//   let dataString = ""
//   request.on( "data", function( data ) {
//       dataString += data 
//   })
//   request.on( "end", function() {
//     let taskObject = JSON.parse( dataString );
//     taskObject._id = new ObjectId();
//     determinePriority(taskObject);

//     // Push new object to taskData array
//     taskData.push(taskObject);
//     collection.insertOne(taskObject);
//     response.writeHead( 200, { 'Content-Type': 'application/json'});
//     response.end(JSON.stringify(taskData));
//   })
// }

// // Delete mode
// const handleDelete = function( request, response ) {
//   let dataString = ""
//   request.on( "data", function( data ) {
//       dataString += data 
//   })

//   request.on( "end", function() {
//     let taskObject = JSON.parse( dataString );
//     taskData.splice(determineTaskIndex(taskObject), 1);
//     response.writeHead( 200, "OK", {"Content-Type": "text/plain" });
//     response.end(JSON.stringify(taskData));
//   })
// }

// // Edit mode
// const handlePatch = function( request, response ) {
//   let dataString = ""
//   request.on( "data", function( data ) {
//       dataString += data 
//   })
//   request.on( "end", function() {
//     let taskObject = JSON.parse( dataString );
//     determinePriority(taskObject);
//     // Update object
//     taskData[determineTaskIndex(taskObject)] = taskObject;
//     response.writeHead( 200, "OK", {"Content-Type": "text/plain" });
//     response.end(JSON.stringify(taskData));
//   })
// }

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

// // Determine the index of the task in the array
// function determineTaskIndex(taskObject) {
//   let foundTask = false;
//   let i = 0;
//   while(foundTask === false && i < taskData.length) {
//     if(taskData[i]._id === taskObject._id) {
//       foundTask = true;
//       i--;
//     }
//     i++;
//   }
//   return i;
// }

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

function printTasks() {
  taskData.forEach(element => {
    console.log(element.task)    
  });
}


// server.listen( process.env.PORT || port )
const listener = app.listen( process.env.PORT || 3000 )