const express = require("express");
const errorHandler = require("./middleware/errorHandler")
const dotenv = require("dotenv").config();
const connectDb = require("./config/dbConnection")
const {getRecipes, createRecipe, deleteRecipe, updateRecipe, getRecipe} = require("./controllers/recipeController");
const {registerUser, loginUser, currentUser} = require("./controllers/userController");
const Recipe = require("./models/recipeModel");
const jwt = require("./middleware/validateTokenHandler")
const path = require('path');
const {all} = require("express/lib/application");
connectDb();
const app = express();
app.use(express.static('public'))
const port = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// app.use("/recipes", require("./controllers/recipeController"));
//app.use("/users", require("./routes/userRoutes"));
//app.use(errorHandler);
app.get("/", async (req,res) => {
    const htmlFile = path.join(__dirname, './public/html/register.html');
    res.sendFile(htmlFile)
});

app.get("/recipes", (req,res) => getRecipes(req,res))
app.post("/register", async (req, res) => registerUser(req,res))
app.post("/login", async (req, res) => loginUser(req,res))
app.get("/showLogin", async (req, res) =>
{ const htmlFile = path.join(__dirname, './public/html/index.html');
    res.sendFile(htmlFile)});
app.post("/CreateRecipes", async (req, res) =>{
    console.log(req.headers)
    let responseBody;
    responseBody= await createRecipe(req),
    console.log("Response Body (server):", responseBody),
    res.writeHead(200, {'Content-Type': 'application/json'})
    res.write(JSON.stringify(responseBody))
    res.end()
});
//{const{recipe_name, recipe_ingredients, recipe_description} = req.body;
// console.log(req.body);
//     if(!recipe_name || !recipe_ingredients || !recipe_description){
//     res.status(400);
//     throw new Error("All fields are mandatory");
// }
// const recipe = await Recipe.create({
//     recipe_name, recipe_ingredients, recipe_description,
//     // user_id: req.user.id,
// });
// res.status(200).json(recipe);
// res.sendFile( __dirname + './static/main.html' )
// });
app.delete("/DeleteRecipes",async (req, res) => deleteRecipe(req,res))
app.put("/UpdateRecipes",async (req, res) => updateRecipe(req,res))
app.get("/GetRecipe", async (req,res)=> {
    console.log(req.headers)
    const allRecipes = await getRecipe(req,res)
    res.writeHead(200, {'Content-Type': 'application/json'})
    res.write(JSON.stringify(allRecipes))
    res.status(200)
    res.end()
})
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
