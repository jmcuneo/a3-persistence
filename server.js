require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");

// if development, use custom logger
if (process.env.NODE_ENV === "development") {
  app.use(require("./src/utils/logger"));
}

app.use(express.static(path.join(__dirname, "public/assets")));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

require("./src/config/database");

app.use(require("./src/config/auth")); // for req.user all over the app

/* routes */
app.use("/", require("./src/routes/viewRoute"));
app.use("/todos", require("./src/routes/todoRoute"));
app.use("/auth", require("./src/routes/userRoute"));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
