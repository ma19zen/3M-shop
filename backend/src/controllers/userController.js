const prisma = require('../config/prisma');
const AppError = require('../utils/AppError');

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, avatar: true, phone: true, createdAt: true },
    });
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: { id: true, name: true, email: true, role: true, avatar: true, phone: true, street: true, city: true, state: true, zipCode: true, country: true, createdAt: true },
    });
    if (!user) return next(new AppError('User not found', 404));
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });
    res.json({ success: true, data: user });
  } catch (error) {
    if (error.code === 'P2025') return next(new AppError('User not found', 404));
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ success: true, data: {} });
  } catch (error) {
    if (error.code === 'P2025') return next(new AppError('User not found', 404));
    next(error);
  }
};
