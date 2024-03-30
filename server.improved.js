require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fs   = require( "fs" );
const dir  = "public/";
const app = express();
const path = require('path')
app.use(express.static("public") )
app.use(express.json() )
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//connect to the DB
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@${process.env.HOST}/?retryWrites=true&w=majority&appName=Cluster0`;

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
    collection = client.db('myDB').collection('myCollection0');

    app.get("/docs", async (req, res) => {
        if (collection !== null) {
            const docs = await collection.find({}).toArray()
            res.json(docs)
        }
    })
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
}
run();

async function switchToAnotherCollection(collectionName) {
    await client.connect();
    collection = client.db('myDB').collection(collectionName);
    console.log("Switch Collection");
}

async function createCollection(collectionName){
    await client.connect();
    await client.db('myDB').createCollection(collectionName);
    console.log("Create New Collection "+ collectionName);
}


app.use( (req,res,next) => {
    if( collection !== null ) {
        next()
    }else{
        res.status( 503 ).send()
    }
})

const appdata = [
    { "model": "toyota", "year": 1999, "mpg": 23 },
    { "model": "honda", "year": 2004, "mpg": 30 },
    { "model": "ford", "year": 1987, "mpg": 14}
]





//show the table
app.get('/result', async (req, res) => {
    const cursor = collection.find({}, {projection: {_id: 0, model: 1, year: 1, mpg: 1, age: 1}});
    const data = await cursor.toArray();
    res.writeHead(200, {'Content-Type': 'application/json'})
    res.end(JSON.stringify(data))
});

//switch page
app.post('/popstate',async (req, res) => {
        await switchToAnotherCollection("myCollection0");
}
)

//login
app.post('/login', async (req, res) =>{
    const{username, password} = req.body;
    const user = await collection.findOne({ Username: username, Password:password });
    if(user){
        await switchToAnotherCollection(user.db);
        res.send('Login successful!');
    } else {
        res.status(401).send('Unauthorized');
    }
});

//sign up without OAuth
app.post('/signup',async (req, res) => {
        const {username, password} = req.body;
    const user = await collection.findOne({ Username: username, Password:password });
    if(!user){
        await createCollection(username+'Data');
        const newData = ({ Username: username, Password:password, db: username+'Data' });
        const result = await collection.insertOne(newData);
        res.send('Sign up successful');
    }else{
        res.status(401).send('Unauthorized');
    }
    });

//Will use database to redo it


app.use(express.json())
app.use(express.static('public'));

///submit name


// add data DB
app.post('/add',async (req, res) => {
    const newData = req.body;
    const currentYear = new Date().getFullYear();
    newData.age = (currentYear - newData.year);
    const result = await collection.insertOne(newData);
    res.json({message: 'Data added successfully', data: newData});
});


app.put('/update/:id', (req, res) => {
    const indexToUPdate = req.params.id;
    const inputData = req.body;
    console.log(req.params.id);
    console.log(req.body)
    if(indexToUPdate>= 0 && indexToUPdate < appdata.length) {
        appdata[indexToUPdate] = inputData;
        const currentYear = new Date().getFullYear();
        appdata[indexToUPdate].age = currentYear - appdata[indexToUPdate].year;
    }
});

app.delete('/delete', (req, res) => {
    const indexToDelete = req.body.index;
    if(indexToDelete>= 0 && indexToDelete < appdata.length) {
        appdata.splice(indexToDelete,1);
    }
});


app.listen(3000);

