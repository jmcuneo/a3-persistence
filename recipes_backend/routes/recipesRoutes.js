const express = require("express");
const router = express.Router();
const {getRecipes} = require("../controllers/recipeController")
const {createRecipe} = require("../controllers/recipeController")
const{getRecipe} = require("../controllers/recipeController")
const{updateRecipe} = require("../controllers/recipeController")
const{deleteRecipe} = require("../controllers/recipeController")

router.route("/").get(getRecipes);
router.route("/").post(createRecipe);
router.route("/:id").get(getRecipe);
router.route("/:id").put(updateRecipe);
router.route("/:id").delete(deleteRecipe);

module.exports = router;