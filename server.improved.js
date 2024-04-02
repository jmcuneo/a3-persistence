require('dotenv').config()
const GitHubStrategy = require('passport-github').Strategy;
const passport = require('passport');
const session = require('express-session');
const express    = require('express'),
  app        = express(),
  { MongoClient, ObjectId } = require("mongodb")

// const appdata = [
//   {
//     taskName: "Find my lost goldfish",
//     priority: 100,
//     creation_date: "2014-09-15",
//   },
//   {
//     taskName: "Finish Assignment 2",
//     priority: 5,
//     creation_date: "2024-03-18",
//   },
//   {
//     taskName: "Make WPI schedule",
//     priority: -100,
//     creation_date: "2024-03-10",
//   },
// ]
//
// // Calculate derived field, days_not_done, for default tasks
// appdata.forEach( task => {
//   task.days_not_done = Math.floor((new Date() - new Date(task.creation_date)) / (1000 * 60 * 60 * 24))
// })

app.use( express.json() )

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
  cb(null, id);
});

// console.log(process.env.GITHUB_ID, process.env.GITHUB_SECRET, process.env.SECRET);
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      callbackURL: '/auth/github/callback',
    },
    function (accessToken, refreshToken, profile, cb) {
      cb(null, profile);
    }
  )
);

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.PASS}@${process.env.HOST}`
const client = new MongoClient( uri )

let taskCollection = null
let userCollection = null

const isAuth = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

app.get('/', isAuth, async (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/login', (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  res.sendFile(__dirname + '/public/login.html');
});

app.get('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

//auth
app.get('/auth/github', passport.authenticate('github'));

app.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  async function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);

async function run() {
  await client.connect()
  taskCollection = await client.db("datatest").collection("Tasks")
  userCollection = await client.db("datatest").collection("Users")

  app.get("/tasks", isAuth, async (req, res) => {
    if (taskCollection !== null) {
      const user = await userCollection.find({ id: req.user }).toArray()

      if (!user.length) {
        await userCollection.insertOne({ id: req.user })
        return res.json( { newUserCreated: true } )
      }

      const tasks = await taskCollection.find({ userId: req.user }).sort({priority: -1}).toArray()
      return res.json( tasks )
    }
  })
}

run()

app.use( (req,res,next) => {
  if( taskCollection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})

app.post('/tasks', isAuth, async function(req, res) {
  const task = req.body
  task.priority = Number(task.priority)
  task.days_not_done = Math.floor((new Date() - new Date(task.creation_date)) / (1000 * 60 * 60 * 24))
  task.userId = req.user;

  const result = await taskCollection.insertOne( task )
  res.json( result )
})

app.put('/tasks', isAuth, async function(req, res) {
  const json = req.body
  const task = {
    taskName: json.taskName,
    // turn priority into a number
    priority: Number(json.priority),
    creation_date: json.creation_date,
    days_not_done: Math.floor((new Date() - new Date(json.creation_date)) / (1000 * 60 * 60 * 24)),
  }

  const result = await taskCollection.updateOne(
    { _id: new ObjectId( json._id ) },
    {
      $set: {
        taskName: task.taskName,
        priority: task.priority,
        creation_date: task.creation_date,
        days_not_done: task.days_not_done,
      }
    }
  )

  res.json( result )
})

app.delete('/tasks', isAuth, async function(req, res) {
  const result = await taskCollection.deleteOne({
    _id:new ObjectId( req.body._id )
  })

  res.json( result )
})

app.use( express.static( 'public' ) )


app.listen( process.env.PORT || 3000 )
