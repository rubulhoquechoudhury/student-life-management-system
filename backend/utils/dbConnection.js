/**
 * Database connection utility for the Student Life Management System
 * Provides enhanced error handling and reconnection logic for MongoDB
 */

const mongoose = require('mongoose');
const logger = require('./logger');

// Maximum number of reconnection attempts
const MAX_RECONNECT_ATTEMPTS = 5;
// Initial reconnection delay in milliseconds (will be increased with backoff)
const INITIAL_RECONNECT_DELAY = 1000;

// Track reconnection attempts
let reconnectAttempts = 0;

/**
 * Connect to MongoDB with enhanced error handling and reconnection logic
 * @param {string} mongoUrl - MongoDB connection string
 * @returns {Promise} - Resolves when connected, rejects after max attempts
 */
const connectToDatabase = (mongoUrl) => {
  return new Promise((resolve, reject) => {
    // Connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      heartbeatFrequencyMS: 10000, // Check server status every 10 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4 // Use IPv4, skip trying IPv6
    };

    // Attempt to connect
    mongoose
      .connect(mongoUrl, options)
      .then(() => {
        // Reset reconnection attempts on successful connection
        reconnectAttempts = 0;
        logger.info("Connected to MongoDB successfully");
        
        // Set up event listeners for connection issues
        setupConnectionMonitoring();
        
        resolve();
      })
      .catch((err) => {
        handleConnectionError(err, mongoUrl, resolve, reject);
      });
  });
};

/**
 * Set up event listeners to monitor database connection
 */
const setupConnectionMonitoring = () => {
  const db = mongoose.connection;
  
  // Handle connection errors after initial connection
  db.on('error', (err) => {
    logger.error('MongoDB connection error after initial connection:', { 
      error: err.message,
      stack: err.stack
    });
    
    // If the connection is lost, attempt to reconnect
    if (!db.readyState) {
      attemptReconnection();
    }
  });
  
  // Log when disconnected
  db.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
    attemptReconnection();
  });
  
  // Log reconnection
  db.on('reconnected', () => {
    logger.info('MongoDB reconnected');
    reconnectAttempts = 0;
  });
};

/**
 * Handle database connection errors with detailed logging
 */
const handleConnectionError = (err, mongoUrl, resolve, reject) => {
  // Categorize database connection errors for better diagnostics
  let errorType = "Unknown Error";
  let recommendedAction = "Check your database configuration and network connection.";
  
  if (err.name === 'MongoServerSelectionError') {
    errorType = "Server Selection Error";
    recommendedAction = "Verify that your MongoDB server is running and accessible.";
  } else if (err.name === 'MongoNetworkError') {
    errorType = "Network Error";
    recommendedAction = "Check your network connection and firewall settings.";
  } else if (err.name === 'MongoParseError') {
    errorType = "Connection String Parse Error";
    recommendedAction = "Verify that your MONGO_URL is correctly formatted.";
  } else if (err.name === 'MongoTimeoutError') {
    errorType = "Timeout Error";
    recommendedAction = "The database connection timed out. Check server load or network latency.";
  } else if (err.message.includes('Authentication failed')) {
    errorType = "Authentication Error";
    recommendedAction = "Verify your database username and password.";
  } else if (err.message.includes('ECONNREFUSED')) {
    errorType = "Connection Refused";
    recommendedAction = "Ensure MongoDB is running on the specified host and port.";
  }
  
  logger.error(`Database connection failed: ${errorType}`, { 
    error: err.message,
    stack: err.stack,
    mongoUrl: mongoUrl ? mongoUrl.replace(/mongodb(\+srv)?:\/\/[^:]+:[^@]+@/, 'mongodb$1://****:****@') : 'undefined',
    recommendedAction: recommendedAction,
    reconnectAttempt: reconnectAttempts + 1,
    maxReconnectAttempts: MAX_RECONNECT_ATTEMPTS
  });
  
  // Log additional information for debugging
  logger.debug("MongoDB connection details", {
    mongoVersion: mongoose.version,
    nodeVersion: process.version,
    platform: process.platform
  });
  
  // Attempt to reconnect with exponential backoff
  if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
    reconnectAttempts++;
    const delay = INITIAL_RECONNECT_DELAY * Math.pow(2, reconnectAttempts - 1);
    
    logger.info(`Attempting to reconnect to MongoDB (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}) in ${delay}ms`);
    
    setTimeout(() => {
      connectToDatabase(mongoUrl)
        .then(resolve)
        .catch(() => {
          // If we've reached max attempts, reject the promise
          if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
            reject(new Error(`Failed to connect to MongoDB after ${MAX_RECONNECT_ATTEMPTS} attempts`));
          }
        });
    }, delay);
  } else {
    logger.error(`Failed to connect to MongoDB after ${MAX_RECONNECT_ATTEMPTS} attempts. Server will continue to run, but database functionality will be unavailable.`);
    reject(err);
  }
};

/**
 * Attempt to reconnect to the database
 */
const attemptReconnection = () => {
  if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
    reconnectAttempts++;
    const delay = INITIAL_RECONNECT_DELAY * Math.pow(2, reconnectAttempts - 1);
    
    logger.info(`Attempting to reconnect to MongoDB (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}) in ${delay}ms`);
    
    setTimeout(() => {
      mongoose
        .connect(process.env.MONGO_URL, {
          useNewUrlParser: true,
          useUnifiedTopology: true
        })
        .then(() => {
          logger.info('MongoDB reconnected successfully');
          reconnectAttempts = 0;
        })
        .catch((err) => {
          logger.error('MongoDB reconnection failed:', { 
            error: err.message,
            reconnectAttempt: reconnectAttempts,
            maxReconnectAttempts: MAX_RECONNECT_ATTEMPTS
          });
          
          // If we've reached max attempts, log a critical error
          if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
            logger.error(`Failed to reconnect to MongoDB after ${MAX_RECONNECT_ATTEMPTS} attempts. Database functionality will be unavailable until the server is restarted.`);
          }
        });
    }, delay);
  }
};

/**
 * Check if the database connection is healthy
 * @returns {boolean} - True if connected, false otherwise
 */
const isDatabaseConnected = () => {
  return mongoose.connection.readyState === 1;
};

/**
 * Get the current database connection state
 * @returns {string} - Human-readable connection state
 */
const getDatabaseConnectionState = () => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
    99: 'uninitialized'
  };
  return states[mongoose.connection.readyState] || 'unknown';
};

module.exports = {
  connectToDatabase,
  isDatabaseConnected,
  getDatabaseConnectionState
};