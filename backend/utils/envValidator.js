/**
 * Environment variable validation utility
 * 
 * This utility provides functions to validate environment variables
 * and ensure they meet the required format and constraints.
 */

const logger = require('./logger');

/**
 * Configuration for environment variables
 * @typedef {Object} EnvVarConfig
 * @property {boolean} required - Whether the variable is required
 * @property {*} [default] - Default value if not provided
 * @property {string} description - Description of the variable
 * @property {Function} [validate] - Validation function
 * @property {string} [errorMessage] - Custom error message for validation failure
 */

/**
 * Validates environment variables against the provided configuration
 * 
 * @param {Object.<string, EnvVarConfig>} envConfig - Configuration for environment variables
 * @returns {Object} - Object containing validation results
 */
function validateEnvVars(envConfig) {
    const missingVars = [];
    const invalidVars = [];
    const defaults = {};

    for (const [key, config] of Object.entries(envConfig)) {
        // Check if required variables are present
        if (config.required && !process.env[key]) {
            missingVars.push({
                name: key,
                description: config.description
            });
        }
        
        // Validate format if validation function exists and variable is present
        if (config.validate && process.env[key] && !config.validate(process.env[key])) {
            invalidVars.push({
                name: key,
                message: config.errorMessage || `Invalid format for ${key}`
            });
        }
        
        // Set default values for optional variables if not provided
        if (!config.required && !process.env[key] && config.default !== undefined) {
            process.env[key] = config.default.toString();
            defaults[key] = config.default;
        }
    }

    return { missingVars, invalidVars, defaults };
}

/**
 * Handles validation errors by logging them and optionally exiting the process
 * 
 * @param {Object} validationResult - Result from validateEnvVars
 * @param {boolean} exitOnError - Whether to exit the process on validation error
 */
function handleValidationErrors(validationResult, exitOnError = true) {
    const { missingVars, invalidVars, defaults } = validationResult;
    
    // Log defaults being used
    Object.entries(defaults).forEach(([key, value]) => {
        logger.info(`Using default value for ${key}: ${value}`);
    });

    // Handle missing required variables
    if (missingVars.length > 0) {
        logger.error('Missing required environment variables:', { missingVars });
        logger.error('Please check your .env file or environment configuration.');
        
        // Provide detailed information about each missing variable
        missingVars.forEach(variable => {
            logger.error(`- ${variable.name}: ${variable.description}`);
        });
        
        if (exitOnError) {
            process.exit(1);
        }
    }

    // Handle invalid variables
    if (invalidVars.length > 0) {
        logger.error('Invalid environment variables:', { invalidVars });
        
        // Provide detailed information about each invalid variable
        invalidVars.forEach(variable => {
            logger.error(`- ${variable.name}: ${variable.message}`);
        });
        
        if (exitOnError) {
            process.exit(1);
        }
    }

    // Log successful validation if no errors
    if (missingVars.length === 0 && invalidVars.length === 0) {
        logger.info('Environment variables validated successfully');
    }

    return missingVars.length === 0 && invalidVars.length === 0;
}

/**
 * Validates URL format
 * 
 * @param {string} url - URL to validate
 * @returns {boolean} - Whether the URL is valid
 */
function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (err) {
        return false;
    }
}

/**
 * Validates comma-separated list of URLs
 * 
 * @param {string} urlList - Comma-separated list of URLs
 * @returns {boolean} - Whether all URLs are valid
 */
function areValidUrls(urlList) {
    return urlList.split(',').every(url => isValidUrl(url.trim()));
}

/**
 * Validates port number
 * 
 * @param {string|number} port - Port number to validate
 * @returns {boolean} - Whether the port is valid
 */
function isValidPort(port) {
    const portNum = parseInt(port, 10);
    return !isNaN(portNum) && portNum >= 0 && portNum <= 65535;
}

module.exports = {
    validateEnvVars,
    handleValidationErrors,
    isValidUrl,
    areValidUrls,
    isValidPort
};