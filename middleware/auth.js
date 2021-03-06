const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const router = require("../routes/auth");

dotenv.config({ path: '../config/config.env' });

module.exports = (req, res, next) => {
  // Read the token from the cookie
  const token = req.cookies.token;
  if (!token)
  return res.status(401).json({ message: "Unauthorized" });
  try {
    // Verify token is valid (headers - payload - signature) using secret
    const decoded = jwt.verify(token, 'secret');
    req.user = decoded;
    next();
  } catch (err) {
    // Incase of expired jwt or invalid token kill the token and clear the cookie
    res.clearCookie("token");
    return res.status(400).send(err.message);
  }
};
