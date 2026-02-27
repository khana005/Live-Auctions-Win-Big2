const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Get MongoDB URI from environment or use local fallback
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bidvault';
    
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    
    // Don't exit in production - allow server to run
    if (process.env.NODE_ENV !== 'production') {
      console.log('Note: Running in development mode without persistent database.');
    }
  }
};

module.exports = { connectDB };
