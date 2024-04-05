const express = require("express");
const axios = require("axios");
const path = require("path");
const session = require("express-session");
const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");
const app = express();

require('dotenv').config();

app.set("view engine", "ejs");
var access_token = "";

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`

const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(
    session({
        secret: "your_secret_key",
        resave: false,
        saveUninitialized: false,
    })
);


let rpeCollection = null
let loginCollection = null
let userID = null;
let userData = null;

async function run() {
    await client.connect()
    rpeCollection = await client.db("a3-EdisonZhang").collection("rpe")
    loginCollection = await client.db("a3-EdisonZhang").collection("login")

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
        userData = response.data;
        console.log(userData)
        userID = userData.name;
        console.log(userID)

        res.sendFile(path.join(__dirname, "public", "backend.html"));
    });

    app.use((req, res, next) => {
        if (rpeCollection !== null) {
            next();
        } else {
            res.status(503).send();
        }
    });

    // route to get all entries
    app.get("/docs", async (req, res) => {
        if (rpeCollection !== null) {
            const docs = await rpeCollection.find({}).toArray();
            res.json(docs);
        }
    })
    console.log("Connected")
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});


function requireLogin(req, res, next) {
    if (req.session.userID) {
        next();
    } else {
        res.redirect('/');
    }
}

app.post('/login', async (req, res) => {
    const {username, password} = req.body;

    let user = await loginCollection.findOne({username: username});

    let validated = false;
    let isNewAccount = false;

    if (!user) {
        try {
            await loginCollection.insertOne({ username: username, password: password });
            console.log("Creating Account with username: ", username)
            userID = username
            user = await loginCollection.findOne({username: username});
            isNewAccount = true;
        } catch (error) {
            console.error("Error creating new user:", error);
            res.status(500).send("Error creating new user");
            return;
        }
    }

    validated = user.password === password;

    if (validated) {
        req.session.userId = user._id;
        if(isNewAccount) {
            res.status(201).send('new account created');
        }
        else res.redirect('/main');
    } else {
        res.send('Invalid username or password');
    }
});

app.get('/main', requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'main.html'));
});

app.post('/submit', async (req, res) => {
    console.log("Request Body: ", req.body);
    console.log("Name: " + userID)
    await saveData(req.body)
    res.send("Data successfully added")
})

app.post('/delete', async (req, res) => {
    const result = await rpeCollection.deleteOne({ _id: new ObjectId(req.body.deleteId) });
    res.send("Data successfully deleted")
})

app.post('/edit', async (req, res) => {
    console.log("Request Body: ", req.body);
    const result = await rpeCollection.updateOne(
        { _id: new ObjectId(req.body.id) },
        {
            $set: {
                "userID": userID,
                "weight": req.body.weight,
                "reps": req.body.reps,
                "rpe": req.body.rpe,
                "oneRM": req.body.oneRM,
                "date": req.body.date,
            }
        }
    );
    res.send("Data successfully edited")
})
const saveData = async function (myDataJSON) {
    // Add to mongodb
    const result = await rpeCollection.insertOne({
        "userID": userID,
        "weight": myDataJSON.weight,
        "reps": myDataJSON.reps,
        "rpe": myDataJSON.rpe,
        "oneRM": myDataJSON.oneRM,
        "date": myDataJSON.date
    })
}


run()

app.listen(3000)
