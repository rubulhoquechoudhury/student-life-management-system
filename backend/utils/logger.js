/**
 * Simple logger utility for the Student Life Management System
 */

const fs = require('fs');
const path = require('path');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
    try {
        fs.mkdirSync(logsDir);
    } catch (err) {
        console.error('Error creating logs directory:', err);
    }
}

// Log levels
const LOG_LEVELS = {
    ERROR: 'ERROR',
    WARN: 'WARN',
    INFO: 'INFO',
    DEBUG: 'DEBUG'
};

// Get current timestamp
const getTimestamp = () => {
    return new Date().toISOString();
};

// Format log message
const formatLogMessage = (level, message, meta = {}) => {
    return `[${getTimestamp()}] [${level}] ${message} ${
        Object.keys(meta).length ? JSON.stringify(meta) : ''
    }`;
};

// Write to console and optionally to file
const log = (level, message, meta = {}) => {
    const formattedMessage = formatLogMessage(level, message, meta);
    
    // Always log to console
    switch (level) {
        case LOG_LEVELS.ERROR:
            console.error(formattedMessage);
            break;
        case LOG_LEVELS.WARN:
            console.warn(formattedMessage);
            break;
        case LOG_LEVELS.INFO:
            console.info(formattedMessage);
            break;
        case LOG_LEVELS.DEBUG:
            console.debug(formattedMessage);
            break;
        default:
            console.log(formattedMessage);
    }
    
    // In production, also log to file
    if (process.env.NODE_ENV === 'production') {
        try {
            const logFile = path.join(logsDir, `${new Date().toISOString().split('T')[0]}.log`);
            fs.appendFileSync(logFile, formattedMessage + '\n');
        } catch (err) {
            console.error('Error writing to log file:', err);
        }
    }
};

// Logger methods
const logger = {
    error: (message, meta = {}) => log(LOG_LEVELS.ERROR, message, meta),
    warn: (message, meta = {}) => log(LOG_LEVELS.WARN, message, meta),
    info: (message, meta = {}) => log(LOG_LEVELS.INFO, message, meta),
    debug: (message, meta = {}) => log(LOG_LEVELS.DEBUG, message, meta)
};

module.exports = logger;