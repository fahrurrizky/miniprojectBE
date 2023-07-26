const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const db = require("../models");
const User = db.User;
const nodemailer = require("nodemailer");

// Helper function to check if a user exists in the database
const checkUserExists = async (field, value) => {
  const user = await User.findOne({ where: { [field]: value } });
  return user;
};

// Helper function to hash the password
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// Helper function to create a new user
const createUser = async (userName, email, password, phoneNumber) => {
  await db.sequelize.sync({ alter: true });
  const hashedPassword = await hashPassword(password);
  const newUser = await User.create({
    userName,
    email,
    password: hashedPassword,
    phoneNumber,
  });
  return newUser;
};

// Helper function to send verification link via email
const sendVerificationEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
      user: process.env.userHotmail,
      pass: process.env.passHotmail,
    },
  });

  const mailOptions = {
    from: process.env.userHotmail,
    to: email,
    subject: "New Account Registration",
    html: `<html>
            <body>
              <h1>Welcome to Beeyond The Pages</h1>
              <p>Hello</p>
              <p>You have successfully registered, the next step is to verify by clicking the button below:</p>
              <a href="http://localhost:8000/verify/${token}"
              style="display: inline-block; text-decoration: solid; padding: 13px; background-color: #08807a; border: #FFFFFF solid 2px; color: #FFFFFF; font-size: 17px; border-radius: 4px;">
              Verification</a>
              <p>Thank you, Welcome to Beeyond The Pages</p>
              <p>Best regards</p>
              <p>My Bee &#128536</p>
            </body>
          </html>`,
  };

  await transporter.sendMail(mailOptions);
};

// Validation rules function
const validationRules = () => {
  return [
    body("userName").notEmpty().custom(async (value) => {
      const user = await checkUserExists("userName", value);
      if (user) throw new Error("Username already exists");
    }),
    body("email").isEmail().withMessage("Invalid email format").custom(async (value) => {
      const user = await checkUserExists("email", value);
      if (user) throw new Error("Email already registered");
    }),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/)
      .withMessage("Password must contain at least 1 symbol, 1 uppercase letter, and 1 number")
      .notEmpty(),
    body("confirmPassword").custom((value, { req }) => {if (value !== req.body.password) {
      throw new Error("Passwords do not match");}
      return true;
      }),
    body("phoneNumber").isLength({ max: 12 }).withMessage("Phone number cannot exceed 12 characters").notEmpty(),
  ];
};

// Registration function
const register = async (req, res) => {
  const token = jwt.sign(
    {
      userName: req.body.userName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      isverified: false,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { userName, email, password, phoneNumber } = req.body;

  try {
    const newUser = await createUser(userName, email, password, phoneNumber);
    await sendVerificationEmail(email, token);
    return res.status(200).json({ success: true, user: newUser, message: "Registration success, please check your email for verification!", token });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Registration failed" });
  }
};

module.exports = { register, validationRules };
