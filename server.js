const	express = require("express"),
	  	app = express(),
		port = 3000;

app.use(express.static("views"));
app.use(express.static("public"));
app.use(express.json());

const appData = [];

app.post("/submit", (req, res) => {
	course = req.body;
	if (appData.some(data => data.cID === course.cID)) {
		// course already exists, let's update the record :)
		const courseIndex = appData.findIndex(data => data.cID === course.cID);
		appData[courseIndex] = course;
	} else {
		appData.push(course);
	}
	res.json(appData);
})

app.listen(port);
