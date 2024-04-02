const express = require("express");
const errorHandler = require("./middleware/errorHandler")
const dotenv = require("dotenv").config();
const connectDb = require("./config/dbConnection")
connectDb().then((connection) => {
    const app = express();
    const port = process.env.PORT;
    app.use(express.json());
    app.use("/recipes", require("./routes/recipesRoutes"));
    app.use(errorHandler);
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
})
