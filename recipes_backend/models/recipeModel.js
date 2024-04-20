const mongoose = require("mongoose");
const recipeSchema = mongoose.Schema({
    recipe_id: {
        //type: mongoose.Schema.Types.ObjectId,
        type: Number,
        required: true,
        //default: 123,
        ref: "User",
    },
    email: {
        type: String,
        required: [true, "Please add the user email"],
    },
    // user_id: {
    //     type: Number,
    //     required: [true, "Please add the user id"]
    // },
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
    },
    recipe_taste: {
        type: String,
        required: [true, "Please add the recipe taste"],
    },
    dietary_restriction: {
        type: String,
        required: [true, "Please add the dietary restriction"],
    },
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Recipe", recipeSchema);