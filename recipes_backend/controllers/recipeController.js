const asyncHandler = require("express-async-handler");
const Recipe = require("../models/recipeModel");
//@desc Get all recipes
//@ route GET /recipes
//@access public
const getRecipes = asyncHandler(async (req,res)=>{
    const recipes = Recipe.find();
    res.status(200).json(recipes);
});

//@desc Create new recipe
//@ route POST /recipes
//@access public
const createRecipe = asyncHandler(async (req,res)=>{
    console.log("The request body is: ", req.body);
    const{recipe_name, recipe_ingredients, recipe_description} = req.body;
    if(!recipe_name || !recipe_ingredients || recipe_description){
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    res.status(200).json({message: "Create recipe"});
});

//@desc Get particular recipe
//@ route GET /recipes/:id
//@access public
const getRecipe = asyncHandler(async (req,res)=>{
    res.status(200).json({message: `Get recipe for ${req.params.id}`});
});

//@desc Update a recipe
//@ route PUT /recipes/:id
//@access public
const updateRecipe = asyncHandler(async (req,res)=>{
    res.status(200).json({message: `Update recipe for ${req.params.id}`});
});

//@desc Delete a recipe
//@ route DELETE /recipes/:id
//@access public
const deleteRecipe = asyncHandler(async (req,res)=>{
    res.status(200).json({message: `Delete recipe for ${req.params.id}`});
});

module.exports = {getRecipes, createRecipe, getRecipe, updateRecipe, deleteRecipe};