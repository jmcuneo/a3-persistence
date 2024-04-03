const
    session = require('express-session'),
    { MongoClient, ServerApiVersion } = require('mongodb'),
    MongoDBStore = require('connect-mongodb-session')(session);

// setup Mongo
const uri = `mongodb+srv://${process.env.MONGO_CLIENT}:${process.env.MONGO_SECRET}@cluster.vvdqqog.mongodb.net/?retryWrites=true&w=majority&appName=Cluster`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const store = new MongoDBStore({
    uri: uri,
    databaseName: 'a3',
    collection: 'sessions'
});

const exp = { set_up_db_store, client, DB: null }
async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        exp.DB = client.db("a3").collection("data");
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch(err) {
       console.log(err)
    }
}

run().catch(console.dir);

function set_up_db_store(app) {
    // check database exists
    app.use((req, res, next) => {
        if (exp.DB !== null) {
            next()
        } else {
            res.status(503).send()
        }
    })

    // check session
    app.use(session({
        store, secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 3 // 3 hours
        },
    }));
}


module.exports = exp