const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const JWT_SECRET = process.env.JWT_SECRET;
const db = require("../models");
const User = db.User;
const { Op } = require("sequelize");

const validationLogin = () => {
  return [
    body("identifier")
      .notEmpty()
      .withMessage("UserName/Email/phoneNumber must be filled."),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ];
};

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { identifier, password } = req.body;

  try {
    // -------------------------------------------------------------------
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { userName: identifier },
          { email: identifier },
          { phoneNumber: identifier },
        ],
      },
    });
    // -------------------------------------------------------------------

    if (!user) {
      return res
        .status(401)
        .json({ message: "401: wrong userName/email/phoneNumber or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: "401: wrong userName/email/phoneNumber or password" });
    }

    const info_login = {
      userId: user.userId,
      userName: user.userName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      password: user.password,
      isverified: user.isverified,
    };

    const token = jwt.sign(
      {
        userId: user.userId,
        userName: user.userName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        isverified: user.isverified,
      },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return res.status(200).json({ message: "login success.", token, info_login });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "500: error" });
  }
};

module.exports = { validationLogin, login };