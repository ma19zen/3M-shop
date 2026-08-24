const prisma = require('../src/config/prisma');

let isConnected = false;

async function init() {
  if (isConnected) return;
  await prisma.$connect();
  isConnected = true;
}

module.exports = async (req, res) => {
  await init();
  const { app } = require('../src/server');
  return app(req, res);
};
