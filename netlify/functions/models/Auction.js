const mongoose = require('mongoose');

const AuctionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  image: {
    type: String,
    required: [true, 'Please provide an image URL']
  },
  startingPrice: {
    type: Number,
    required: [true, 'Please provide a starting price']
  },
  currentPrice: {
    type: Number,
    required: true,
    default: 0
  },
  endTime: {
    type: Date,
    required: [true, 'Please provide an end time']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'ended', 'cancelled'],
    default: 'active'
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  bids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bid'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update current price when bid is placed
AuctionSchema.methods.updatePrice = async function(newPrice) {
  this.currentPrice = newPrice;
  this.updatedAt = Date.now();
  await this.save();
};

// Check if auction has ended
AuctionSchema.methods.hasEnded = function() {
  return new Date() > this.endTime;
};

module.exports = mongoose.model('Auction', AuctionSchema);
