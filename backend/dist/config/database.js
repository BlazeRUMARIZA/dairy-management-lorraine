"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
require("reflect-metadata");
const User_1 = require("../models/User");
const Product_1 = __importDefault(require("../models/Product"));
const Client_1 = __importDefault(require("../models/Client"));
const Order_1 = __importDefault(require("../models/Order"));
const Batch_1 = __importDefault(require("../models/Batch"));
const Invoice_1 = __importDefault(require("../models/Invoice"));
const sequelize = new sequelize_typescript_1.Sequelize({
    database: process.env.DB_DATABASE || process.env.DB_NAME || 'dairy_management',
    dialect: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME || process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    define: {
        timestamps: true,
        underscored: false,
        freezeTableName: false
    }
});
exports.sequelize = sequelize;
// Add models to sequelize instance
sequelize.addModels([User_1.User, Product_1.default, Client_1.default, Order_1.default, Batch_1.default, Invoice_1.default]);
// Initialize model hooks (for password hashing, etc.)
User_1.User.initHooks();
Product_1.default.initHooks();
Order_1.default.initHooks();
Batch_1.default.initHooks();
Invoice_1.default.initHooks();
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log(`✅ MySQL Connected: ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '3306'}`);
        // Sync models in development (create tables if they don't exist)
        if (process.env.NODE_ENV === 'development' || process.env.DB_SYNC === 'true') {
            await sequelize.sync({ alter: process.env.DB_ALTER === 'true' });
            console.log('✅ Database models synchronized');
        }
        process.on('SIGINT', async () => {
            await sequelize.close();
            console.log('MySQL connection closed due to app termination');
            process.exit(0);
        });
    }
    catch (error) {
        console.error('❌ Error connecting to MySQL:', error.message);
        console.log('⚠️  Server will continue running without database');
        console.log('⚠️  Please check your database configuration:');
        console.log(`    DB_HOST: ${process.env.DB_HOST || 'not set'}`);
        console.log(`    DB_PORT: ${process.env.DB_PORT || 'not set'}`);
        console.log(`    DB_USERNAME: ${process.env.DB_USERNAME || process.env.DB_USER || 'not set'}`);
        console.log(`    DB_DATABASE: ${process.env.DB_DATABASE || process.env.DB_NAME || 'not set'}`);
        // Don't exit - let server continue running
    }
};
exports.default = connectDB;
//# sourceMappingURL=database.js.map