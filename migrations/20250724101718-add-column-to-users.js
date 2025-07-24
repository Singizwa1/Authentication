'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    
    await queryInterface.addColumn('Users', 'googleId', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true
    });

    
    await queryInterface.addColumn('Users', 'photo', {
      type: Sequelize.STRING,
      allowNull: true
    });


    await queryInterface.addColumn('Users', 'lastLogin', {
      type: Sequelize.DATE,
      allowNull: true
    });

    
  },

  async down(queryInterface, Sequelize) {
    

    await queryInterface.removeColumn('Users', 'lastLogin');
    await queryInterface.removeColumn('Users', 'photo');
    await queryInterface.removeColumn('Users', 'googleId');
  }
};