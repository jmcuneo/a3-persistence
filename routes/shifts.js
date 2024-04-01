const 	app = require('express'),
		{ connect, database } = require("../db/connection"),
		router = app.Router();


router.post("/add", async (req, res) => {
	const db = database();
	const userColl = db.collection("user-data");
	const userQuery = { user: req.user.username }
	const userResult = await userColl.findOne(userQuery);
	
	res.send(userResult).status(200);
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
