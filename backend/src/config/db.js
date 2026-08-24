const prisma = require('./prisma');

const connectPostgres = async () => {
  try {
    await prisma.$connect();
    console.log('PostgreSQL (Prisma) Connected');
  } catch (error) {
    console.error(`PostgreSQL Error: ${error.message}`);
    throw error;
  }
};

module.exports = { connectPostgres, prisma };
