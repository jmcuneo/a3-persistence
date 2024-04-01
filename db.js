const { MongoClient } = require("mongodb");

const uri = process.env.MONGO;

const mongoClient = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

const connect = async() => {
	try {
		await mongoClient.connect();
	} catch (err) {
		console.error("Mongo connection error", err);
	}
};

module.exports = connect;