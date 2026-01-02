"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelOrder = exports.assignDriver = exports.updateOrderStatus = exports.updateOrder = exports.createOrder = exports.getOrder = exports.getOrders = void 0;
const sequelize_1 = require("sequelize");
const Order_1 = __importDefault(require("../models/Order"));
const Client_1 = __importDefault(require("../models/Client"));
const Product_1 = __importDefault(require("../models/Product"));
const User_1 = require("../models/User");
const emailService_1 = __importDefault(require("../services/emailService"));
// @desc    Get all orders
// @route   GET /api/v1/orders
// @access  Private
const getOrders = async (req, res) => {
    try {
        const { status, clientId, startDate, endDate } = req.query;
        const where = {};
        if (status) {
            where.status = status;
        }
        if (clientId) {
            where.clientId = clientId;
        }
        if (startDate || endDate) {
            where.deliveryDate = {};
            if (startDate) {
                where.deliveryDate[sequelize_1.Op.gte] = new Date(startDate);
            }
            if (endDate) {
                where.deliveryDate[sequelize_1.Op.lte] = new Date(endDate);
            }
        }
        const orders = await Order_1.default.findAll({
            where,
            include: [
                { model: Client_1.default, as: 'client', attributes: ['name', 'type'] },
                { model: User_1.User, as: 'driver', attributes: ['name'] },
                { model: User_1.User, as: 'creator', attributes: ['name'] }
            ],
            order: [['createdAt', 'DESC']],
        });
        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};
exports.getOrders = getOrders;
// @desc    Get single order
// @route   GET /api/v1/orders/:id
// @access  Private
const getOrder = async (req, res) => {
    try {
        const order = await Order_1.default.findByPk(req.params.id, {
            include: [
                { model: Client_1.default, as: 'client' },
                { model: User_1.User, as: 'driver', attributes: ['name'] },
                { model: User_1.User, as: 'creator', attributes: ['name'] }
            ],
        });
        if (!order) {
            res.status(404).json({
                success: false,
                message: 'Order not found',
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: order,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};
exports.getOrder = getOrder;
// @desc    Create order
// @route   POST /api/v1/orders
// @access  Private (Admin, Manager)
const createOrder = async (req, res) => {
    try {
        const { clientId, items, deliveryAddress, deliveryDate, deliveryTime, specialInstructions } = req.body;
        // Verify client exists
        const client = await Client_1.default.findByPk(clientId);
        if (!client) {
            res.status(404).json({
                success: false,
                message: 'Client not found',
            });
            return;
        }
        // Calculate totals and verify products
        let subtotal = 0;
        const orderItems = [];
        for (const item of items) {
            const product = await Product_1.default.findByPk(item.productId);
            if (!product) {
                res.status(404).json({
                    success: false,
                    message: `Product not found: ${item.productId}`,
                });
                return;
            }
            if (product.currentStock < item.quantity) {
                res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.name}`,
                });
                return;
            }
            const itemTotal = product.unitPrice * item.quantity;
            subtotal += itemTotal;
            orderItems.push({
                productId: product.id,
                productName: product.name,
                quantity: item.quantity,
                unit: product.unit,
                unitPrice: product.unitPrice,
                total: itemTotal,
            });
        }
        // Calculate tax and total
        const tax = subtotal * 0.2; // 20% tax
        const total = subtotal + tax;
        // Create order
        const order = await Order_1.default.create({
            clientId,
            clientName: client.name,
            items: orderItems,
            subtotal,
            tax,
            total,
            deliveryAddress,
            deliveryDate,
            deliveryTime,
            specialInstructions,
            createdBy: req.user?.id,
            tracking: {
                status: 'pending',
                events: [{
                        status: 'pending',
                        timestamp: new Date(),
                        note: 'Order created',
                        updatedBy: req.user?.id,
                    }],
            },
        });
        // Update product stocks
        for (const item of orderItems) {
            const product = await Product_1.default.findByPk(item.productId);
            if (product) {
                product.currentStock -= item.quantity;
                await product.save();
            }
        }
        // Update client stats
        if (client.totalOrders !== undefined) {
            client.totalOrders += 1;
        }
        if (client.totalRevenue !== undefined) {
            client.totalRevenue += total;
        }
        client.lastOrderDate = new Date();
        await client.save();
        // Send order confirmation email
        if (client.email) {
            await emailService_1.default.sendOrderConfirmationEmail(order, client.email, client.name);
        }
        res.status(201).json({
            success: true,
            data: order,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};
exports.createOrder = createOrder;
// @desc    Update order
// @route   PUT /api/v1/orders/:id
// @access  Private (Admin, Manager)
const updateOrder = async (req, res) => {
    try {
        const order = await Order_1.default.findByPk(req.params.id);
        if (!order) {
            res.status(404).json({
                success: false,
                message: 'Order not found',
            });
            return;
        }
        await order.update(req.body);
        res.status(200).json({
            success: true,
            data: order,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};
exports.updateOrder = updateOrder;
// @desc    Update order status
// @route   PATCH /api/v1/orders/:id/status
// @access  Private
const updateOrderStatus = async (req, res) => {
    try {
        const { status, note, location } = req.body;
        const order = await Order_1.default.findByPk(req.params.id);
        if (!order) {
            res.status(404).json({
                success: false,
                message: 'Order not found',
            });
            return;
        }
        // Parse tracking if it's a JSON string
        const tracking = typeof order.tracking === 'string'
            ? JSON.parse(order.tracking)
            : order.tracking;
        // Update tracking object
        tracking.status = status;
        if (!Array.isArray(tracking.events)) {
            tracking.events = [];
        }
        tracking.events.push({
            status,
            timestamp: new Date(),
            note,
            location,
            updatedBy: req.user?.id,
        });
        // Update order
        order.status = status;
        order.tracking = tracking;
        await order.save();
        res.status(200).json({
            success: true,
            data: order,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};
exports.updateOrderStatus = updateOrderStatus;
// @desc    Assign driver to order
// @route   PATCH /api/v1/orders/:id/assign-driver
// @access  Private (Admin, Manager)
const assignDriver = async (req, res) => {
    try {
        const { driverId, driverName } = req.body;
        const order = await Order_1.default.findByPk(req.params.id);
        if (!order) {
            res.status(404).json({
                success: false,
                message: 'Order not found',
            });
            return;
        }
        order.driverId = driverId;
        order.driverName = driverName;
        await order.save();
        res.status(200).json({
            success: true,
            data: order,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};
exports.assignDriver = assignDriver;
// @desc    Cancel order
// @route   PATCH /api/v1/orders/:id/cancel
// @access  Private (Admin, Manager)
const cancelOrder = async (req, res) => {
    try {
        const order = await Order_1.default.findByPk(req.params.id);
        if (!order) {
            res.status(404).json({
                success: false,
                message: 'Order not found',
            });
            return;
        }
        if (order.status === 'delivered') {
            res.status(400).json({
                success: false,
                message: 'Cannot cancel delivered order',
            });
            return;
        }
        // Parse tracking if it's a JSON string
        const tracking = typeof order.tracking === 'string'
            ? JSON.parse(order.tracking)
            : order.tracking;
        // Update tracking object
        tracking.status = 'cancelled';
        if (!Array.isArray(tracking.events)) {
            tracking.events = [];
        }
        tracking.events.push({
            status: 'cancelled',
            timestamp: new Date(),
            note: req.body.reason || 'Order cancelled',
            updatedBy: req.user?.id,
        });
        // Update order
        order.status = 'cancelled';
        order.tracking = tracking;
        await order.save();
        // Restore product stocks
        const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
        for (const item of items) {
            const product = await Product_1.default.findByPk(item.productId);
            if (product) {
                product.currentStock += item.quantity;
                await product.save();
            }
        }
        res.status(200).json({
            success: true,
            data: order,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};
exports.cancelOrder = cancelOrder;
//# sourceMappingURL=orderController.js.map