const prisma = require('../config/prisma');
const Review = require('../models/Review');
const AppError = require('../utils/AppError');

exports.getProducts = async (req, res, next) => {
  try {
    const { search, category, sort, page = 1, limit = 12, minPrice, maxPrice } = req.query;
    const where = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (category) {
      where.category = { slug: category };
    }
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }

    let orderBy = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    else if (sort === 'price_desc') orderBy = { price: 'desc' };
    else if (sort === 'rating') orderBy = { rating: 'desc' };
    else if (sort === 'name') orderBy = { name: 'asc' };

    const skip = (Number(page) - 1) * Number(limit);
    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({ where, orderBy, skip, take: Number(limit), include: { category: true } }),
    ]);

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
    const products = await prisma.product.findMany({
      where: { featured: true },
      take: 8,
      include: { category: true },
    });
    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany();
    res.json({ success: true, data: categories.map((c) => c.name) });
  } catch (error) {
    next(error);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { category: true },
    });
    if (!product) return next(new AppError('Product not found', 404));

    const reviews = await Review.find({ productId: product.id }).sort({ createdAt: -1 });
    res.json({ success: true, data: { ...product, reviews } });
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
    const { imageUrls, category: categoryName, ...bodyData } = req.body;

    const category = await prisma.category.upsert({
      where: { slug: categoryName.toLowerCase().replace(/\s+/g, '-') },
      update: {},
      create: {
        name: categoryName,
        slug: categoryName.toLowerCase().replace(/\s+/g, '-'),
      },
    });

    const product = await prisma.product.create({
      data: { ...bodyData, images, categoryId: category.id, price: Number(bodyData.price), stock: Number(bodyData.stock) },
      include: { category: true },
    });
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const fileImages = req.files && req.files.length > 0 ? req.files.map((file) => `/uploads/${file.filename}`) : [];
    let updateData = {};

    if (fileImages.length > 0) updateData.images = fileImages;
    if (req.body.imageUrls) {
      let urlImages = [];
      try {
        const parsed = typeof req.body.imageUrls === 'string' ? JSON.parse(req.body.imageUrls) : req.body.imageUrls;
        urlImages = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        urlImages = req.body.imageUrls.split(',').map((u) => u.trim()).filter(Boolean);
      }
      if (updateData.images) {
        updateData.images = [...updateData.images, ...urlImages];
      } else {
        updateData.images = urlImages;
      }
    }

    const { imageUrls, category: categoryName, ...bodyData } = req.body;
    if (bodyData.price) bodyData.price = Number(bodyData.price);
    if (bodyData.stock) bodyData.stock = Number(bodyData.stock);
    Object.assign(updateData, bodyData);

    if (categoryName) {
      const category = await prisma.category.upsert({
        where: { slug: categoryName.toLowerCase().replace(/\s+/g, '-') },
        update: {},
        create: { name: categoryName, slug: categoryName.toLowerCase().replace(/\s+/g, '-') },
      });
      updateData.categoryId = category.id;
    }

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: updateData,
      include: { category: true },
    });
    res.json({ success: true, data: product });
  } catch (error) {
    if (error.code === 'P2025') return next(new AppError('Product not found', 404));
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ success: true, data: {} });
  } catch (error) {
    if (error.code === 'P2025') return next(new AppError('Product not found', 404));
    next(error);
  }
};

exports.addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const product = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!product) return next(new AppError('Product not found', 404));

    const review = await Review.create({
      productId: product.id,
      userId: req.user.id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    });

    const allReviews = await Review.find({ productId: product.id });
    const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;
    await prisma.product.update({
      where: { id: product.id },
      data: { rating: avgRating, numReviews: allReviews.length },
    });

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    if (error.code === 11000) return next(new AppError('You already reviewed this product', 400));
    next(error);
  }
};
