const prisma = require('../src/config/prisma');
const { connectMongo } = require('../src/config/db');

let isConnected = false;
let connectionError = null;

async function init() {
  if (isConnected || connectionError) return;
  try {
    await prisma.$connect();
    await connectMongo();
    isConnected = true;
  } catch (error) {
    console.error('Init failed:', error.message);
    connectionError = error.message;
  }
}

module.exports = async (req, res) => {
  try {
    await init();
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server initialization failed', error: error.message });
  }

  if (connectionError) {
    return res.status(500).json({ success: false, message: 'Database connection failed', error: connectionError });
  }

  const { app } = require('../src/server');
  return app(req, res);
};
