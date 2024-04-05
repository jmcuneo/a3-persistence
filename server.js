const express = require('express')
const { MongoClient, ObjectId } = require("mongodb")
const app = express()
const passport = require('passport');
var GitHubStrategy = require('passport-github2').Strategy;
const port = 3000
require('dotenv').config()


const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`
const client = new MongoClient( uri )

let db = null
let db_user = null


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new GitHubStrategy({
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
  callbackURL: "http://127.0.0.1:3000/auth/github/callback"
},
function(accessToken, refreshToken, profile, done) {
  // asynchronous verification, for effect...
  process.nextTick(function () {
    
    // To keep the example simple, the user's GitHub profile is returned to
    // represent the logged-in user.  In a typical application, you would want
    // to associate the GitHub account with a user record in your database,
    // and return that user instead.
    return done(null, profile);
  });
}
));

app.use(passport.initialize());
app.use(passport.session());

// GET /auth/github
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in GitHub authentication will involve redirecting
//   the user to github.com.  After authorization, GitHub will redirect the user
//   back to this application at /auth/github/callback
app.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }),
  function(req, res){
    // The request will be redirected to GitHub for authentication, so this
    // function will not be called.
  });

// GET /auth/github/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

async function connect() {
  await client.connect()
  db = await client.db("test_db");
  db_user = await client.db("user_db");
}

async function getNextID(username) {
  const userC = await db.collection(username);
  if (userC !== null) {
    const years = await userC.find({}, {year: 1}).sort({year: -1}).toArray();
    return years.length;
  } else {
    await db.createCollection(username)
  }
  return 0;
}

async function updateScore(username) {
  let score = await getNextID(username);
  const login = await db_user.collection("leaderboard");
  if (login !== null) {
    let q = {user: username}
    let ns = {$set: {score: score}}
    let o = {upsert: true}
    login.updateOne(q, ns, o);
  }
}

async function addBox(user, color) {
  const nextID = await getNextID(user)
  let newBox = {id: nextID, color: color};
  db.collection(user).insertOne(newBox);
  console.log(`Added a ${color} box for ${user}.`);
}

connect()

app.use(express.static("public"))

app.get('/', (req, res) => {
  res.redirect("/html/index.html")
})

app.post('/add_box', (req, res) => {
  let dStr = ""
  req.on( "data", function( data ) {
    dStr += data 
  });

  req.on( "end", async function() {
    let data = JSON.parse(dStr);
    await addBox(data.user, data.color);
    updateScore(data.user);
    res.send("Received request for add_box...")
  });
  
})

app.post('/rmv_box', (req, res) => {
  let dStr = ""
  req.on( "data", function( data ) {
    dStr += data 
  });

  req.on( "end", async function() {
    let data = JSON.parse(dStr);
    const userC = await db.collection(data.user);
    if (userC !== null) {
      const box = {id: parseInt(data.id)};
      await userC.deleteOne(box);
      updateScore(data.user);
      res.send("Deleted box.")
    } else {
      res.send("Error: no collection exists for this user.")
    }
  })
})

app.post('/paint_box', (req, res) => {
  let dStr = ""
  req.on("data", function( data ) {
    dStr += data 
  });

  req.on("end", async function() {
    let data = JSON.parse(dStr);
    const userC = await db.collection(data.user);
    if (userC !== null) {
      console.log(data);
      const box = {id: parseInt(data.id)};
      const newcolor = {$set: {color: data.color}};
      userC.updateOne(box, newcolor);
      res.send("Painted box.");
    } else {
      res.send("Error: no collection exists for this user.")
    }
  })
})

app.post('/get_boxes', async (req, res) => {
  let dStr = ""
  req.on( "data", function( data ) {
    dStr += data 
  });

  req.on( "end", async function() {
    let data = JSON.parse(dStr);
    const userC = await db.collection(data.user);
    if (userC !== null) {
      let boxes = await userC.find({}).toArray();
      res.writeHead(200, "OK", {"Content-Type": "application/json"});
      res.write(JSON.stringify(boxes));
      res.end();
    } else {
      getNextID(data.user);
      res.writeHead(200, "OK", {"Content-Type": "application/json"});
      res.write(JSON.stringify([]));
      res.end();
    } 
  })
})

async function validateUser(user, pass) {
  if (user === "" || pass === "") {
    return false;
  }
  const login = await db_user.collection("login");
  if (login !== null) {
    const acc = await login.findOne({user: user});
    if (acc != null) {
      return acc.pass === pass;
    } else {
      login.insertOne({user: user, pass: pass});
    }
  }
  return true;
}

app.get('/user_exists', async (req, res) => {
  const login = await db_user.collection("login");
  if (login !== null) {
    let user = await login.findOne({user: req.query.user});
    let resp = +(user !== null)
    res.writeHead(200, "OK", {"Content-Type": "text/plain"});
    res.write("" + resp);
    res.end()
  }
})

app.post('/login', async (req, res) => {
  let dStr = ""
  req.on( "data", function( data ) {
    dStr += data 
  });

  req.on( "end", async function() {
    let data = JSON.parse(dStr);
    const login = await validateUser(data.user, data.pass);
    res.writeHead(200, "OK", {"Content-Type": "text/plain"});
    if (login) {
      res.write("1");
    } else {
      res.write("0");
    }
    res.end();
  })
})


app.get('/get_scores', async (req, res) => {
  const login = await db_user.collection("leaderboard");
  let results = []
  if (login !== null) {
    let options = {
      sort: {total: -1},
      projection: {user: 1, score: 1}
    }
    results = await login.find({}, options).toArray(); 
  }

  res.writeHead(200, "OK", {"Content-Type": "application/json"});
  res.write(JSON.stringify(results))
  res.end()
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})