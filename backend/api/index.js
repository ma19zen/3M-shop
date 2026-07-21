console.log('Function loaded');

module.exports = async (req, res) => {
  console.log('Request:', req.method, req.url);
  try {
    console.log('Loading server...');
    const server = require('../src/server');
    console.log('Server loaded, app:', typeof server.app);

    const { connectMongo, connectPostgres } = require('../src/config/db');
    const { initOrderTable } = require('../src/models/Order');

    console.log('Connecting MongoDB...');
    await connectMongo();
    console.log('Connecting Postgres...');
    await connectPostgres();
    console.log('Init order table...');
    await initOrderTable();
    console.log('DB ready');

    return server.app(req, res);
  } catch (error) {
    console.error('HANDLER ERROR:', error.message, error.stack);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
