const mongoose = require('mongoose');
const { Pool } = require('pg');

const pgPool = new Pool({
  connectionString: process.env.POSTGRES_URI,
});

const connectMongo = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};

const connectPostgres = async () => {
  try {
    const client = await pgPool.connect();
    console.log('PostgreSQL Connected');
    client.release();
  } catch (error) {
    console.error(`PostgreSQL Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { connectMongo, connectPostgres, pgPool };
