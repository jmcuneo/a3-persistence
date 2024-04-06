const express = require("express");
const router = express.Router();
const usersCtrl = require("../controllers/userController");

router.post("/register", usersCtrl.register);
router.post("/login", usersCtrl.login);
router.get("/logout", usersCtrl.logout);

module.exports = router;
