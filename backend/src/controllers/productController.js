const Product = require('../models/Product');
const AppError = require('../utils/AppError');

exports.getProducts = async (req, res, next) => {
  try {
    const { search, category, sort, page = 1, limit = 12, minPrice, maxPrice } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'rating') sortOption = { rating: -1 };
    else if (sort === 'name') sortOption = { name: 1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ featured: true }).limit(8);
    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Product.distinct('category');
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('reviews.user', 'name avatar');
    if (!product) return next(new AppError('Product not found', 404));
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const fileImages = req.files ? req.files.map((file) => `/uploads/${file.filename}`) : [];
    let urlImages = [];
    if (req.body.imageUrls) {
      try {
        const parsed = typeof req.body.imageUrls === 'string' ? JSON.parse(req.body.imageUrls) : req.body.imageUrls;
        urlImages = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        urlImages = req.body.imageUrls.split(',').map((u) => u.trim()).filter(Boolean);
      }
    }
    const images = [...fileImages, ...urlImages];
    const { imageUrls, ...bodyData } = req.body;
    const product = await Product.create({ ...bodyData, images });
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const fileImages = req.files && req.files.length > 0 ? req.files.map((file) => `/uploads/${file.filename}`) : [];
    if (fileImages.length > 0) {
      req.body.images = fileImages;
    }
    if (req.body.imageUrls) {
      let urlImages = [];
      try {
        const parsed = typeof req.body.imageUrls === 'string' ? JSON.parse(req.body.imageUrls) : req.body.imageUrls;
        urlImages = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        urlImages = req.body.imageUrls.split(',').map((u) => u.trim()).filter(Boolean);
      }
      if (req.body.images) {
        req.body.images = [...req.body.images, ...urlImages];
      } else {
        req.body.images = urlImages;
      }
    }
    const { imageUrls, ...bodyData } = req.body;
    const product = await Product.findByIdAndUpdate(req.params.id, bodyData, { new: true, runValidators: true });
    if (!product) return next(new AppError('Product not found', 404));
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return next(new AppError('Product not found', 404));
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

exports.addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return next(new AppError('Product not found', 404));

    const alreadyReviewed = product.reviews.find((r) => r.user.toString() === req.user._id.toString());
    if (alreadyReviewed) {
      return next(new AppError('You already reviewed this product', 400));
    }

    product.reviews.push({ user: req.user._id, name: req.user.name, rating: Number(rating), comment });
    await product.save();
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};
