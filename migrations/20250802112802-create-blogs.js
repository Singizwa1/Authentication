'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

  await queryInterface.createTable('blogs',{
    id:{
      primaryKey:true,
      type:Sequelize.UUID,
      defaultValue:Sequelize.UUIDV4

    },
    slug:Sequelize.STRING,
    title:Sequelize.STRING,
    description:Sequelize.TEXT,
    content:Sequelize.TEXT,
    author:Sequelize.STRING,
  
    isPublished:Sequelize.BOOLEAN,
    

    createdAt:{
      allowNull:false,
     type:Sequelize.DATE 
    },
    updatedAt:{
      allowNull:false,
      type:Sequelize.DATE,
    },
    deletedAt:{
      allowNull:true,
      type:Sequelize.DATE,
    }



  });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('blogs');
    
  }
};
