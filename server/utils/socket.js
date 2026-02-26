const Auction = require('../models/Auction');
const Bid = require('../models/Bid');

const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Join auction room
    socket.on('join_auction', async (auctionId) => {
      socket.join(auctionId);
      console.log(`Socket ${socket.id} joined auction ${auctionId}`);

      // Get latest bids for this auction
      try {
        const bids = await Bid.find({ auction: auctionId })
          .sort({ amount: -1 })
          .limit(10)
          .populate('user', 'name email');

        const auction = await Auction.findById(auctionId);

        socket.emit('auction_data', {
          auction,
          bids
        });
      } catch (error) {
        console.error('Error fetching auction data:', error);
      }
    });

    // Leave auction room
    socket.on('leave_auction', (auctionId) => {
      socket.leave(auctionId);
      console.log(`Socket ${socket.id} left auction ${auctionId}`);
    });

    // Place bid
    socket.on('place_bid', async (data) => {
      const { auctionId, userId, amount } = data;

      try {
        const auction = await Auction.findById(auctionId);

        if (!auction) {
          socket.emit('bid_error', { message: 'Auction not found' });
          return;
        }

        if (auction.status !== 'active') {
          socket.emit('bid_error', { message: 'Auction is not active' });
          return;
        }

        if (new Date() > auction.endTime) {
          socket.emit('bid_error', { message: 'Auction has ended' });
          return;
        }

        if (amount <= auction.currentPrice) {
          socket.emit('bid_error', { message: 'Bid must be higher than current price' });
          return;
        }

        // Create bid
        const bid = await Bid.create({
          auction: auctionId,
          user: userId,
          amount
        });

        // Update auction
        auction.currentPrice = amount;
        auction.bidCount += 1;
        await auction.save();

        // Populate bid with user info
        const populatedBid = await Bid.findById(bid._id).populate('user', 'name email');

        // Broadcast to all in auction room
        io.to(auctionId).emit('new_bid', {
          bid: populatedBid,
          currentPrice: amount,
          bidCount: auction.bidCount
        });

        // Check if auction should end
        if (new Date() >= auction.endTime) {
          await endAuction(auctionId, io);
        }

      } catch (error) {
        console.error('Error placing bid:', error);
        socket.emit('bid_error', { message: error.message });
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};

// Function to end auction and select winner
const endAuction = async (auctionId, io) => {
  try {
    const auction = await Auction.findById(auctionId)
      .populate('bids')
      .populate('createdBy', 'name email');

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

    // Broadcast auction ended
    io.to(auctionId).emit('auction_ended', {
      auctionId,
      winner: highestBid ? highestBid.user : null,
      finalPrice: auction.currentPrice
    });

    // Send notification to winner
    if (highestBid) {
      io.emit('notification', {
        userId: highestBid.user._id,
        type: 'win',
        message: `Congratulations! You won the auction: ${auction.title}`,
        auction: {
          id: auction._id,
          title: auction.title,
          finalPrice: auction.currentPrice
        }
      });
    }

  } catch (error) {
    console.error('Error ending auction:', error);
  }
};

// Export for scheduler use
module.exports = setupSocket;
module.exports.endAuction = endAuction;
