const prisma = require('../config/prisma');

exports.getReviewsByProduct = async (req, res, next) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { productId: req.params.productId },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    next(error);
  }
};

exports.addReview = async (req, res, next) => {
  try {
    const { productId, userId, name, rating, comment } = req.body;
    if (!productId || !userId || !name || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const review = await prisma.review.create({
      data: {
        productId,
        userId,
        name,
        rating: Number(rating),
        comment,
      },
    });

    const allReviews = await prisma.review.findMany({ where: { productId } });
    const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;

    res.status(201).json({
      success: true,
      data: review,
      stats: { averageRating: avgRating, totalReviews: allReviews.length },
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ success: false, message: 'You already reviewed this product' });
    }
    next(error);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    await prisma.review.delete({ where: { id: req.params.id } });
    res.json({ success: true, data: {} });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    next(error);
  }
};

exports.healthCheck = async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'OK', service: 'review-service', timestamp: new Date().toISOString(), database: 'connected' });
  } catch (error) {
    res.status(503).json({ status: 'ERROR', service: 'review-service', timestamp: new Date().toISOString(), database: 'disconnected' });
  }
};
