const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const db = require("../models");
const User = db.User;
const JWT_SECRET = process.env.JWT_SECRET;
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: process.env.userHotmail,
    pass: process.env.passHotmail,
  },
});

// Helper function to get the decoded user ID from the JWT token
const getDecodedUserIdFromToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.userId;
  } catch (err) {
    throw new Error("Invalid authorization token");
  }
};

// Helper function to send the username change notification email
const sendChangeUsernameEmail = async (email) => {
  const mailOptions = {
    from: process.env.userHotmail,
    to: email,
    subject: "Username Change Notification",
    html: `
      <html>
        <body>
          <h1>Welcome to Beeyond The Pages</h1>
          <p>Hello,</p>
          <p>Your username has been successfully changed &#128536</p>
          <p>Best regards,</p>
          <p>My Bee &#128536</p>
        </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

const validateChangeUsername = () => {
  return [
    body("currentUsername").notEmpty().withMessage("Current username is required"),
    body("newUsername").notEmpty().withMessage("New username is required"),
  ];
};

const changeUsername = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { currentUsername, newUsername } = req.body;
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Missing authorization token" });
  }

  try {
    const userId = getDecodedUserIdFromToken(token);
    const user = await User.findOne({ where: { userId: userId } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.userName !== currentUsername) {
      return res.status(401).json({ error: "Incorrect current Username / Username not found" });
    }

    const existingUser = await User.findOne({ where: { userName: newUsername } });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    await User.update({ userName: newUsername }, { where: { userId: userId } });

    await sendChangeUsernameEmail(user.email);

    return res.status(200).json({ message: "Username changed successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Error updating username in the database" });
  }
};

module.exports = {
  changeUsername,
  validateChangeUsername,
};
