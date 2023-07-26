const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const db = require("../models");
const User = db.User;
const JWT_SECRET = process.env.JWT_SECRET;
const nodemailer = require("nodemailer");

const validateChangePhone = () => {
  return [
    body("currentPhone").notEmpty().withMessage("Current phone number is required"),
    body("newPhone").notEmpty().withMessage("New phone number is required"),
  ];
};

const sendPhoneChangeEmail = async (email) => {
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
    subject: "Notification of Change of Phone Number",
    html: `
      <html>
          <body>
            <h1>Welcome to Beeyond The Pages</h1>
            <p>Hello,</p>
            <p>Your phone number has been successfully changed &#128536</p>
            <p>Best regards,</p>
            <p>My Bee &#128536</p>
          </body>
        </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

const changePhone = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { currentPhone, newPhone } = req.body;
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Missing authorization token" });
  }

  let userName;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    userName = decoded.userName;

  } catch (err) {
    return res.status(401).json({ error: "Invalid authorization token" });
  }

  try {
    const user = await User.findOne({ where: { userName: userName } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.phoneNumber !== currentPhone) {
      return res.status(401).json({ error: "Incorrect current phone number" });
    }

    const updatedUser = await User.update(
        {phoneNumber: newPhone },
        {where: {userName:userName}},
        );

    await sendPhoneChangeEmail(user.email);

    return res.status(200).json({ message: "Phone number change successful", updatedUser });
  } catch (error) {
    return res.status(500).json({ error: "Error updating phone number in the database" });
  }
};

module.exports = {
  changePhone,
  validateChangePhone,
};