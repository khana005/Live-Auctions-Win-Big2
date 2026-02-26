import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AuctionCard from '../components/AuctionCard';
import { auctionAPI } from '../services/api';

const Home = () => {
  const [featuredAuctions, setFeaturedAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await auctionAPI.getFeatured();
        setFeaturedAuctions(response.data.data);
      } catch (error) {
        console.error('Error fetching featured auctions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  // Sample auction data with real images from Unsplash
  const sampleAuctions = [
    {
      _id: '1',
      title: 'Vintage Rolex Submariner',
      description: 'Rare 1960s Rolex Submariner in excellent condition with original box',
      image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80',
      currentPrice: 15000,
      bidCount: 24,
      endTime: new Date(Date.now() + 86400000 * 2).toISOString(),
      status: 'active'
    },
    {
      _id: '2',
      title: 'Original Banksy Print',
      description: 'Authenticated Banksy Girl with Balloon limited edition print',
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80',
      currentPrice: 8500,
      bidCount: 18,
      endTime: new Date(Date.now() + 86400000 * 3).toISOString(),
      status: 'active'
    },
    {
      _id: '3',
      title: 'Classic Ferrari 250 GTO',
      description: '1:18 scale die-cast model of the legendary Ferrari 250 GTO',
      image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80',
      currentPrice: 2200,
      bidCount: 42,
      endTime: new Date(Date.now() + 86400000 * 1).toISOString(),
      status: 'active'
    }
  ];

  const displayAuctions = featuredAuctions.length > 0 ? featuredAuctions : sampleAuctions;

  const categories = [
    { name: 'Luxury Watches', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&q=80', count: '2.5K+', icon: '⌚' },
    { name: 'Art and Collectibles', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&q=80', count: '5K+', icon: '🎨' },
    { name: 'Classic Cars', image: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=400&q=80', count: '1.2K+', icon: '🚗' },
    { name: 'Designer Bags', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80', count: '3K+', icon: '👜' },
    { name: 'Sports Memorabilia', image: 'https://images.unsplash.com/photo-1461896836934-60ccfa7d6a1?w=400&q=80', count: '4K+', icon: '🏆' },
    { name: 'Antiques', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', count: '2K+', icon: '🏺' }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Art Collector',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
      text: 'BidVault made it so easy to find authentic art pieces. Won an amazing Banksy print!'
    },
    {
      name: 'Michael Chen',
      role: 'Watch Enthusiast',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
      text: 'The real-time bidding is thrilling. Found my dream Rolex at a great price!'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Vintage Car Collector',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80',
      text: 'Best auction platform I have used. Secure, transparent, and amazing selection!'
    }
  ];

  const socialLinks = [
    { name: 'Twitter', icon: '𝕏', url: 'https://twitter.com/bidvault' },
    { name: 'Instagram', icon: '📷', url: 'https://instagram.com/bidvault' },
    { name: 'Facebook', icon: 'f', url: 'https://facebook.com/bidvault' },
    { name: 'YouTube', icon: '▶', url: 'https://youtube.com/bidvault' }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 animated-bg" />
        
        {/* Floating Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -100, 0],
              y: [0, 50, 0],
              scale: [1, 1.5, 1]
            }}
            transition={{ duration: 25, repeat: Infinity }}
            className="absolute top-1/3 right-1/4 w-80 h-80 bg-secondary-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, 50, 0],
              y: [0, 100, 0],
            }}
            transition={{ duration: 15, repeat: Infinity }}
            className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">Live Auctions</span>
              <br />
              <span className="text-white">Win Big</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-2xl mx-auto">
              Experience the thrill of real-time bidding. Join thousands of collectors competing for unique items worldwide.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auctions" className="btn-primary text-lg px-8 py-4">
                Browse Auctions
              </Link>
              <Link to="/register" className="btn-secondary text-lg px-8 py-4">
                Create Account
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { number: '10K+', label: 'Active Bidders' },
              { number: '5K+', label: 'Auctions' },
              { number: '$2M+', label: 'Total Bids' },
              { number: '99%', label: 'Satisfaction' }
            ].map((stat, index) => (
              <div key={index} className="glass-card rounded-xl p-6">
                <p className="text-4xl font-bold gradient-text mb-2">{stat.number}</p>
                <p className="text-slate-400">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-slate-500 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-primary-500 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Browse by <span className="gradient-text">Category</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Explore our diverse collection of premium items across multiple categories
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="glass-card rounded-2xl overflow-hidden cursor-pointer group"
              >
                <div className="relative h-32">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                  <div className="absolute bottom-2 left-3">
                    <span className="text-2xl">{category.icon}</span>
                    <h3 className="text-white font-semibold text-sm">{category.name}</h3>
                    <p className="text-primary-400 text-xs">{category.count} items</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Auctions Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Featured <span className="gradient-text">Auctions</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Discover our most popular items up for bidding. Do not miss your chance to own something extraordinary.
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass-card rounded-2xl h-80 shimmer" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayAuctions.slice(0, 6).map((auction, index) => (
                <AuctionCard key={auction._id} auction={auction} index={index} />
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link to="/auctions" className="btn-secondary inline-block">
              View All Auctions
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              What Our <span className="gradient-text">Users Say</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Join thousands of satisfied bidders who found their dream items on BidVault
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="glass-card rounded-2xl p-6"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="text-white font-semibold">{testimonial.name}</h4>
                    <p className="text-slate-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-slate-300 italic">"{testimonial.text}"</p>
                <div className="flex mt-4 text-accent-400">★★★★★</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-8 md:p-12 text-center"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Stay <span className="gradient-text">Connected</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto mb-8">
              Follow us on social media for exclusive deals, new arrivals, and auction updates
            </p>
            
            {/* Social Media Links */}
            <div className="flex justify-center gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-white text-xl hover:bg-primary-500 transition-all"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1559523161-0fc0d8b38a7a?w=1600&q=80"
                alt="Auction"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/50" />
            </div>
            <div className="relative z-10 py-16 px-8 md:py-24 md:px-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Start <span className="gradient-text">Bidding?</span>
              </h2>
              <p className="text-xl text-slate-300 mb-8 max-w-xl">
                Join over 10,000 collectors worldwide. Create your free account today and start winning amazing items!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register" className="btn-primary text-lg px-8 py-4">
                  Get Started Free
                </Link>
                <Link to="/auctions" className="btn-secondary text-lg px-8 py-4">
                  Explore Auctions
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Getting started is easy. Follow these simple steps to start bidding on your favorite items.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '👤', title: 'Create Account', description: 'Sign up for free and verify your email to start bidding on auctions.' },
              { icon: '🔍', title: 'Find Items', description: 'Browse through thousands of unique items and find what you love.' },
              { icon: '💰', title: 'Place Bids', description: 'Place your bids and watch in real-time as others compete for the same item.' }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="glass-card rounded-2xl p-8 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-2xl">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-slate-400">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
