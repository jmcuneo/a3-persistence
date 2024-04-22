const express = require('express');
const app = express();
const port = 3000;
const dotenv = require('dotenv').config();
const { MongoClient } = require('mongodb');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const cookieParser = require('cookie-parser');

app.use(express.static('public'));
app.use(express.json());

// Use a cookie parser with a secret code
app.use(cookieParser('CS4241'));

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`;
const client = new MongoClient(uri);

let appdata = []
var githubID = null;
var username = null;
var displayName = null;
const cookieDuration = 72000000;
const doDebug = false;

/**
 * Prints a message only if {@link doDebug} is on
 * @param {String} msg The message to print if {@link doDebug} is on
 */
function debugPrint(msg) {
    if (doDebug) {
        console.log(msg);
    }
}

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "https://a3-alexanderbeck.onrender.com/auth/github/callback"
},
    async function (accessToken, refreshToken, profile, done) {
        debugPrint("Successfully connected to Github");
        if (profile) {
            let user = profile;
            githubID = user.id;
            username = user.username;
            displayName = user.displayName;

            // Initialize appdata based on githubID
            appdata = await collection.find({ githubID: user.id }).toArray();
            return done(null, user);
        } else {
            return done(null, false);
        }
    }
));

app.get('/auth/github/callback',
    passport.authenticate('github', { session: false, failureRedirect: '/' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.cookie('userID', githubID, { maxAge: cookieDuration, path: "/" });
        res.cookie('username', username, { maxAge: cookieDuration, path: "/" });
        res.cookie('displayName', displayName, { maxAge: cookieDuration, path: "/" });
        githubID = null;
        username = null;
        displayName = null;
        res.redirect('/');
    });


app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));


/* Inner HTML Code for test buttons
<span id="testButtons">
    <a href="test/1">
        <button class="ui button">Test Account 1</button>
    </a>
    <a href="test/2">
        <button class="ui button">Test Account 2</button>
    </a>
    <a href="test/3">
        <button class="ui button">Test Account 3</button>
    </a>
</span>
*/
/*
// Server-side test button code
app.get('/test/1', (req, res) => changeToUser(req, res, '1'));
app.get('/test/2', (req, res) => changeToUser(req, res, '2'));
app.get('/test/3', (req, res) => changeToUser(req, res, '3'));

async function changeToUser(req, res, testGithubID) {
    appdata = [];
    res.cookie('userID', testGithubID, {maxAge: cookieDuration, path:"/"});
    res.cookie('username', "TU " + testGithubID, {maxAge: cookieDuration, path:"/"});
    res.cookie('displayName', "Test User " + testGithubID, {maxAge: cookieDuration, path:"/"});
    appdata = await collection.find({ githubID: testGithubID }).toArray();
    res.redirect('/');
}
/*

/**
 * Sorts the data in appData according to priority, and then by date. Also reassigns ordernum.
 */
function sortData() {
    const MS_TO_HOURS = 1000 * 60 * 60;

    // Rank with priority first. Then, smaller the number, the greater the priority
    const priorities = {
        'verylow': 1,
        'low': 2,
        'medium': 3,
        'high': 4,
        'veryhigh': 5
    };

    appdata.sort((a, b) => {
        let priorityDifference = priorities[b.priority] - priorities[a.priority];
        if (priorityDifference !== 0) {
            return priorityDifference;
        }
        // They have the same priority, so sort by date instead
        return Math.floor((new Date(b.duedate).getTime() - new Date(a.duedate).getTime()) / MS_TO_HOURS);
    });

    // Update recommended order
    for (let i = 0; i < appdata.length; i++) {
        appdata[i].ordernum = i;
    }
}

// Connect to the DB
let collection = null;
/**
 * Connects to the MongoDB database
 */
async function connectToDB() {
    await client.connect();
    collection = await client.db(process.env.DBNAME).collection(process.env.DBCOLLECTION);
    debugPrint('Connected to DB');
}

connectToDB();

// Middleware to check connection to DB
app.use((req, res, next) => {
    if (collection !== null) {
        next();
    } else {
        res.status(503).send();
    }
});

passport.serializeUser(function (user, done) {
    process.nextTick(function () {
        return done(null, user);
    });
});

passport.deserializeUser(function (obj, done) {
    process.nextTick(function () {
        done(null, obj);
    })
});


// Load the data from appdata
app.post('/load', async (req, res) => {
    if (req.cookies.userID === undefined) {
        // Ensure that no database objects can be accessed without logging in
        debugPrint("No githubID found");
        res.writeHead(200, "OK", { "Content-Type": "application/json" });
        res.end(JSON.stringify({ nocontent: true }));
        return;
    }

    // User is logged in. Send the data
    debugPrint("Data requested");
    // Get the data from the DB for the user
    appdata = await collection.find({ githubID: req.cookies.userID }).toArray();

    res.writeHead(200, "OK", { "Content-Type": "application/json" });
    res.end(JSON.stringify(appdata));
    debugPrint("Data sent");
});

// Clear the data
app.post('/clear', (req, res) => {
    // Ensure that no database objects can be accessed without logging in
    if (req.cookies.userID === undefined) {
        return;
    }
    // Clear the DB
    collection.deleteMany({ githubID: req.cookies.userID });
    appdata = [];
    debugPrint("Cleared data!");
    res.writeHead(200, "OK", { "Content-Type": "text/plain" });
    res.end("Data cleared!");
});

app.post('/delete', (req, res) => {
    let dataString = "";

    req.on("data", function (data) {
        dataString += data;
    })

    req.on("end", function () {
        if (req.cookies.userID === undefined) {
            // Ensure that no database objects can be accessed without logging in
            return;
        }

        // Server crashes when dataString is not valid
        let newData = null;
        try {
            newData = JSON.parse(dataString);
        } catch {
            if (newData === '') {
                console.warn("Empty string given");
            } else {
                console.warn("INVALID JSON GIVEN");
            }
            return;
        }
        debugPrint("Recieved request to delete item");
        collection.deleteOne({ githubID: req.cookies.userID, taskname: newData.taskname });
        appdata.splice(appdata.indexOf(task => task.taskname === newData.taskname), 1);

        debugPrint("Item deleted!");
        res.writeHead(200, "OK", { "Content-Type": "text/plain" });
        res.end("Item deleted!");
    });
});


const new_post = (req, res, next) => {
    let dataString = "";

    req.on("data", function (data) {
        dataString += data;
    })

    req.on("end", function () {
        if (req.cookies.userID === undefined) {
            // Ensure that no database objects can be accessed without logging in
            return;
        }
        // Server crashes when dataString is not valid
        let newData = null;
        try {
            newData = JSON.parse(dataString);
        } catch {
            if (newData === '' || newData === ' ') {
                console.warn("Empty string given");
            } else {
                console.warn("INVALID JSON GIVEN");
            }
            return;
        }

        if (!newData.taskname) {
            // No taskname found
            debugPrint("No task name given");
            return;
        }

        // Edits the existing value if the name is already there
        for (let i = 0; i < appdata.length; i++) {
            if (appdata[i].taskname === newData.taskname) {
                newData.ordernum = appdata[i].ordernum;
                // Update item in DB
                const result = collection.updateOne(
                    { _id: appdata[i]._id },
                    {
                        $set: {
                            taskname: appdata[i].taskname,
                            priority: newData.priority,
                            duedate: newData.duedate,
                            githubID: req.cookies.userID,
                            ordernum: newData.ordernum
                        }
                    }
                );
                debugPrint("Updated item in DB");

                // Replace the existing value in appdata with the new data
                appdata.splice(i, 1, newData);
                sortData();
                debugPrint("Updated data!");

                if (newData.taskname === "undefined") {
                    console.warn("Undefined task name");
                }
                // Send data to front end
                res.writeHead(200, "OK", { "Content-Type": "application/json" });
                res.end(JSON.stringify(appdata));
                next();
                return;
            }
        }

        // Add githubID to entry
        newData.githubID = req.cookies.userID;
        appdata.push(newData);

        // Update all the order nums
        sortData();

        // Add item to DB
        const result = collection.insertOne(newData);
        debugPrint("Added item to DB");

        // // Return the new table
        res.writeHead(200, "OK", { "Content-Type": "application/json" });
        res.end(JSON.stringify(appdata));
        next();
    });
}

app.use(new_post);

app.get('/', (req, res) => {
    debugPrint('Root request recieved');
    res.send('/');
});

// Failed login handler
app.get('/failedlogin', (req, res) => {
    githubID = null;
    displayName = null;
    username = null;
    appdata = [];
    res.redirect('/');
});


app.listen(process.env.PORT || port, () => {
    console.log("Server listening on port " + port);
});
