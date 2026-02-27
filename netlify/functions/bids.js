const Bid = require('../models/Bid');
const Auction = require('../models/Auction');
const User = require('../models/User');
const connectDB = require('../utils/db');

// @route   POST /bids
// @desc    Place a bid
// @access  Private
exports.placeBid = async (req, res) => {
  try {
    await connectDB();
    
    const { auctionId, amount } = req.body;

    // Find auction
    const auction = await Auction.findById(auctionId);
    
    if (!auction) {
      return res.status(404).json({
        success: false,
        message: 'Auction not found'
      });
    }

    // Check if auction is active
    if (auction.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Auction is not active'
      });
    }

    // Check if auction has ended
    if (new Date() > auction.endTime) {
      return res.status(400).json({
        success: false,
        message: 'Auction has ended'
      });
    }

    // Check if bid amount is higher than current price
    if (amount <= auction.currentPrice) {
      return res.status(400).json({
        success: false,
        message: `Bid must be higher than current price: $${auction.currentPrice}`
      });
    }

    // Check if user is not the auction creator
    if (auction.createdBy.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot bid on your own auction'
      });
    }

    // Create bid
    const bid = await Bid.create({
      auction: auctionId,
      user: req.user.id,
      amount
    });

    // Update auction current price
    auction.currentPrice = amount;
    
    // Check if this is the last bid (auction ends in 1 minute if bid placed)
    const newEndTime = new Date(auction.endTime);
    const timeLeft = newEndTime - new Date();
    if (timeLeft < 60000) {
      auction.endTime = new Date(Date.now() + 60000);
    }
    
    await auction.save();

    // Populate bid with user info
    const populatedBid = await Bid.findById(bid._id)
      .populate('user', 'name email');

    res.status(201).json({
      success: true,
      data: populatedBid,
      auction: {
        currentPrice: auction.currentPrice,
        endTime: auction.endTime
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @route   GET /bids/auction/:auctionId
// @desc    Get bids for auction
// @access  Public
exports.getAuctionBids = async (req, res) => {
  try {
    await connectDB();
    
    const bids = await Bid.find({ auction: req.params.auctionId })
      .populate('user', 'name email')
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

// @route   GET /bids/my-bids
// @desc    Get current user's bids
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
