const User = require('../models/User');
const Auction = require('../models/Auction');
const Bid = require('../models/Bid');
const connectDB = require('../utils/db');

// @route   GET /users/profile
// @desc    Get user profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    await connectDB();
    
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

// @route   PUT /users/profile
// @desc    Update user profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    await connectDB();
    
    const { name, email, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, avatar },
      { new: true, runValidators: true }
    );

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

// @route   GET /users/my-bids
// @desc    Get user's bids
// @access  Private
exports.getMyBids = async (req, res) => {
  try {
    await connectDB();
    
    const bids = await Bid.find({ user: req.user.id })
      .populate({
        path: 'auction',
        populate: { path: 'createdBy', select: 'name' }
      })
      .sort({ timestamp: -1 });

    res.status(200).json({
      success: true,
      data: bids
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @route   GET /users/my-wins
// @desc    Get user's winning auctions
// @access  Private
exports.getMyWins = async (req, res) => {
  try {
    await connectDB();
    
    const auctions = await Auction.find({ 
      winner: req.user.id,
      status: 'ended'
    })
      .populate('createdBy', 'name email')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      data: auctions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @route   GET /users/joined-auctions
// @desc    Get auctions user has bid on
// @access  Private
exports.getJoinedAuctions = async (req, res) => {
  try {
    await connectDB();
    
    // Get all auctions where user has placed a bid
    const bids = await Bid.find({ user: req.user.id });
    const auctionIds = [...new Set(bids.map(bid => bid.auction.toString()))];
    
    const auctions = await Auction.find({ 
      _id: { $in: auctionIds }
    })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: auctions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
