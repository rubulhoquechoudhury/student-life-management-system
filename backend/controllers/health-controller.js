/**
 * Health check controller for the Student Life Management System
 * Provides endpoints to check the health of the application and its dependencies
 */

const mongoose = require('mongoose');
const logger = require('../utils/logger');
const dbConnection = require('../utils/dbConnection');

/**
 * Get the health status of the application
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getHealthStatus = async (req, res) => {
    try {
        // Check database connection
        const dbStatus = dbConnection.isDatabaseConnected() ? 'connected' : 'disconnected';
        const dbState = dbConnection.getDatabaseConnectionState();
        
        // Build health status response
        const healthStatus = {
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development',
            database: {
                status: dbStatus,
                state: dbState
            }
        };
        
        // If database is not connected, change overall status
        if (dbStatus !== 'connected') {
            healthStatus.status = 'degraded';
        }
        
        res.status(200).json(healthStatus);
    } catch (error) {
        logger.error('Error in health check endpoint:', { error: error.message });
        res.status(500).json({ 
            status: 'error',
            message: 'Error checking system health',
            error: error.message
        });
    }
};

/**
 * Get detailed database status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getDatabaseStatus = async (req, res) => {
    try {
        // Check if database is connected
        const isConnected = dbConnection.isDatabaseConnected();
        const connectionState = dbConnection.getDatabaseConnectionState();
        
        // If connected, try to ping the database
        let pingResult = null;
        if (isConnected) {
            try {
                // Try to execute a simple command to verify connection
                const adminDb = mongoose.connection.db.admin();
                const result = await adminDb.ping();
                pingResult = result.ok === 1 ? 'successful' : 'failed';
            } catch (pingError) {
                logger.error('Database ping failed:', { error: pingError.message });
                pingResult = 'failed';
            }
        }
        
        // Build database status response
        const dbStatus = {
            connected: isConnected,
            state: connectionState,
            ping: pingResult,
            name: mongoose.connection.name || 'not_connected',
            host: mongoose.connection.host || 'not_connected',
            port: mongoose.connection.port || 'not_connected',
            models: Object.keys(mongoose.models)
        };
        
        res.status(200).json(dbStatus);
    } catch (error) {
        logger.error('Error checking database status:', { error: error.message });
        res.status(500).json({ 
            status: 'error',
            message: 'Error checking database status',
            error: error.message
        });
    }
};

module.exports = {
    getHealthStatus,
    getDatabaseStatus
};