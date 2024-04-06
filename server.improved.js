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
  username: String,
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

//auth middlewares

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect("/login")
}

function isNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/")
  }
  next()
}

app.get("/", isAuthenticated, (req, res) => {
  res.render("index.ejs", { name: req.user.username })
})

app.get("/login", isNotAuthenticated, (req, res) => {
  res.render("login.ejs")
})

app.post("/login", isNotAuthenticated, passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true
}))

app.get("/register", isNotAuthenticated, (req, res) => {
  res.render("register.ejs")
})

app.post("/register", isNotAuthenticated, async (req, res) => {
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
      res.render("register.ejs", { error: "Username already exists!" })
    }
  } catch (error) {
    res.render("register.ejs", { error: "Crypto has failed" })
  }
})

app.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/login');
  })
})

app.post('/add-task', isAuthenticated, async (req, res) => {
  const username = req.user.username

  const dbTask = await Task.findOne({ 'task': req.body.task }).where({ username: username }).exec()

  if (dbTask == null) {
    const newTask = new Task({ username: username, task: req.body.task, creationDate: req.body.creationDate, dueDate: req.body.dueDate })
    await newTask.save()
  } else {
    dbTask.dueDate = req.body.dueDate
    await dbTask.save()
  }
  const allTasks = await Task.find({ username: username }, "-_id task creationDate dueDate") ?? []

  let appDataToSend = allTasks.map((model) => { return model.toObject() })
  appDataToSend.forEach((obj) => {
    const timeDiff = new Date(obj.dueDate) - new Date()
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))
    // -0 fix
    obj.daysUntilDue = daysDiff + 0
  })
  res.send(JSON.stringify(appDataToSend))
})

app.delete('/delete-task', isAuthenticated, async (req, res) => {
  const taskName = req.body.task
  await Task.deleteOne({ 'task': req.body.task }).where({ username: req.user.username }).exec()

  const allTasks = await Task.find({ username: req.user.username }, "-_id task creationDate dueDate") ?? []

  let appDataToSend = allTasks.map((model) => { return model.toObject() })
  appDataToSend.forEach((obj) => {
    const timeDiff = new Date(obj.dueDate) - new Date()
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))
    obj.daysUntilDue = daysDiff + 0
  })
  res.send(JSON.stringify(appDataToSend))
})

app.get('*', function (req, res) {
  res.redirect('/')
})

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