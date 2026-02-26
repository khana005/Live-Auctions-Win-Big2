const Bid = require('../models/Bid');
const Auction = require('../models/Auction');

// @desc    Place a bid
// @route   POST /api/bids
// @access  Private
exports.placeBid = async (req, res, next) => {
  try {
    const { auctionId, amount } = req.body;

    const auction = await Auction.findById(auctionId);

    if (!auction) {
      return res.status(404).json({
        success: false,
        message: 'Auction not found'
      });
    }

    if (auction.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Auction is not active'
      });
    }

    if (new Date() > auction.endTime) {
      return res.status(400).json({
        success: false,
        message: 'Auction has ended'
      });
    }

    if (amount <= auction.currentPrice) {
      return res.status(400).json({
        success: false,
        message: `Bid must be higher than current price: $${auction.currentPrice}`
      });
    }

    // Create bid
    const bid = await Bid.create({
      auction: auctionId,
      user: req.user.id,
      amount
    });

    // Update auction
    auction.currentPrice = amount;
    auction.bidCount += 1;
    auction.bids.push(bid._id);
    await auction.save();

    // Populate bid with user info
    const populatedBid = await Bid.findById(bid._id).populate('user', 'name email');

    res.status(201).json({
      success: true,
      data: populatedBid,
      currentPrice: amount,
      bidCount: auction.bidCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get bids for an auction
// @route   GET /api/bids/auction/:auctionId
// @access  Public
exports.getAuctionBids = async (req, res, next) => {
  try {
    const bids = await Bid.find({ auction: req.params.auctionId })
      .populate('user', 'name email')
      .sort({ amount: -1 });

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

// @desc    Get user's bids
// @route   GET /api/bids/my-bids
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
