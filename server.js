require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const morgan = require("morgan");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

require("./src/config/database");

app.use(morgan("dev"));

/* routes */
app.use("/todos", require("./src/routes/todoRoute"));
app.use("/", require("./src/routes/viewRoute"));

const port = 3000 || process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
