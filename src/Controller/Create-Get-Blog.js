const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const db = require("../models");
const Blog = db.Blog;

const setPagination = (page, limit) => {
  const offset = (page - 1) * limit;
  return {
    offset,
    limit: parseInt(limit),
  };
};

const blogController = {
  getBlogById: async (req, res) => {
    const { blogId } = req.params;

    try {
      const blog = await Blog.findOne({
        where: { blogId },
        include: [{ model: db.Category }],
      });
      if (!blog) return res.status(404).json("data isn't found");

      res.status(200).json({ message: "successfully get data", data: blog });
    } catch (err) {
      res.status(500).json({ message: "data failed to fetch" });
    }
  },

  createBlog: async (req, res) => {
    const { title, content, video, keywords, category, country } = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decode.userId;
    try {
      await db.sequelize.transaction(async (t) => {
        const result = await Blog.create(
          {
            title,
            author: userId,
            publicationDate: new Date(),
            image: req.file.path,
            category,
            content,
            video,
            keywords,
            country,
          },
          { transaction: t }
        );
        return res
          .status(200)
          .json({ message: "Blog created successfully", data: result });
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  getBlogbyQuery: async (req, res) => {
    const { title, category, orderBy, page = 1, limit = 10 } = req.query;

    const whereClause = {};
    if (title) whereClause.title = { [db.Sequelize.Op.like]: `%${title}%` };
    if (category) whereClause.category = category;

    const pagination = setPagination(page, limit);

    console.log(page, limit);

    try {
      const blog = await Blog.findAll({
        attributes: { exclude: ["userId","countryId","categoryId","Category","Country"] },
        where: whereClause,
        include: [{ model: db.Category }, { model: db.Country }],
        order: [["createdAt", orderBy || "DESC"]],
        ...pagination,
      });
      res
        .status(200)
        .json({ message: "successfully get data", page, limit, data: blog });
    } catch {
      res.status(500).json({ message: "data failed to fetch" });
    }
  },
};

module.exports = blogController;
