const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
var session = require("express-session");
const app = express();
const passport = require("passport");
var GitHubStrategy = require("passport-github2").Strategy;
const port = 3000;
require("dotenv").config();

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`;
const client = new MongoClient(uri);

let db = null;
let db_user = null;

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

passport.use(
  new GitHubStrategy(
    {
      clientID: "f55cac6ac0c54d5baf80",
      clientSecret: "f2e8111b26a8c2cc944e8da550b1a77015c9bc16",
      callbackURL: "https://a3-patrickhunter.glitch.me/auth/github/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      process.nextTick(function () {
        return done(null, profile);
      });
    }
  )
);

app.use(
  session({
    secret: "i love javascript",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  function (req, res) {}
);

app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async function (req, res) {
    const login = await validateUser(req.user.username, "", true);
    res.redirect("/html/boxes.html");
  }
);

const auth = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect("/");
  }
};

async function connect() {
  await client.connect();
  db = await client.db("test_db");
  db_user = await client.db("user_db");
}

async function getNextID(username) {
  const userC = await db.collection(username);
  if (userC !== null) {
    const years = await userC
      .find({}, { year: 1 })
      .sort({ year: -1 })
      .toArray();
    return years.length;
  } else {
    await db.createCollection(username);
  }
  return 0;
}

async function updateScore(username) {
  let score = await getNextID(username);
  const login = await db_user.collection("leaderboard");
  if (login !== null) {
    let q = { user: username };
    let ns = { $set: { score: score } };
    let o = { upsert: true };
    login.updateOne(q, ns, o);
  }
}

async function addBox(user, color) {
  const nextID = await getNextID(user);
  let newBox = { id: nextID, color: color };
  db.collection(user).insertOne(newBox);
  console.log(`Added a ${color} box for ${user}.`);
}

connect();

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect("/html/index.html");
});

app.post("/add_box", auth, (req, res) => {
  let dStr = "";
  req.on("data", function (data) {
    dStr += data;
  });

  req.on("end", async function () {
    let data = JSON.parse(dStr);
    await addBox(req.user.username, data.color);
    updateScore(req.user.username);
    res.send("Received request for add_box...");
  });
});

app.post("/rmv_box", auth, (req, res) => {
  let dStr = "";
  req.on("data", function (data) {
    dStr += data;
  });

  req.on("end", async function () {
    let data = JSON.parse(dStr);
    const userC = await db.collection(req.user.username);
    if (userC !== null) {
      const box = { id: parseInt(data.id) };
      await userC.deleteOne(box);
      updateScore(req.user.username);
      res.send("Deleted box.");
    } else {
      res.send("Error: no collection exists for this user.");
    }
  });
});

app.post("/paint_box", auth, (req, res) => {
  let dStr = "";
  req.on("data", function (data) {
    dStr += data;
  });

  req.on("end", async function () {
    let data = JSON.parse(dStr);
    const userC = await db.collection(req.user.username);
    if (userC !== null) {
      console.log(data);
      const box = { id: parseInt(data.id) };
      const newcolor = { $set: { color: data.color } };
      userC.updateOne(box, newcolor);
      res.send("Painted box.");
    } else {
      res.send("Error: no collection exists for this user.");
    }
  });
});

app.get("/get_boxes", async (req, res) => {
    const userC = await db.collection(req.user.username);
    if (userC !== null) {
      let boxes = await userC.find({}).toArray();
      res.writeHead(200, "OK", { "Content-Type": "application/json" });
      res.write(JSON.stringify(boxes));
      res.end();
    } else {
      getNextID(req.user.username);
      res.writeHead(200, "OK", { "Content-Type": "application/json" });
      res.write(JSON.stringify([]));
      res.end();
    }
});

async function validateUser(user, pass, github) {
  if (user === "" || (pass === "" && github === false)) {
    return false;
  }
  const login = await db_user.collection("login");
  if (login !== null) {
    const acc = await login.findOne({ user: user });
    if (acc != null) {
      return acc.pass === pass;
    } else {
      login.insertOne({ user: user, pass: pass });
    }
  }
  return true;
}

app.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.get("/user_exists", async (req, res) => {
  const login = await db_user.collection("login");
  if (login !== null) {
    let user = await login.findOne({ user: req.query.user });
    let resp = +(user !== null);
    res.writeHead(200, "OK", { "Content-Type": "text/plain" });
    res.write("" + resp);
    res.end();
  }
});


//unsafe, oh well
app.get("/login", async (req, res, next) => {
  let data = req.query;
  const login = await validateUser(data.user, data.pass, false);
  if (login) {
    let user = {username: data.user};
    req.login(user, function(err) {
      if (err) { return next(err); }
      return res.redirect("/html/boxes.html");
    });
  } else {
    res.redirect("/")
  }
});

app.post("/try_login", async (req, res, next) => {
  let dStr = "";
  req.on("data", function (data) {
    dStr += data;
  });

  req.on("end", async function () {
    let data = JSON.parse(dStr);
    const login = await validateUser(data.user, data.pass, false);
    if (login) {
      res.writeHead(200, "OK", { "Content-Type": "text/plain" });
      res.write("1");
      res.end();
    } else {
      res.writeHead(200, "OK", { "Content-Type": "text/plain" });
      res.write("0");
      res.end();
    }
  });
});

app.get("/get_scores", async (req, res) => {
  const login = await db_user.collection("leaderboard");
  let results = [];
  if (login !== null) {
    let options = {
      sort: { total: -1 },
      projection: { user: 1, score: 1 },
    };
    results = await login.find({}, options).toArray();
  }

  res.writeHead(200, "OK", { "Content-Type": "application/json" });
  res.write(JSON.stringify(results));
  res.end();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
