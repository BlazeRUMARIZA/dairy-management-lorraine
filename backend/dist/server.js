"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const database_1 = __importDefault(require("./config/database"));
const error_1 = require("./middleware/error");
const cronJobs_1 = __importDefault(require("./services/cronJobs"));
// Load env vars
dotenv_1.default.config();
// Initialize app
const app = (0, express_1.default)();
// Body parser
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// CORS configuration MUST come before helmet for preflight requests
// CORS configuration - allow multiple origins
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://dairy-management-lorraine-production.up.railway.app',
    process.env.FRONTEND_URL
].filter(Boolean);
console.log('🔐 CORS allowed origins:', allowedOrigins);
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) {
            console.log('✅ CORS: Allowing request with no origin');
            return callback(null, true);
        }
        if (allowedOrigins.indexOf(origin) !== -1) {
            console.log(`✅ CORS: Allowing origin: ${origin}`);
            callback(null, true);
        }
        else {
            // In production, log rejected origins for debugging
            console.log(`⚠️  CORS blocked origin: ${origin}`);
            console.log(`   Allowed origins:`, allowedOrigins);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204
}));
// Security middleware (after CORS)
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
// Compression
app.use((0, compression_1.default)());
// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    message: 'Too many requests from this IP, please try again later.',
});
app.use('/api', limiter);
// Health check endpoints FIRST (before DB connection)
app.get('/health', (_req, res) => {
    res.status(200).json({
        success: true,
        message: 'API is running',
        environment: process.env.NODE_ENV || 'production',
        timestamp: new Date().toISOString(),
    });
});
app.get('/api/v1/health', (_req, res) => {
    res.status(200).json({
        success: true,
        message: 'API is running',
        environment: process.env.NODE_ENV || 'production',
        version: process.env.API_VERSION || 'v1',
        timestamp: new Date().toISOString(),
    });
});
// Home route
app.get('/', (_req, res) => {
    res.status(200).json({
        success: true,
        message: 'Dairy Management System API',
        version: process.env.API_VERSION || 'v1',
        documentation: '/api-docs',
    });
});
// Import routes
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes")); // User management CRUD routes - deployed 2026-01-02
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const clientRoutes_1 = __importDefault(require("./routes/clientRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const batchRoutes_1 = __importDefault(require("./routes/batchRoutes"));
const invoiceRoutes_1 = __importDefault(require("./routes/invoiceRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
// Mount routes
const apiVersion = process.env.API_VERSION || 'v1';
app.use(`/api/${apiVersion}/auth`, authRoutes_1.default);
app.use(`/api/${apiVersion}/users`, userRoutes_1.default);
app.use(`/api/${apiVersion}/products`, productRoutes_1.default);
app.use(`/api/${apiVersion}/clients`, clientRoutes_1.default);
app.use(`/api/${apiVersion}/orders`, orderRoutes_1.default);
app.use(`/api/${apiVersion}/batches`, batchRoutes_1.default);
app.use(`/api/${apiVersion}/invoices`, invoiceRoutes_1.default);
app.use(`/api/${apiVersion}`, dashboardRoutes_1.default);
// Error handler
app.use(error_1.notFound);
app.use(error_1.errorHandler);
// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`
  ╔════════════════════════════════════════╗
  ║   🥛 Dairy Management System API      ║
  ║   Server running on port ${PORT}        ║
  ║   Environment: ${process.env.NODE_ENV || 'production'}           ║
  ╚════════════════════════════════════════╝
  `);
    // Connect to database (non-blocking)
    (0, database_1.default)()
        .then(() => {
        console.log('✅ Database connected successfully');
        // Start cron jobs for automated notifications (optional)
        // Email notifications will only work if email service is configured
        if (process.env.CRON_ENABLED === 'true') {
            try {
                cronJobs_1.default.startAllCronJobs();
                console.log('✅ Cron jobs started (email notifications enabled)');
            }
            catch (err) {
                console.error('⚠️  Cron jobs failed to start:', err.message);
            }
        }
        else {
            console.log('⏸️  Cron jobs disabled (set CRON_ENABLED=true to enable)');
        }
    })
        .catch((err) => {
        console.error('❌ Database connection failed:', err.message);
        console.log('⚠️  Server will continue running without database');
        console.log('⚠️  Please check your database configuration');
    });
});
// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log(`❌ Unhandled Rejection: ${err.message}`);
    // Don't crash the server, just log the error
    console.log('⚠️  Server continues running');
});
// Handle SIGTERM gracefully
process.on('SIGTERM', () => {
    console.log('👋 SIGTERM signal received: closing HTTP server');
    try {
        cronJobs_1.default.stopAllCronJobs();
    }
    catch (err) {
        console.error('Error stopping cron jobs:', err);
    }
    server.close(() => {
        console.log('✅ HTTP server closed');
        process.exit(0);
    });
});
// Handle SIGINT (Ctrl+C) gracefully
process.on('SIGINT', () => {
    console.log('\n👋 SIGINT signal received: closing HTTP server');
    try {
        cronJobs_1.default.stopAllCronJobs();
    }
    catch (err) {
        console.error('Error stopping cron jobs:', err);
    }
    server.close(() => {
        console.log('✅ HTTP server closed');
        process.exit(0);
    });
});
exports.default = app;
//# sourceMappingURL=server.js.map