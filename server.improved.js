const express = require("express");
const fs = require("fs");
const mime = require("mime");
const dir = "public/";
const port = 3000;

const appdata = [];

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  sendFile(res, "public/index.html");
});

app.get("/getArray", (req, res) => {
  res.json(appdata);
});

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

app.listen(3000)
