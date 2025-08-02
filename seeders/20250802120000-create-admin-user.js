'use strict';

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminId = uuidv4();

    await queryInterface.bulkInsert('users', [
      {
        id: adminId,
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        gender: 'male',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    console.log('Admin user created with:');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', {
      email: 'admin@example.com'
    });
  }
};
