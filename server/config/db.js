const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectDB = async () => {
  try {
    // Start in-memory MongoDB server
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Memory Server Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('Note: Server will run but database features will be unavailable.');
    console.log('To fix: Install MongoDB locally or use MongoDB Atlas cloud database.');
  }
};

// Export function to stop the memory server when needed
const stopMongoDB = async () => {
  if (mongoServer) {
    await mongoServer.stop();
  }
};

module.exports = { connectDB, stopMongoDB };
