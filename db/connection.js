const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = process.env.MONGO;
const mongo = MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true
	},
});

try {
	await mongo.connect();
	await mongo.db("webware").command({ping: 1});
	console.log("Pinged db");
} catch (err) {
	console.log(err);
}

let db = client.db("webware");

export default db;