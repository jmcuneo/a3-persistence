require("dotenv").config();
const express = require("express"),
    app = express(),
    mime = require("mime"),
    // IMPORTANT: you must run `npm install` in the directory for this assignment
    // to install the mime library if you"re testing this on your local machine.
    // However, Glitch will install it automatically by looking in your package.json
    // file.
    cookieParser = require('cookie-parser'),
    dir = "public/",
    port = 3000;

 app.use(express.json());
 app.use(cookieParser());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://dovushman:${process.env.PASSWORD}@cluster0.vpfjttx.mongodb.net/a3-dovUshman?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

let db;
let users;
let usersData;

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        db = client.db("a3-dovUshman");
        console.log(`Connected to the database:${db.databaseName}`)

        users = db.collection("users");
        console.log(`Connected to the collection:${users.collectionName}`);

        usersData = db.collection("usersData");
        console.log(`Connected to the collection:${usersData.collectionName}`);

    } catch (error) {
        console.dir(error);
    }
}
run();

let namesArray = []

app.get("/", (request, response) => {
    response.sendFile(__dirname + "/public/logIn.html")
})

app.use(express.static("public"));


app.get("/data", async (request, response) => {
    const userId = request.query.userId;
    console.log("userId: ", userId);


    // Find the user in the users collection
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });

    console.log("user: ", user)

    let data = [];

    if (user) {
        
        data = await db.collection('usersData').find({ userId: user._id.toString() }).toArray();
        console.log("data: ", data)
        console.log("Made it into the if user")
        
        data.forEach(item => console.log("usersData.userId: ", item.userId));
    }

    response.writeHead(200, "OK", { "Content-Type": "application/json" });
    response.end(JSON.stringify(data));
});

let userId = "";

// app.post("/signin", async (request, response) => {
//     console.log("sign in post request received")
//     const {username, password} = request.body;
//     const user = await users.findOne({username: username});
//     if (user && user.password === password) {
//         const userData = await db.collection('userData').findOne({userId: user._id});
        
//         userId = user._id.toString();
//         response.cookie('userId', userId);
//         response.json({status: 'success', user: user, userData: userData});
//     }
//     else if (user){
//         response.json({status: 'error', message: 'Invalid password' });
//     }
//     else {
//         const newUser = {username: username, password: password};
//         await users.insertOne(newUser);
//         const userData = await db.collection('userData').findOne({userId: newUser._id});
//         userId = newUser._id.toString();
//         response.cookie('userId', userId);
//         response.json({status: 'success', user: newUser, userData: userData});
//     }
// });
app.post("/signin", async (request, response) => {
    console.log("sign in post request received")
    const {username, password} = request.body;
    const user = await users.findOne({username: username});
    if (user && user.password === password) {
        const userData = await db.collection('userData').findOne({userId: user._id});
        
        userId = user._id.toString();
        response.cookie('userId', userId);
        response.json({status: 'success', user: user, userData: userData});
    }
    else if (user){
        response.json({status: 'error', message: 'Invalid password' });
    }
    else {
        const newUser = {username: username, password: password};
        await users.insertOne(newUser);
        const userData = await db.collection('userData').findOne({userId: newUser._id});
        userId = newUser._id.toString();
        response.cookie('userId', userId);
        if (userData) {
            response.json({status: 'success', user: newUser, userData: userData});
        } else {
            response.json({status: 'error', message: 'User data not found for new user'});
        }
    }
});

app.post("/submit", async (request, response) => {
    let dataString = ""

    request.on("data", function (data) {
        dataString += data
    })

    console.log("holy fuck my balls itch")

    request.on("end", async function () {
        const formData = JSON.parse(dataString);

        const id = formData.id;
        const firstName = formData.firstName;
        const middleName = formData.middleName;
        const lastName = formData.lastName;
        const initial = (firstName.charAt(0) + middleName.charAt(0) + lastName.charAt(0)).toUpperCase();

        const nameJson = {
            id: id,
            firstName: firstName,
            middleName: middleName,
            lastName: lastName,
            initial: initial,
            userId: formData.mongoUserId
        }

        // Insert the data into the MongoDB collection
        try {
            await usersData.insertOne(nameJson);
            console.log(`Inserted data into the MongoDB collection: ${JSON.stringify(nameJson)}`);
        } catch (error) {
            console.error(`Failed to insert data into the MongoDB collection: ${error}`);
        }

        // Fetch all documents from the MongoDB collection
        try {
            const documents = await usersData.find().toArray();
            console.log(`Current documents in the MongoDB collection: ${JSON.stringify(documents)}`);
        } catch (error) {
            console.error(`Failed to fetch documents from the MongoDB collection: ${error}`);
        }

        response.writeHead(200, "OK", { "Content-Type": "application/json" })
        response.end(JSON.stringify(nameJson))
    })
})

// app.put("/modify", async (request, response) => {
//     const { id, firstName, middleName, lastName } = request.body;

//     // Find the document in the MongoDB collection
//     const userData = await usersData.findOne({$and: [
//         { id: parseInt(id) },
//         { userId: request.cookies['userId'] }
//     ]});

//     if (!userData) {
//         response.json({ status: 'error', message: 'No matching document found' });
//         return;
//     }

//     // Update the document with the new data
//     try {
//         await usersData.updateOne(
//             { _id: userData._id },
//             { $set: { firstName: firstName, middleName: middleName, lastName: lastName } }
//         );
//         console.log(`Updated document in the MongoDB collection: ${JSON.stringify(request.body)}`);
//         response.json({ status: 'success', message: 'Update successful' });
//     } catch (error) {
//         console.error(`Failed to update document in the MongoDB collection: ${error}`);
//         response.json({ status: 'error', message: 'Update failed' });
//     }
// });

app.put("/modify", async (request, response) => {
    console.log(request.body)
    const { id, firstName, middleName, lastName } = request.body;
    console.log("modify server")
    // Check if the request body is empty
    if (!id || !firstName || !lastName) {
        response.json({ status: 'error', message: 'Request body is empty' });
        return;
    }

    // Calculate the initials after the names have been updated
    const initial = (firstName.charAt(0) + (middleName.charAt(0) || '') + lastName.charAt(0)).toUpperCase();

    // Find the document in the MongoDB collection
    const userData = await usersData.findOne({$and: [
        { id: parseInt(id) },
        { userId: request.cookies['userId'] }
    ]});

    if (!userData) {
        response.json({ status: 'error', message: 'No matching document found' });
        return;
    }

    // Update the document with the new data
    try {
        await usersData.updateOne(
            { _id: userData._id },
            { $set: { firstName: firstName, middleName: middleName, lastName: lastName, initial: initial } }
        );
        console.log(`Updated document in the MongoDB collection: ${JSON.stringify(request.body)}`);
        response.json({ status: 'success', message: 'Update successful', id, firstName, middleName, lastName });
    } catch (error) {
        console.error(`Failed to update document in the MongoDB collection: ${error}`);
        response.json({ status: 'error', message: 'Update failed' });
    }
});

// // this version deletes client nothing else
app.delete("/delete", async (request, response) => {
    const {username, password} = request.body;
    
    console.log("line 166 " + request.body.id)
    
    const userData = await usersData.findOne({$and: [
        { id: parseInt(request.body.id) },
        { userId: request.cookies['userId'] }
      ]});
    console.log("line 174 " + JSON.stringify(userData, null, 2));
    let objectId = userData._id

    usersData.deleteOne({_id: objectId})


    if (usersData.find({ _id: objectId }) === null) {
        console.log("deleted")
    }

    console.log(namesArray)

    response.writeHead(200, "OK", { "Content-Type": "application/json" })
    response.end(JSON.stringify({ status: 'success', message: 'Delete' }))
})


app.listen(process.env.PORT || port)