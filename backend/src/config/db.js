const mongoose = require('mongoose');
const { Pool } = require('pg');

let pgPool;

const getPool = () => {
  if (!pgPool) {
    pgPool = new Pool({
      connectionString: process.env.POSTGRES_URI,
    });
  }
  return pgPool;
};

const connectMongo = async () => {
  if (mongoose.connection.readyState === 1) return;
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Error: ${error.message}`);
    throw error;
  }
};

const connectPostgres = async () => {
  try {
    const client = await getPool().connect();
    console.log('PostgreSQL Connected');
    client.release();
  } catch (error) {
    console.error(`PostgreSQL Error: ${error.message}`);
    throw error;
  }
};

module.exports = { connectMongo, connectPostgres, getPool };
