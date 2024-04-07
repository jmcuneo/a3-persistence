const express = require("express"),
			cookie = require("cookie-session"),
			bcrypt = require("bcrypt"),
			url = require("url"),
			app = express(),
			{ MongoClient, ObjectId } = require("mongodb")

require("dotenv").config({ path:".env"})

app.use( express.json())

const uri = `mongodb+srv://${process.env.MONGOUSER}:${process.env.PASS}@${process.env.HOST}`;
console.log(uri)
const client = new MongoClient(uri);

let reportCollection = null;


app.use(express.urlencoded({extended:true}))

app.use( cookie({
	name: "session",
	keys: [process.env.KEY1, process.env.KEY2]
}))

async function authHelper(collection, req, res) {

		const user = await collection.findOne({
			username: req.body.username
		})

		if (user != null) {
			console.log(user)
			bcrypt.compare(req.body.password, user.password, function(err, result) {
				if (result) {
					req.session.login = true
					req.session.username = user.username
					res.redirect("main.html")
				}
				else {
					console.log("invalid password!")
					res.send("<script>alert(\"invalid password!\"); window.location.href=\"/\"; </script>");
				}
			})
		}
		else {
			console.log("invalid username");
			let password = "";
			bcrypt.hash(req.body.password, 10, async function(err,hash){
				console.log(hash);
				let newEntry = {username: req.body.username, password: hash};
				const newUser = await collection.insertOne(newEntry);
			})
			res.send("<script>alert(\"Account created! Please log in!\"); window.location.href=\"/\"; </script>");
		}
}

function auth() {
	client.connect();
	console.log("test");
	userCollection = client.db("StormReports").collection("users");

	app.post("/login", (req, res) => {
		console.log("login: " + req.body.username)
		authHelper(userCollection, req, res)	
	})
	
}

auth()

app.use( function (req,res,next) {
	// check for robots.txt to not make lighthouse mad
	if (req.session.login === true || url.parse(req.url).pathname === "/robots.txt") next()
	else res.sendFile(__dirname + "/public/index.html")
})

app.use( express.static("public"));

async function run() {
	await client.connect();
	reportCollection = await client.db("StormReports").collection("reports");
	userCollection = await client.db("StormReports").collection("users");

	app.post("/get", async(req, res) => {
		console.log("get")
		if (reportCollection !== null) {
			console.log(req.session.username)
			const docs = await reportCollection.find({
				user: req.session.username
			}).toArray()
			res.json( docs )
		}
	})

	app.post('/submit', async(req, res) => {
		console.log(req.body)
		let newEntry = req.body
		
		// this date function is silly because it will never update. i could implement it better but not right now.
		let eventDate = new Date(newEntry.date)
		let currentDate = new Date()
		currentDate.setHours(0,0,0,0)

		let timeDiff = currentDate.getTime()-eventDate.getTime()
		let dateDiff = Math.round(timeDiff / (1000 * 3600 * 24))

		newEntry.dateDiff = dateDiff
		
		let uniqueid = null

		if (newEntry.hasOwnProperty("_id")) {
			docid = newEntry._id
			delete newEntry["_id"]
			const response = await reportCollection.replaceOne(
				{_id:new ObjectId(docid), user:req.body.user},
				newEntry
			)
			uniqueid = docid
		}
		else {
			newEntry.user = req.session.username
			uniqueid = await reportCollection.insertOne(newEntry)
		}
		console.log(uniqueid)
		res.writeHead(200, {"Content-Type": "text/plain"})
		res.end("added or modified " + uniqueid)
	})

	app.post("/delete", async (req,res) => {
		console.log(req.body.delid)
		const result = await reportCollection.deleteOne({
			_id:new ObjectId( req.body.delid), user: req.session.username
		})
		console.log(result)

		res.writeHead(200, {"Content-Type": "text/plain"})
		res.end("removed "+ req.body.delid)
	})


}

run()



app.listen( process.env.PORT || 3000 )
