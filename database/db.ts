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
});

sequelize.authenticate()
  .then(() => {
    console.log('Database connected');
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });

const models = AllModal(sequelize);

Object.values(models).forEach(model => {
  if (model?.association) {
    model.association(models);
  }
});

export const Database = {
  ...models,
  database: sequelize,
};
