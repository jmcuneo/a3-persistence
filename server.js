const express = require("express"),
  cookie = require("cookie-session"),
  { MongoClient, ObjectId } = require("mongodb"),
  app = express(),
  hbs = require("express-handlebars").engine;

app.engine("handlebars", hbs());
app.set("view engine", "handlebars");
app.set("views", "./views");

// Connect to MongoDB
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`;
console.log(uri);
const client = new MongoClient(uri);

// Data
let collection = null;

async function run() {
  await client.connect();
  collection = await client.db("test_db").collection("test_collection");

  // route to get all docs
  app.get("/docs", async (req, res) => {
    if (collection !== null) {
      const docs = await collection.find({ owner: req.session.user }).toArray();
      res.json(docs);
    }
  });
}

// -------Middleware-------

app.use(express.urlencoded({ extended: true }));

app.use(
  cookie({
    name: "session",
    keys: ["key1", "key2"],
  })
);

app.use(express.static("public"));
app.use(express.json());

// Check MongoDB connection
app.use((req, res, next) => {
  if (collection !== null) {
    next();
  } else {
    res.status(503).send();
  }
});

// -------Post-------

// Insert a doc
app.post("/add", async (req, res) => {
  console.log(req.body);
  const query = req.body;
  query.owner = req.session.user;
  const result = await collection.insertOne(query);
  res.json(result);
});

// Remove a doc
// assumes req.body takes form { _id:5d91fb30f3f81b282d7be0dd } etc.
app.post("/remove", async (req, res) => {
  const result = await collection.deleteOne({
    _id: new ObjectId(req.body._id),
  });

  res.json(result);
});

// Update a doc
app.post("/update", async (req, res) => {
  const result = await collection.updateOne(
    { _id: new ObjectId(req.body._id) },
    {
      $set: {
        owner: req.session.user,
        dept_code: req.body.dept_code,
        course_id: req.body.course_id,
        professor: req.body.professor,
        grade: req.body.grade,
        notes: req.body.notes,
      },
    }
  );

  res.json(result);
});

// Log in
app.post("/login", async (req, res) => {
  const find = await collection.findOne({ username: req.body.username });

  if (find === null) {
    req.session.login = true;
    req.session.user = req.body.username;

    const result = await collection.insertOne(req.body);
    res.redirect("main.html");
  } else {
    if (req.body.password === find.password) {
      req.session.login = true;
      req.session.user = req.body.username;

      res.redirect("main.html");
    } else {
      req.session.login = false;

      res.render("index", { layout: false });
    }
  }
});

// Confirm logged in
app.use(function (req, res, next) {
  if (req.session.login === true) {
    next();
  } else {
    res.render("index", { message: "", layout: false });
  }
});

// Log out
app.post("/logout", (req, res) => {
  req.session.login = false;
  res.redirect("/");
});

app.get("/", (req, res) => {
  res.render("index", { message: "", layout: false });
});

app.get("/main.html", (req, res) => {
  res.render("main", { user: req.session.user, layout: false });
});

run();

app.listen(3000);
