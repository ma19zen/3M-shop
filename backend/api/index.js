const { app, startServer } = require('../src/server');

let isConnected = false;

module.exports = async (req, res) => {
  if (!isConnected) {
    try {
      const { connectMongo, connectPostgres } = require('../src/config/db');
      const { initOrderTable } = require('../src/models/Order');
      await connectMongo();
      await connectPostgres();
      await initOrderTable();
      isConnected = true;
    } catch (error) {
      console.error('DB connection failed:', error.message);
    }
  }
  return app(req, res);
};
