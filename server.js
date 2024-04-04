const express = require('express'),
  app = express()
  session = require('express-session');
  path = require('path');

require('dotenv').config()

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json())

//LOGIN START
let guest_username = null
let guest_password = null
//LOGIN END

app.get('/', function(req, res) {
	// Render login template
	res.sendFile(path.join(__dirname + '/public/login.html'));
});

app.get('/main', (req, res) => {
  // If the user is loggedin
	if (req.session.loggedin) {
		res.sendFile(path.join(__dirname + '/public/main.html'));
	} else {
		// Not logged in
		res.status(401).send()
	}
})

//DATABASE CONNECTION START
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let collection = null

async function run() {


  await client.connect();

  collection = await client.db("Cars").collection("myCars");

  app.get("/docs", async (req, res) => {
    if (collection !== null) {
      const docs = await collection.find({}).toArray()
      res.json(docs)
    }
  })
}
run()

app.use((req, res, next) => {
  if (collection !== null) {
    next()
  } else {
    res.status(503).send()
  }
})

app.post('/add', async (req, res) => {
  let temp = req.body
  temp.EOL = calculateEOL(temp.year, temp.mpg)
  const result = await collection.insertOne(temp)
  res.json(result)
})

app.post('/remove', async (req, res) => {
  const result = await collection.deleteOne({
    _id: new ObjectId(req.body._id)
  })

  res.json(result)
})

app.post('/update', async (req, res) => {
  const result = await collection.updateOne(
    { _id: new ObjectId(req.body._id) },
    { $set: { model: req.body.model,
      year: req.body.year, 
      mpg: req.body.mpg,
      EOL: calculateEOL(req.body.year, req.body.mpg)} }
  )

  res.json(result)
})
//DATABASE CONNECTION END

app.post('/login', async (req, res) => {
  const login_data = req.body

  if(guest_username === null){
    guest_username = login_data.uname
    guest_password = login_data.psw
    console.log(`Successful sign in: ${login_data.uname}`)
    //sign them in...
    req.session.loggedin = true
    req.session.username = guest_username
    res.redirect("/main")
    res.end()
  } else { //not a new user

    if(guest_username === login_data.uname && guest_password === login_data.psw){
      //success!
      req.session.loggedin = true
      req.session.username = guest_username
      console.log(`Successful sign in: ${login_data.uname}`)
      res.redirect("/main")
      res.end()
    } else {
      //failed
      res.status(401).send("Incorrect Username or password!")
      res.end()
    }

  }

})

const calculateEOL = (year, mpg) => {
  let new_val = year + mpg;
  new_val = new_val - (year % mpg);

  return new_val;
}


app.listen(3000)