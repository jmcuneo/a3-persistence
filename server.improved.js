const express = require("express");
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(cookieParser());
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

const EDIT_DELAY = 1000 * 60; // 60 second delay before editing again

const colorSchema = new mongoose.Schema({
    x: Number,
    y: Number,
    color: { type: String, default: "#FFFFFF" }
});
const Cells = mongoose.model("cells", colorSchema);

const recentListSchema = new mongoose.Schema({
    name: String,
    color: String,
    x: Number,
    y: Number,
    updatedAt: Date
});
const RecentList = mongoose.model("recentList", recentListSchema);

const accountSchema = new mongoose.Schema({
    username: String,
    password: String, //Plaintext, very secure
    lastColor: String,
    isAdmin: Boolean,
    updatedAt: Date
},);
const Accounts = mongoose.model("accounts", accountSchema);

app.use(express.static(__dirname + "/public"));

app.get("/read-grid", async (_req, res) => {
    const colors = await Cells.find().exec();
    const recent = await RecentList.find().sort({ updatedAt: "asc" }).exec();
    res.status(200).send(JSON.stringify({ colors: colors, recent: recent }));
});

app.post("/submit", (req, res) => {
    let dataString = "";

    req.on("data", function (data) {
        dataString += data;
    });

    req.on("end", async function () {
        let userData = JSON.parse(dataString);
        userData.name = decodeURIComponent(req.cookies.username);
        userData.pass = decodeURIComponent(req.cookies.password);

        if (!userData.color.match("^#[0-9a-f]{6}$") || userData.name === "" || userData.name.match("^\\s+$") || userData.x < 0 || userData.x >= 10 || userData.y < 0 || userData.y >= 10) {
            res.status(200).send(JSON.stringify({ result: "invalid" }));
            return;
        }

        const checkDate = new Date().getTime();
        await Accounts.findOne({ username: userData.name, password: userData.pass }).then(async found => {
            if (checkDate - found.updatedAt.getTime() < EDIT_DELAY) {
                res.status(200).send(JSON.stringify({ result: "deny", extra: EDIT_DELAY - (checkDate - new Date(found.updatedAt).getTime()) }));
                return;
            }

            const coord = { x: userData.x, y: userData.y };

            await Accounts.updateOne({ username: userData.name, password: userData.pass }, { lastColor: userData.color, updatedAt: checkDate }).exec();
            await RecentList.find().sort({ updatedAt: "asc" }).limit(20).then(async recent => {
                if (recent.length >= 20) {
                    await RecentList.updateOne({ _id: recent[0]._id }, { name: userData.name, color: userData.color, x: coord.x, y: coord.y, updatedAt: checkDate }).exec();
                } else {
                    await RecentList.create({ name: userData.name, color: userData.color, x: coord.x, y: coord.y, updatedAt: checkDate });
                }
            });
            await Cells.updateOne({ x: coord.x, y: coord.y }, { color: userData.color }).exec();

            res.status(200).send(JSON.stringify({ result: "accept" }));
            return;
        }).catch(err => {
            res.status(400).send(JSON.stringify({ result: "invalid" }));
            return;
        });
    });
});

app.post("/login", (req, res) => {
    let dataString = "";

    req.on("data", function (data) {
        dataString += data;
    });

    req.on("end", async function () {
        const userData = JSON.parse(dataString);
        if(userData.user.match("^\s*$") || userData.pass.match("^\s*$")) {
            res.status(200).send("your username or password is invalid.");
            return;
        }
        Accounts.findOne({ username: userData.user }).then(async acc => {
            if(userData.newAccount) {
                if(!acc) {
                    Accounts.create({ username: userData.user, password: userData.pass, lastColor: "#FFFFFF", isAdmin: false, updatedAt: new Date() });
                    res.status(200).send("Successfully created your account!");
                    return;
                } else {
                    res.status(200).send("That username is unavailable.");
                    return;
                }
            } else {
                if(acc) {
                    res.status(200).send("success");
                    return;
                }

                res.status(200).send("Your username or password is incorrect. Please try again.");
                return;
            }
        });
    });
});

app.get("/paint.html", (req, res) => {
    Accounts.findOne({ username: decodeURIComponent(req.cookies.username), password: decodeURIComponent(req.cookies.password) })
    .then(async acc => {
        if(!acc) {
            res.status(200).sendFile(__dirname + "/public/index.html");
        } else {
            res.status(200).sendFile(__dirname + "/private/paint.html");
        }
    });
});
app.get("/js/paint.js", (req, res) => {
    Accounts.findOne({ username: decodeURIComponent(req.cookies.username), password: decodeURIComponent(req.cookies.password) })
    .then(async acc => {
        if(!acc) {
            res.status(400).send("Invalid username or password");
        } else {
            res.status(200).sendFile(__dirname + "/private/js/paint.js");
        }
    });
});

async function initializeDatabse() {
    let initList = [];
    for (let x = 0; x < 10; x++) {
        for (let y = 0; y < 10; y++) {
            initList.push({ color: "#FFFFFF", x: x, y: y });
        }
    }

    await Cells.insertMany(initList);
    await Accounts.create({ username: process.env.ADMIN_USER, password: process.env.ADMIN_PASS, lastColor: "#FFFFFF", isAdmin: true, updatedAt: new Date() });
}

async function run() {
    try {
        // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
        await mongoose.connect(process.env.URI, clientOptions);
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log("Connected to MongoDB!");
        if(process.env.RESET_DB === "TRUE") {
            initializeDatabse();
        }
        app.listen(parseInt(process.env.PORT));
    } catch (ex) {
        console.log(ex);
        console.log("Error occured");
    }
}

run().catch(console.dir);
process.on("exit", async function () {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
});