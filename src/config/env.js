// config/env.js
import 'dotenv/config'; // automatically loads .env

export const ENV = {
  PORT: process.env.PORT || 5001,
  DATABASE_URL: process.env.DATABASE_URL,
};
