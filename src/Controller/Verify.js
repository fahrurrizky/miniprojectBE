const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.User;
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const verificationTokens = new Map();

const verify = async (req, res) => {
  try {
    const token = req.headers.authorization.replace("Bearer ", "");

    if (verificationTokens.has(token)) {
      const expirationTime = verificationTokens.get(token);
      if (expirationTime < Date.now()) {
        return res.status(401).json({
          message: "Your token has been used.",
        });
      }
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userName = decoded.userName;

    const [updatedCount] = await User.update(
      { isVerified: true },
      {
        where: { userName },
      }
    );

    if (updatedCount === 0) {
      return res.status(404).json({
        message: "The user doesn't exist, or the account has been verified",
      });
    }

    verificationTokens.set(token, decoded.exp * 10);

    console.log(verificationTokens);
    return res.status(200).json({ message: "Email verification successful." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while processing email verification.",
      token: error,
    });
  }
};

module.exports = verify;