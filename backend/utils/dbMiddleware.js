/**
 * Database middleware for the Student Life Management System
 * Provides middleware functions to check database connection status
 */

const logger = require('./logger');
const dbConnection = require('./dbConnection');

/**
 * Middleware to check if the database is connected
 * If not connected, returns a 503 Service Unavailable response
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const requireDatabaseConnection = (req, res, next) => {
    if (!dbConnection.isDatabaseConnected()) {
        logger.error('Database connection required but not available', {
            path: req.path,
            method: req.method,
            connectionState: dbConnection.getDatabaseConnectionState()
        });
        
        return res.status(503).json({
            status: 'error',
            message: 'Database service is currently unavailable. Please try again later.',
            details: 'The application is experiencing database connectivity issues. Our team has been notified.'
        });
    }
    
    next();
};

module.exports = {
    requireDatabaseConnection
};