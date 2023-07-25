'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Blog', {
      blogId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      author: {
        type: Sequelize.INTEGER,
        references: {
          model: 'User',
          key: 'userId',
        },
      },
      publicationDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      image: {
        type: Sequelize.STRING(255),
      },
      category: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Category',
          key: 'categoryId',
        },
      },
      content: {
        type: Sequelize.TEXT,
      },
      video: {
        type: Sequelize.STRING(255),
      },
      keywords: {
        type: Sequelize.STRING(255),
      },
      country: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Country',
          key: 'countryId',
        },
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Blog');
  }
};