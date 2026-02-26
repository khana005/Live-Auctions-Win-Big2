const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getProfile,
  updateProfile,
  getMyBids,
  getMyWins,
  getJoinedAuctions
} = require('../controllers/userController');

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, getProfile);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, updateProfile);

// @route   GET /api/users/my-bids
// @desc    Get user's bids
// @access  Private
router.get('/my-bids', protect, getMyBids);

// @route   GET /api/users/my-wins
// @desc    Get user's won auctions
// @access  Private
router.get('/my-wins', protect, getMyWins);

// @route   GET /api/users/joined-auctions
// @desc    Get auctions user has joined
// @access  Private
router.get('/joined-auctions', protect, getJoinedAuctions);

module.exports = router;
