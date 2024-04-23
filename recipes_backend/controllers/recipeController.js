const asyncHandler = require("express-async-handler");
const Recipe = require("../models/recipeModel");
const status= require("express/lib/response");
const path = require("path");
const User = require("./userController")
//@desc Get all recipes
//@ route GET /recipes
//@access private
const getRecipes = asyncHandler(async (req)=>{
    const recipes = await Recipe.find();
    console.log(hello);
    //res.status(200).json(recipes);
});

//@desc Create new recipe
//@ route POST /recipes
//@access private
const createRecipe = asyncHandler(async (req)=>{
    console.log("Body")
    console.log(req.body)
    const{recipe_name, recipe_ingredients, recipe_description, recipe_taste, dietary_restriction} = req.body
    const recipe_id=Math.floor(Math.random() * 1000000001);
    console.log("Current User Details: ",User.currentUser);
    if(!recipe_name || !recipe_ingredients || !recipe_description){
        //res.status(400);
        // throw new Error("All fields are mandatory");
    }
    const user = req.session.user;
    const recipe = await Recipe.create({
        recipe_id: recipe_id, email:user.email, recipe_name, recipe_ingredients, recipe_description, recipe_taste, dietary_restriction,
        //recipe_id: req.user.id,
    });
    //res.status(200).json(recipe);
    console.log(recipe)
    return recipe;
});

//@desc Get particular recipe
//@ route GET /recipes/:id
//@access private
const getRecipe = asyncHandler(async (req)=>{
    console.log("Hello");
    //const recipe = await Recipe.findById(req.params.id);
    const user = req.session.user;
    const recipe = await Recipe.find({email: user.email});
    if(!recipe){
        //res.status(404);
        //throw new Error("Recipe Not Found");
    }
    console.log("Recipe: "+recipe);
    return recipe;
    //const htmlFile = path.join(__dirname, '../recipes_backend/html/main.html');
    //res.sendFile(htmlFile)
});

//@desc Update a recipe
//@ route PUT /recipes/:id
//@access private
const updateRecipe = asyncHandler(async (req, res)=>{
    // const recipe = await Recipe.findById(req.params.id);
    //const recipe = await Recipe.findById(123);
    console.log("Update Recipe Body: ", req.body.recipe_id);
    // if(!recipe){
    //     //res.status(404);
    //     //throw new Error("Recipe Not Found");
    // }
    // if(recipe.recipe_id.toString()!==req.user.id){
    //     //res.status(403);
    //     //throw new Error("Forbidden");
    // }
    const updatedRecipe = await Recipe.findOneAndUpdate(
        {
            recipe_id: req.body.recipe_id
        },
        req.body
    );
    res.status(200).json(updatedRecipe);
});

//@desc Delete a recipe
//@ route DELETE /recipes/:id
//@access private
const deleteRecipe = asyncHandler(async (id)=>{
    // const recipe = await Recipe.findById(req.params.id);
    console.log(id);
    //const recipe = await Recipe.findById(id);
    // if(!recipe){
    //     //res.status(404);
    //     // throw new Error("Recipe Not Found");
    // }
    // if(recipe.recipe_id.toString()!==req.user.id){
    //     //res.status(403);
    //     throw new Error("Forbidden");
    // }
    await Recipe.deleteOne({recipe_id:id});
    //await Recipe.deleteOne({id: req.params.id});
    // //res.status(200).json(recipe);
    const recipes = await Recipe.find();
    return recipes;
});

module.exports = {getRecipes, createRecipe, getRecipe, updateRecipe, deleteRecipe};