"use strict";
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
class Blog extends Model {
  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'userId' });
    this.belongsTo(models.Category, { foreignKey: 'categoryId' });
    this.belongsTo(models.Country, { foreignKey: 'countryId' });
  }
}

Blog.init(
  {
    blogId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    author: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'userId',
      },
    },
    publicationDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(255),
    },
    category: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Category',
        key: 'categoryId',
      },
    },
    content: {
      type: DataTypes.TEXT,
      validate: {len:[0,500]},
    },
    video: {
      type: DataTypes.STRING(255),
    },
    keywords: {
      type: DataTypes.STRING(255),
    },
    country: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Country',
        key: 'countryId',
      },
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize, 
    modelName: 'Blog', 
    freezeTableName:true,
  }
);
return Blog;
};