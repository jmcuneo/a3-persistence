const http = require("http"),
      fs   = require("fs"),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you"re testing this on your local machine.
      // However, Glitch will install it automatically by looking in your package.json
      // file.
      mime = require("mime"),
      dir  = "public/",
      port = 3000;

const appdata = [
  { "model": "toyota", "year": 1999, "mpg": 23 },
  { "model": "honda", "year": 2004, "mpg": 30 },
  { "model": "ford", "year": 1987, "mpg": 14} 
]

// Stores data for GPA values
const gpaData = [
  
]

var gpa = 0.0;

const server = http.createServer(function(request,response)
{
  if (request.method === "GET") {
    handleGet(request, response); 
  } else if (request.method === "POST") {
    handlePost(request, response); 
  }
})

const handleGet = function(request, response)
{
  const filename = dir + request.url.slice(1);
  if (request.url === "/") {
    sendFile(response, "public/index.html");
  } else if (request.url === "/display") {
    // Fetching data for table
    response.writeHead(200, "OK", {"Content-Type": "text/plain"});
    response.end(JSON.stringify(gpaData));
  } else if (request.url === "/gpa") {
    // Fetching GPA value
    response.writeHead(200, "OK", {"Content-Type": "text/plain"});
    let roundedGpa = Math.round(gpa * 100) / 100;
    response.end(roundedGpa.toString());
  } else {
    sendFile(response, filename);
  }
}

const handlePost = function(request, response)
{
  let dataString = "";

  request.on("data", function(data) {
      dataString += data;
  })
  if (request.url === "/submit")
  {
    request.on("end", function() {  
      gpaData[gpaData.length] = JSON.parse(dataString);
      response.writeHead(200, "OK", {"Content-Type": "text/plain"});
      response.end(JSON.stringify(gpaData[gpaData.length - 1]));
      gpa = calculateGpa(gpaData);
    })
  } else if (request.url === "/adjust")
  {
    request.on("end", function() {  
      gpaData[gpaData.length - 1] = JSON.parse(dataString);
      response.writeHead(200, "OK", {"Content-Type": "text/plain"});
      response.end(JSON.stringify(gpaData[gpaData.length - 1]));
      gpa = calculateGpa(gpaData);
    })
  } else if (request.url === "/delete")
  {
    request.on("end", function() {  
      let entryToDelete = Number(JSON.parse(dataString));
      response.writeHead(200, "OK", {"Content-Type": "text/plain"});
      gpaData.splice(entryToDelete - 1, 1);
      response.end(JSON.stringify(entryToDelete));
      gpa = calculateGpa(gpaData);
    })
  }
}

const sendFile = function(response, filename)
{
   const type = mime.getType(filename);

   fs.readFile(filename, function(err, content) {
     // if the error = null, then we"ve loaded the file successfully
     if (err === null) {
       // status code: https://httpstatuses.com
       response.writeHeader(200, { "Content-Type": type});
       response.end(content);
     } else {
       // file not found, error code 404
       response.writeHeader(404);
       response.end("404 Error: File Not Found");
     }
   })
}

// Determine what the user's GPA is based on the provided info
const calculateGpa = function(jsonData)
{
  let totalPoints = 0;
  let totalCredits = 0;
  jsonData.forEach(entry => {
    let currentPoints = 0;
    let grade = entry.grade.toLowerCase();

    if (grade === "a") {
      currentPoints = 4;
    } else if (grade === "b") {
      currentPoints = 3;
    } else if (grade === "c") {
      currentPoints = 2;
    } else if (grade === "d") {
      currentPoints = 1;
    }

    let amountCredits = Number(entry.credits);
    currentPoints *= amountCredits;
    totalPoints += currentPoints;
    totalCredits += amountCredits;
  });
  return totalPoints / totalCredits;
}

server.listen(process.env.PORT || port);