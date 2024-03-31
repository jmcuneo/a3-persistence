const express = require('express');
const { MongoClient, ObjectId } = require("mongodb")
const app = express();
const port = 3000;

const uri = `mongodb+srv://bryontom13:dnoRyjyrKYtC0W27@bluster.wfsyp44.mongodb.net/?retryWrites=true&w=majority&appName=Bluster`
const client = new MongoClient(uri)

app.use(express.static('public'));
app.use(express.static('views'));
app.use(express.json());

let collection = null
let entries = []

async function run() {
    await client.connect()
    collection = await client.db("datatest").collection("test")

    // route to get all docs
    app.get("/docs", async (req, res) => {
        if (collection !== null) {
            const docs = await collection.find({}).toArray()
            res.json(docs)
        }
    })

    app.use((req, res, next) => {
        if (collection !== null) {
            next()
        } else {
            res.status(503).send()
        }
    })

    app.get('/entries', async (req, res) => {
        if (collection !== null) {
            const docs = await collection.find({}).toArray()
            res.json( docs )
        }
    });

    app.post('/submit', (req, res) => {
        let dataString = '';

        req.on('data', function (data) {
            dataString += data;
        });

        req.on('end', async function () {
            const json = JSON.parse(dataString);
            json.total = Number(json.squat) + Number(json.benchPress) + Number(json.deadLift);

            const result = await collection.insertOne(json);
            res.json(result);
        });
    });

    app.post('/update', async (req, res) => {
        const result = await collection.updateOne(
            { _id: new ObjectId(req.body._id) },
            { $set: { name: req.body.name } }
        )

        res.json(result)
    })

    app.post('/remove', async (req, res) => {
        const result = await collection.deleteOne({
            _id: new ObjectId(req.body._id)
        })

        res.json(result)
    })

    run()

}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});