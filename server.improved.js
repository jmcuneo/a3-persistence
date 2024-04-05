const express = require("express");
const {MongoClient, ObjectId} = require("mongodb");
const app = express();
const cookie = require('cookie-session');
const uri = `${process.env.URI}`;
const client = new MongoClient(uri);

app.use(express.static("src"));
app.use(express.json());
app.use( express.urlencoded({ extended:true }) );
app.use( cookie({
    name: 'session',
    keys: ['key1', 'key2']
}));

let collection = null;
let userInfo = null;

async function run() {
    await client.connect();
    collection = await client.db("MonthlyCostDatabase").collection("MonthlyCost");
    userInfo = await client.db("MonthlyCostDatabase").collection("Users");

    // route to get all docs
    app.get("/docs", async (req, res) => {
        if (collection !== null) {
            const docs = await collection.find({}).toArray();
            res.json(docs);
        }
    });
}

run();

app.post( '/login', (req,res)=> {
    userInfo.findOne({username: req.body.username}).then(
        (result) => {
            if (result) {
                if (result.password === req.body.password) {
                    req.session.login = true;
                    req.session.userId = result._id.toString();
                    res.redirect("main.html");
                } else {
                    req.session.login = false;
                    req.session.userId = "";
                    res.redirect("invalid")
                }
            } else {
                userInfo.insertOne(req.body).then(
                    (result) => {
                        req.session.login = true;
                        req.session.userId = result.insertedId;
                        res.redirect("main.html")
                    }
                );
            }
        }
    );
});

app.use((req, res, next) => {
    if (collection !== null && userInfo !== null) {
        next();
    } else {
        res.status(503).send();
    }
});

app.post("/check", (req, res) => {
    if (req.session.login === true) {
        res.status(200).send("Logged In!");
    } else {
        res.status(401).send("Not Logged In!")
    }
});

app.get("/invalid", (req, res) => {
    res.sendFile(__dirname + '/src/index.html');
});

app.post("/newEntry", (req, res) => {
    try {
        const body = {
            userId: req.session.userId,
            date: req.body.date,
            rent: parseInt(req.body.rent),
            util: parseInt(req.body.util),
            food: parseInt(req.body.food),
            other: parseInt(req.body.other),
            total: parseInt(req.body.rent) + parseInt(req.body.util) + parseInt(req.body.food) + parseInt(req.body.other)
        };
        collection.insertOne(body).then(
            (result) => {
                collection.findOne({_id: new ObjectId(result.insertedId)}).then((item) => {
                    res.status(200).send(item);
                });
            }
        );
    } catch (err) {
        console.log(err);
        res.status(400).send("Entry Creation Failed!");
    }
});

app.delete("/deleteEntry", (req, res) => {
    try {
        collection.deleteOne({
            _id: new ObjectId(req.body.id)
        }).then(() => res.status(200).send("Entry Successfully Deleted!"))
    } catch (err) {
        console.log(err);
        res.status(400).send("Entry Deletion Failed!");
    }
});

app.put("/updateEntry", (req, res) => {
    try {
        const body = {
            date: req.body.date,
            rent: parseInt(req.body.rent),
            util: parseInt(req.body.util),
            food: parseInt(req.body.food),
            other: parseInt(req.body.other),
            total: parseInt(req.body.rent) + parseInt(req.body.util) + parseInt(req.body.food) + parseInt(req.body.other)
        };
        collection.updateOne(
            { _id: new ObjectId( req.body.id ) },
            { $set:{date: body.date, rent: body.rent, util: body.util, food: body.food, other: body.other, total: body.total} }
        ).then(
            () => {
                collection.findOne({_id: new ObjectId(req.body.id)}).then((item) => {
                    res.status(200).send(item);
                });
            });
    } catch (err) {
        console.log(err);
        res.status(400).send("Entry Update Failed!");
    }
});

app.post("/userInfo", (req, res) => {
    try {
        collection.find({userId: req.session.userId}).toArray().then((data) => {
            if (data.length === 0) {
                res.status(404).send("No Data Found!");
            } else {
                res.status(200).send(data);
            }
        });
    } catch (err) {
        console.log(err);
        res.status(400).send("Bad Request!");
    }
});

app.listen(3000);
