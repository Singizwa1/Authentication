// config/config.ts
import dotenv from 'dotenv';
dotenv.config();

const getPrefix = (): string => {
  const env = process.env.NODE_ENV || 'DEV';
  return env;
};

export interface ConfigInterface {
  username: string;
  password: string;
  database: string;
  port: number;
  host: string;
  dialect: 'postgres';
}

const databaseConfig = (): ConfigInterface => {
  const env = getPrefix();
  return {
    username: process.env[`${env}_USERNAME`] || '',
    database: process.env[`${env}_DATABASE`] || '',
    password: process.env[`${env}_PASSWORD`] || '',
    host: process.env[`${env}_HOST`] || '',
    port: Number(process.env[`${env}_PORT`] || 5432),
    dialect: 'postgres',
  };
};

export default databaseConfig;
