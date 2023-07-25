const express = require("express");
const { verifyToken } = require("../middleware/verify");
const { multerUpload } = require("../middleware/multer");
const blogController = require("../Controller/Create-Get-Blog");

const blogRouter = express.Router();
blogRouter.use(express.json());

blogRouter.post(
  "/create",
  verifyToken,
  multerUpload.single("blog"),
  blogController.createBlog
);

blogRouter.get("/get/:blogId", blogController.getBlogById);
blogRouter.get("/get", blogController.getBlogbyQuery);

module.exports = blogRouter;
