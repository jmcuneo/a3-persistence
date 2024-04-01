const 	app = require('express'),
		{ connect, database } = require("../db/connection"),
		router = app.Router();


router.post("/add", async (req, res) => {
	const db = database();
	const userColl = db.collection("user-data");
	const userQuery = { user: req.user.username }
	
	let nextID = -1;

	userColl.find(userQuery).toArray((err, result) => {
		if (err) throw err;
		if (result) {
			// user already exists;
			nextID = (result.idLast) + 1;

		} else {
			// user does not exist
			userColl.insertOne({user: req.user.username, idLast: 0})
			nextID = 0;
		}
	});

	
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
