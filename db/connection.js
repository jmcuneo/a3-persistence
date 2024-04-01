const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = process.env.MONGO;
const mongo = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true
	},
});

const connect = async () => {
	try {
		await mongo.connect();
		await mongo.db("webware").command({ping: 1});
		console.log("Pinged db");
	} catch (err) {
		console.log(err);
	}
}

const database = () => {
	return mongo.db("webware");
}

module.exports = { connect, database }