const User = require('../models/User');
const Auction = require('../models/Auction');
const Bid = require('../models/Bid');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private (Admin only)
exports.getDashboard = async (req, res, next) => {
  try {
    // Get counts
    const userCount = await User.countDocuments();
    const auctionCount = await Auction.countDocuments();
    const activeAuctionCount = await Auction.countDocuments({ status: 'active' });
    const bidCount = await Bid.countDocuments();

    // Get recent auctions
    const recentAuctions = await Auction.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get recent bids
    const recentBids = await Bid.find()
      .populate({
        path: 'auction',
        select: 'title'
      })
      .populate('user', 'name email')
      .sort({ timestamp: -1 })
      .limit(10);

    // Calculate total revenue (sum of all final prices for ended auctions)
    const endedAuctions = await Auction.find({ status: 'ended' });
    const totalRevenue = endedAuctions.reduce((sum, auction) => sum + auction.currentPrice, 0);

    // Get top bidders
    const topBidders = await Bid.aggregate([
      {
        $group: {
          _id: '$user',
          totalBids: { $sum: 1 },
          highestBid: { $max: '$amount' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          name: '$user.name',
          email: '$user.email',
          totalBids: 1,
          highestBid: 1
        }
      },
      {
        $sort: { totalBids: -1 }
      },
      {
        $limit: 5
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          users: userCount,
          auctions: auctionCount,
          activeAuctions: activeAuctionCount,
          bids: bidCount,
          revenue: totalRevenue
        },
        recentAuctions,
        recentBids,
        topBidders
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin only)
exports.getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    
    let query = {};
    
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count,
      page: Number(page),
      pages: Math.ceil(count / limit),
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private (Admin only)
exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

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

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Don't allow deleting admin users
    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete admin users'
      });
    }

    // Delete user's bids
    await Bid.deleteMany({ user: req.params.id });

    // Remove user from auctions they created
    await Auction.updateMany(
      { createdBy: req.params.id },
      { status: 'cancelled' }
    );

    // Remove user from auction winners
    await Auction.updateMany(
      { winner: req.params.id },
      { winner: null }
    );

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

// @desc    Get all auctions (admin view)
// @route   GET /api/admin/auctions
// @access  Private (Admin only)
exports.getAllAuctions = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
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
