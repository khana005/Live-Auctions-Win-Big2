const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const {
  getAuctions,
  getAuction,
  createAuction,
  updateAuction,
  deleteAuction,
  getFeaturedAuctions
} = require('../controllers/auctionController');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// @route   GET /api/auctions
// @desc    Get all auctions
// @access  Public
router.get('/', getAuctions);

// @route   GET /api/auctions/featured
// @desc    Get featured auctions
// @access  Public
router.get('/featured', getFeaturedAuctions);

// @route   GET /api/auctions/:id
// @desc    Get single auction
// @access  Public
router.get('/:id', getAuction);

// @route   POST /api/auctions
// @desc    Create auction
// @access  Private (Admin only)
router.post('/', [
  protect,
  authorize('admin'),
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('image').notEmpty().withMessage('Image URL is required'),
  body('startingPrice').isNumeric().withMessage('Starting price must be a number'),
  body('endTime').notEmpty().withMessage('End time is required')
], validate, createAuction);

// @route   PUT /api/auctions/:id
// @desc    Update auction
// @access  Private (Admin only)
router.put('/:id', protect, authorize('admin'), updateAuction);

// @route   DELETE /api/auctions/:id
// @desc    Delete auction
// @access  Private (Admin only)
router.delete('/:id', protect, authorize('admin'), deleteAuction);

module.exports = router;
