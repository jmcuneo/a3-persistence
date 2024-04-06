const path = require("path");

const serveHomePage = (req, res) => {
  // if user is not logged in, redirect to login page
  if (!req.user) {
    return res.redirect("/login");
  }
  res.sendFile(path.join(__dirname, "../../public/index.html"));
};

const serveLoginPage = (req, res) => {
  // if user is already logged in, redirect to home page
  if (req.user) {
    return res.redirect("/");
  }
  res.sendFile(path.join(__dirname, "../../public/login.html"));
};

const serveRegisterPage = (req, res) => {
  // if user is already logged in, redirect to home page
  if (req.user) {
    return res.redirect("/");
  }
  res.sendFile(path.join(__dirname, "../../public/register.html"));
};

module.exports = {
  serveHomePage,
  serveLoginPage,
  serveRegisterPage,
};
