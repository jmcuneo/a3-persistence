const 	app = require('express'),
		Shift = require("../models/shiftSchema")
		router = app.Router();


router.post("/add", async (req, res) => {
	const uri = process.env.MONGO;

	shift = req.body;
	shift.username=req.user.username;

	const shifts = await Shift.find();
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
