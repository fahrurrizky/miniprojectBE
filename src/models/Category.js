"use strict";
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
class Category extends Model {
  static associate(models) {
    this.hasMany(models.Blog, { foreignKey: "categoryId" });
  }
}

Category.init(
  {
    categoryId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
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
    modelName: 'Category', 
    freezeTableName:true,
  }
);
return Category;
};
