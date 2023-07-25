const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const db = require("../models");
const User = db.User;
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: process.env.userHotmail,
    pass: process.env.passHotmail,
  },
});

const validateForgotPassword = () => {
  return [body("email").isEmail().withMessage("Email not Found")];
};

const sendResetPassword = async (email) => {
  const user = await User.findOne({
    where: { email: email },
  });
  const token = jwt.sign(
    {
      userId: user.userId,
      userName: user.userName,
      email: user.email,
      phoneNumber: user.phoneNumber,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  const mailOptions = {
    from: process.env.userHotmail,
    to: email,
    subject: "Password Reset Request",
    html: `<html>
    <body>
      <h1>Welcome to Beeyond The Pages</h1>
      <p>Hello</p>
      <p>You have requested a link to reset your password. Please click the button
      below to reset your password:</p>
      <a href="http://localhost:8000/verify/${token}"
            style="
              display: inline-block;
              text-decoration: solid;
              padding: 13px;
              background-color: #08807a;
              border: #000000 solid 2px;
              color: #000000;
              font-size: 17px;
              border-radius: 4px;"
              >Reset Password</a>
      <p>Best regards,</p>
      <p>My Bee &#128536</p>
    </body>
  </html>`,
  };
  await transporter.sendMail(mailOptions);
};

const forgotPassword = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;

  try {
    const user = await User.findOne({
      where: { email: email },
    });

    if (!user) {
      return res.status(404).json({ error: "Email not registered" });
    }

    await sendResetPassword(email);
    res
      .status(200)
      .json({ message: "Link to reset password sent successfully!" });
  } catch (error) {
    console.error("Failed to send an email:", error);
    res.status(500).json({ error: "Failed to send an email" });
  }
};

module.exports = { validateForgotPassword, forgotPassword };
