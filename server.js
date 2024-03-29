const	express = require("express"),
	  	app = express(),
		port = 3000;

const coursesRouter = require("./routes/courses");

app.set("view engine", "pug");
app.set("views", "./views");
app.use(express.json());

app.use("/courses", coursesRouter);
app.use(express.static("views"));
app.use(express.static("public"));



app.listen(port);