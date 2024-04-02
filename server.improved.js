require('dotenv').config()
const express = require("express"),
    app = express(),
    // IMPORTANT: you must run `npm install` in the directory for this assignment
    // to install the mime library if you"re testing this on your local machine.
    // However, Glitch will install it automatically by looking in your package.json
    // file.
    mime = require("mime"),
    dir = "public/",
    port = 3000
let users;
let userData;
let currentUser; // for ID for user
let userCount; //total number of users
let dataCount; //total number of data
let currentUserDataCount; //current number of data for user

//MONGODB CODE
const { MongoClient, ServerApiVersion } = require('mongodb');
const { request, response } = require("express");
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@${process.env.HOST}/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        const database = client.db("Cars");
        users = database.collection("users");
        userData = database.collection("userData");
        userCount = await users.countDocuments();
        //console.log(userCount);
        dataCount = await userData.countDocuments();
        //console.log(users.countDocuments());
//        const cursor = users.find();
        //await cursor.forEach(console.log)
    } finally {

        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
run().catch(console.dir);

//TODO this should be taken from MONGO

const appdata = [
    /*
  {"Id": 1, "model": "Toyota", "year": 1999, "mpg": 23, "fuelLoad": 12, "tillEmpty": 23*12},
  {"Id": 2, "model": "Honda", "year": 2004, "mpg": 30,"fuelLoad": 15, "tillEmpty": 30*15 },
  {"Id": 3, "model": "Ford", "year": 1987, "mpg": 14,"fuelLoad": 10,"tillEmpty": 14*10  }

     */
]


app.use(express.static(__dirname + '/public'));
app.use(express.json())
app.get('/', (request, response) => {
    //sendFile( response, "public/main.html" )
    response.sendFile('public/login.html', { root: __dirname })

})
app.post('/login', async (request, response) => {
    let username = Object.values(request.body)[0];
    let password = Object.values(request.body)[1];
    const user = await users.findOne({username: username})
    if (user && user.password === password) {
        response.json({success: true});
        //console.log(user._id);
        currentUser = user._id.toString();
        console.log(currentUser);


      let currentData = await userData.find({user: currentUser}).toArray();
      currentUserDataCount = currentData.length;
      console.log(currentData);
      /*
        for(let i = 0; i <dataCount; i++){
            if(currentUser === userData[i].user){
                currentUserDataCount++;
            }
        }

         */


    } else if(user){
        response.json({success: false, message: "Invalid password"});
    }  else if(username === "" || password === ""){
        response.json({success: false, message: "Invalid user or password"});
    } else{
        await users.insertOne({username: username, password: password});
        response.json({success: true});
        currentUser = user._id;
        currentUserDataCount = 0;
    }
})

app.get('/data', (request, response) => {
    let dataString = ""

    request.on("data", function(data) {
        dataString += data
    })
    request.on("end", async function () {
        // ... do something with the data here!!!
        //console.log("made it here")
        //console.log(typeof Object.values(JSON.parse( dataString ))[0] === 'string')
        //console.log(appdata)

        //console.log(users.find({_id: currentUser}));
        console.log(currentUserDataCount);
        console.log(typeof currentUserDataCount);
        let currentData = await userData.find({user: currentUser}).toArray();
        var jsonArray = JSON.stringify(currentData)
        response.writeHead(200, "OK", {"Content-Type": "text/plain"})
        response.end(jsonArray)
    })
})

app.post('/submit', (request, response) => {
    //console.log("post happened")
    let dataString = ""

    request.on("data", function(data) {
        dataString += data
    })
    request.on("end", async function () {
        //console.log( JSON.parse( dataString ) )

        // ... do something with the data here!!!
        //console.log("made it here")
        //console.log(Object. values(JSON.parse( dataString ))[0]);

        if (isNaN(parseInt(Object.values(JSON.parse(dataString))[2])) ||
            isNaN(parseInt(Object.values(JSON.parse(dataString))[3])) ||
            isNaN(parseInt(Object.values(JSON.parse(dataString))[4]))
        ) {
            console.log("it broke")
        } else {
            currentUserDataCount++;
            await userData.insertOne({
                Id: parseInt(currentUserDataCount),
                model: Object.values(JSON.parse(dataString))[1],
                year: parseInt(Object.values(JSON.parse(dataString))[2]),
                mpg: parseInt(Object.values(JSON.parse(dataString))[3]),
                fuelLoad: parseInt(Object.values(JSON.parse(dataString))[4]),
                tillEmpty: parseInt(Object.values(JSON.parse(dataString))[3]) * parseInt(Object.values(JSON.parse(dataString))[4]),
                user: currentUser
            });
            //console.log(currentUserDataCount);
            //console.log(typeof currentUserDataCount);
        }

        //console.log(typeof Object.values(JSON.parse( dataString ))[0] === 'string')
        //console.log(appdata)
        let currentData = await userData.find({user: currentUser}).toArray();
        var jsonArray = JSON.stringify(currentData)
        response.writeHead(200, "OK", {"Content-Type": "text/plain"})
        response.end(jsonArray)
    })

})

app.delete('/remove', (request, response) => {
    let dataString = ""

    request.on("data", function(data) {
        dataString += data
    })

    request.on("end", async function () {
        // console.log( JSON.parse( dataString ) )

        // console.log("made it here to delete")
        const query = {Id: parseInt(Object.values(JSON.parse(dataString))[0]), user: currentUser};
        let currentData = await userData.find({user: currentUser}).toArray();
        //console.log(typeof Object.values(JSON.parse( dataString ))[0] === 'string')
        if (isNaN(parseInt(Object.values(JSON.parse(dataString))[0])) ||
            parseInt(Object.values(JSON.parse(dataString))[0]) <= 0 ||
            parseInt(Object.values(JSON.parse(dataString))[0]) > currentData.length + 1) {
        } else {
            for (let i = 0; i < currentData.length; i++) {
                if (parseInt(Object.values(JSON.parse(dataString))[0]) === currentData[i].Id) {
                    await userData.deleteOne(query);
                    currentUserDataCount--;
                }
            }
        }

        currentData = await userData.find({user: currentUser}).toArray();

        for (let i = 0; i < currentData.length; i++) {
            const query = {Id: currentData[i].Id, user: currentUser};
            const newValues = {$set: {Id: i + 1}};
            userData.updateOne(query, newValues);
        }



        //console.log(appdata)
        var jsonArray = JSON.stringify(appdata)
        response.writeHead(200, "OK", {"Content-Type": "text/plain"})
        response.end(jsonArray)
    })
})

app.put('/modify', (request, response) => {
    let dataString = ""

    request.on("data", function(data) {
        dataString += data
    })

    let indexToChange = 0;
    let indexFound = false;

    request.on("end", async function () {
        let currentData = await userData.find({user: currentUser}).toArray();
        const query = {Id: parseInt(Object.values(JSON.parse(dataString))[0]), user: currentUser};
        if (isNaN(parseInt(Object.values(JSON.parse(dataString))[0])) ||
            parseInt(Object.values(JSON.parse(dataString))[0]) <= 0 ||
            parseInt(Object.values(JSON.parse(dataString))[0]) > currentData.length
        ) {

        } else {
            for (let i = 0; i < currentData.length; i++) {
                if (parseInt(Object.values(JSON.parse(dataString))[0]) === currentData[i].Id) {
                    indexFound = true;
                    indexToChange = i;
                }

                if (indexFound && Object.values(JSON.parse(dataString))[1] !== "") {
                    const newValues = {$set: {model: Object.values(JSON.parse(dataString))[1]}};
                    userData.updateOne(query, newValues);
                }

                if (indexFound && parseInt(Object.values(JSON.parse(dataString))[2]) > 0) {
                    const newValues = {$set: {year: parseInt(Object.values(JSON.parse(dataString))[2])}};
                    userData.updateOne(query, newValues);
                }

                if (indexFound && parseInt(Object.values(JSON.parse(dataString))[3]) > 0) {
                    const newValues = {$set: {mpg: parseInt(Object.values(JSON.parse(dataString))[3]), tillEmpty: parseInt(Object.values(JSON.parse(dataString))[3]) * currentData[indexToChange].fuelLoad}};
                    userData.updateOne(query, newValues);
                }

                if (indexFound && parseInt(Object.values(JSON.parse(dataString))[4]) > 0) {
                    const newValues = {$set: {fuelLoad: parseInt(Object.values(JSON.parse(dataString))[4]), tillEmpty: parseInt(Object.values(JSON.parse(dataString))[4]) * currentData[indexToChange].mpg}};
                    userData.updateOne(query, newValues);
                }

            }
        }

        currentData = await userData.find({user: currentUser}).toArray();

        var jsonArray = JSON.stringify(currentData)
        response.writeHead(200, "OK", {"Content-Type": "text/plain"})
        response.end(jsonArray)
    })

})

app.listen(process.env.PORT || port)