// server
const express = require('express'),
    app = express();

let collection = null;


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

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}/?retryWrites=true&w=majority&appName=Webware`;
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
        collection = await client.db("hwDB").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        app.get("/docs", async (req, res) => {
            if (collection !== null) {
                const docs = await collection.find({}).toArray()
                res.json( docs )
            }
        })
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);

const listener = app.listen( process.env.PORT || 3000 )