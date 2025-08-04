'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    
    await queryInterface.addColumn('users', 'googleId', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true
    });

    
    await queryInterface.addColumn('users', 'photo', {
      type: Sequelize.STRING,
      allowNull: true
    });


    await queryInterface.addColumn('users', 'lastLogin', {
      type: Sequelize.DATE,
      allowNull: true
    });

    
  },

  async down(queryInterface, Sequelize) {
    

    await queryInterface.removeColumn('users', 'lastLogin');
    await queryInterface.removeColumn('users', 'photo');
    await queryInterface.removeColumn('users', 'googleId');
  }
};