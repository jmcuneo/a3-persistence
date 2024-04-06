const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const JWT_SECRET = process.env.JWT_SECRET;

// Register User
async function register(req, res) {
  try {
    const { username, password } = req.body;
    const userExists = await User.findOne({ username });
    if (userExists) {
      // return res.status(400).json({ message: "User already exists" });
      return res.status(400).redirect("/register?message=User already exists");
    }

    const user = await User.create({ username, password });

    // Create a token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1d",
    });

    // save the token in a cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

    res.status(201).redirect("/");
  } catch (error) {
    // res.status(500).json({ message: error.message });
    res.status(500).redirect("/register?message=Internal Server Error");
  }
}

// Login User
async function login(req, res) {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      // return res.status(401).json({ message: "Username does not exist" });
      return res.status(401).redirect("/login?message=Username does not exist");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      // return res.status(401).json({ message: "Incorrect Password" });
      return res.status(401).redirect("/login?message=Incorrect Password");
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1d",
    });
    console.log("token after login: ", token);

    // save the token in a cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

    res.redirect("/");
  } catch (error) {
    // res.status(500).json({ message: error.message });
    res.status(500).redirect("/login?message=Internal Server Error");
  }
}

// logout User
async function logout(req, res) {
  res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
  res.redirect("/login");
}

module.exports = {
  register,
  login,
  logout,
};
