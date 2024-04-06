const http = require( "http" ),
      fs   = require( "fs" ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you"re testing this on your local machine.
      // However, Glitch will install it automatically by looking in your package.json
      // file.
      dir  = "public/",
      port = 3000


let todoList = []

accounts = [] // [{ username: "admin", password: "password" }]

let current_user = "Guest"

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://tester:ubLpKcS1KNRdiZfc@cluster0.kty1d7h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const collection = client.db("todo_list").collection("collection1")

const express = require('express'),
  app = express()

const logger = (req, res, next) => 
{
  console.log('url:', req.url)
  next()
}

const handleLogin = async function (request, response) {
  let input = request.body

  current_user = input.username

  response.writeHead(200, "OK", { "Content-Type": "text/plain" })
  
  for(const element of accounts)
  {
    if(element.username === input.username)
    {
      if(element.password === input.password)
      {
        await response.end("correct")
        return
      }
      else
      {
        current_user = null
        await response.end("incorrect")
        return
      }
    }
  }

  accounts.push({ username: input.username, password: input.password })
  response.end("new account")
}

const handlePost = function (request, response) {
  let input = request.body

  inputData(input.data).then(r => {
    returnToDoList(response)
  })

}

const handleClear = async function (request, response) {
  collection.deleteMany({user: current_user}).then(r => {
    returnToDoList(response)
  })
}

// Server logic function
async function inputData(input) {
  // Adds derived field
  let currentDate = new Date()

  if(input[3])
  {
    input.push(currentDate.toDateString())
  }
  else
  {
    input.push("")
  }

  taskFilter = { task: input[1], user: current_user }
  existingTask = await collection.findOne(taskFilter)
  if(existingTask) // Modify (replace) the element
  {
    collection.deleteOne(taskFilter)
  }

  // Add the element
  let document = {
    course: input[0],
    task: input[1],
    due: input[2],
    date_added: input[4],
    user: current_user
  }
  await collection.insertOne(document)
}

function handleUpdate(request, response) {
  returnToDoList(response)
}

function returnToDoList(response) {
  getToDoList().then(todoList => {
    response.writeHead(200, "OK", { "Content-Type": "text/plain" })
    response.end(JSON.stringify(todoList))
  })
}

async function getToDoList() {
  newList = []
  let outp = collection.find()
  for await (const doc of outp) {
    if(doc.user === current_user)
    {
      let data = [doc.course, doc.task, doc.due, doc.date_added]
      newList.push(data)
    }
  }
  return newList
}

async function connectoToDB() {
  // Connect the client to the server	(optional starting in v4.7)
  await client.connect();
  // Send a ping to confirm a successful connection
  await client.db("admin").command({ ping: 1 });
  console.log("Pinged your deployment. You successfully connected to MongoDB!");
}

async function disconnectFromDB() {
  await client.close();
}

connectoToDB()

app.use(logger)

app.use(express.static("public"))

app.use(express.json())

app.post("/submit", handlePost)
app.post("/clear", handleClear)
app.post("/login", handleLogin)
app.post("/update", handleUpdate)

app.listen(process.env.PORT || port)

process.on("SIGINT", async () => {
  console.log("Closing...")
  disconnectFromDB()
  process.exit(0)
})