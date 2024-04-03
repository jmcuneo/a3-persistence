const express = require("express");
const router = express.Router();
const {
  serveHomePage,
  serveLoginPage,
  serveRegisterPage,
} = require("../controllers/viewController");

router.get("/", serveHomePage);
router.get("/login", serveLoginPage);
router.get("/register", serveRegisterPage);

module.exports = router;
