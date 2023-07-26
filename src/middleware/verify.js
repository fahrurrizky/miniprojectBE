const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const verifyToken = (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) {
    return res.status(401).send("Access Denied!");
  }
  try {
    token = token.split(" ")[1];
    if (token === "null" || !token) {
      return res.status(401).send("Access Denied!");
    }
    let verifiedUser = jwt.verify(token, process.env.JWT_SECRET);
    if (!verifiedUser) {
      return res.status(401).send("Unauthorized request");
    }
    req.user = verifiedUser;
    console.log(req.user);
    next();
  } catch (err) {
    return res.status(400).send("Invalid Token");
  }
};

const checkRole = async (req, res, next) => {
  if (req.user) {
    return next();
  }
  return res.status(401).send("unauthorized");
};

module.exports = {
  verifyToken,
  checkRole,
};
