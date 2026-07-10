const Cart = require('../models/Cart');
const Product = require('../models/Product');
const AppError = require('../utils/AppError');

exports.getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name price images stock');
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }
    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product) return next(new AppError('Product not found', 404));
    if (product.stock < quantity) return next(new AppError('Not enough stock', 400));

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return next(new AppError('Cart not found', 404));

    const existingIndex = cart.items.findIndex((i) => i.product.toString() === productId);
    const items = JSON.parse(JSON.stringify(cart.items));

    if (existingIndex >= 0) {
      items[existingIndex].quantity += quantity;
    } else {
      items.push({
        product: product._id,
        name: product.name,
        image: product.images[0] || '',
        price: product.price,
        quantity,
      });
    }

    const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    await Cart.findOneAndUpdate({ user: req.user._id }, { items, totalPrice });
    const updated = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name price images stock');
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

exports.updateCartItem = async (req, res, next) => {
  try {
    const quantity = Number(req.body.quantity);
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return next(new AppError('Cart not found', 404));

    const items = JSON.parse(JSON.stringify(cart.items));
    const itemIndex = items.findIndex((i) => i.product.toString() === req.params.itemId);
    if (itemIndex === -1) return next(new AppError('Item not found in cart', 404));

    if (quantity <= 0) {
      items.splice(itemIndex, 1);
    } else {
      items[itemIndex].quantity = quantity;
    }

    const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    await Cart.findOneAndUpdate({ user: req.user._id }, { items, totalPrice });
    const updated = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name price images stock');
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

exports.removeFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return next(new AppError('Cart not found', 404));

    const items = JSON.parse(JSON.stringify(cart.items));
    const itemIndex = items.findIndex((i) => i.product.toString() === req.params.itemId);
    if (itemIndex === -1) return next(new AppError('Item not found in cart', 404));

    items.splice(itemIndex, 1);
    const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    await Cart.findOneAndUpdate({ user: req.user._id }, { items, totalPrice });
    const updated = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name price images stock');
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

exports.clearCart = async (req, res, next) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], totalPrice: 0 });
    const updated = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name price images stock');
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};
