const 	app = require('express'),
		{ connect, database } = require("../db/connection"),
		{ getNextID } = require("../db/userData"),
		dayjs = require("dayjs"),
		router = app.Router();


router.post("/add", async (req, res) => {
	const db = database();

	if (req.body.id == "") {
		let shiftID = await getNextID(req.user.username);
		const startDate = dayjs(req.body.start);
		const endDate = dayjs(req.body.end);
		const duration = endDate.diff(startDate, 'hour', true);
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
		const startDate = dayjs(req.body.start);
		const endDate = dayjs(req.body.end);
		const duration = endDate.diff(startDate, 'hour', true); 
		const update = { $set: {start: startDate.toString(), 
								end: endDate.toString(), 
								duration: duration.toString()}
						};
		await db.collection("shifts").updateOne(old, update)
	}
	
	const shifts = await db.collection("shifts").find({user: req.user.username}).toArray();
	shifts.forEach((shift) => {
		delete shift._id;
		delete shift.user;
	})
	console.log(shifts);

	res.locals.user = req.user.username;
	res.locals.shiftRecords = shifts;
	res.render("index");
})

router.post("/delete", async (req, res) => {
	const db = database();
	const coll = db.collection("shifts");
	console.log(req.body);
	const query = { id: req.body.removeID, user: req.user.username };
	console.log(query);
	const find = await coll.findOne(query);
	if (find) {
		const result = await coll.deleteOne({_id: find._id});
		if (result === 1) {
			console.log("success")
		} else {
			console.error("unsuccess");
		}
	}
	
	const shifts = await db.collection("shifts").find({user: req.user.username}).toArray();
	shifts.forEach((shift) => {
		delete shift._id;
		delete shift.user;
	})
	console.log(shifts);

	res.locals.user = req.user.username;
	res.locals.shiftRecords = shifts;
	res.render("index");
	
})



module.exports = router;
