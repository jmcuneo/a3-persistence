const express = require("express");
const fs = require("fs");
const mime = require("mime");
const dir = "public/";
const port = 3000;

const appdata = [];

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Route for GET requests
app.get("/", (req, res) => {
  sendFile(res, "public/index.html");
});

app.get("/getArray", (req, res) => {
  res.json(appdata);
});

// Route for POST requests
app.post("/", (req, res) => {
  const finalData = req.body;
  const method = finalData.method;

  if (method === "/delete") {
    const targetIndex = finalData.index;
    appdata.splice(targetIndex, 1);
    res.send("Bye bye!");
  } else if (method === "/add" || method === "/submit") {
    appdata.push(finalData.string);
    res.send("Added/Submitted!");
  } else if (method === "/edit") {
    appdata[finalData.index] = finalData.content;
    res.send("Edited!");
  } else {
    res.status(400).send("Yikes");
  }
});

// Middleware to serve static files
app.use(express.static("public"));

// Function to send files
const sendFile = (res, filename) => {
  const type = mime.getType(filename);
  fs.readFile(filename, (err, content) => {
    if (err === null) {
      res.setHeader("Content-Type", type);
      res.end(content);
    } else {
      res.status(404).send("404 Error: File Not Found");
    }
  });
};

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
