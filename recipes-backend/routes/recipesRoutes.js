const express = require("express");
const router = express.Router();
router.route("/").get((req,res)=>{
    res.status(200).json({message: "Get all recipes"});
});

router.route("/").post((req,res)=>{
    res.status(200).json({message: "Create recipe"});
});

router.route("/:id").get((req,res)=>{
    res.status(200).json({message: `Get recipe for ${req.params.id}`});
});

router.route("/:id").put((req,res)=>{
    res.status(200).json({message: `Update recipe for ${req.params.id}`});
});

router.route("/:id").delete((req,res)=>{
    res.status(200).json({message: `Delete recipe for ${req.params.id}`});
});
module.exports = router;