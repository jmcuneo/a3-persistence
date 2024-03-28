const uri = "mongodb+srv://jackweinstein808:ieiVz7K19MdkPRQb@a3persistence.ilydjmx.mongodb.net/?retryWrites=true&w=majority&appName=a3Persistence";

const express = require("express"),
      { MongoClient, ObjectId } = require("mongodb"),
      app = express()

app.use(express.static("public") )
app.use(express.json() )

const client = new MongoClient( uri )

let collection = null

async function run() {
  await client.connect()
  collection = await client.db("foodLogData").collection("collection1")
  // route to get all docs
  app.get("/docs", async (req, res) => {
    //console.log("Collection: " + collection);
    if (collection !== null) {
      try { // Wrap in try-catch for error handling      
        const docs = await collection.find({}).toArray(); // Use 'await'
        //console.log("DOCS:", docs);  // This log should now show docs
        res.json(docs);
      } catch (error) {
        console.error("Error fetching docs:", error);
        res.status(500).send("Error retrieving documents"); 
      } 
    }
  });
}

app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})

app.post( '/add', async (req,res) => {
  const result = await collection.insertOne( req.body )
  res.json( result )
})

run()

app.listen(3000)

/*
const http = require( "http" ),
      fs   = require( "fs" ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you"re testing this on your local machine.
      // However, Glitch will install it automatically by looking in your package.json
      // file.
      mime = require( "mime" ),
      dir  = "public/",
      port = 3000

let items = []; // Initialize an empty array to store items
const { v4: uuidv4 } = require('uuid'); 

//handle routes
const server = http.createServer(function(request, response) {
  if (request.method === "GET") {
      handleGet(request, response);
  } 
  else if (request.method === "POST") {
      if (request.url === '/clear-items') {
          handleClear(request, response); 
      } 
      else if (request.url === '/delete-item') {
        handleDelete(request, response); 
      } 
      else if (request.url === '/edit-item') {
        handleEdit(request, response); 
      } 
      else {
          handlePost(request, response); 
      }
  }
});

//return all items to client
const handleGet = function( request, response ) {
  const filename = dir + request.url.slice( 1 ) 

  if( request.url === "/" ) {
    sendFile( response, "public/index.html" )
  }
  else if (request.url === "/items") {
    response.writeHead( 200, {"Content-Type": "application/json" })
    response.end(JSON.stringify(items))
  }
  else {
    sendFile( response, filename )
  }
}

//add an item to the list and perform calculations for derived fields
const handlePost = function(request, response) {
  let dataString = "";

  request.on("data", function(data) {
      dataString += data;
  });

  request.on("end", function() {
      try {
        const newItemsData = JSON.parse(dataString); 

        //newItemsData is an array of item objects:
        const thisItem = newItemsData[0];
        thisItem.id = uuidv4(); //assign unique ID to entry
        items.push(thisItem); // Add the item

        // Find the newly added item and update it
        const itemIndex = items.findIndex(item => item.id === thisItem.id);
        if (itemIndex !== -1) items[itemIndex] = calculateItemProperties(thisItem); //calculations

        console.log("Items:", items); 
        response.writeHead(200, "OK", {"Content-Type": "text/plain"});
        response.end("Items added"); 
      } 
      catch (error) {
        console.error("Error parsing JSON:", error);
        response.writeHead(400, "Bad Request"); 
        response.end(); 
    }
  });
}

//handle clearing off all items
const handleClear = function(request, response) {
  if (request.method === 'POST') {
      items = []; // Clear the items array
      response.writeHead(200, "OK", {"Content-Type": "text/plain"});
      response.end("Items cleared");
  } 
  else {
      response.writeHead(405, "Method Not Allowed"); 
      response.end();
  }
}

const handleDelete = function(request, response) {
  console.log('Delete request received!');
  let dataString = '';

  request.on('data', function(data) {
      dataString += data;
  });

  request.on('end', function() {
    try {
      const { itemId } = JSON.parse(dataString);
      const itemIndex = items.findIndex(item => item.id === itemId);

      if (itemIndex !== -1) {
          items.splice(itemIndex, 1); 
          response.writeHead(200, "OK", {"Content-Type": "text/plain"});
          response.end("Item deleted");
      }
      else {
          response.writeHead(404, "Not Found", {"Content-Type": "text/plain"}); 
          response.end("Item not found"); 
      }
    } 
    catch (error) {
        console.error("Error deleting item:", error);
        response.writeHead(500, "Internal Server Error");
        response.end();
    }
  });
}

const handleEdit = function(request, response) {
  let dataString = '';

  request.on('data', function(data) {
      dataString += data;
  });

  request.on('end', function() {
    try {
      const { itemId, ...updatedData } = JSON.parse(dataString); 
      const itemIndex = items.findIndex(item => item.id === itemId); 
      console.log('Received updatedData:', updatedData);

      if (itemIndex !== -1) {
        items[itemIndex] = { ...items[itemIndex], ...updatedData }; // Maintain the 'id'
        items[itemIndex] = calculateItemProperties(items[itemIndex]); // Apply calculations

        response.writeHead(200, "OK", {"Content-Type": "text/plain"});
        response.end("Item updated");
      } 
      else {
        response.writeHead(404, "Not Found", {"Content-Type": "text/plain"}); 
        response.end("Item not found"); 
      }
    } 
    catch (error) {
        console.error("Error editing item:", error);
        response.writeHead(500, "Internal Server Error");
        response.end();
    }
  });
  console.log('Updated items:', items);
}

function calculateItemProperties(item) {
  item.total = (parseFloat(item.wages, 10) + parseFloat(item.tips, 10)).toFixed(2);
  item.gasUsed = (parseFloat(item.miles, 10) / parseFloat(item.mpg, 10)).toFixed(2);
  item.gasCost = (parseFloat(item.gasUsed, 10) * parseFloat(item.gasPrice, 10)).toFixed(2); //compute cost of gas
  item.income = (parseFloat(item.total, 10) - parseFloat(item.gasCost, 10)).toFixed(2); //compute income
  item.hourlyPay = (parseFloat(item.income, 10)/(parseFloat(item.time, 10)/60)).toFixed(2); //compute hourly pay
  return item; // Return the modified item
}


const sendFile = function( response, filename ) {
   const type = mime.getType( filename ) 

   fs.readFile( filename, function( err, content ) {

     // if the error = null, then we"ve loaded the file successfully
     if( err === null ) {
       // status code: https://httpstatuses.com
       response.writeHeader( 200, { "Content-Type": type })
       response.end( content )
     }
     else{
       // file not found, error code 404
       response.writeHeader( 404 )
       response.end( "404 Error: File Not Found" )
     }
   })
}

server.listen( process.env.PORT || port )
*/