import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('bids');
  const [myBids, setMyBids] = useState([]);
  const [myWins, setMyWins] = useState([]);
  const [joinedAuctions, setJoinedAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bidsRes, winsRes, joinedRes] = await Promise.all([
        userAPI.getMyBids(),
        userAPI.getMyWins(),
        userAPI.getJoinedAuctions()
      ]);
      setMyBids(bidsRes.data.data);
      setMyWins(winsRes.data.data);
      setJoinedAuctions(joinedRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'bids', label: 'My Bids', count: myBids.length },
    { id: 'wins', label: 'My Wins', count: myWins.length },
    { id: 'joined', label: 'Joined Auctions', count: joinedAuctions.length }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="pt-32 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-white mb-2">
              Welcome back, <span className="gradient-text">{user?.name}</span>!
            </h1>
            <p className="text-slate-400">Manage your bids and see your wins</p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {tabs.map((tab, index) => (
              <motion.div
                key={tab.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-xl p-6 cursor-pointer"
                onClick={() => setActiveTab(tab.id)}
              >
                <p className="text-slate-400 text-sm">{tab.label}</p>
                <p className="text-3xl font-bold gradient-text">{tab.count}</p>
              </motion.div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="glass-card rounded-xl h-48 shimmer" />
              ))}
            </div>
          ) : (
            <>
              {activeTab === 'bids' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myBids.length > 0 ? myBids.map((bid, index) => (
                    <motion.div
                      key={bid._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-card rounded-xl overflow-hidden"
                    >
                      <img
                        src={bid.auction?.image}
                        alt={bid.auction?.title}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="text-white font-semibold mb-2 line-clamp-1">
                          {bid.auction?.title}
                        </h3>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-slate-400 text-xs">Your Bid</p>
                            <p className="text-primary-400 font-bold font-mono">
                              ${bid.amount.toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-slate-400 text-xs">Status</p>
                            <p className={`text-sm ${bid.auction?.status === 'ended' ? 'text-red-400' : 'text-green-400'}`}>
                              {bid.auction?.status === 'ended' ? 'Ended' : 'Active'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )) : (
                    <div className="col-span-full text-center py-12">
                      <p className="text-slate-400">No bids yet</p>
                      <Link to="/auctions" className="text-primary-400 mt-2 inline-block">
                        Browse auctions
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'wins' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myWins.length > 0 ? myWins.map((auction, index) => (
                    <motion.div
                      key={auction._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-card rounded-xl overflow-hidden border-accent-500/30"
                    >
                      <img
                        src={auction.image}
                        alt={auction.title}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="text-white font-semibold mb-2 line-clamp-1">
                          {auction.title}
                        </h3>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-slate-400 text-xs">Winning Bid</p>
                            <p className="text-accent-400 font-bold font-mono">
                              ${auction.currentPrice.toLocaleString()}
                            </p>
                          </div>
                          <span className="px-3 py-1 bg-accent-500/20 text-accent-400 rounded-full text-xs">
                            🎉 Won
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )) : (
                    <div className="col-span-full text-center py-12">
                      <p className="text-slate-400">No wins yet</p>
                      <Link to="/auctions" className="text-primary-400 mt-2 inline-block">
                        Start bidding
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'joined' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {joinedAuctions.length > 0 ? joinedAuctions.map((auction, index) => (
                    <motion.div
                      key={auction._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-card rounded-xl overflow-hidden"
                    >
                      <img
                        src={auction.image}
                        alt={auction.title}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="text-white font-semibold mb-2 line-clamp-1">
                          {auction.title}
                        </h3>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-slate-400 text-xs">Current Price</p>
                            <p className="text-primary-400 font-bold font-mono">
                              ${auction.currentPrice.toLocaleString()}
                            </p>
                          </div>
                          <Link
                            to={`/auctions/${auction._id}`}
                            className="text-primary-400 text-sm hover:underline"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )) : (
                    <div className="col-span-full text-center py-12">
                      <p className="text-slate-400">No auctions joined yet</p>
                      <Link to="/auctions" className="text-primary-400 mt-2 inline-block">
                        Browse auctions
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Dashboard;
