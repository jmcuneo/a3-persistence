const dotenv = require('dotenv')
const jwt = require('jsonwebtoken');
dotenv.config();

exports.generateAccessToken = function(username){
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}

exports.authenticateToken = function(req, res, next){
  console.log(req.headers);
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if(token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    console.log(err)
    if(err) return res.sendStatus(403)
    req.user = user;
    console.log(user)
    next()
  })
}