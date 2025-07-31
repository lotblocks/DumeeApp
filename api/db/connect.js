const mongoose = require('mongoose');
const { logger } = require('@dumee/data-schemas');

let isConnected = false;
let connectionRetries = 0;
const maxRetries = 5;

const connectDb = async () => {
  if (isConnected) {
    logger.info('Database already connected');
    return;
  }

  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dumee-dev';
  
  try {
    connectionRetries++;
    logger.info(`Attempting to connect to MongoDB (attempt ${connectionRetries})`);
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });

    isConnected = true;
    connectionRetries = 0;
    logger.info('Successfully connected to MongoDB');
    
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
      isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
      isConnected = true;
    });

  } catch (error) {
    logger.error('MongoDB connection failed:', error);
    isConnected = false;
    
    if (connectionRetries < maxRetries) {
      logger.info(`Retrying connection in 5 seconds... (${connectionRetries}/${maxRetries})`);
      setTimeout(() => connectDb(), 5000);
    } else {
      logger.error('Max connection retries reached. Exiting...');
      process.exit(1);
    }
  }
};

const disconnectDb = async () => {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
    logger.info('Disconnected from MongoDB');
  }
};

module.exports = { connectDb, disconnectDb };
