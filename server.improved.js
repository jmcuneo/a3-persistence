const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));


// going to store data like this:
// {task: <string>; created-on: <date>; due-by: <date>, is-most-urgent: <bool>}
//is most urgent will be a derived field, and will signal to the client to highlight this one red. this will the the task with the closest due date to the current time
// const appData = [
// ]

// const server = http.createServer(function (request, response) {
//   if (request.method === "GET") {
//     handleGet(request, response)
//   } else if (request.method === "POST") {
//     handlePost(request, response)
//   } else if (request.method === "DELETE") {
//     handleDelete(request, response)
//   }
// })

// const handleGet = function (request, response) {
//   const filename = dir + request.url.slice(1)

//   if (request.url === "/") {
//     sendFile(response, "public/index.html")
//   } else {
//     sendFile(response, filename)
//   }
// }

// const handlePost = function (request, response) {
//   let dataString = ""

//   request.on("data", function (data) {
//     dataString += data
//   })

//   request.on("end", function () {
//     let taskObj = JSON.parse(dataString)

//     const index = appData.findIndex(obj => obj.task === taskObj.task)

//     const newTaskObject = {
//       task: taskObj.task, creationDate: taskObj.creationDate, dueDate: taskObj.dueDate
//     }
//     if (index !== -1) {
//       appData[index] = newTaskObject
//     } else {
//       appData.push(newTaskObject)
//     }

//     //you can have a day change between computations and sends, so just computing directly before sending out
//     let appDataToSend = appData
//     appDataToSend.forEach(obj => {
//       const timeDiff = new Date(obj.dueDate) - new Date()
//       const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))
//       // -0
//       obj.daysUntilDue = daysDiff + 0
//     })

//     response.writeHead(200, "OK", { "Content-Type": "application/json" })
//     response.end(JSON.stringify(appDataToSend))
//   })
// }

// const handleDelete = function (request, response) {
//   let dataString = ""

//   request.on("data", function (data) {
//     dataString += data
//   })

//   request.on("end", () => {
//     let data = JSON.parse(dataString)

//     const index = appData.findIndex(obj => obj.task === data.task)

//     if (index > -1) {
//       appData.splice(index, 1)
//     } else {
//       console.log("Could not delete")
//     }
//     response.writeHead(200, "OK", { "Content-Type": "application/json" })
//     response.end(JSON.stringify(appData))
//   })
// }

// const sendFile = function (response, filename) {
//   const type = mime.getType(filename)

//   fs.readFile(filename, function (err, content) {

//     // if the error = null, then we've loaded the file successfully
//     if (err === null) {

//       // status code: https://httpstatuses.com
//       response.writeHeader(200, { "Content-Type": type })
//       response.end(content)

//     } else {

//       // file not found, error code 404
//       response.writeHeader(404)
//       response.end("404 Error: File Not Found")

//     }
//   })
// }

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
