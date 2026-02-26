import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CountdownTimer from '../components/CountdownTimer';
import { useAuth } from '../context/AuthContext';
import { auctionAPI, bidAPI } from '../services/api';
import { socket, joinAuction, leaveAuction, setupSocketListeners, connectSocket } from '../services/socket';

const AuctionDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState('');
  const [placingBid, setPlacingBid] = useState(false);
  const [isEnded, setIsEnded] = useState(false);

  useEffect(() => {
    fetchAuctionData();
    connectSocket();
    
    // Setup socket listeners
    setupSocketListeners({
      onNewBid: handleNewBid,
      onAuctionEnded: handleAuctionEnded,
      onNotification: handleNotification
    });

    // Join auction room
    joinAuction(id);

    return () => {
      leaveAuction(id);
    };
  }, [id]);

  const fetchAuctionData = async () => {
    try {
      const [auctionRes, bidsRes] = await Promise.all([
        auctionAPI.getById(id),
        bidAPI.getAuctionBids(id)
      ]);
      setAuction(auctionRes.data.data);
      setBids(bidsRes.data.data);
      
      // Check if auction is ended
      if (auctionRes.data.data.status === 'ended') {
        setIsEnded(true);
      }
    } catch (error) {
      console.error('Error fetching auction:', error);
      toast.error('Failed to load auction');
    } finally {
      setLoading(false);
    }
  };

  const handleNewBid = (data) => {
    setBids(prev => [data.bid, ...prev]);
    setAuction(prev => ({
      ...prev,
      currentPrice: data.currentPrice,
      bidCount: data.bidCount
    }));
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} bg-slate-800 border border-primary-500 p-4 rounded-lg shadow-lg`}>
        <p className="text-white font-semibold">New Bid!</p>
        <p className="text-slate-400">${data.bid.amount.toLocaleString()} by {data.bid.user?.name}</p>
      </div>
    ));
  };

  const handleAuctionEnded = (data) => {
    setIsEnded(true);
    setAuction(prev => ({ ...prev, status: 'ended' }));
    
    if (data.winner && data.winner._id === user?.id) {
      toast.success('🎉 Congratulations! You won this auction!');
    }
  };

  const handleNotification = (data) => {
    if (data.userId === user?.id) {
      toast.success(data.message);
    }
  };

  const handlePlaceBid = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to place a bid');
      return;
    }

    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount <= auction.currentPrice) {
      toast.error(`Bid must be higher than $${auction.currentPrice}`);
      return;
    }

    setPlacingBid(true);
    try {
      await bidAPI.placeBid({ auctionId: id, amount });
      toast.success('Bid placed successfully!');
      setBidAmount('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place bid');
    } finally {
      setPlacingBid(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-32 container mx-auto px-4">
          <div className="glass-card rounded-2xl h-96 shimmer" />
        </div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-32 container mx-auto px-4 text-center">
          <h2 className="text-2xl text-white">Auction not found</h2>
          <Link to="/auctions" className="text-primary-400 mt-4 inline-block">Back to Auctions</Link>
        </div>
      </div>
    );
  }

  const isWinner = auction.winner && user && auction.winner._id === user.id;

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="pt-32 pb-12">
        <div className="container mx-auto px-4">
          <Link to="/auctions" className="inline-flex items-center text-slate-400 hover:text-white mb-6">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Auctions
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="glass-card rounded-2xl overflow-hidden">
                <img
                  src={auction.image}
                  alt={auction.title}
                  className="w-full h-[400px] object-cover"
                />
              </div>
            </motion.div>

            {/* Info Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Status Badge */}
              <div className="flex items-center gap-3">
                {isEnded ? (
                  <span className="px-4 py-1.5 bg-red-500/20 text-red-400 rounded-full text-sm font-medium border border-red-500/30">
                    Auction Ended
                  </span>
                ) : (
                  <span className="px-4 py-1.5 bg-green-500/20 text-green-400 rounded-full text-sm font-medium border border-green-500/30 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    Live Auction
                  </span>
                )}
                <span className="text-slate-400 text-sm">{auction.bidCount} bids</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-white">{auction.title}</h1>

              {/* Description */}
              <p className="text-slate-300">{auction.description}</p>

              {/* Timer (only for active auctions) */}
              {!isEnded && (
                <div className="glass-card rounded-xl p-4">
                  <p className="text-slate-400 text-sm mb-2">Auction ends in:</p>
                  <CountdownTimer endTime={auction.endTime} />
                </div>
              )}

              {/* Current Price */}
              <div className="glass-card rounded-xl p-6">
                <p className="text-slate-400 text-sm">Current Bid</p>
                <p className="text-4xl font-bold gradient-text font-mono">
                  ${auction.currentPrice?.toLocaleString()}
                </p>
              </div>

              {/* Winner Info */}
              {isEnded && auction.winner && (
                <div className={`glass-card rounded-xl p-6 ${isWinner ? 'border-accent-500 glow-accent' : ''}`}>
                  <p className="text-slate-400 text-sm mb-2">Winner</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-white font-bold text-lg">
                      {auction.winner.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-semibold">{auction.winner.name}</p>
                      {isWinner && (
                        <p className="text-accent-400 text-sm">🎉 Congratulations!</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Bid Form (only for active auctions) */}
              {!isEnded && (
                <form onSubmit={handlePlaceBid} className="space-y-4">
                  <div className="flex gap-4">
                    <input
                      type="number"
                      placeholder={`Min $${auction.currentPrice + 1}`}
                      className="input-field flex-1"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      min={auction.currentPrice + 1}
                    />
                    <button
                      type="submit"
                      disabled={placingBid}
                      className="btn-primary px-8 disabled:opacity-50"
                    >
                      {placingBid ? 'Placing...' : 'Place Bid'}
                    </button>
                  </div>
                  <p className="text-slate-400 text-sm">
                    Minimum bid: ${auction.currentPrice + 1}
                  </p>
                </form>
              )}
            </motion.div>
          </div>

          {/* Bids History */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">Bid History</h2>
            {bids.length > 0 ? (
              <div className="glass-card rounded-xl overflow-hidden">
                <div className="divide-y divide-slate-700">
                  {bids.map((bid, index) => (
                    <motion.div
                      key={bid._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 flex items-center justify-between ${index === 0 ? 'bg-primary-500/10' : ''}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold">
                          {bid.user?.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white font-medium">{bid.user?.name}</p>
                          <p className="text-slate-400 text-sm">
                            {new Date(bid.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-xl font-bold font-mono ${index === 0 ? 'text-primary-400' : 'text-white'}`}>
                          ${bid.amount.toLocaleString()}
                        </p>
                        {index === 0 && (
                          <span className="text-xs text-primary-400">Highest Bid</span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="glass-card rounded-xl p-8 text-center">
                <p className="text-slate-400">No bids yet. Be the first to bid!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AuctionDetail;
