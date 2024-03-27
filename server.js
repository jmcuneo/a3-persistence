// server
const express = require('express'),
    app = express();

const bcrypt = require('bcryptjs');
let db = null;


app.use( express.static( 'public' ) );
app.use( express.static( 'views'  ) );
app.use(express.json());

const appdata = [
    { "game": "Genshin Impact", "name": "Azu", "uid": 999525821,  "server": "Test Server"},
    { "game": "Genshin Impact", "name": "Jim", "uid": 100000001,  "server": "CN" },
    { "game": "Genshin Impact", "name": "HelloWorld", "uid": 600000009,  "server": "US"}
]

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
async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        db = await client.db("hwDB").command({ ping: 1 });
        console.log("Pinged your deployment. Test successfully!");

        app.get("/docs", async (req, res) => {
            if (db!== null) {
                const docs = await db.find({}).toArray()
                res.json( docs )
            }
        })
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
        console.log("Closed connection to MongoDB");
    }
}
run().catch(console.dir);

app.post( '/submit', ( req, res ) => {
    const data = req.body; // Express.json() middleware parses the JSON body and attaches it to req.body

    console.log(data);

    switch (data.uid.charAt(0)) {
        case '1':
            appdata.push({ "game": data.game, "name": data.name, "uid": data.uid, server: "CN" });
            break;
        case '9':
            appdata.push({ "game": data.game, "name": data.name, "uid": data.uid, server: "Test Server" });
            break;
        case '6':
            appdata.push({ "game": data.game, "name": data.name, "uid": data.uid, server: "US" });
            break;
        case '7':
            appdata.push({ "game": data.game, "name": data.name, "uid": data.uid, server: "EU" });
            break;
        default:
            appdata.push({ "game": data.game, "name": data.name, "uid": data.uid, server: "Other" });
            break;
    }
    res.writeHead( 200, "OK", {"Content-Type": "application/json"})
    res.end(JSON.stringify(appdata))
})

app.post('/login', async (req, res) => {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        db = await client.db("hwDB").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        const { username, password } = req.body;
        const collection = db;
        const user = await collection.findOne({ username });

        if (user && await bcrypt.compare(password, user.password)) {
            res.send('Login successful');
        } else {
            res.status(400).send('Invalid credentials');
        }
    } catch (error) {
        res.status(500).send(error.message);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
        console.log("Closed connection to MongoDB");
    }
});

app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const collection = db.collection('users');
        const userExists = await collection.findOne({ username });

        if (userExists) {
            return res.status(400).send('Username already exists');
        }

        await collection.insertOne({ username, password: hashedPassword });
        res.status(201).send('User created');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get( '/data', async (req, res) => {
    try {
        const username = req.body;
        const collection = db.collection('db0');

        if (username === "admin") {
            const data = await collection.find({}).toArray();
            res.json(data);
            res.status(201).send('Data fetched');
        }
        else{
            const data = await collection.find({username}).toArray();
            res.json(data);
            res.status(201).send('Data fetched');
        }
    }catch (error) {
        res.status(500).send(error.message);
    }
})

app.put('/modify', async (req, res) => {
    try {
        // Assuming `userId` is obtained from the session or a verified token
        const {recordID, updateData} = req.body; // Data to update

        const collection = db.collection('db0');
        const result = await collection.updateOne({ recordID }, { $set: updateData });

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
        const recordID = req.body; // Data to update

        const collection = db.collection('db0');
        const result = await collection.deleteOne({ recordID });

        if (result.deletedCount === 0) {
            return res.status(404).send('No data found for the user to delete.');
        }

        res.send('Data deleted successfully.');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

const listener = app.listen( process.env.PORT || 3000 )