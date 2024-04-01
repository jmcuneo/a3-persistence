const 	app = require('express'),
		{ connect, database } = require("../db/connection"),
		{ getNextID } = require("../db/userData"),
		router = app.Router();


router.post("/add", async (req, res) => {
	const db = database();
	let respon = await getNextID();
	console.log(respon);
	

	
	res.json(respon).status(200);
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
