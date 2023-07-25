const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const express = require("express");
const app = express();
const port = 8000;
const db = require("./models");
const User = db.User;

// db.sequelize.sync({alter: true});

const { authRouter } = require("./Router");
// const profileRouter = require("./router/profileRouter.js");
const blogRouter = require("./Router/blogRouter");

app.use(express.json());
app.use("/api/auth", authRouter);
// app.use("/api/blog", blogRouter);
// app.use("/api/profile", profileRouter);
app.use("/api/blog", blogRouter);

app.listen(port, () => {
  console.log("Connected");
});
