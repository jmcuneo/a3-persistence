const express = require('express');
const path = require('path');
const dotenv = require('dotenv')
const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
  task: String,
  creationDate: String,
  dueDate: String,
});

dotenv.config()
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_USERNAME = process.env.DB_USERNAME

const uri = `mongodb+srv://${encodeURIComponent(DB_USERNAME)}:${encodeURIComponent(DB_PASSWORD)}@a3.n93xx9m.mongodb.net/?retryWrites=true&w=majority&appName=a3`;
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

mongoose.connect(uri, clientOptions)

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.post('/add-task', (req, res) => {
  const task = req.body
  res.send(JSON.stringify([{ task: "hi", creationDate: "2024-03-12", dueDate: "2024-03-12", daysUntilDue: 12 }]))
})

app.delete('/delete-task', (req, res) => {
  const taskName = req.body
  res.send(JSON.stringify([{ task: "hi", creationDate: "2024-03-12", dueDate: "2024-03-12", daysUntilDue: 12 }]))
})


// // const handlePost = function (request, response) {
// //   let dataString = ""

// //   request.on("data", function (data) {
// //     dataString += data
// //   })

// //   request.on("end", function () {
// //     let taskObj = JSON.parse(dataString)

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



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("SIGINT", () => {
  mongoose.connection.close(false, () => {
    process.exit(0)
  })
})
process.on("SIGTERM", () => {
  mongoose.connection.close(false, () => {
    process.exit(0)
  })
})