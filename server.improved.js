const express = require("express");
const app = express();
const path = require("path");

//arrays
const appdata = [];
const suggestdata = [];

//middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
app.use(express.static("public")); //public
app.use(express.static("views")); //views
app.use(express.urlencoded({ extended: false })); //middleware for form data??
app.use(express.json()); //middleware for json

app.get("/", (req, res) => {
  console.log("here");
  res.sendFile(path.join(__dirname, "/index.html"));
});

//CUSTOM MIDDLEWARE
//submit post middleware
const submitPost = (req, res, next) => {
  let dataString = "";

  req.on("data", function (data) {
    dataString += data;
  });

  req.on("end", function () {
    const dataObject = JSON.parse(dataString);
    const updatedObject = calculateDerived(dataObject);
    appdata.push(updatedObject);
    let bothArrays = {
      appdata: appdata,
      suggestdata: suggestdata,
    };
    req.json = JSON.stringify(bothArrays);
    next();
  });
};
const calculateDerived = function (object) {
  if (object.price === "" || object.qty === "") {
    object.cost = "Cannot calculate total cost";
  } else {
    let totalCost = object.price * object.qty;
    object.cost = totalCost;
  }
  return object;
};

//remove post middleware
const removePost = (req, res, next) => {
  let dataString = "";

  req.on("data", function (data) {
    dataString += data;
  });

  req.on("end", function () {
    appdata.splice(dataString, 1); // Remove the entry from the array
    console.log("Removed item at index: ", dataString);
    console.log("Updated appdata: ", appdata);
    req.json = JSON.stringify(appdata);
    next();
  });
};

//suggest post middleware
const suggestPost = (req, res, next) => {
  let dataString = "";

  req.on("data", function (data) {
    dataString += data;
  });

  req.on("end", function () {
    const suggestObject = JSON.parse(dataString);
    //check if suggestion is already being brought
    let repeat = 0;
    let alreadySuggested = 0;
    for (let i = 0; i < appdata.length; i++) {
      if (appdata[i].item == suggestObject.Sitem) {
        console.log("repeat", repeat);
        repeat++;
      }
    }
    for (let j = 0; j < suggestdata.length; j++){
      if (suggestdata[j].Sitem == suggestObject.Sitem) {
        alreadySuggested++;
      }
    }
    if (repeat > 0 || alreadySuggested > 0) {
      console.log("cannot add suggestion");
      return;
    } else {
      suggestdata.push(suggestObject);
    }
    console.log("suggestdata after suggest: ", suggestdata);
    req.json = JSON.stringify(suggestdata);
    next();
  });
};

//Handle Submit
app.post("/submit", submitPost, (req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(req.json);
});

//Handle Refresh
app.post("/refresh", (req, res) => {
  let bothArrays = {
    appdata: appdata,
    suggestdata: suggestdata,
  };
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(bothArrays));
});

//Handle Remove
app.post("/remove", removePost, (req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(req.json);
});

//Handle Suggest
app.post("/suggest", suggestPost, (req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(req.json);
});

app.listen(process.env.PORT || 3000);
