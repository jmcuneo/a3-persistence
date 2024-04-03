const mongoose = require("mongoose");
const recipeSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    recipe_name: {
        type: String,
        required: [true, "Please add the recipe name"],
    },
    recipe_ingredients: {
        type: String,
        required: [true, "Please add the recipe list of ingredients"],
    },
    recipe_description: {
        type: String,
        required: [true, "Please add the recipe description"],
    }
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Recipe", recipeSchema);