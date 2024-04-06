const express = require("express");
const router = express.Router();
const viewCtrl = require("../controllers/viewController");

router.get("/", viewCtrl.serveHomePage);
router.get("/login", viewCtrl.serveLoginPage);
router.get("/register", viewCtrl.serveRegisterPage);

module.exports = router;
