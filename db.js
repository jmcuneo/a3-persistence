const mongoose = require("mongoose");

const uri = process.env.MONGO;

mongoose.connect(uri, {
	useNewUrlParse: true,
	useUnifiedTopology: true,
}).then(() => {
	console.log("Connected to Mongo");
}).catch((error) => {
	console.error("Error connecting to Mongo", error);
});