const express = require("express");
const axios = require("axios");
const path = require("path");
const session = require("express-session");
const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");
const app = express();

app.set("view engine", "ejs");
var access_token = "";

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

app.use(express.static("public"));
app.use(express.json());
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
  })
);

let collection = null;
let user = null;

async function run() {
  
  await client.connect();

  collection = await client.db("datatest").collection("test");

  app.get("/github/login", (req, res) => {
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${clientID}`
    );
  });

  app.get("/github/callback", async (req, res) => {
    const requestToken = req.query.code;
    const response = await axios.post(
      `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
      {},
      {
        headers: {
          accept: "application/json",
        },
      }
    );

    access_token = response.data.access_token;

    req.session.accessToken = access_token;

    res.redirect("/success");
  });

  app.get("/success", async (req, res) => {
    if (!req.session.accessToken) {

    res.redirect("/github/login");
    return;
  }

  const response = await axios.get("https://api.github.com/user", {
    headers: {
      Authorization: `token ${req.session.accessToken}`,
    },
  });
  const userData = response.data;
  user = userData.name;
    
  res.sendFile(path.join(__dirname, 'public', 'db.html'));
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
      const docs = await collection.find({name: user}).toArray();
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
      json.name = user;
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
        {
          $set: {
            name: json.name,
            squat: json.squat,
            benchPress: json.benchPress,
            deadLift: json.deadLift,
            total: json.total,
          },
        }
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
