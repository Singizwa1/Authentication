// src/database/db.ts
import databaseConfig from '../config/config';
import { Sequelize } from 'sequelize';
import { AllModal } from '../models/index';

interface ConfigInterface {
  username: string;
  password: string;
  database: string;
  port: number;
  host: string;
}

const db_config = databaseConfig() as ConfigInterface;

const sequelize = new Sequelize({
  ...db_config,
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false, 
});

sequelize.authenticate()
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch(err => {
    console.error('❌ Database connection error:', err);
  });


const models = AllModal(sequelize);

sequelize.sync({ alter: true }) 
  .then(() => {
    console.log('✅ Models synchronized');
  })
  .catch(err => {
    console.error('❌ Model synchronization error:', err);
  });

Object.values(models).forEach(model => {
  if (model?.association) {
    model.association(models);
  }
});

export const Database = {
  ...models,
  database: sequelize,
};


export const { User } = models;