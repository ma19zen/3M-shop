const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');
const AppError = require('../utils/AppError');
const Review = require('../models/Review');
const ActivityLog = require('../models/ActivityLog');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return next(new AppError('User already exists', 400));
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });
    await prisma.cart.create({ data: { userId: user.id } });
    const token = generateToken(user.id, user.role);
    await ActivityLog.create({ userId: user.id, action: 'register', ip: req.ip });
    res.status(201).json({
      success: true,
      data: {
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new AppError('Invalid email or password', 401));
    }
    const token = generateToken(user.id, user.role);
    await ActivityLog.create({ userId: user.id, action: 'login', ip: req.ip });
    res.json({
      success: true,
      data: {
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        address: { street: user.street, city: user.city, state: user.state, zipCode: user.zipCode, country: user.country },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email, phone, address } = req.body;
    const data = {};
    if (name) data.name = name;
    if (email) data.email = email;
    if (phone) data.phone = phone;
    if (address) {
      if (address.street !== undefined) data.street = address.street;
      if (address.city !== undefined) data.city = address.city;
      if (address.state !== undefined) data.state = address.state;
      if (address.zipCode !== undefined) data.zipCode = address.zipCode;
      if (address.country !== undefined) data.country = address.country;
    }
    const user = await prisma.user.update({ where: { id: req.user.id }, data });
    const token = generateToken(user.id, user.role);
    res.json({
      success: true,
      data: {
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        address: { street: user.street, city: user.city, state: user.state, zipCode: user.zipCode, country: user.country },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!(await bcrypt.compare(currentPassword, user.password))) {
      return next(new AppError('Current password is incorrect', 401));
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: req.user.id }, data: { password: hashedPassword } });
    const token = generateToken(user.id, user.role);
    res.json({ success: true, data: { token } });
  } catch (error) {
    next(error);
  }
};
