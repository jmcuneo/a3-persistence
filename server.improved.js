require("dotenv").config();

const express = require("express"),
      app = express(),
      {MongoClient, ObjectId} = require("mongodb");

const router = express.Router();
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const session = require('cookie-session');

app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
      
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`;
const client = new MongoClient(uri);

let collection = null;
let users = null;

async function run() {
    await client.connect();
    collection = await client.db("a3-EllysGorodisch").collection("Recipes");
    users = await client.db("a3-EllysGorodisch").collection("Users");

    console.log("Done!");
}

run();

const logger = (req, res, next) => {
    console.log("url:", req.url);
    next();
};

app.use(express.static("public"));
app.set("views", __dirname + "/public");
app.use(logger);
app.use(express.json());

app.use(session({
    maxAge: 24 * 60 * 60 * 1000, // One day in milliseconds
    keys: [process.env.COOKIE_KEY]
}));

app.use(function(req, res, next) {
    if (req.session && !req.session.regenerate) {
        req.session.regenerate = (callback) => {
            callback();
        };
    }
    if (req.session && !req.session.save) {
        req.session.save = (callback) => {
            callback();
        };
    }
    next();
});

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    if (collection !== null) {
        next();
    } else {
        console.log("DEBUG");
        res.status(503).send();
    }
});

passport.use(
    new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "/auth/github/redirect"
    }, async (accessToken, refreshToken, profile, done) => {
        console.log("Strategy:");
        await users.findOne({githubID: profile.id}).then(async (user) => {
            if (user) {
                console.log("Old User:");
                console.log(user);
                return done(null, user);
            } else {
                await users.insertOne({githubID: profile.id}).then((newUser) => {
                    console.log("New User:");
                    console.log(newUser);
                    return done(null, newUser.insertId);
                });
            }
        });
    })
);

function isUserAuthenticated(req, res, next) {
    //console.log(req);
    console.log(req.user);
    if (req.user) {
        next(req, res);
    } else {
        return res.send('You must login!');
    }
}

passport.serializeUser((user, done) => {
    console.log("Serialize:");
    console.log(user);
    done(null, user);
});

passport.deserializeUser((user, done) => {
    console.log("Deserialize:");
    console.log(user);
    done(null, user);
});

app.get("/", (req, res) => {
    return res.render("index.html");
});

router.get("/github", passport.authenticate("github", {
    scope: ['user:email']
}));

router.get("/github/redirect", passport.authenticate("github"), (req, res) => {
    console.log("Redirect:");
    console.log(req.user);
    if (req.user) {
        return res.redirect("/recipes");
    } else {
        return res.send("You must login!");
    }
});

router.get("/logout", (req, res) => {
    req.logout(() => {
        return res.redirect("/");
    });
});

app.use("/auth", router);

app.get("/recipes", (req, res) => {
    console.log(req.user);
    return res.render("recipes.html");
});

async function createTable(res, userID) {
    let table = "<tr><th>Recipe Name</th><th>Prep Time</th><th>Cook Time</th><th>Total Time</th></tr>";
    collection.find({}).toArray().then((data) => {
        data = data.filter((a) => a.userID === userID);
        for (let d of data)
            table += `<tr><td>${d.name}</td>
                          <td>${d.prep} min${d.prep == 1 ? "" : "s"}</td>
                          <td>${d.cook} min${d.cook == 1 ? "" : "s"}</td>
                          <td>${d.total} min${d.total == 1 ? "" : "s"}</td></tr>`;
        res.end(table);
    });
};

app.get("/appdata", async (req, res) => {
    console.log("App Data:");
    console.log(req.user);
    await createTable(res, req.user._id);
});

app.post("/add", express.json(), async (req, res) => {
    const data = req.body;
    console.log(data);
    await collection.insertOne({
        userID: req.user._id,
        name: data.name,
        prep: data.prep,
        cook: data.cook,
        total: parseInt(data.prep) + parseInt(data.cook)
    }).then((result) => {
        console.log("Add:");
        console.log(result);
    });
    await createTable(res, req.user._id);
});

app.post("/remove", express.json(), async (req, res) => {
    const data = req.body;
    console.log(data);
    await collection.deleteOne({
        userID: req.user._id,
        name: {$regex: `^${data.name}$`, $options: "i"}
    }).then((result) => {
        console.log("Remove:");
        console.log(result);
    });
    await createTable(res, req.user._id);
});

app.post("/modify", express.json(), async (req, res) => {
    const data = req.body;
    console.log(data);
    await collection.updateOne(
        {
            userID: req.user._id,
            name: {$regex: `^${data.name}$`, $options: "i"}
        }, {
            $set: {
                prep: data.prep,
                cook: data.cook,
                total: parseInt(data.prep) + parseInt(data.cook)
            }
        }
    ).then((result) => {
        console.log("Modify:");
        console.log(result);
    })
    await createTable(res, req.user._id);
});

app.listen(process.env.PORT || 3000);