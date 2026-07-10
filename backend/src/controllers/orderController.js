const { Order } = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const AppError = require('../utils/AppError');

exports.createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;
    if (!shippingAddress || !paymentMethod) {
      return next(new AppError('Please provide shipping address and payment method', 400));
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.items.length === 0) {
      return next(new AppError('Cart is empty', 400));
    }

    for (const item of cart.items) {
      const product = await Product.findById(item.product);
      if (!product) return next(new AppError(`Product ${item.name} not found`, 404));
      if (product.stock < item.quantity) {
        return next(new AppError(`Not enough stock for ${item.name}`, 400));
      }
    }

    const totalAmount = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const order = await Order.create(
      req.user._id.toString(),
      cart.items.map((item) => ({
        product: item.product.toString(),
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
      })),
      shippingAddress,
      paymentMethod,
      totalAmount
    );

    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

    cart.items = [];
    await cart.save();

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.findByUserId(req.user._id.toString());
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return next(new AppError('Order not found', 404));
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll();
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
    const order = await Order.updateStatus(req.params.id, status);
    if (!order) return next(new AppError('Order not found', 404));
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};
