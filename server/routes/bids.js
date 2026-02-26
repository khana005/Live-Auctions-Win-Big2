const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');
const {
  placeBid,
  getAuctionBids,
  getMyBids
} = require('../controllers/bidController');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// @route   POST /api/bids
// @desc    Place a bid
// @access  Private
router.post('/', [
  protect,
  body('auctionId').notEmpty().withMessage('Auction ID is required'),
  body('amount').isNumeric().withMessage('Amount must be a number')
], validate, placeBid);

// @route   GET /api/bids/auction/:auctionId
// @desc    Get bids for an auction
// @access  Public
router.get('/auction/:auctionId', getAuctionBids);

// @route   GET /api/bids/my-bids
// @desc    Get user's bids
// @access  Private
router.get('/my-bids', protect, getMyBids);

module.exports = router;
