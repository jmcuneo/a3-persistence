const path = require("path");

const serveHomePage = (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/index.html"));
};

const serveLoginPage = (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/login.html"));
};

const serveRegisterPage = (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/register.html"));
};

module.exports = {
  serveHomePage,
  serveLoginPage,
  serveRegisterPage,
};
