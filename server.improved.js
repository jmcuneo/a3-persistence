require('dotenv').config();

const express = require("express"),
      app = express(),
      {MongoClient, ObjectId} = require("mongodb");

const logger = (req, res, next) => {
    console.log("url:", req.url);
    next();
};

app.use(express.static("public"));
app.use(logger);
app.use(express.json());

app.get("/appdata", (req, res) => createTable(res));

app.post("/add", express.json(), async (req, res) => {
    const data = req.body;
    console.log(data);
    appdata.push({name: data.name,
                  prep: data.prep,
                  cook: data.cook,
                  total: parseInt(data.prep) + parseInt(data.cook)});
    const result = await collection.insertOne({name: data.name,
                                               prep: data.prep,
                                               cook: data.cook,
                                               total: parseInt(data.prep) + parseInt(data.cook)});
    console.log(result);
    createTable(res);
});

app.post("/remove", express.json(), async (req, res) => {
    const data = req.body;
    console.log(data);
    for (let i in appdata) {
        if (appdata[i].name.toLowerCase() === data.name.toLowerCase()) {
            appdata.splice(i, 1);

            const result = await collection.deleteOne({
                name: data.name
            });
            console.log(result);
            break;
        }
    }
    createTable(res);
});

app.post("/modify", express.json(), async (req, res) => {
    const data = req.body;
    for (let i in appdata) {
        if (appdata[i].name.toLowerCase() === data.name.toLowerCase()) {
            appdata[i].prep = data.prep;
            appdata[i].cook = data.cook;
            appdata[i].total = parseInt(data.prep) + parseInt(data.cook);

            const result = await collection.updateOne(
                {name: data.name},
                {$set: {prep: data.prep,
                        cook: data.cook,
                        total: parseInt(data.prep) + parseInt(data.cook)}}
            );
            console.log(result);
            
            break;
        }
    }
    createTable(res);
});

app.listen(process.env.PORT || 3000);

const appdata = [];

const createTable = async function(response) {
    let table = "<tr><th>Recipe Name</th><th>Prep Time</th><th>Cook Time</th><th>Total Time</th></tr>";
    const docs = await collection.find({}).toArray();
    for (let data of docs)
        table += `<tr><td>${data.name}</td>
                      <td>${data.prep} min${data.prep == 1 ? "" : "s"}</td>
                      <td>${data.cook} min${data.cook == 1 ? "" : "s"}</td>
                      <td>${data.total} min${data.total == 1 ? "" : "s"}</td></tr>`;
    response.writeHeader(200, {"Content-Type": "string"});
    response.end(table);
}

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`;
const client = new MongoClient(uri);

let collection = null;

async function run() {
    await client.connect();
    collection = await client.db("a3-EllysGorodisch").collection("Recipes");

    // route to get all docs
    app.get("/docs", async (req, res) => {
        if (collection !== null) {
            const docs = await collection.find({}).toArray();
            res.json(docs);
        }
    });
}

run();

app.use((req, res, next) => {
    if (collection !== null) {
        next();
    } else {
        res.status(503).send();
    }
});