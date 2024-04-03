// server
const express = require('express'),
    cookie  = require( 'cookie-session' ),
    app = express();

let db = null;
let current= "";

app.use( express.urlencoded({ extended:true }) )
app.use( express.static( 'public' ) );
app.use(express.json());
app.use( cookie({
    name: 'a3-shiming',
    keys: ['azu109', 'sde'],
    maxAge: 24 * 60 * 60 * 1000
}))



const logger = (req,res,next) => {
    console.log( 'url:', req.url );
    next();
}

app.use( logger );

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://deshiming:ming@webware.yfjup5c.mongodb.net/?retryWrites=true&w=majority&appName=Webware`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
client.connect();

app.post( '/login', async (req, res) => {
    // express.urlencoded will put your key value pairs
    // into an object, where the key is the name of each
    // form field and the value is whatever the user entered
    console.log(req.body)

    try {
        const collection = await client.db("hwDB").collection('userDB');
        const {username, password} = req.body;
        const user = await collection.findOne({username});

        if (user && password === user.password) {
            req.session.login = true
            current = username;
            res.status(200).redirect('main.html');
        } else {
            res.status(400).redirect('index.html');
        }
    }catch (error){
        res.status(500).send(error.message);
    }

});


app.use( function( req,res,next) {
    if( req.session.login === true ){
        next();
    }
    else{
        res.sendFile( __dirname + '/public/index.html'  )
    }

});

app.post( '/submit', async (req, res) => {
    try{
        const collection = await client.db("hwDB").collection('db0');
        const { game, name, uid, server, owner} = req.body;

        const result = await collection.insertOne( req.body )
        res.json( result )
    }catch (error){
        res.status(500).send(error.message);
    }
})


app.post('/register', async (req, res) => {
    try {

        const { email, username, password, role } = req.body;

        const collection = await client.db("hwDB").collection('userDB');
        const userExists = await collection.findOne({ username });

        if (userExists) {
            return res.status(400).send('Username already exists');
        }

        await collection.insertOne({ email: email, username: username, password: password, role: role});
        res.status(201).send('User created');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post( '/data', async (req, res)  => {
    try {
        const {username} = req.body;
        const collection = await client.db("hwDB").collection('db0');


        if (username === "admin") {
            const data = await collection.find({}).toArray();
            res.status(201).json(data);
        }
        else{
            const data = await collection.find({owner: username}).toArray();
            res.status(201).json(data);
        }
    }catch (error) {
        res.status(500).send(error.message);
    }
})

app.put('/modify', async (req, res) => {
    try {
        // Assuming `userId` is obtained from the session or a verified token
        const {game, name, uid, server, owner} = req.body; // Data to update

        const collection = await client.db("hwDB").collection('db0');
        console.log(await collection.findOne({ uid: uid}));
        const result = await collection.updateOne(
            { uid: uid },
            { $set: req.body }
        )
        if (result.matchedCount === 0) {
            return res.status(404).send('No data found for the user to update.');
        }
        res.send('Data updated successfully.');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.delete('/delete', async (req, res) => {
    try {
        // Assuming `userId` is obtained from the session or a verified token
        const {uid} = req.body; // Data to update

        const collection = await client.db("hwDB").collection('db0');
        const result = await collection.deleteOne({ uid: uid });

        if (result.deletedCount === 0) {
            return res.status(404).send('No data found for the user to delete.');
        }

        res.send('Data deleted successfully.');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/verify', async (req, res) => {
    try {
        const collection = await client.db("hwDB").collection('userDB');
        const userExists = await collection.findOne({ username: current });

        if (userExists) {
            res.status(201).json(userExists);
        }
        else{
            res.status(400).send("");
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

const listener = app.listen( process.env.PORT || 3000 )