const prisma = require('../config/prisma');
const AppError = require('../utils/AppError');

exports.createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;
    if (!shippingAddress || !paymentMethod) {
      return next(new AppError('Please provide shipping address and payment method', 400));
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: { items: { include: { product: true } } },
    });
    if (!cart || cart.items.length === 0) {
      return next(new AppError('Cart is empty', 400));
    }

    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return next(new AppError(`Not enough stock for ${item.product.name}`, 400));
      }
    }

    const totalAmount = cart.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        shippingAddress,
        paymentMethod,
        totalAmount,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            name: item.product.name,
            image: item.product.images[0] || null,
            price: item.product.price,
            quantity: item.quantity,
          })),
        },
      },
      include: { items: true },
    });

    for (const item of cart.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { items: true },
    });
    if (!order) return next(new AppError('Order not found', 404));
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      include: { items: true, user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return next(new AppError('Invalid status', 400));
    }
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status },
      include: { items: true },
    });
    res.json({ success: true, data: order });
  } catch (error) {
    if (error.code === 'P2025') return next(new AppError('Order not found', 404));
    next(error);
  }
};
