const Auction = require('../models/Auction');
const Bid = require('../models/Bid');

// @desc    Get all auctions
// @route   GET /api/auctions
// @access  Public
exports.getAuctions = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 12 } = req.query;
    
    let query = {};
    
    // Filter by status
    if (status) {
      query.status = status;
    } else {
      // Default: show active auctions
      query.status = 'active';
    }

    const auctions = await Auction.find(query)
      .populate('createdBy', 'name email')
      .populate('winner', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Auction.countDocuments(query);

    // Check and update expired auctions
    for (const auction of auctions) {
      if (auction.status === 'active' && new Date() > auction.endTime) {
        await updateAuctionStatus(auction._id);
      }
    }

    res.status(200).json({
      success: true,
      count,
      page: Number(page),
      pages: Math.ceil(count / limit),
      data: auctions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single auction
// @route   GET /api/auctions/:id
// @access  Public
exports.getAuction = async (req, res, next) => {
  try {
    const auction = await Auction.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('winner', 'name email')
      .populate({
        path: 'bids',
        options: { sort: { amount: -1 }, limit: 20 },
        populate: { path: 'user', select: 'name email' }
      });

    if (!auction) {
      return res.status(404).json({
        success: false,
        message: 'Auction not found'
      });
    }

    // Check if auction should be ended
    if (auction.status === 'active' && new Date() > auction.endTime) {
      await updateAuctionStatus(auction._id);
      auction.status = 'ended';
    }

    res.status(200).json({
      success: true,
      data: auction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new auction
// @route   POST /api/auctions
// @access  Private (Admin only)
exports.createAuction = async (req, res, next) => {
  try {
    req.body.createdBy = req.user.id;

    const auction = await Auction.create(req.body);

    res.status(201).json({
      success: true,
      data: auction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update auction
// @route   PUT /api/auctions/:id
// @access  Private (Admin only)
exports.updateAuction = async (req, res, next) => {
  try {
    let auction = await Auction.findById(req.params.id);

    if (!auction) {
      return res.status(404).json({
        success: false,
        message: 'Auction not found'
      });
    }

    // Don't allow updates to certain fields if auction has bids
    if (auction.bidCount > 0) {
      delete req.body.startingPrice;
      delete req.body.currentPrice;
    }

    auction = await Auction.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: auction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete auction
// @route   DELETE /api/auctions/:id
// @access  Private (Admin only)
exports.deleteAuction = async (req, res, next) => {
  try {
    const auction = await Auction.findById(req.params.id);

    if (!auction) {
      return res.status(404).json({
        success: false,
        message: 'Auction not found'
      });
    }

    // Delete all bids for this auction
    await Bid.deleteMany({ auction: req.params.id });

    await auction.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Auction deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get featured auctions
// @route   GET /api/auctions/featured
// @access  Public
exports.getFeaturedAuctions = async (req, res, next) => {
  try {
    const auctions = await Auction.find({ 
      status: 'active',
      endTime: { $gt: new Date() }
    })
      .populate('createdBy', 'name')
      .sort({ bidCount: -1, createdAt: -1 })
      .limit(6);

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

// Helper function to update auction status
const updateAuctionStatus = async (auctionId) => {
  try {
    const auction = await Auction.findById(auctionId);
    
    if (!auction || auction.status !== 'active') {
      return;
    }

    // Find highest bid
    const highestBid = await Bid.findOne({ auction: auctionId })
      .sort({ amount: -1 })
      .populate('user', 'name email');

    if (highestBid) {
      auction.winner = highestBid.user._id;
      auction.currentPrice = highestBid.amount;
    }

    auction.status = 'ended';
    await auction.save();

    // Emit socket event for auction ended
    const io = req.app.get('io');
    if (io) {
      io.to(auctionId.toString()).emit('auction_ended', {
        auctionId,
        winner: highestBid ? highestBid.user : null,
        finalPrice: auction.currentPrice
      });
    }
  } catch (error) {
    console.error('Error updating auction status:', error);
  }
};
