import { io } from 'socket.io-client';

// Use environment variable or fallback to localhost for development
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

// Check if we're in production
const isProduction = import.meta.env.PROD || !import.meta.env.VITE_DEV_MODE;

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: isProduction ? 3 : 5,
  // Use polling for production (WebSocket may not work)
  transports: isProduction ? ['polling'] : ['websocket', 'polling']
});

// Socket event listeners
export const setupSocketListeners = (handlers) => {
  const { onNewBid, onAuctionEnded, onNotification, onAuctionData } = handlers;

  socket.on('new_bid', (data) => {
    if (onNewBid) onNewBid(data);
  });

  socket.on('auction_ended', (data) => {
    if (onAuctionEnded) onAuctionEnded(data);
  });

  socket.on('notification', (data) => {
    if (onNotification) onNotification(data);
  });

  socket.on('auction_data', (data) => {
    if (onAuctionData) onAuctionData(data);
  });

  socket.on('bid_error', (error) => {
    console.error('Bid error:', error);
  });
};

// Join auction room
export const joinAuction = (auctionId) => {
  socket.emit('join_auction', auctionId);
};

// Leave auction room
export const leaveAuction = (auctionId) => {
  socket.emit('leave_auction', auctionId);
};

// Place bid via socket
export const placeBidSocket = (auctionId, userId, amount) => {
  socket.emit('place_bid', { auctionId, userId, amount });
};

// Connect socket
export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

// Disconnect socket
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export default socket;
