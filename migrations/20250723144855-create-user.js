'use strict';

const { ENUM } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
         primaryKey:true,
         type:Sequelize.UUID,
         defaultValue:Sequelize.UUIDV4

      },
      name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING,
        unique:true
      },
      password: {
        type: Sequelize.STRING

      },
      role:{
        type:Sequelize.STRING,
        defaultValue:'user'

      },
      gender:{
        type:ENUM('male','female','other')

      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
       deletedAt: {
          type: Sequelize.DATE,
          allowNull: true,

        },

    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};