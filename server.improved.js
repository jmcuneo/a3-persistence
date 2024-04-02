const express = require("express"),
    { MongoClient, ObjectId } = require("mongodb"),
    hbs     = require( 'express-handlebars' ).engine,
    cookie  = require( 'cookie-session' ),
    app = express()


app.engine( 'handlebars',  hbs() )
app.set(    'view engine', 'handlebars' )
app.set(    'views',       './views' )


app.use(express.static("public") )
//app.use(express.static("views") )
app.use(express.json() )

// use express.urlencoded to get data sent by default form actions
// or GET requests
app.use( express.urlencoded({ extended:true }) )

app.get('/favicon.ico', (req, res) => res.status(204));

// cookie middleware! The keys are used for encryption and should be
// changed
app.use( cookie({
  name: 'session',
  keys: ['key1', 'key2']
}))

function getUsername(req) {
  return req.session.username;
}

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (password === 'test') {
    req.session.username = username;
    req.session.login = true;
    res.redirect('main.html');
  } else {
    res.render('index', { msg: 'login failed, please try again', layout: false });
  }
});
app.get( '/', (req,res) => {
  res.render( 'index', { msg:'', layout:false })
})

app.use( function( req,res,next) {
  if( req.session.login === true )
    next()
  else
    res.render('index', { msg:'login failed, please try again', layout:false })
})

app.get( '/main.html', ( req, res) => {
  res.render( 'main', { msg:'success you have logged in', layout:false })
})

// app.listen( 3000 )

//MongoDB driver and routing

//const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`
const uri = `mongodb+srv://nwhalen:V6AsuKm0gTYCLsSJ@$cluster0.3fakrji.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient( uri )

let collection = null

async function run() {
  try {
    await client.connect();
    collection = client.db("projectDatabase").collection("Collection0");
    userCollection = client.db("projetDatabase").collection("Users");
    //userCollection is not used
    await client.db("projectDatabase").command({ping: 1});
    console.log();
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("Error : ", error);
  }

}

run()

//app.listen(3000)

// route to get all docs
app.get("/docs", async (req, res) => {
  const username = getUsername(req);
  if (collection !== null) {
    const projects = await collection.find({ username: username }).toArray();
    //const projects = await collection.find({}).toArray()
    const projectsWithPointsPerTeammate = projects.map(project => {
      const pointsPerTeammate = project.points / project.teammates;
      return { ...project, pointsPerTeammate };
  });
    res.json(projectsWithPointsPerTeammate);
}else {
    console.log("Cannot find project in db")
  }
});

app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})

//Send project to db with current username
app.post('/add', async (req, res) => {
  const username = req.session.username; // Get the current user's username from the session
  const { name, teammates, points } = req.body; // Parse project data from request body
  console.log(req.body)
  const pointsPerTeammate = parseFloat(points) / parseInt(teammates); // Calculate points per teammate
  const projectData = {name, teammates, points, pointsPerTeammate, username};
  const result = await collection.insertOne(projectData); // Insert project into the database
  res.json(result);
});

app.post('/remove', async (req, res) => {
  const projectName = req.body.name;
  const username = req.session.username;
  const result = await collection.deleteOne({ name: projectName, username: username });

  if (result.deletedCount === 1) {
    res.status(200).json({ message: 'Project removed successfully' });
  } else {
    res.status(404).json({ error: 'Project not found' });
  }
});


app.post( '/update', async (req,res) => {
  const result = await collection.updateOne(
      { _id: new ObjectId( req.body._id ) },
      { $set:{ name:req.body.name } }
  )
  res.json( result )
})

//* User database management

app.listen( 3000 )
