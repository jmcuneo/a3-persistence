const fs   = require( "fs" ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you're testing this on your local machine.
      // However, Glitch will install it automatically by looking in your package.json
      // file.
      mime = require( "mime" ),
      anagram = require("./anagram"),
      dir  = "public/",
      port = 3000,
      express = require("express"),
      app = express()

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`

const clientDB = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let collection = null;

async function runDB() {
  await clientDB.connect()
  collection = await clientDB.db("datatest").collection("test")

  // route to get all docs
  app.get("/docs", async (req, res) => {
    if (collection !== null) {
      const docs = await collection.find({userId:req.userId}).toArray()
      res.json( docs )
    }
  })
}

runDB();

const handlePost = function(request, response) {
    // console.log("HANDLING POST");
    let data = request.body;
    console.log(data);
    var type = data.type;
    switch(type){
      //Entry is a new anagram request
      case "anagram":
        handleNewEntry(response,data);
        break;
      //Entry is a request to remove a specific anagram.
      case "remove":
        handleRemove(response,data);
        break;
      //Entry is a request to get all current appdata.
      case "getAll":
        handleGetAll(response,data);
        break;
    }
}

//When a new anagram request comes, sends back the new appdata entry.
const handleNewEntry = async function(response,data){
  var string = data.string;
  var anagrams = anagram.getAnagrams(string,4);
  //Send this back as a unique identifier, which will allow the client to delete entries.
  let nextData = {
    userId:data.userId,
    string:string,
    gram0:anagrams[0],
    gram1:anagrams[1],
    gram2:anagrams[2],
    gram3:anagrams[3]
  };
  const result = await collection.insertOne(nextData);
  nextData.id = result.insertedId;
  //TODO: Use result in some way
  console.log(anagrams);

  response.writeHead( 200, "OK", {"Content-Type": "text/plain" });
  response.end(JSON.stringify(nextData));
}

//When a request comes in to remove, remove it from appdata and send back the ID the server removed.
const handleRemove = async function(response, data){
  var removeVal = data.index;
  const result = await collection.deleteOne({
    _id:new ObjectId(removeVal)
  });
  response.writeHead( 200, "OK", {"Content-Type": "text/plain" });
  response.end(JSON.stringify(result));
}

//Give the client all appdata
const handleGetAll = async function(response,data){
  if(collection===null){
    response.writeHead(409, "ERROR",{"Content-Type":"text/plain"});
    response.end();
  }else{
    response.writeHead( 200, "OK", {"Content-Type": "text/plain" });
    const docs = await collection.find({}).toArray()
    response.end(JSON.stringify(docs));
  }
}

app.use(express.static('public'));
app.use(express.json());
app.post('/submit',handlePost);

app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
});

console.log(process.env.port);
app.listen(process.env.PORT);