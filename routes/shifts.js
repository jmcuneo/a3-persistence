const 	app = require('express'),
		{ connect } = require("../db");
		router = app.Router();


router.post("/add", async (req, res) => {
	const mongo = connect();
	const dbo = mongo.db("webware");

	const coll_user = dbo.collection("user-data");
	const user_query = {user: req.user.username};
	const user_result = await coll_user.findOne(user_query);
	console.log(user_result);

	// const shift = req.body;
	// shift.username=req.user.username;
	// const shifts = await Shift.find({});
	// console.log(shifts);
	
	// res.locals.user = req.user.username;
	// res.locals.shiftRecords = shifts;
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
