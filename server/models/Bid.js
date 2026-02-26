const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  auction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auction',
    required: [true, 'Please provide an auction']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide a user']
  },
  amount: {
    type: Number,
    required: [true, 'Please provide a bid amount'],
    min: [1, 'Bid amount must be at least 1']
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
bidSchema.index({ auction: 1, amount: -1 });
bidSchema.index({ user: 1 });

module.exports = mongoose.model('Bid', bidSchema);
