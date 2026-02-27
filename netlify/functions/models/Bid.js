const mongoose = require('mongoose');

const BidSchema = new mongoose.Schema({
  auction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auction',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Please provide a bid amount']
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
BidSchema.index({ auction: 1, timestamp: -1 });
BidSchema.index({ user: 1, timestamp: -1 });

module.exports = mongoose.model('Bid', BidSchema);
