const	app = require('express'),
		router = app.Router();

const appData = [];

router.post("/log", (req, res) => {
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
