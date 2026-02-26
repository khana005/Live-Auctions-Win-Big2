import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { adminAPI, auctionAPI } from '../services/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    startingPrice: '',
    endTime: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, auctionsRes] = await Promise.all([
        adminAPI.getDashboardStats(),
        adminAPI.getAllUsers(),
        auctionAPI.getAll({ limit: 50 })
      ]);
      setStats(statsRes.data.data);
      setUsers(usersRes.data.data);
      setAuctions(auctionsRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAuction = async (e) => {
    e.preventDefault();
    setCreating(true);

    try {
      await auctionAPI.create({
        ...formData,
        startingPrice: parseFloat(formData.startingPrice),
        endTime: new Date(formData.endTime).toISOString()
      });
      toast.success('Auction created successfully!');
      setShowCreateForm(false);
      setFormData({
        title: '',
        description: '',
        image: '',
        startingPrice: '',
        endTime: ''
      });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create auction');
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateUserRole = async (userId, role) => {
    try {
      await adminAPI.updateUserRole(userId, { role });
      toast.success('User role updated!');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update role');
    }
  };

  const handleDeleteAuction = async (auctionId) => {
    if (!confirm('Are you sure you want to delete this auction?')) return;
    
    try {
      await auctionAPI.delete(auctionId);
      toast.success('Auction deleted!');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete auction');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'users', label: 'Users' },
    { id: 'auctions', label: 'Auctions' }
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
            className="flex justify-between items-center mb-8"
          >
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Admin <span className="gradient-text">Dashboard</span>
              </h1>
              <p className="text-slate-400">Manage your platform</p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn-primary"
            >
              + Create Auction
            </button>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="glass-card rounded-xl h-32 shimmer" />
              ))}
            </div>
          ) : (
            <>
              {activeTab === 'overview' && stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: 'from-blue-500 to-blue-600' },
                    { label: 'Total Auctions', value: stats.totalAuctions, icon: '🏆', color: 'from-purple-500 to-purple-600' },
                    { label: 'Active Auctions', value: stats.activeAuctions, icon: '⚡', color: 'from-green-500 to-green-600' },
                    { label: 'Total Bids', value: stats.totalBids, icon: '💰', color: 'from-amber-500 to-amber-600' }
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-card rounded-xl p-6"
                    >
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-2xl mb-4`}>
                        {stat.icon}
                      </div>
                      <p className="text-slate-400 text-sm">{stat.label}</p>
                      <p className="text-3xl font-bold text-white">{stat.value}</p>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === 'users' && (
                <div className="glass-card rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-800/50">
                        <tr>
                          <th className="px-6 py-4 text-left text-slate-400 text-sm">User</th>
                          <th className="px-6 py-4 text-left text-slate-400 text-sm">Email</th>
                          <th className="px-6 py-4 text-left text-slate-400 text-sm">Role</th>
                          <th className="px-6 py-4 text-left text-slate-400 text-sm">Joined</th>
                          <th className="px-6 py-4 text-left text-slate-400 text-sm">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700">
                        {users.map((user) => (
                          <tr key={user._id} className="hover:bg-slate-800/30">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold">
                                  {user.name.charAt(0)}
                                </div>
                                <span className="text-white font-medium">{user.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-slate-400">{user.email}</td>
                            <td className="px-6 py-4">
                              <select
                                value={user.role}
                                onChange={(e) => handleUpdateUserRole(user._id, e.target.value)}
                                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-white text-sm"
                              >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 text-slate-400 text-sm">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => handleUpdateUserRole(user._id, user.role === 'admin' ? 'user' : 'admin')}
                                className="text-primary-400 hover:underline text-sm"
                              >
                                Toggle Role
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'auctions' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {auctions.map((auction) => (
                    <motion.div
                      key={auction._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-card rounded-xl overflow-hidden"
                    >
                      <img
                        src={auction.image}
                        alt={auction.title}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-white font-semibold line-clamp-1">{auction.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            auction.status === 'active' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {auction.status}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-slate-400 text-xs">Current Price</p>
                            <p className="text-primary-400 font-bold font-mono">
                              ${auction.currentPrice?.toLocaleString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Link
                              to={`/auctions/${auction._id}`}
                              className="text-primary-400 hover:underline text-sm"
                            >
                              View
                            </Link>
                            <button
                              onClick={() => handleDeleteAuction(auction._id)}
                              className="text-red-400 hover:underline text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Create Auction Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl p-6 w-full max-w-lg"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Create New Auction</h2>
            <form onSubmit={handleCreateAuction} className="space-y-4">
              <div>
                <label className="block text-slate-300 mb-2">Title</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="Enter auction title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-2">Description</label>
                <textarea
                  required
                  className="input-field"
                  placeholder="Enter description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-2">Image URL</label>
                <input
                  type="url"
                  required
                  className="input-field"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-2">Starting Price</label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="input-field"
                    placeholder="100"
                    value={formData.startingPrice}
                    onChange={(e) => setFormData({ ...formData, startingPrice: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-2">End Time</label>
                  <input
                    type="datetime-local"
                    required
                    className="input-field"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 btn-primary disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create Auction'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AdminDashboard;
