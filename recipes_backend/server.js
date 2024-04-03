const express = require("express");
const errorHandler = require("./middleware/errorHandler")
const dotenv = require("dotenv").config();
const connectDb = require("./config/dbConnection")
connectDb();
const app = express();
const port = process.env.PORT;
app.use(express.json());
app.get("/", (req,res) => res.sendFile("../templates/index.html"))
app.use("/recipes", require("./routes/recipesRoutes"));
app.use("/users", require("./routes/userRoutes"));
app.use(errorHandler);
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
