const prisma = require('../config/prisma');
const AppError = require('../utils/AppError');

exports.getCart = async (req, res, next) => {
  try {
    let cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: { items: { include: { product: true } } },
    });
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: req.user.id },
        include: { items: { include: { product: true } } },
      });
    }
    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return next(new AppError('Product not found', 404));
    if (product.stock < quantity) return next(new AppError('Not enough stock', 400));

    const cart = await prisma.cart.findUnique({ where: { userId: req.user.id } });
    if (!cart) return next(new AppError('Cart not found', 404));

    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity },
      });
    }

    const updated = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: { items: { include: { product: true } } },
    });
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

exports.updateCartItem = async (req, res, next) => {
  try {
    const quantity = Number(req.body.quantity);
    const cart = await prisma.cart.findUnique({ where: { userId: req.user.id } });
    if (!cart) return next(new AppError('Cart not found', 404));

    const item = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId: req.params.itemId },
    });
    if (!item) return next(new AppError('Item not found in cart', 404));

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: item.id } });
    } else {
      await prisma.cartItem.update({ where: { id: item.id }, data: { quantity } });
    }

    const updated = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: { items: { include: { product: true } } },
    });
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

exports.removeFromCart = async (req, res, next) => {
  try {
    const cart = await prisma.cart.findUnique({ where: { userId: req.user.id } });
    if (!cart) return next(new AppError('Cart not found', 404));

    const item = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId: req.params.itemId },
    });
    if (!item) return next(new AppError('Item not found in cart', 404));

    await prisma.cartItem.delete({ where: { id: item.id } });
    const updated = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: { items: { include: { product: true } } },
    });
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

exports.clearCart = async (req, res, next) => {
  try {
    const cart = await prisma.cart.findUnique({ where: { userId: req.user.id } });
    if (!cart) return next(new AppError('Cart not found', 404));

    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    const updated = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: { items: { include: { product: true } } },
    });
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};
