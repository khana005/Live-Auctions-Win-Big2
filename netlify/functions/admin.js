const User = require('../models/User');
const Auction = require('../models/Auction');
const Bid = require('../models/Bid');
const connectDB = require('../utils/db');

// @route   GET /admin/dashboard
// @desc    Get admin dashboard stats
// @access  Private (Admin)
exports.getDashboard = async (req, res) => {
  try {
    await connectDB();
    
    // Check if user is admin
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    // Get counts
    const userCount = await User.countDocuments();
    const auctionCount = await Auction.countDocuments();
    const activeAuctionCount = await Auction.countDocuments({ status: 'active' });
    const endedAuctionCount = await Auction.countDocuments({ status: 'ended' });
    const bidCount = await Bid.countDocuments();

    // Get recent auctions
    const recentAuctions = await Auction.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get recent users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5);

    // Get total bid value
    const bids = await Bid.find();
    const totalBidValue = bids.reduce((sum, bid) => sum + bid.amount, 0);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          users: userCount,
          auctions: auctionCount,
          activeAuctions: activeAuctionCount,
          endedAuctions: endedAuctionCount,
          totalBids: bidCount,
          totalBidValue
        },
        recentAuctions,
        recentUsers
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @route   GET /admin/users
// @desc    Get all users
// @access  Private (Admin)
exports.getUsers = async (req, res) => {
  try {
    await connectDB();
    
    // Check if user is admin
    const adminUser = await User.findById(req.user.id);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const { page = 1, limit = 10, search = '' } = req.query;
    
    let query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: users,
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

// @route   PUT /admin/users/:id/role
// @desc    Update user role
// @access  Private (Admin)
exports.updateUserRole = async (req, res) => {
  try {
    await connectDB();
    
    // Check if user is admin
    const adminUser = await User.findById(req.user.id);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const { role } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

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

// @route   DELETE /admin/users/:id
// @desc    Delete user
// @access  Private (Admin)
exports.deleteUser = async (req, res) => {
  try {
    await connectDB();
    
    // Check if user is admin
    const adminUser = await User.findById(req.user.id);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @route   GET /admin/auctions
// @desc    Get all auctions for admin
// @access  Private (Admin)
exports.getAllAuctions = async (req, res) => {
  try {
    await connectDB();
    
    // Check if user is admin
    const adminUser = await User.findById(req.user.id);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const { page = 1, limit = 10, status = '' } = req.query;
    
    let query = {};
    
    if (status) {
      query.status = status;
    }

    const auctions = await Auction.find(query)
      .populate('createdBy', 'name email')
      .populate('winner', 'name email')
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
