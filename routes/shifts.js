const 	app = require('express'),
		mongo = require("mongodb").MongoClient;
		router = app.Router();

const schema = require("../models/shiftSchema");


router.post("/add", (req, res) => {
	const uri = process.env.MONGO;

	mongo.connect(uri, function (err, db) {
		if (err) throw err;
		const dbo = db.db("webware");
		dbo.collection("shifts").find({}).toArray(function (err, result) {
			if (err) throw err;
			console.log(result);
			db.close();
		})
	})

	shift = req.body;

	if (appData.some(data => data.cID === course.cID)) {
		// course already exists, let's update the record :)
		const courseIndex = appData.findIndex(data => data.cID === course.cID);
		appData[courseIndex] = course;
	} else {
		appData.push(course);
	}
	console.log(appData);
	res.json(appData);
})

router.delete("/delete", (req, res) => {
	course = req.body;

	if (appData.some(data => data.cID === course.cID)) {
		console.log("course exists. deleting");
		const index = appData.findIndex(data => data.cID === course.cID);
		appData.splice(index, 1)
	} else {
		console.log("course does not exist");
	}

	res.json(appData);
})

module.exports = router;
