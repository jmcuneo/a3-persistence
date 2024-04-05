const express = require('express')
const path = require('path')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const crypto = require("crypto")
const passport = require("passport")
const flash = require("express-flash")
const session = require("express-session")
const initializePassport = require("./passport-config")

const taskSchema = new mongoose.Schema({
  task: String,
  creationDate: String,
  dueDate: String,
}, { collection: "tasks" })
const userSchema = new mongoose.Schema({
  username: String,
  hashedPassword: String,
  salt: String,
}, { collection: "users" })

dotenv.config()
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_USERNAME = process.env.DB_USERNAME

const uri = `mongodb+srv://${encodeURIComponent(DB_USERNAME)}:${encodeURIComponent(DB_PASSWORD)}@a3.n93xx9m.mongodb.net/todo?retryWrites=true&w=majority&appName=a3`
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } }

mongoose.connect(uri, clientOptions)
const Task = mongoose.model("Task", taskSchema)
const User = mongoose.model("User", userSchema)

initializePassport(
  passport,
  async usernameToSearch => await User.findOne({ username: usernameToSearch })
)

const app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/public/views'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public'), {
  extensions: ['html']
}))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

app.get("/", (req, res) => {
  console.log(JSON.stringify(req.body))
  res.render("index.ejs", { name: req.user.username })
})

app.get("/register", (req, res) => {
  res.render("register.ejs")
})

app.get("/login", (req, res) => {
  res.render("login.ejs")
})

app.post("/register", async (req, res) => {
  //get username. find username in database. if exists, give error. If not exists, create model and update record with username, hashed password, and salt. redirect to login
  try {
    const dbUser = await User.findOne({ username: req.body.username })
    if (dbUser == null) {
      const salt = crypto.randomBytes(16).toString('hex')
      const hashedPassword = crypto.scryptSync(req.body.password, salt, 64)
      const newUser = new User({ username: req.body.username, hashedPassword: hashedPassword.toString('hex'), salt: salt })
      await newUser.save()
      res.redirect("/login")
    } else {
      res.redirect("/register")
    }
  } catch (error) {
    console.log("failed crypto" + error)
    res.send({ ok: false })
    res.redirect("/register")
  }

})

app.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true
}))

app.post('/add-task', async (req, res) => {
  const reqTask = req.body
  const dbTask = await Task.findOne({ 'task': reqTask.task })
  if (dbTask == null) {
    const newTask = new Task({ task: reqTask.task, creationDate: reqTask.creationDate, dueDate: reqTask.dueDate })
    await newTask.save()
  }
  const allTasks = await Task.find({}, "task creationDate dueDate") ?? []
  console.log(`result of find: ${JSON.stringify(allTasks)}`)
  res.send(JSON.stringify(allTasks))
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



const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

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