const express = require("express");
const { MongoClient } = require('mongodb');
const app = express();
const path = require("path");

app.use(express.static("public")); //public
//app.use(express.static("views")); //views
//app.use(express.urlencoded({ extended: false })); //middleware for form data?? changed to true
app.use(express.json()); //middleware for json

//mongodb

//const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://ngcleary:45Richfield@cluster0.yywwl2c.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient( uri )

let collection = null

async function run() {
  await client.connect()
  collection = await client.db("a3-db").collection("a3Collection")

  //return collection;
  //const result = await collection.find().toArray()
  //return result;
  
  // route to get all docs
  app.get("/docs", async (req, res) => {
    if (collection !== null) {
      const docs = await collection.find({}).toArray()
      res.json( docs )
    }
  })
};
run();




//arrays
const appdata = [];
const suggestdata = [];


app.get("/", (req, res) => {
  console.log("here");
  res.sendFile(path.join(__dirname, "/index.html"));
});

/*
app.get("/submit", async (req, res) => {
  const result = await run();
  res.send(result);
});*/

//CUSTOM MIDDLEWARE
//check mongo connection
app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
});

//submit post middleware
const submitPost = (req, res, next) => {
  let dataString = "";

  req.on("data", function (data) {
    dataString += data;
  });

  req.on("end", function () {
    const dataObject = JSON.parse(dataString);
    //const updatedObject = calculateDerived(dataObject);
    appdata.push(dataObject);
    /*
    let bothArrays = {
      appdata: appdata,
      suggestdata: suggestdata,
    };*/
    //req.json = JSON.stringify(bothArrays);
    //req.json = JSON.stringify(appdata);
    req.json = dataString;

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

//bringPost middleware
const bringPost = (req, res, next) => {
  let dataString = "";

  req.on("data", function (data) {
    dataString += data;
  });

  req.on("end", function () {
    const newData = {name:"", item: suggestdata[dataString].Sitem, price: "",qty: suggestdata[dataString].Sqty};
    suggestdata.splice(dataString, 1); // Remove the entry from the array
    appdata.push(newData);
    console.log("index: ", dataString);
    console.log("Updated suggestdata: ", suggestdata);
    console.log("after bring, updated appdata: ", appdata);

    //send client both arrays -> make a new object, with both objects array inside (better way to do this??)
    let bothArrays = {
      appdata: appdata,
      suggestdata: suggestdata
    };
    req.json = JSON.stringify(bothArrays);
    next();
  });
}

//Handle Submit

app.post("/submit", express.json(), async (req, res) => {
  console.log(req.body);
  let data = req.body;
  console.log(data);
  var entry = {
    name: data.name,
    item: data.item,
    price: data.price,
    qty: data.qty, 
    cost: data.price * data.qty
  };
  appdata.push(entry);
  console.log("req: ", entry);
  const result = await collection.insertOne(entry)
  //res.json( result );  
  res.send(entry);
});

//Handle Remove
app.post("/remove", /*removePost*/ express.json(), async (req, res) => {
  //get data to remove
  console.log("type: ", typeof(req.body))
  console.log("string: ", typeof(JSON.stringify(req.body)))
  let indexToRemove = req;
  console.log("index to remove: ", indexToRemove)
  let intIndex = parseInt(indexToRemove);
  console.log("index to remove: ", intIndex)
  /*
  // Check if indexToRemove is valid
  if (indexToRemove < 0 || indexToRemove >= appdata.length) {
    return res.status(400).send("Invalid index");
  }*/

  // Get data to remove from appdata array using index
  const remove = appdata[0];
  console.log("appdata: ", appdata)
  console.log("item to remove: ", remove);
  
  // Use the attribute 'name' of the object to remove data from MongoDB
  const result = await collection.deleteOne({"name": remove.name, "item": remove.item, "_id": remove._id})
  
  //console.log(result);
  //res.send("Data removed successfully");
  appdata.splice(req.body, 1); // Remove the entry from the array
  //console.log("Removed item at index: ", req.body);
  console.log("Updated appdata: ", appdata);

  res.send(appdata);

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



//Handle Suggest
app.post("/suggest", suggestPost, (req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(req.json);
});

//Handle Bring
app.post("/bring", bringPost, (req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(req.json);
});

//run();
app.listen(process.env.PORT || 3000);
