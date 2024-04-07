const express = require('express'),
      app = express(),
      port = 3000

let appdata = []

app.use(express.static('public'))
// app.use(express.json)

app.post("/submit",  (req, res) => {  
  handlePost(req, res) 
})
app.delete("/delete",  (req, res) => {  
  handleDelete(req, res) 
})
app.get('/appdata', (req, res) => { 
  sendAppData(res) 
})


/*
  Function for server-side calculated field
  Sorts tasks in the server by their due date (newest first) 
  then assigns them a priority based on their sorted index
*/
const assignItemPriorities = function() {
    appdata.sort((a,b) => Date.parse(a.date) - Date.parse(b.date));

    for(let i = 0; i < appdata.length; i++){
      appdata[i].priority = i+1;
    }
}


function handlePost( request, response ) {
  let dataString = ""

  request.on( "data", function( data ) {
      dataString += data 
  })

  request.on( "end", function() {
    let dataReceived = JSON.parse(dataString); // convert string received to JSON object

    let data = {
      name: dataReceived.name,
      date: dataReceived.date,
      color: dataReceived.color
    }

    appdata.push(data); // store data received in the server
    // console.log(appdata)
    assignItemPriorities(); // server-side calculation performed here

    response.writeHead( 200, "OK", {"Content-Type": "text/plain" })
    response.end()
  })
}

const handleDelete = function( request, response ) {
  let dataString = ""

  request.on( "data", function( data ) {
      dataString += data 
  })

  request.on( "end", function() {
    data = parseInt(dataString); // convert string received to JSON object
    appdata.splice(data, 1); // remove 1 item at the index specified in the response body
    assignItemPriorities();

    response.writeHead( 200, "OK", {"Content-Type": "text/plain" })
    response.end()
  })
}

// sends a json representation of the current server storage
const sendAppData = function( response ) {
  response.writeHeader( 200, { "Content-Type": "application/json" })
  response.end( JSON.stringify(appdata) )
}

app.listen(port)







// require('dotenv').config()

// const express = require('express'),
//       { MongoClient, ObjectId } = require("mongodb"),
//       app = express(),
//       port = 3000
  
// const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`
// const client = new MongoClient( uri )

// let collection = null
// let appdata = []

// app.use(express.static('public'))
// app.use(express.json)

// //middleware to check database connection
// app.use( (req,res,next) => {
//   console.log("zoinks")
//   if( collection !== null ) {
//     console.log("yeepers")
//     next()
//   }else{
//     res.status( 503 ).send()
//   }
// })

// app.post("/submit",  async (req, res) => {  
//   console.log("yippeee")
//   await handlePost(req, res) 
//   res.end()
// })
// app.delete("/delete",  async (req, res) => {  
//   await handleDelete(req, res) 
//   res.end()
// })
// // app.get('/appdata', (req, res) => { sendAppData(res) })

// async function run() {
//   await client.connect()
//   collection = client.db("a3").collection("todo")
// }

// app.get("/appdata", async (req, res) => {
//   if (collection !== null) {
//     console.log("i")
//     appdata = await collection.find({}).toArray()
//     res.json( appdata )
//   }
//   console.log("e")
// })

// /*
//   Function for server-side calculated field
//   Sorts tasks in the server by their due date (newest first) 
//   then assigns them a priority based on their sorted index
// */
// const assignItemPriorities = function() {
//     appdata.sort((a,b) => Date.parse(a.date) - Date.parse(b.date));

//     for(let i = 0; i < appdata.length; i++){
//       appdata[i].priority = i+1;
//     }
// }


// async function handlePost( request, response ) {
//   let dataString = ""
//   console.log("yipes")

//   request.on( "data", function( data ) {
//       dataString += data 
//   })

//   request.on( "end", async function() {
//     let dataReceived = JSON.parse(dataString); // convert string received to JSON object

//     let data = {
//       name: dataReceived.name,
//       date: dataReceived.date,
//       color: dataReceived.color
//     }

//     appdata.push(data); // store data received in the server
//     console.log(appdata)

//     const result = await collection.insertOne( data )
//     assignItemPriorities(); // server-side calculation performed here

//     response.json( result )
//     response.writeHead( 200, "OK", {"Content-Type": "text/plain" })
//     response.end()
//   })
// }

// const handleDelete = async function( request, response ) {
//   let dataString = ""

//   request.on( "data", function( data ) {
//       dataString += data 
//   })

//   request.on( "end", function() {
//     data = parseInt(dataString); // convert string received to JSON object
//     appdata.splice(data, 1); // remove 1 item at the index specified in the response body
//     assignItemPriorities();

//     response.writeHead( 200, "OK", {"Content-Type": "text/plain" })
//     response.end()
//   })
// }

// // sends a json representation of the current server storage
// const sendAppData = async function( response ) {
//   response.writeHeader( 200, { "Content-Type": "application/json" })
//   response.end( JSON.stringify(appdata) )
// }

// run()

// app.listen(port)