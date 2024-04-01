const express = require("express");
const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");
const app = express();


const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

app.use(express.static("public"));
app.use(express.static("views"));
app.use(express.json());

let collection = null;

async function run() {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    collection = await client.db("datatest").collection("test");

    // route to get all docs
    app.get("/docs", async (req, res) => {
        if (collection !== null) {
            const docs = await collection.find({}).toArray();
            res.json(docs);
        }
    });

    app.use((req, res, next) => {
        if (collection !== null) {
            next();
        } else {
            res.status(503).send();
        }
    });

    app.get("/entries", async (req, res) => {
        if (collection !== null) {
            const docs = await collection.find({}).toArray();
            res.json(docs);
        }
    });

    app.post("/submit", (req, res) => {
        let dataString = "";

        req.on("data", function (data) {
            dataString += data;
        });

        req.on("end", async function () {
            const json = JSON.parse(dataString);
            json.total =
                Number(json.squat) + Number(json.benchPress) + Number(json.deadLift);

            const result = await collection.insertOne(json);
            res.json(result);
        });
    });

    app.post("/update", async (req, res) => {
        let dataString = "";

        req.on("data", function (data) {
            dataString += data;
        });

        req.on("end", async function () {
            const json = JSON.parse(dataString);
            json.total =
                Number(json.squat) + Number(json.benchPress) + Number(json.deadLift);

            const result = await collection.updateOne(
                { _id: new ObjectId(json._id) },
                { $set: { name: json.name,  squat: json.squat, benchPress: json.benchPress, deadLift: json.deadLift, total: json.total} }
            );
            res.json(result);
        });
    });

    app.post("/delete", async (req, res) => {
        let dataString = "";

        req.on("data", function (data) {
            dataString += data;
        });

        req.on("end", async function () {
            const json = JSON.parse(dataString);

            const result = await collection.deleteOne({
                _id: new ObjectId(json._id),
            });
            res.json(result);
        });
    });
}
run().catch(console.dir);
app.listen(3000);
