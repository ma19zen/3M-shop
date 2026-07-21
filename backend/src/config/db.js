const mongoose = require('mongoose');
const prisma = require('./prisma');

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
    await prisma.$connect();
    console.log('PostgreSQL (Prisma) Connected');
  } catch (error) {
    console.error(`PostgreSQL Error: ${error.message}`);
    throw error;
  }
};

module.exports = { connectMongo, connectPostgres, prisma };
