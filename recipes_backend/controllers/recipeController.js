const asyncHandler = require("express-async-handler");
const Recipe = require("../models/recipeModel");
//@desc Get all recipes
//@ route GET /recipes
//@access private
const getRecipes = asyncHandler(async (req,res)=>{
    const recipes = await Recipe.find({user_id: req.user.id});
    res.status(200).json(recipes);
});

//@desc Create new recipe
//@ route POST /recipes
//@access private
const createRecipe = asyncHandler(async (req,res)=>{
    console.log("The request body is: ", req.body);
    const{recipe_name, recipe_ingredients, recipe_description} = req.body;
    if(!recipe_name || !recipe_ingredients || recipe_description){
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const recipe = await Recipe.create({
        recipe_name, recipe_ingredients, recipe_description,
        user_id: req.user.id,
    });
    res.status(200).json(recipe);
});

//@desc Get particular recipe
//@ route GET /recipes/:id
//@access private
const getRecipe = asyncHandler(async (req,res)=>{
    const recipe = await Recipe.findById(req.params.id);
    if(!recipe){
        res.status(404);
        throw new Error("Recipe Not Found");
    }
    res.status(200).json(recipe);
});

//@desc Update a recipe
//@ route PUT /recipes/:id
//@access private
const updateRecipe = asyncHandler(async (req,res)=>{
    const recipe = await Recipe.findById(req.params.id);
    if(!recipe){
        res.status(404);
        throw new Error("Recipe Not Found");
    }
    if(recipe.user_id.toString()!==req.user.id){
        res.status(403);
        throw new Error("Forbidden");
    }
    const updatedRecipe = await Recipe.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true}
    );
    res.status(200).json(updatedRecipe);
});

//@desc Delete a recipe
//@ route DELETE /recipes/:id
//@access private
const deleteRecipe = asyncHandler(async (req,res)=>{
    const recipe = await Recipe.findById(req.params.id);
    if(!recipe){
        res.status(404);
        throw new Error("Recipe Not Found");
    }
    if(recipe.user_id.toString()!==req.user.id){
        res.status(403);
        throw new Error("Forbidden");
    }
    await Recipe.remove();
    res.status(200).json(recipe);
});

module.exports = {getRecipes, createRecipe, getRecipe, updateRecipe, deleteRecipe};