const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = function (req, res, next) {
  // Check for the token being sent in three different ways
  let token =
    req.get("Authorization") ||
    req.query.token ||
    req.body.token ||
    req.cookies.token;
  if (token) {
    // Remove the 'Bearer ' if it was included in the token header
    token = token.replace("Bearer ", "");
    // Check if token is valid and not expired
    jwt.verify(token, JWT_SECRET, function (err, decoded) {
      if (err) {
        next(err);
      } else {
        // It's a valid token, so add user to req
        req.user = decoded.userId;
        next();
      }
    });
  } else {
    // No token was sent
    next();
  }
};
