const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide an auction title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  image: {
    type: String,
    required: [true, 'Please provide an image URL'],
  },
  startingPrice: {
    type: Number,
    required: [true, 'Please provide a starting price'],
    min: [1, 'Starting price must be at least 1']
  },
  currentPrice: {
    type: Number,
    required: true,
    default: function() {
      return this.startingPrice;
    }
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
  bidCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for faster queries
auctionSchema.index({ status: 1, endTime: 1 });
auctionSchema.index({ createdBy: 1 });

// Virtual for checking if auction is expired
auctionSchema.virtual('isExpired').get(function() {
  return new Date() > this.endTime;
});

// Check if auction should be ended
auctionSchema.methods.shouldEnd = function() {
  return new Date() >= this.endTime && this.status === 'active';
};

module.exports = mongoose.model('Auction', auctionSchema);
