const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Models
const User = require('../models/User');
const Auction = require('../models/Auction');
const Bid = require('../models/Bid');

// Connect to database
const connectDB = require('../config/db');

const seedData = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Auction.deleteMany({});
    await Bid.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@bidvault.com',
      password: adminPassword,
      role: 'admin'
    });
    console.log('Created admin user: admin@bidvault.com / admin123');

    // Create test users
    const user1Password = await bcrypt.hash('user123', 10);
    const user2Password = await bcrypt.hash('user123', 10);
    const user3Password = await bcrypt.hash('user123', 10);

    const user1 = await User.create({
      name: 'John Doe',
      email: 'john@bidvault.com',
      password: user1Password,
      role: 'user'
    });

    const user2 = await User.create({
      name: 'Jane Smith',
      email: 'jane@bidvault.com',
      password: user2Password,
      role: 'user'
    });

    const user3 = await User.create({
      name: 'Bob Wilson',
      email: 'bob@bidvault.com',
      password: user3Password,
      role: 'user'
    });

    console.log('Created test users:');
    console.log('  - john@bidvault.com / user123');
    console.log('  - jane@bidvault.com / user123');
    console.log('  - bob@bidvault.com / user123');

    // Sample auction images (using placeholder images)
    const auctionImages = [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800',
      'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800',
      'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'
    ];

    // Create auctions
    const auctions = [
      {
        title: 'Vintage Rolex Submariner',
        description: 'A classic vintage Rolex Submariner from the 1960s. This timepiece features the iconic black dial and rotating bezel. Recently serviced with original box and papers.',
        image: auctionImages[0],
        startingPrice: 5000,
        currentPrice: 5000,
        endTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
        createdBy: admin._id,
        status: 'active',
        bidCount: 0
      },
      {
        title: 'Modern Art Painting',
        description: 'Original contemporary abstract art piece by emerging artist. Oil on canvas, signed and dated. Comes with certificate of authenticity.',
        image: auctionImages[1],
        startingPrice: 800,
        currentPrice: 800,
        endTime: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from now
        createdBy: admin._id,
        status: 'active',
        bidCount: 0
      },
      {
        title: 'Luxury Mercedes-Benz Model Car',
        description: '1:18 scale die-cast model of Mercedes-Benz 300SL Gullwing. Limited edition, mint condition with original packaging.',
        image: auctionImages[2],
        startingPrice: 150,
        currentPrice: 150,
        endTime: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
        createdBy: admin._id,
        status: 'active',
        bidCount: 0
      },
      {
        title: 'Professional DSLR Camera',
        description: 'Canon EOS 5D Mark IV professional DSLR camera. Includes 24-70mm f/2.8 lens. Low shutter count, excellent condition.',
        image: auctionImages[3],
        startingPrice: 1200,
        currentPrice: 1200,
        endTime: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours from now
        createdBy: admin._id,
        status: 'active',
        bidCount: 0
      },
      {
        title: 'Antique Chinese Vase',
        description: 'Qing Dynasty blue and white porcelain vase. Expertly authenticated with provenance documentation.',
        image: auctionImages[4],
        startingPrice: 3000,
        currentPrice: 3000,
        endTime: new Date(Date.now() + 72 * 60 * 60 * 1000), // 72 hours from now
        createdBy: admin._id,
        status: 'active',
        bidCount: 0
      },
      {
        title: 'Designer Handbag - Limited Edition',
        description: 'Gucci limited edition handbag, numbered. Black leather with gold hardware. Includes authenticity card and dust bag.',
        image: auctionImages[5],
        startingPrice: 600,
        currentPrice: 600,
        endTime: new Date(Date.now() + 36 * 60 * 60 * 1000), // 36 hours from now
        createdBy: admin._id,
        status: 'active',
        bidCount: 0
      },
      {
        title: 'Vintage Vinyl Record Collection',
        description: 'Collection of 50 rare vinyl records from the 1960s-1980s. Includes many first pressings and rare editions.',
        image: auctionImages[6],
        startingPrice: 400,
        currentPrice: 400,
        endTime: new Date(Date.now() + 18 * 60 * 60 * 1000), // 18 hours from now
        createdBy: admin._id,
        status: 'active',
        bidCount: 0
      },
      {
        title: 'Premium Wireless Headphones',
        description: 'Sony WH-1000XM5 flagship noise-canceling headphones. Like new condition, barely used.',
        image: auctionImages[7],
        startingPrice: 200,
        currentPrice: 200,
        endTime: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours from now
        createdBy: admin._id,
        status: 'active',
        bidCount: 0
      }
    ];

    const createdAuctions = await Auction.insertMany(auctions);
    console.log(`Created ${createdAuctions.length} sample auctions`);

    // Create some sample bids
    const bids = [
      {
        auction: createdAuctions[0]._id,
        user: user1._id,
        amount: 5500,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        auction: createdAuctions[0]._id,
        user: user2._id,
        amount: 6000,
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000)
      },
      {
        auction: createdAuctions[1]._id,
        user: user1._id,
        amount: 900,
        timestamp: new Date(Date.now() - 30 * 60 * 1000)
      },
      {
        auction: createdAuctions[2]._id,
        user: user3._id,
        amount: 180,
        timestamp: new Date(Date.now() - 45 * 60 * 1000)
      }
    ];

    await Bid.insertMany(bids);
    console.log('Created sample bids');

    // Update auction current prices and bid counts
    await Auction.findByIdAndUpdate(createdAuctions[0]._id, {
      currentPrice: 6000,
      bidCount: 2
    });
    await Auction.findByIdAndUpdate(createdAuctions[1]._id, {
      currentPrice: 900,
      bidCount: 1
    });
    await Auction.findByIdAndUpdate(createdAuctions[2]._id, {
      currentPrice: 180,
      bidCount: 1
    });

    console.log('\n✅ Seed completed successfully!');
    console.log('\nTest Accounts:');
    console.log('Admin: admin@bidvault.com / admin123');
    console.log('User: john@bidvault.com / user123');
    console.log('User: jane@bidvault.com / user123');
    console.log('User: bob@bidvault.com / user123');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
