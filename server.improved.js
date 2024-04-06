require("dotenv").config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://"+process.env.USER+":"+process.env.PASSWORD+"@"+process.env.ENDPOINT+"/?retryWrites=true&w=majority&appName=Cluster0";
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
  await client.connect()
  collection = await client.db(process.env.DATABASE).collection(process.env.COLLECTION)

  const user = await collection.find({type: 'user', username: 'username', password: 'password'}).toArray();
  if (user[0] === undefined) {await collection.insertOne( {type: 'user', username: 'username', password: 'password'} );}

  // route to get all docs
  app.get("/docs", async (req, res) => {
    if (collection !== null) {
      const docs = await collection.find({}).toArray()
      res.json( docs )
    }
  })
}

run();


const express = require( 'express' ),
    cookie = require('cookie-session'),
    app = express()
const {join} = require("path");

app.use( cookie({
  name: 'session',
  keys: ['key1', 'key2']
}))

const userRouter = express.Router();
userRouter.get('/', async function (req, res) {
  const data = await collection.find({type: "user"}).toArray();
  res.json(data);
});
userRouter.post('/', async function (req, res) {
  let body = JSON.parse(req.body);
  body.type = 'user';
  await collection.insertOne( body );
  res.sendStatus(200);
});

userRouter.delete('/', async function (req, res) {
  let body = JSON.parse(req.body);
  body.type = 'user';
  await collection.deleteOne( body )
  res.sendStatus(200);
});

const gameRouter = express.Router();
gameRouter.get('/', async function (req, res) {
  const games = await collection.find({type: 'game', user: req.session.user}).toArray();
  res.json(games);
});
gameRouter.post('/', async function (req, res) {
  let body = JSON.parse(req.body);
  body.type = 'game';
  body.user = req.session.user;
  body.winner = "draw";
  if (body.score1 > body.score2) {
    body.winner = body.team1;
  } else if (body.score1 < body.score2) {
    body.winner = body.team2;
  }
  await collection.insertOne( body )
  res.sendStatus(200);
});

gameRouter.delete('/', async function (req, res) {
  let body = JSON.parse(req.body);
  body.type = 'game';
  body.user = req.session.user;
  body.winner = "draw";
  if (body.score1 > body.score2) {
    body.winner = body.team1;
  } else if (body.score1 < body.score2) {
    body.winner = body.team2;
  }
  await collection.deleteOne( body )
  res.sendStatus(200);
});

gameRouter.patch('/', async function (req, res) {
  let body = JSON.parse(req.body);
  let old = {team1: body.team1, team2: body.team2, score1: body.score1, score2: body.score2};
  old.type = 'game';
  old.user = req.session.user;
  old.winner = "draw";
  if (old.score1 > old.score2) {
    old.winner = old.team1;
  } else if (old.score1 < old.score2) {
    old.winner = old.team2;
  }

  let newGame = {team1: body.newTeam1, team2: body.newTeam2, score1: body.newScore1, score2: body.newScore2};
  newGame.type = 'game';
  newGame.user = req.session.user;
  newGame.winner = "draw";
  if (newGame.score1 > newGame.score2) {
    newGame.winner = newGame.team1;
  } else if (newGame.score1 < newGame.score2) {
    newGame.winner = newGame.team2;
  }
  await collection.updateOne( old, {$set: newGame} )
  res.sendStatus(200);
});


app.use( express.urlencoded({ extended:true }) )
// cookie middleware! The keys are used for encryption and should be
// changed




app.post( '/login', async (req, res) => {
  const user = await collection.find({type: 'user', username: req.body.username, password: req.body.password}).toArray();
  if (user[0] !== undefined) {
    req.session.login = true;
    req.session.user = user[0].username;
    res.redirect('homepage.html');
  } else {
    res.sendFile(join(__dirname + '/public/login.html'));
  }
});

app.get( '/logout', (req,res)=> {
  req.session.login = false;
  req.session.user = null;
  res.sendFile( join(__dirname + '/public/login.html' ));
});

const middleware = (req, res, next) => {
  if( collection !== null ) {
    if (req.url.includes('.css')) {
      next();
    } else if( req.session.login === true )
      next();
    else
      res.sendFile( join(__dirname + '/public/Login.html' ));
  }else{
    res.status( 503 );
  }
}
app.use(middleware);

app.use( express.static( join(__dirname, 'public' )) );
app.use( express.static( 'public/css' ) );
app.use( express.static( 'views'  ) );

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, "/public/homepage.html"));
});






app.use("/api/user", express.text(), userRouter);
app.use("/api/game", express.text(), gameRouter);

app.listen( process.env.PORT || 3000 );