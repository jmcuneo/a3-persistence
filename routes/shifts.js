const 	app = require('express'),
		{ connect, database } = require("../db/connection"),
		{ getNextID } = require("../db/userData"),
		dayjs = require("dayjs"),
		router = app.Router();


router.post("/add", async (req, res) => {
	const db = database();

	if (!req.body.id) {
		let shiftID = await getNextID(req.user.username);
		console.log(shiftID);
		const startDate = dayjs(req.body.start);
		const endDate = dayjs(req.body.end);
		const duration = startDate.diff(endDate, 'day', true);
		const doc = {
			id: shiftID.toString(),
			user: req.user.username,
			start: startDate.toString(),
			end: endDate.toString(),
			duration: duration.toString()
		};
		await db.collection("shifts").insertOne(doc);
	} else {
		const old = { id: req.body.id }
		const update = { $set: {date: req.body.date, 
								start: req.body.start, 
								end: req.body.end}
						};
		await db.collection("shifts").updateOne(old, update)
	}
	
	const shifts = await db.collection("shifts").find({}).toArray();
	shifts.forEach((shift) => {
		delete shift._id;
		delete shift.user;
	})
	console.log(shifts);

	res.locals.user = req.user.username;
	res.locals.shiftRecords = shifts;
	res.render("index");
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
