const express = require("express");
const errorHandler = require("./middleware/errorHandler")
const dotenv = require("dotenv").config();
const connectDb = require("./config/dbConnection")
const {getRecipes, createRecipe, deleteRecipe, updateRecipe} = require("./controllers/recipeController");
connectDb();
const app = express();
const port = process.env.PORT;
app.use(express.json());
//app.use("/recipes", require("./routes/recipesRoutes"));
//app.use("/users", require("./routes/userRoutes"));
app.use(errorHandler);
app.get("/recipes", (req,res) => getRecipes(req,res))
app.post("/CreateRecipes", (req, res) => createRecipe(req,res))
app.delete("/DeleteRecipes",(req, res) => deleteRecipe(req,res))
app.put("/UpdateRecipes",(req, res) => updateRecipe(req,res))
app.get("/", (req,res) =>  res.sendFile( __dirname + '/static/html/main.html' ));
app.get("/test", (req,res) =>{
    const data = req.body
    res.sendFile( __dirname + '/templates/base.html' )});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
