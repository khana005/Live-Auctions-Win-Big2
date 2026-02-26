const User = require('../models/User');
const Auction = require('../models/Auction');
const Bid = require('../models/Bid');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's bids
// @route   GET /api/users/my-bids
// @access  Private
exports.getMyBids = async (req, res, next) => {
  try {
    const bids = await Bid.find({ user: req.user.id })
      .populate({
        path: 'auction',
        populate: [
          { path: 'createdBy', select: 'name' },
          { path: 'winner', select: 'name' }
        ]
      })
      .sort({ timestamp: -1 });

    res.status(200).json({
      success: true,
      count: bids.length,
      data: bids
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's won auctions
// @route   GET /api/users/my-wins
// @access  Private
exports.getMyWins = async (req, res, next) => {
  try {
    const auctions = await Auction.find({ winner: req.user.id })
      .populate('createdBy', 'name email')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: auctions.length,
      data: auctions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get auctions user has joined (bid on)
// @route   GET /api/users/joined-auctions
// @access  Private
exports.getJoinedAuctions = async (req, res, next) => {
  try {
    // Get all auctions user has bid on
    const bids = await Bid.find({ user: req.user.id }).distinct('auction');
    
    const auctions = await Auction.find({ _id: { $in: bids } })
      .populate('createdBy', 'name email')
      .populate('winner', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: auctions.length,
      data: auctions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
