require("dotenv").config();
const express = require("express"),
    app = express(),
    mime = require("mime"),
    // IMPORTANT: you must run `npm install` in the directory for this assignment
    // to install the mime library if you"re testing this on your local machine.
    // However, Glitch will install it automatically by looking in your package.json
    // file.
    dir = "public/",
    port = 3000

app.use(express.static("public"));

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://dovushman:${process.env.PASSWORD}@cluster0.vpfjttx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);





const appdata = [
    { "model": "toyota", "year": 1999, "mpg": 23 },
    { "model": "honda", "year": 2004, "mpg": 30 },
    { "model": "ford", "year": 1987, "mpg": 14 }
]

let namesArray = []

app.get("/", (request, response) => {
    response.sendFile(__dirname + "/public/index.html")
})

app.get("/data", (request, response) => {
    const filename = dir + request.url.slice(1);

    if (request.url === "/") {
        response.sendFile(__dirname + "/public/index.html");
    } else if (request.url === "/data") {
        response.writeHead(200, "OK", { "Content-Type": "application/json" });
        response.end(JSON.stringify(namesArray));
    } else {
        response.sendFile(__dirname + "/" + filename);
    }
});




// const server = http.createServer( function( request,response ) {
//   if( request.method === "GET" ) {
//     handleGet( request, response )
//   }else if( request.method === "POST" ){
//     handlePost( request, response )
//   }else if (request.method === "DELETE"){
//     handleDelete(request, response)
//   }

// })

app.post("/submit", (request, response) => {
    // const handlePost = function( request, response ) {
    let dataString = ""

    request.on("data", function(data) {
        dataString += data
    })

    request.on("end", function() {
        // ... do something with the data here!!!

        const formData = JSON.parse(dataString);

        const id = formData.id;
        const firstName = formData.firstName;
        const middleName = formData.middleName;
        const lastName = formData.lastName;
        const initial = (firstName.charAt(0) + middleName.charAt(0) + lastName.charAt(0)).toUpperCase();


        const nameJson = {
            id: id,
            firstName: firstName,
            middleName: middleName,
            lastName: lastName,
            initial: initial
        }

        namesArray.push(nameJson)

        console.log(namesArray)

        response.writeHead(200, "OK", { "Content-Type": "application/json" })
        response.end(JSON.stringify(nameJson))
    })
})

app.delete("/delete", (request, response) => {
    // const handleDelete = function( request, response ) {
    let dataString = ""

    request.on("data", function(data) {
        dataString += data
    })

    request.on("end", function() {

        const parsedDataString = JSON.parse(dataString);
        // const idToDelete = parsedDataString.id;
        const idToDelete = parseInt(parsedDataString.id);

        for (let i = 0; i < namesArray.length; i++) {
            if (idToDelete === namesArray[i].id) {
                namesArray.splice(i, 1)
            }
        }

        console.log(namesArray)

        response.writeHead(200, "OK", { "Content-Type": "application/json" })
        response.end(JSON.stringify({ status: 'success', message: 'Delete' }))
    })
})

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

app.listen(process.env.PORT || port)