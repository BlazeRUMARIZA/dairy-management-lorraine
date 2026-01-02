"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFinancialReport = exports.getClientReport = exports.getInventoryReport = exports.getProductionReport = exports.getSalesReport = exports.getDashboardStats = void 0;
const sequelize_1 = require("sequelize");
const Order_1 = __importDefault(require("../models/Order"));
const Product_1 = __importDefault(require("../models/Product"));
const Client_1 = __importDefault(require("../models/Client"));
const Batch_1 = __importDefault(require("../models/Batch"));
const Invoice_1 = __importDefault(require("../models/Invoice"));
// @desc    Get dashboard statistics
// @route   GET /api/v1/dashboard/stats
// @access  Private
const getDashboardStats = async (_req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const thisMonth = new Date();
        thisMonth.setDate(1);
        thisMonth.setHours(0, 0, 0, 0);
        // Total products
        const totalProducts = await Product_1.default.count();
        // Low stock products
        const lowStockProducts = await Product_1.default.count({
            where: {
                status: { [sequelize_1.Op.in]: ['low', 'critical', 'out-of-stock'] },
            },
        });
        // Orders statistics
        const totalOrders = await Order_1.default.count();
        const pendingOrders = await Order_1.default.count({ where: { status: 'pending' } });
        const todayOrders = await Order_1.default.count({
            where: {
                createdAt: { [sequelize_1.Op.gte]: today },
            },
        });
        // Revenue statistics - Monthly
        const monthlyRevenueResult = await Order_1.default.findOne({
            where: {
                createdAt: { [sequelize_1.Op.gte]: thisMonth },
                status: { [sequelize_1.Op.ne]: 'cancelled' },
            },
            attributes: [[(0, sequelize_1.fn)('SUM', (0, sequelize_1.col)('total')), 'total']],
            raw: true,
        });
        // Revenue statistics - Today
        const todayRevenueResult = await Order_1.default.findOne({
            where: {
                createdAt: { [sequelize_1.Op.gte]: today },
                status: { [sequelize_1.Op.ne]: 'cancelled' },
            },
            attributes: [[(0, sequelize_1.fn)('SUM', (0, sequelize_1.col)('total')), 'total']],
            raw: true,
        });
        // Active clients
        const activeClients = await Client_1.default.count({ where: { status: 'active' } });
        // Active batches
        const activeBatches = await Batch_1.default.count({ where: { status: 'in-progress' } });
        // Today's production (sum of completed batches today)
        const todayProductionResult = await Batch_1.default.findOne({
            where: {
                createdAt: { [sequelize_1.Op.gte]: today },
                status: 'completed',
            },
            attributes: [[(0, sequelize_1.fn)('SUM', (0, sequelize_1.col)('quantity')), 'total']],
            raw: true,
        });
        // Previous day's production for trend calculation
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayProductionResult = await Batch_1.default.findOne({
            where: {
                createdAt: { [sequelize_1.Op.gte]: yesterday, [sequelize_1.Op.lt]: today },
                status: 'completed',
            },
            attributes: [[(0, sequelize_1.fn)('SUM', (0, sequelize_1.col)('quantity')), 'total']],
            raw: true,
        });
        // Previous month's revenue for trend calculation
        const lastMonth = new Date(thisMonth);
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        const lastMonthRevenueResult = await Order_1.default.findOne({
            where: {
                createdAt: { [sequelize_1.Op.gte]: lastMonth, [sequelize_1.Op.lt]: thisMonth },
                status: { [sequelize_1.Op.ne]: 'cancelled' },
            },
            attributes: [[(0, sequelize_1.fn)('SUM', (0, sequelize_1.col)('total')), 'total']],
            raw: true,
        });
        // Calculate trends
        const todayProduction = Number(todayProductionResult?.total || 0);
        const yesterdayProduction = Number(yesterdayProductionResult?.total || 0);
        const productionTrend = yesterdayProduction > 0
            ? ((todayProduction - yesterdayProduction) / yesterdayProduction) * 100
            : 0;
        const monthlyRevenue = Number(monthlyRevenueResult?.total || 0);
        const lastMonthRevenue = Number(lastMonthRevenueResult?.total || 0);
        const revenueTrend = lastMonthRevenue > 0
            ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
            : 0;
        // Previous day's pending orders for trend
        const yesterdayPendingOrders = await Order_1.default.count({
            where: {
                createdAt: { [sequelize_1.Op.gte]: yesterday, [sequelize_1.Op.lt]: today },
                status: 'pending',
            },
        });
        const ordersTrend = yesterdayPendingOrders > 0
            ? ((pendingOrders - yesterdayPendingOrders) / yesterdayPendingOrders) * 100
            : 0;
        res.status(200).json({
            success: true,
            data: {
                // Main stats for StatCards
                todayProduction: Math.round(todayProduction),
                pendingOrders,
                criticalStock: lowStockProducts,
                monthlyRevenue: Math.round(monthlyRevenue),
                // Trends (percentage change)
                productionTrend: Math.round(productionTrend * 10) / 10,
                ordersTrend: Math.round(ordersTrend * 10) / 10,
                revenueTrend: Math.round(revenueTrend * 10) / 10,
                // Additional stats (detailed breakdown)
                products: {
                    total: totalProducts,
                    lowStock: lowStockProducts,
                },
                orders: {
                    total: totalOrders,
                    pending: pendingOrders,
                    today: todayOrders,
                },
                revenue: {
                    monthly: Math.round(monthlyRevenue),
                    today: Math.round(Number(todayRevenueResult?.total || 0)),
                },
                clients: {
                    active: activeClients,
                },
                production: {
                    activeBatches,
                    today: Math.round(todayProduction),
                },
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};
exports.getDashboardStats = getDashboardStats;
// @desc    Get sales report
// @route   GET /api/v1/reports/sales
// @access  Private
const getSalesReport = async (req, res) => {
    try {
        const { startDate, endDate, groupBy = 'day' } = req.query;
        // Convert MongoDB query operators to Sequelize
        const whereClause = { status: { [sequelize_1.Op.ne]: 'cancelled' } };
        if (startDate || endDate) {
            whereClause.createdAt = {};
            if (startDate) {
                whereClause.createdAt[sequelize_1.Op.gte] = new Date(startDate);
            }
            if (endDate) {
                whereClause.createdAt[sequelize_1.Op.lte] = new Date(endDate);
            }
        }
        // Simplified reporting - get all orders and group in application logic
        // For complex time-series, consider using raw SQL queries
        const orders = await Order_1.default.findAll({
            where: whereClause,
            attributes: [
                'id',
                'totalAmount',
                'createdAt',
                'status',
            ],
            order: [['createdAt', 'ASC']],
            raw: true,
        });
        // Group data based on groupBy parameter
        const groupedData = orders.reduce((acc, order) => {
            const date = new Date(order.createdAt);
            let key;
            if (groupBy === 'day') {
                key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            }
            else if (groupBy === 'month') {
                key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            }
            else if (groupBy === 'year') {
                key = `${date.getFullYear()}`;
            }
            else {
                key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            }
            if (!acc[key]) {
                acc[key] = {
                    _id: key,
                    orders: 0,
                    revenue: 0,
                };
            }
            acc[key].orders += 1;
            acc[key].revenue += parseFloat(order.totalAmount || 0);
            return acc;
        }, {});
        const salesData = Object.values(groupedData);
        res.status(200).json({
            success: true,
            count: salesData.length,
            data: salesData,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};
exports.getSalesReport = getSalesReport;
// @desc    Get production report
// @route   GET /api/v1/reports/production
// @access  Private
const getProductionReport = async (req, res) => {
    try {
        const { startDate, endDate, productType } = req.query;
        const whereClause = { status: 'completed' };
        if (startDate || endDate) {
            whereClause.startTime = {};
            if (startDate) {
                whereClause.startTime[sequelize_1.Op.gte] = new Date(startDate);
            }
            if (endDate) {
                whereClause.startTime[sequelize_1.Op.lte] = new Date(endDate);
            }
        }
        if (productType) {
            whereClause.productType = productType;
        }
        // Get all batches and group by productType
        const batches = await Batch_1.default.findAll({
            where: whereClause,
            attributes: ['productType', 'quantity', 'yield'],
            raw: true,
        });
        // Group by productType
        const groupedData = batches.reduce((acc, batch) => {
            const type = batch.productType || 'Unknown';
            if (!acc[type]) {
                acc[type] = {
                    _id: type,
                    totalBatches: 0,
                    totalQuantity: 0,
                    totalYield: 0,
                    yieldCount: 0,
                };
            }
            acc[type].totalBatches += 1;
            acc[type].totalQuantity += parseFloat(batch.quantity || 0);
            if (batch.yield != null) {
                acc[type].totalYield += parseFloat(batch.yield);
                acc[type].yieldCount += 1;
            }
            return acc;
        }, {});
        // Calculate averages and format data
        const productionData = Object.values(groupedData).map((item) => ({
            _id: item._id,
            totalBatches: item.totalBatches,
            totalQuantity: item.totalQuantity,
            avgYield: item.yieldCount > 0 ? item.totalYield / item.yieldCount : 0,
        }));
        res.status(200).json({
            success: true,
            count: productionData.length,
            data: productionData,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};
exports.getProductionReport = getProductionReport;
// @desc    Get inventory report
// @route   GET /api/v1/reports/inventory
// @access  Private
const getInventoryReport = async (_req, res) => {
    try {
        // Get all products
        const products = await Product_1.default.findAll({
            attributes: ['category', 'currentStock', 'unitPrice', 'status'],
            raw: true,
        });
        // Group by category
        const groupedData = products.reduce((acc, product) => {
            const category = product.category || 'Uncategorized';
            if (!acc[category]) {
                acc[category] = {
                    _id: category,
                    totalProducts: 0,
                    totalStock: 0,
                    totalValue: 0,
                    lowStockCount: 0,
                };
            }
            acc[category].totalProducts += 1;
            acc[category].totalStock += parseFloat(product.currentStock || 0);
            acc[category].totalValue += parseFloat(product.currentStock || 0) * parseFloat(product.unitPrice || 0);
            if (['low', 'critical', 'out-of-stock'].includes(product.status)) {
                acc[category].lowStockCount += 1;
            }
            return acc;
        }, {});
        // Convert to array and sort
        const inventoryData = Object.values(groupedData).sort((a, b) => a._id.localeCompare(b._id));
        res.status(200).json({
            success: true,
            count: inventoryData.length,
            data: inventoryData,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};
exports.getInventoryReport = getInventoryReport;
// @desc    Get client report
// @route   GET /api/v1/reports/clients
// @access  Private
const getClientReport = async (_req, res) => {
    try {
        // Get all clients
        const clients = await Client_1.default.findAll({
            attributes: ['type', 'status', 'totalRevenue', 'rating'],
            raw: true,
        });
        // Group by type
        const groupedData = clients.reduce((acc, client) => {
            const type = client.type || 'Unknown';
            if (!acc[type]) {
                acc[type] = {
                    _id: type,
                    totalClients: 0,
                    activeClients: 0,
                    totalRevenue: 0,
                    totalRating: 0,
                    ratingCount: 0,
                };
            }
            acc[type].totalClients += 1;
            if (client.status === 'active') {
                acc[type].activeClients += 1;
            }
            acc[type].totalRevenue += parseFloat(client.totalRevenue || 0);
            if (client.rating != null) {
                acc[type].totalRating += parseFloat(client.rating);
                acc[type].ratingCount += 1;
            }
            return acc;
        }, {});
        // Calculate averages and sort
        const clientData = Object.values(groupedData)
            .map((item) => ({
            _id: item._id,
            totalClients: item.totalClients,
            activeClients: item.activeClients,
            totalRevenue: item.totalRevenue,
            avgRating: item.ratingCount > 0 ? item.totalRating / item.ratingCount : 0,
        }))
            .sort((a, b) => b.totalRevenue - a.totalRevenue);
        // Top clients by revenue
        const topClients = await Client_1.default.findAll({
            attributes: ['id', 'name', 'type', 'totalRevenue', 'totalOrders', 'rating'],
            order: [['totalRevenue', 'DESC']],
            limit: 10,
        });
        res.status(200).json({
            success: true,
            data: {
                byType: clientData,
                topClients,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};
exports.getClientReport = getClientReport;
// @desc    Get financial report
// @route   GET /api/v1/reports/financial
// @access  Private (Admin, Manager)
const getFinancialReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const whereClause = {};
        if (startDate || endDate) {
            whereClause.issueDate = {};
            if (startDate) {
                whereClause.issueDate[sequelize_1.Op.gte] = new Date(startDate);
            }
            if (endDate) {
                whereClause.issueDate[sequelize_1.Op.lte] = new Date(endDate);
            }
        }
        // Get all invoices
        const invoices = await Invoice_1.default.findAll({
            where: whereClause,
            attributes: ['status', 'total', 'issueDate'],
            raw: true,
        });
        // Group by status
        const statusData = invoices.reduce((acc, invoice) => {
            const status = invoice.status || 'unknown';
            if (!acc[status]) {
                acc[status] = {
                    _id: status,
                    count: 0,
                    total: 0,
                };
            }
            acc[status].count += 1;
            acc[status].total += parseFloat(invoice.total || 0);
            return acc;
        }, {});
        const financialData = Object.values(statusData);
        // Group by month for trend analysis
        const monthlyData = invoices.reduce((acc, invoice) => {
            const date = new Date(invoice.issueDate);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const key = `${year}-${String(month).padStart(2, '0')}`;
            if (!acc[key]) {
                acc[key] = {
                    _id: { year, month },
                    revenue: 0,
                    invoices: 0,
                };
            }
            acc[key].revenue += parseFloat(invoice.total || 0);
            acc[key].invoices += 1;
            return acc;
        }, {});
        // Sort monthly trend
        const monthlyTrend = Object.values(monthlyData).sort((a, b) => {
            if (a._id.year !== b._id.year) {
                return a._id.year - b._id.year;
            }
            return a._id.month - b._id.month;
        });
        res.status(200).json({
            success: true,
            data: {
                byStatus: financialData,
                monthlyTrend,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};
exports.getFinancialReport = getFinancialReport;
//# sourceMappingURL=dashboardController.js.map