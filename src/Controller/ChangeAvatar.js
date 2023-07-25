const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const db = require("../models");
const User = db.User;

const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Missing authorization token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userName = decoded.userName;

    const filePath = req.file.path;

    await User.update(
      { profilePicture: filePath },
      { where: { userName: userName } }
    );

    return res.status(200).json({ message: "Upload avatar successful!" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Error uploading avatar", token: error });
  }
};

module.exports = uploadAvatar;
