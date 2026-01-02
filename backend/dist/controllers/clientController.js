"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClientStats = exports.deleteClient = exports.updateClient = exports.createClient = exports.getClient = exports.getClients = void 0;
const sequelize_1 = require("sequelize");
const Client_1 = __importDefault(require("../models/Client"));
// @desc    Get all clients
// @route   GET /api/v1/clients
// @access  Private
const getClients = async (req, res) => {
    try {
        const { type, status, search } = req.query;
        let where = {};
        if (type) {
            where.type = type;
        }
        if (status) {
            where.status = status;
        }
        if (search) {
            where[sequelize_1.Op.or] = [
                { name: { [sequelize_1.Op.like]: `%${search}%` } },
                { email: { [sequelize_1.Op.like]: `%${search}%` } },
                { phone: { [sequelize_1.Op.like]: `%${search}%` } },
            ];
        }
        const clients = await Client_1.default.findAll({
            where,
            order: [['createdAt', 'DESC']],
        });
        res.status(200).json({
            success: true,
            count: clients.length,
            data: clients,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};
exports.getClients = getClients;
// @desc    Get single client
// @route   GET /api/v1/clients/:id
// @access  Private
const getClient = async (req, res) => {
    try {
        const client = await Client_1.default.findByPk(req.params.id);
        if (!client) {
            res.status(404).json({
                success: false,
                message: 'Client not found',
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: client,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};
exports.getClient = getClient;
// @desc    Create client
// @route   POST /api/v1/clients
// @access  Private (Admin, Manager)
const createClient = async (req, res) => {
    try {
        const client = await Client_1.default.create(req.body);
        res.status(201).json({
            success: true,
            data: client,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};
exports.createClient = createClient;
// @desc    Update client
// @route   PUT /api/v1/clients/:id
// @access  Private (Admin, Manager)
const updateClient = async (req, res) => {
    try {
        const client = await Client_1.default.findByPk(req.params.id);
        if (!client) {
            res.status(404).json({
                success: false,
                message: 'Client not found',
            });
            return;
        }
        await client.update(req.body);
        res.status(200).json({
            success: true,
            data: client,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};
exports.updateClient = updateClient;
// @desc    Delete client
// @route   DELETE /api/v1/clients/:id
// @access  Private (Admin)
const deleteClient = async (req, res) => {
    try {
        const client = await Client_1.default.findByPk(req.params.id);
        if (!client) {
            res.status(404).json({
                success: false,
                message: 'Client not found',
            });
            return;
        }
        await client.destroy();
        res.status(200).json({
            success: true,
            message: 'Client deleted successfully',
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};
exports.deleteClient = deleteClient;
// @desc    Get client statistics
// @route   GET /api/v1/clients/:id/stats
// @access  Private
const getClientStats = async (req, res) => {
    try {
        const client = await Client_1.default.findByPk(req.params.id);
        if (!client) {
            res.status(404).json({
                success: false,
                message: 'Client not found',
            });
            return;
        }
        // TODO: Aggregate orders data for more detailed stats
        res.status(200).json({
            success: true,
            data: {
                totalOrders: client.totalOrders,
                totalRevenue: client.totalRevenue,
                monthlyRevenue: client.monthlyRevenue,
                lastOrderDate: client.lastOrderDate,
                rating: client.rating,
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
exports.getClientStats = getClientStats;
//# sourceMappingURL=clientController.js.map