"use strict";
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
class Country extends Model {
  static associate(models) {
    this.hasMany(models.Blog, { foreignKey: "countryId" });
  }
}

Country.init(
  {
    countryId: {
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
    modelName: 'Country', 
    freezeTableName:true,
  }
);
return Country;
};
