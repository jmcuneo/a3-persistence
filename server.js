const	express = require("express"),
	  	app = express(),
		port = 3000;

const coursesRouter = require("./routes/courses");

app.use("/courses", coursesRouter);
app.use(express.static("views"));
app.use(express.static("public"));
app.use(express.json());



app.listen(port);
