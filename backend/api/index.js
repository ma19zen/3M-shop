const { app } = require('../src/server');

let isConnected = false;
let connectionError = null;

module.exports = async (req, res) => {
  if (!isConnected && !connectionError) {
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

  if (connectionError) {
    return res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: connectionError,
    });
  }

  return app(req, res);
};
