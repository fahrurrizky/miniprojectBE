// const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.User;
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
// const JWT_SECRET = process.env.JWT_SECRET;


const verify = async (req, res) => {
  try {
    const token = req.headers.authorization.replace("Bearer ", "");

    const userName = req.user.userName;
    console.log(userName)

    const updatedCount = await User.update(
      { isVerified: true },
      {
        where: { userName },
      }
    );

    if (updatedCount === 0) {
      return res.status(404).json({
        message: "User does not exist/Account has been verified.",
      });
    }

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