//@desc Get all recipes
//@ route GET /recipes
//@access public
const getRecipes = (req,res)=>{
    res.status(200).json({message: "Get all recipes"});
};

//@desc Create new recipe
//@ route POST /recipes
//@access public
const createRecipe = (req,res)=>{
    console.log("The request body is: ", req.body);
    res.status(200).json({message: "Create recipe"});
};

//@desc Get particular recipe
//@ route GET /recipes/:id
//@access public
const getRecipe = (req,res)=>{
    res.status(200).json({message: `Get recipe for ${req.params.id}`});
};

//@desc Update a recipe
//@ route PUT /recipes/:id
//@access public
const updateRecipe = (req,res)=>{
    res.status(200).json({message: `Update recipe for ${req.params.id}`});
};

//@desc Delete a recipe
//@ route DELETE /recipes/:id
//@access public
const deleteRecipe = (req,res)=>{
    res.status(200).json({message: `Delete recipe for ${req.params.id}`});
};

module.exports = {getRecipes, createRecipe, getRecipe, updateRecipe, deleteRecipe};