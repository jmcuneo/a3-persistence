const 	app = require('express'),
		{ getAllShifts } = require("../controllers/shiftController"),
		router = app.Router();


router.post("/add", getAllShifts)

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
