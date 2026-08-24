const express = require('express');
const router = express.Router();
const { getReviewsByProduct, addReview, deleteReview, healthCheck } = require('../controllers/reviewController');

router.get('/health', healthCheck);
router.get('/product/:productId', getReviewsByProduct);
router.post('/', addReview);
router.delete('/:id', deleteReview);

module.exports = router;
