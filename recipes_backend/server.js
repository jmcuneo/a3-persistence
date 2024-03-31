const express = require("express");
const errorHandler = require("./middleware/errorHandler")
const dotenv = require("dotenv").config();
connectDb();
const app = express();
const port = process.env.PORT;
app.use(express.json());
app.use("/recipes", require("./routes/recipesRoutes"));
app.use(errorHandler);
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});