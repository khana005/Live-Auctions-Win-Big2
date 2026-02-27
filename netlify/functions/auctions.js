const Auction = require('../models/Auction');
const Bid = require('../models/Bid');
const User = require('../models/User');
const connectDB = require('../utils/db');
const { protect, admin } = require('../middleware/auth');

// @route   GET /auctions
// @desc    Get all active auctions
// @access  Public
exports.getAuctions = async (req, res) => {
  try {
    await connectDB();
    
    const { page = 1, limit = 10, search = '', category = '' } = req.query;
    
    let query = { status: 'active', endTime: { $gt: new Date() } };
    
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const auctions = await Auction.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Auction.countDocuments(query);

    res.status(200).json({
      success: true,
      data: auctions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @route   GET /auctions/featured
// @desc    Get featured auctions
// @access  Public
exports.getFeaturedAuctions = async (req, res) => {
  try {
    await connectDB();
    
    const auctions = await Auction.find({ 
      status: 'active', 
      endTime: { $gt: new Date() } 
    })
      .populate('createdBy', 'name')
      .sort({ currentPrice: -1 })
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

// @route   GET /auctions/:id
// @desc    Get single auction
// @access  Public
exports.getAuction = async (req, res) => {
  try {
    await connectDB();
    
    const auction = await Auction.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('winner', 'name email');

    if (!auction) {
      return res.status(404).json({
        success: false,
        message: 'Auction not found'
      });
    }

    // Get recent bids
    const bids = await Bid.find({ auction: req.params.id })
      .populate('user', 'name email')
      .sort({ timestamp: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: auction,
      bids
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @route   POST /auctions
// @desc    Create auction
// @access  Private (Admin)
exports.createAuction = async (req, res) => {
  try {
    await connectDB();
    
    // Check if user is admin
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create auctions'
      });
    }

    const auction = await Auction.create({
      ...req.body,
      createdBy: req.user.id,
      currentPrice: req.body.startingPrice
    });

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

// @route   PUT /auctions/:id
// @desc    Update auction
// @access  Private (Admin)
exports.updateAuction = async (req, res) => {
  try {
    await connectDB();
    
    let auction = await Auction.findById(req.params.id);

    if (!auction) {
      return res.status(404).json({
        success: false,
        message: 'Auction not found'
      });
    }

    // Check if user is admin
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update auctions'
      });
    }

    auction = await Auction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

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

// @route   DELETE /auctions/:id
// @desc    Delete auction
// @access  Private (Admin)
exports.deleteAuction = async (req, res) => {
  try {
    await connectDB();
    
    const auction = await Auction.findById(req.params.id);

    if (!auction) {
      return res.status(404).json({
        success: false,
        message: 'Auction not found'
      });
    }

    // Check if user is admin
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete auctions'
      });
    }

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
