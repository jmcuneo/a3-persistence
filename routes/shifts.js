const 	app = require('express'),
		db = require("../db/connection"),
		router = app.Router();


router.post("/add", async (req, res) => {
	let collection = await db.collection("user-data");
	let results = await collection.find({}).toArray();
	res.send(results).status(200);
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
