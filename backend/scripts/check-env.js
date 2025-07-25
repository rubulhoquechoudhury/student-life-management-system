/**
 * Environment Variable Check Script
 * 
 * This script checks if all required environment variables are set
 * and validates their format. It can be run before starting the server
 * to ensure all necessary configuration is in place.
 */

const dotenv = require('dotenv');
const path = require('path');
const envValidator = require('../utils/envValidator');

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log('Checking environment variables...');

// Define environment variables configuration
const envConfig = {
    // Required variables
    MONGO_URL: {
        required: true,
        description: 'MongoDB connection string'
    },
    JWT_SECRET: {
        required: true,
        description: 'Secret key for JWT token generation and verification'
    },
    // Optional variables with defaults
    PORT: {
        required: false,
        default: 5000,
        description: 'Port for the server to listen on',
        validate: envValidator.isValidPort,
        errorMessage: 'PORT must be a valid port number between 0 and 65535'
    },
    NODE_ENV: {
        required: false,
        default: 'development',
        description: 'Application environment (development, production)',
        validate: (value) => ['development', 'production', 'test'].includes(value),
        errorMessage: 'NODE_ENV must be one of: development, production, test'
    },
    ALLOWED_ORIGINS: {
        required: false,
        description: 'Comma-separated list of allowed origins for CORS in production',
        validate: envValidator.areValidUrls,
        errorMessage: 'ALLOWED_ORIGINS must be a comma-separated list of valid URLs'
    }
};

// Validate environment variables
const validationResult = envValidator.validateEnvVars(envConfig);
const isValid = envValidator.handleValidationErrors(validationResult, false);

// Print summary
console.log('\nEnvironment Variables Summary:');
console.log('-----------------------------');

Object.keys(envConfig).forEach(key => {
    const value = process.env[key];
    const status = value ? 'SET' : 'NOT SET';
    const required = envConfig[key].required ? 'REQUIRED' : 'OPTIONAL';
    
    console.log(`${key}: ${status} (${required})`);
    if (value && envConfig[key].validate && !envConfig[key].validate(value)) {
        console.log(`  WARNING: Invalid format - ${envConfig[key].errorMessage}`);
    }
});

console.log('\nValidation result:', isValid ? 'PASSED' : 'FAILED');

// Exit with appropriate code
process.exit(isValid ? 0 : 1);