const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const fs = require("fs")
const path = require("path")
// const bodyParser = require("body-parser")
const app = express()
const Routes = require("./routes/route.js")
const logger = require("./utils/logger")
const dbConnection = require("./utils/dbConnection")

// Load environment variables
dotenv.config();

// Import environment validator
const envValidator = require('./utils/envValidator');

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

// Validate environment variables and handle any errors
const validationResult = envValidator.validateEnvVars(envConfig);
envValidator.handleValidationErrors(validationResult, true);

const PORT = process.env.PORT || 5000

// app.use(bodyParser.json({ limit: '10mb', extended: true }))
// app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))

app.use(express.json({ limit: '10mb' }))

// Configure CORS based on environment
if (process.env.NODE_ENV === 'production') {
    // In production, only allow specific origins
    const allowedOrigins = process.env.ALLOWED_ORIGINS ? 
        process.env.ALLOWED_ORIGINS.split(',') : 
        ['https://student-life-management-system.onrender.com'];
    
    app.use(cors({
        origin: function(origin, callback) {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) === -1) {
                const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        },
        credentials: true
    }));
    
    // Add security headers in production
    app.use((req, res, next) => {
        // Helps prevent clickjacking attacks
        res.setHeader('X-Frame-Options', 'DENY');
        // Helps prevent XSS attacks
        res.setHeader('X-XSS-Protection', '1; mode=block');
        // Prevents browser from MIME-sniffing
        res.setHeader('X-Content-Type-Options', 'nosniff');
        // Strict Transport Security
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        // Content Security Policy
        res.setHeader('Content-Security-Policy', "default-src 'self'");
        next();
    });
} else {
    // In development, allow all origins
    app.use(cors());
}

// Ensure upload directories exist
const uploadsDir = path.join(__dirname, 'uploads');
const assignmentsDir = path.join(__dirname, 'uploads/assignments');

try {
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir);
        logger.info('Created uploads directory');
    }
    if (!fs.existsSync(assignmentsDir)) {
        fs.mkdirSync(assignmentsDir);
        logger.info('Created assignments upload directory');
    }
} catch (err) {
    logger.error('Error creating upload directories:', { error: err.message });
}

// Connect to the database using the enhanced connection utility
dbConnection.connectToDatabase(process.env.MONGO_URL)
    .catch(err => {
        // If connection fails after all retries, log a critical error
        logger.error("All database connection attempts failed. The application will continue to run, but database functionality will be unavailable.", {
            error: err.message
        });
    });

// Import database middleware
const dbMiddleware = require('./utils/dbMiddleware');

// Apply database middleware to all routes except health checks
app.use(/^(?!\/health).+/, dbMiddleware.requireDatabaseConnection);

// Set up routes
app.use('/', Routes);
app.use('/uploads/assignments', express.static('uploads/assignments'));

// Start the server and handle any errors
const server = app.listen(PORT, () => {
    logger.info(`Server started successfully`, { 
        port: PORT, 
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString(),
        baseUrl: `http://localhost:${PORT}`
    });
    
    // Log available routes for debugging
    logger.info('Available API routes:');
    app._router.stack
        .filter(r => r.route)
        .map(r => {
            const methods = Object.keys(r.route.methods).join(', ').toUpperCase();
            logger.info(`${methods} ${r.route.path}`);
        });
});

// Handle server errors
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        logger.error(`Port ${PORT} is already in use. Please choose a different port or stop the process using this port.`);
    } else {
        logger.error('Server error:', { error: error.message, stack: error.stack });
    }
    process.exit(1);
});