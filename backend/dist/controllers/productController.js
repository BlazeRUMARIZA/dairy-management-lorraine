"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLowStockProducts = exports.updateStock = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProduct = exports.getProducts = void 0;
const sequelize_1 = require("sequelize");
const Product_1 = __importDefault(require("../models/Product"));
// @desc    Get all products
// @route   GET /api/v1/products
// @access  Private
const getProducts = async (req, res) => {
    try {
        const { category, status, search } = req.query;
        let where = {};
        if (category) {
            where.category = category;
        }
        if (status) {
            where.status = status;
        }
        if (search) {
            where[sequelize_1.Op.or] = [
                { name: { [sequelize_1.Op.like]: `%${search}%` } },
                { sku: { [sequelize_1.Op.like]: `%${search}%` } },
                { barcode: { [sequelize_1.Op.like]: `%${search}%` } },
            ];
        }
        const products = await Product_1.default.findAll({
            where,
            order: [['createdAt', 'DESC']],
        });
        res.status(200).json({
            success: true,
            count: products.length,
            data: products,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};
exports.getProducts = getProducts;
// @desc    Get single product
// @route   GET /api/v1/products/:id
// @access  Private
const getProduct = async (req, res) => {
    try {
        const product = await Product_1.default.findByPk(req.params.id);
        if (!product) {
            res.status(404).json({
                success: false,
                message: 'Product not found',
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: product,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};
exports.getProduct = getProduct;
// @desc    Create product
// @route   POST /api/v1/products
// @access  Private (Admin, Manager)
const createProduct = async (req, res) => {
    try {
        const product = await Product_1.default.create(req.body);
        res.status(201).json({
            success: true,
            data: product,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};
exports.createProduct = createProduct;
// @desc    Update product
// @route   PUT /api/v1/products/:id
// @access  Private (Admin, Manager)
const updateProduct = async (req, res) => {
    try {
        const product = await Product_1.default.findByPk(req.params.id);
        if (!product) {
            res.status(404).json({
                success: false,
                message: 'Product not found',
            });
            return;
        }
        await product.update(req.body);
        res.status(200).json({
            success: true,
            data: product,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};
exports.updateProduct = updateProduct;
// @desc    Delete product
// @route   DELETE /api/v1/products/:id
// @access  Private (Admin)
const deleteProduct = async (req, res) => {
    try {
        const product = await Product_1.default.findByPk(req.params.id);
        if (!product) {
            res.status(404).json({
                success: false,
                message: 'Product not found',
            });
            return;
        }
        await product.destroy();
        res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};
exports.deleteProduct = deleteProduct;
// @desc    Update stock
// @route   PATCH /api/v1/products/:id/stock
// @access  Private (Admin, Manager, Operator)
const updateStock = async (req, res) => {
    try {
        const { quantity, type } = req.body;
        const product = await Product_1.default.findByPk(req.params.id);
        if (!product) {
            res.status(404).json({
                success: false,
                message: 'Product not found',
            });
            return;
        }
        if (type === 'add') {
            product.currentStock += quantity;
            product.lastRestocked = new Date();
        }
        else if (type === 'subtract') {
            if (product.currentStock < quantity) {
                res.status(400).json({
                    success: false,
                    message: 'Insufficient stock',
                });
                return;
            }
            product.currentStock -= quantity;
        }
        else if (type === 'set') {
            product.currentStock = quantity;
        }
        await product.save();
        res.status(200).json({
            success: true,
            data: product,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};
exports.updateStock = updateStock;
// @desc    Get low stock products
// @route   GET /api/v1/products/alerts/low-stock
// @access  Private
const getLowStockProducts = async (_req, res) => {
    try {
        const products = await Product_1.default.findAll({
            where: {
                status: {
                    [sequelize_1.Op.in]: ['low', 'critical', 'out-of-stock']
                }
            },
            order: [['currentStock', 'ASC']],
        });
        res.status(200).json({
            success: true,
            count: products.length,
            data: products,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};
exports.getLowStockProducts = getLowStockProducts;
//# sourceMappingURL=productController.js.map