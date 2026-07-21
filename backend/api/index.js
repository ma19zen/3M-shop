let app = null;
let isConnected = false;
let connectionError = null;

async function init() {
  if (app) return;
  const server = require('../src/server');
  app = server.app;

  try {
    const { connectMongo, connectPostgres } = require('../src/config/db');
    const { initOrderTable } = require('../src/models/Order');
    await connectMongo();
    await connectPostgres();
    await initOrderTable();
    isConnected = true;
  } catch (error) {
    console.error('DB connection failed:', error.message);
    connectionError = error.message;
  }
}

module.exports = async (req, res) => {
  try {
    await init();
  } catch (error) {
    console.error('Init failed:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server initialization failed',
      error: error.message,
    });
  }

  if (connectionError) {
    return res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: connectionError,
    });
  }

  return app(req, res);
};
