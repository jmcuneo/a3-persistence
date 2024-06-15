const 	app = require('express'),
		{ connect, database } = require("../db/connection"),
		{ getNextID } = require("../db/userData"),
		dayjs = require("dayjs"),
		router = app.Router();


router.post("/add", async (req, res) => {
	const db = database();

	// if the request doesnt have an ID, user wants to add a new shift.
	// create the new shift, and find the record for it.
	if (req.body.id == "") {
		let shiftID = await getNextID(req.user.username);
		const startDate = dayjs(req.body.start);
		const endDate = dayjs(req.body.end);
		const duration = endDate.diff(startDate, 'hour', true);
		const briefDesc = req.body.briefDesc;
		const doc = {
			id: shiftID.toString(),
			user: req.user.username,
			start: startDate.toString(),
			end: endDate.toString(),
			duration: duration.toString(),
			brief: briefDesc
		};
		await db.collection("shifts").insertOne(doc);
	} else {
		// use is requesting to update a shift
		const old = { id: req.body.id }
		const startDate = dayjs(req.body.start);
		const endDate = dayjs(req.body.end);
		const duration = endDate.diff(startDate, 'hour', true);
		const briefDesc = req.body.briefDesc; 
		const update = { $set: {start: startDate.toString(), 
								end: endDate.toString(), 
								duration: duration.toString(),
								brief: briefDesc}
						};
		await db.collection("shifts").updateOne(old, update)
	}
	
	// render the new shifts!
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
	// delete the requested shift !
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
	// render the shifts after deleting the shift
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
