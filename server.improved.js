//server.improved.js
//server-side code

const http = require( "http" ),
  fs   = require( "fs" ),
  // IMPORTANT: you must run `npm install` in the directory for this assignment
  // to install the mime library if you"re testing this on your local machine.
  // However, Glitch will install it automatically by looking in your package.json
  // file.
  mime = require( "mime" ),
  dir  = "public/",
  port = 3000,
  express = require('express'), 
  app = express(),
  previousResults = []

const middleware_post = (req, res, next) => {
  let dataString = ''

  req.on( 'data', function(data){
    dataString += data
  })

  req.on( 'end', function() {
    if(dataString){
      const clientData = JSON.parse(dataString)     //define client data
      num1 = parseFloat(clientData.num1),       //extracting the first number from clientData
      num2 = parseFloat(clientData.num2)        //extracting the second number from clientData
      index = parseInt(clientData.index)        //extracting the index from clientdata for the delete result in array case

      req.clientData = {
        num1: num1, 
        num2: num2,
        index: index
      }
    }
    next()
  })
}

app.use( express.static( 'public' ) )
app.use( middleware_post )

app.post('/addition', (req, res) => {
  const { num1, num2 } = req.clientData;
  const result = (num1 + num2).toFixed(2);      //add the two imputted numbers together + truncates
  addPreviousResults({ result: result });       //add this result to the array of previous results
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ result: result }));        //send the result to the client
});

app.post('/subtract', (req, res) => {
  const { num1, num2 } = req.clientData;
  const result = (num1 - num2).toFixed(2);          //subtract the two imputted numbers together + truncates
  addPreviousResults({ result: result });           //add this result to the array of previous results
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ result: result }));      //send the result to the client
});

app.post('/multiply', (req, res) => {
  const { num1, num2 } = req.clientData;
  const result = (num1 * num2).toFixed(2);          //multiply the two imputted numbers together + truncates
  addPreviousResults({ result: result });           //add this result to the array of previous results
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ result: result }));      //send the result to the client
});

app.post('/divide', (req, res) => {
  const { num1, num2 } = req.clientData;
  const result = (num1 / num2).toFixed(2);          //divide the two imputted numbers together + truncates
  addPreviousResults({ result: result });           //add this result to the array of previous results
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ result: result }));      //send the result to the client
});

app.post('/deleteResult', (req, res) => {
  const { index } = req.clientData;
  previousResults.splice(index, 1);
  res.writeHead(200, { "Content-Type": "text/plain" });        
  res.end("Result deleted.");
});

app.post( '/addResult', (req, res) => {
  const result = clientData.result;           //define the result and set it to the passed result
  addPreviousResults({ result: result });     //add the result to the server side array
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end("Result added.");              //send a message back that it worked 
})

app.get( '/', ( req, res ) => res.send( sendFile( response, "public/index.html" ) ) )

app.get( '/getPreviousResults', ( req, res ) => res.send( JSON.stringify(previousResults) ))

app.listen( process.env.port || 3000 )

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


//function to add a given result to the previous results array
const addPreviousResults = function (result) {        //pass the result
  previousResults.push(result);                       //add result to the array
  if (previousResults.length > 50) {                  //limit array length to 50 previous entries   
      previousResults.pop();                          //if over 50, pop the oldest entry
  }
};