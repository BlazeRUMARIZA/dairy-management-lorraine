"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBatch = exports.updateQualityChecks = exports.completeBatch = exports.updateBatch = exports.createBatch = exports.getBatch = exports.getBatches = void 0;
const sequelize_1 = require("sequelize");
const Batch_1 = __importDefault(require("../models/Batch"));
const Product_1 = __importDefault(require("../models/Product"));
const User_1 = require("../models/User");
// @desc    Get all batches
// @route   GET /api/v1/batches
// @access  Private
const getBatches = async (req, res) => {
    try {
        const { status, productType, startDate, endDate } = req.query;
        let where = {};
        if (status) {
            where.status = status;
        }
        if (productType) {
            where.productType = productType;
        }
        if (startDate || endDate) {
            where.startTime = {};
            if (startDate) {
                where.startTime[sequelize_1.Op.gte] = new Date(startDate);
            }
            if (endDate) {
                where.startTime[sequelize_1.Op.lte] = new Date(endDate);
            }
        }
        const batches = await Batch_1.default.findAll({
            where,
            include: [
                { model: User_1.User, as: 'operatorRef', attributes: ['id', 'name'] },
                { model: Product_1.default, as: 'productRef', attributes: ['id', 'name'] },
            ],
            order: [['createdAt', 'DESC']],
        });
        res.status(200).json({
            success: true,
            count: batches.length,
            data: batches,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};
exports.getBatches = getBatches;
// @desc    Get single batch
// @route   GET /api/v1/batches/:id
// @access  Private
const getBatch = async (req, res) => {
    try {
        const batch = await Batch_1.default.findByPk(req.params.id, {
            include: [
                { model: User_1.User, as: 'operator' },
                { model: Product_1.default, as: 'product' },
            ],
        });
        if (!batch) {
            res.status(404).json({
                success: false,
                message: 'Batch not found',
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: batch,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};
exports.getBatch = getBatch;
// @desc    Create batch
// @route   POST /api/v1/batches
// @access  Private (Admin, Manager, Operator)
const createBatch = async (req, res) => {
    try {
        const batchData = {
            ...req.body,
            // Use operatorId from request body if provided, otherwise use authenticated user's ID
            operatorId: req.body.operatorId || req.user?.id,
            // Use operator name from request body if provided, otherwise use authenticated user's name
            operator: req.body.operator || req.user?.name || 'Unknown Operator',
        };
        const batch = await Batch_1.default.create(batchData);
        res.status(201).json({
            success: true,
            data: batch,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};
exports.createBatch = createBatch;
// @desc    Update batch
// @route   PUT /api/v1/batches/:id
// @access  Private (Admin, Manager, Operator)
const updateBatch = async (req, res) => {
    try {
        const batch = await Batch_1.default.findByPk(req.params.id);
        if (!batch) {
            res.status(404).json({
                success: false,
                message: 'Batch not found',
            });
            return;
        }
        await batch.update(req.body);
        res.status(200).json({
            success: true,
            data: batch,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};
exports.updateBatch = updateBatch;
// @desc    Complete batch
// @route   PATCH /api/v1/batches/:id/complete
// @access  Private (Admin, Manager, Operator)
const completeBatch = async (req, res) => {
    try {
        const { yield: batchYield, qualityChecks } = req.body;
        const batch = await Batch_1.default.findByPk(req.params.id);
        if (!batch) {
            res.status(404).json({
                success: false,
                message: 'Batch not found',
            });
            return;
        }
        batch.status = 'completed';
        batch.endTime = new Date();
        if (batchYield) {
            batch.yield = batchYield;
        }
        if (qualityChecks) {
            batch.qualityChecks = { ...batch.qualityChecks, ...qualityChecks };
        }
        await batch.save();
        // Update product stock if productId exists
        if (batch.productId && batch.yield) {
            const actualQuantity = (batch.quantity * batch.yield) / 100;
            const product = await Product_1.default.findByPk(batch.productId);
            if (product) {
                product.currentStock += actualQuantity;
                product.lastRestocked = new Date();
                await product.save();
            }
        }
        res.status(200).json({
            success: true,
            data: batch,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};
exports.completeBatch = completeBatch;
// @desc    Update quality checks
// @route   PATCH /api/v1/batches/:id/quality-checks
// @access  Private (Admin, Manager, Operator)
const updateQualityChecks = async (req, res) => {
    try {
        const batch = await Batch_1.default.findByPk(req.params.id);
        if (!batch) {
            res.status(404).json({
                success: false,
                message: 'Batch not found',
            });
            return;
        }
        batch.qualityChecks = { ...batch.qualityChecks, ...req.body };
        await batch.save();
        res.status(200).json({
            success: true,
            data: batch,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};
exports.updateQualityChecks = updateQualityChecks;
// @desc    Delete batch
// @route   DELETE /api/v1/batches/:id
// @access  Private (Admin)
const deleteBatch = async (req, res) => {
    try {
        const batch = await Batch_1.default.findByPk(req.params.id);
        if (!batch) {
            res.status(404).json({
                success: false,
                message: 'Batch not found',
            });
            return;
        }
        await batch.destroy();
        res.status(200).json({
            success: true,
            message: 'Batch deleted successfully',
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};
exports.deleteBatch = deleteBatch;
//# sourceMappingURL=batchController.js.map