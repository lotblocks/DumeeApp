const { connectDb, disconnectDb } = require('./connect');
const { logger } = require('@dumee/data-schemas');

// Index synchronization function
const indexSync = async () => {
  try {
    logger.info('Starting index synchronization...');
    
    // Import models to ensure indexes are created
    const models = require('./models');
    
    // Sync indexes for all models
    const modelNames = Object.keys(models);
    const syncPromises = modelNames.map(async (modelName) => {
      try {
        await models[modelName].syncIndexes();
        logger.info(`Synced indexes for ${modelName}`);
      } catch (error) {
        logger.warn(`Failed to sync indexes for ${modelName}:`, error.message);
      }
    });
    
    await Promise.all(syncPromises);
    logger.info('Index synchronization completed successfully');
    
  } catch (error) {
    logger.error('Index synchronization failed:', error);
    throw error;
  }
};

module.exports = {
  connectDb,
  disconnectDb,
  indexSync,
  ...require('./models')
};
