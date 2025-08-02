'use strict';

const bcrypt = require('bcryptjs'); 
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
    const ADMIN_NAME = process.env.ADMIN_NAME || 'Admin User';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'; 

    
    // if (!process.env.ADMIN_PASSWORD && process.env.NODE_ENV === 'production') {
    //   console.error('❌ SEED ABORTED: ADMIN_PASSWORD is required in production.');
    //   return;
    // }

    
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
    const adminId = uuidv4();

    
    try {
      await queryInterface.bulkInsert(
        'users',
        [
          {
            id: adminId,
            name: ADMIN_NAME,
            email: ADMIN_EMAIL,
            password: hashedPassword, 
            role: 'admin',
            gender: 'male',
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null, 
          },
        ],
        {}
      );

      console.log('Admin user seeded successfully:');
    
    } catch (error) {
      console.error('Failed to seed admin user:', error);
      throw error; 
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      
      await queryInterface.bulkDelete('users', {
        email: process.env.ADMIN_EMAIL || 'admin@example.com',
      }, {});

      console.log('🗑️  Admin user removed during seed undo.');
    } catch (error) {
      console.error('❌ Failed to remove admin user:', error);
      throw error;
    }
  }
};