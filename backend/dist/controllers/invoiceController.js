"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFinancialSummary = exports.deleteInvoice = exports.markInvoiceAsPaid = exports.updateInvoice = exports.createInvoice = exports.createInvoiceFromOrder = exports.getInvoice = exports.getInvoices = void 0;
const sequelize_1 = require("sequelize");
const Invoice_1 = __importDefault(require("../models/Invoice"));
const Order_1 = __importDefault(require("../models/Order"));
const Client_1 = __importDefault(require("../models/Client"));
const User_1 = require("../models/User");
// @desc    Get all invoices
// @route   GET /api/v1/invoices
// @access  Private
const getInvoices = async (req, res) => {
    try {
        const { status, clientId, startDate, endDate } = req.query;
        let where = {};
        if (status) {
            where.status = status;
        }
        if (clientId) {
            where.clientId = clientId;
        }
        if (startDate || endDate) {
            where.issueDate = {};
            if (startDate) {
                where.issueDate[sequelize_1.Op.gte] = new Date(startDate);
            }
            if (endDate) {
                where.issueDate[sequelize_1.Op.lte] = new Date(endDate);
            }
        }
        const invoices = await Invoice_1.default.findAll({
            where,
            include: [
                { model: Client_1.default, as: 'client', attributes: ['id', 'name', 'type', 'email'] },
                { model: Order_1.default, as: 'order' },
            ],
            order: [['createdAt', 'DESC']],
        });
        res.status(200).json({
            success: true,
            count: invoices.length,
            data: invoices,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};
exports.getInvoices = getInvoices;
// @desc    Get single invoice
// @route   GET /api/v1/invoices/:id
// @access  Private
const getInvoice = async (req, res) => {
    try {
        const invoice = await Invoice_1.default.findByPk(req.params.id, {
            include: [
                { model: Client_1.default, as: 'client' },
                { model: Order_1.default, as: 'order' },
                { model: User_1.User, as: 'creator', attributes: ['id', 'name'] },
            ],
        });
        if (!invoice) {
            res.status(404).json({
                success: false,
                message: 'Invoice not found',
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: invoice,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};
exports.getInvoice = getInvoice;
// @desc    Create invoice from order
// @route   POST /api/v1/invoices/from-order/:orderId
// @access  Private (Admin, Manager)
const createInvoiceFromOrder = async (req, res) => {
    try {
        const order = await Order_1.default.findByPk(req.params.orderId, {
            include: [{ model: Client_1.default, as: 'client' }],
        });
        if (!order) {
            res.status(404).json({
                success: false,
                message: 'Order not found',
            });
            return;
        }
        const items = order.items.map((item) => ({
            description: item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.total,
        }));
        const { paymentTerms = 30 } = req.body;
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + paymentTerms);
        const invoice = await Invoice_1.default.create({
            orderId: order.id,
            clientId: order.clientId,
            clientName: order.clientName,
            items,
            subtotal: order.subtotal,
            tax: order.tax,
            discount: order.discount || 0,
            total: order.total,
            issueDate: new Date(),
            dueDate,
            createdBy: req.user?.id,
        });
        res.status(201).json({
            success: true,
            data: invoice,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};
exports.createInvoiceFromOrder = createInvoiceFromOrder;
// @desc    Create invoice
// @route   POST /api/v1/invoices
// @access  Private (Admin, Manager)
const createInvoice = async (req, res) => {
    try {
        const { clientId, items, dueDate, discount, termsAndConditions, notes } = req.body;
        const client = await Client_1.default.findByPk(clientId);
        if (!client) {
            res.status(404).json({
                success: false,
                message: 'Client not found',
            });
            return;
        }
        // Calculate totals
        let subtotal = 0;
        items.forEach((item) => {
            subtotal += item.total;
        });
        const tax = subtotal * 0.2; // 20% tax
        const total = subtotal + tax - (discount || 0);
        const invoice = await Invoice_1.default.create({
            clientId,
            clientName: client.name,
            items,
            subtotal,
            tax,
            discount: discount || 0,
            total,
            dueDate,
            termsAndConditions,
            notes,
            createdBy: req.user?.id,
        });
        res.status(201).json({
            success: true,
            data: invoice,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};
exports.createInvoice = createInvoice;
// @desc    Update invoice
// @route   PUT /api/v1/invoices/:id
// @access  Private (Admin, Manager)
const updateInvoice = async (req, res) => {
    try {
        const invoice = await Invoice_1.default.findByPk(req.params.id);
        if (!invoice) {
            res.status(404).json({
                success: false,
                message: 'Invoice not found',
            });
            return;
        }
        await invoice.update(req.body);
        res.status(200).json({
            success: true,
            data: invoice,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};
exports.updateInvoice = updateInvoice;
// @desc    Mark invoice as paid
// @route   PATCH /api/v1/invoices/:id/pay
// @access  Private (Admin, Manager)
const markInvoiceAsPaid = async (req, res) => {
    try {
        const { paymentMethod, paymentReference } = req.body;
        const invoice = await Invoice_1.default.findByPk(req.params.id);
        if (!invoice) {
            res.status(404).json({
                success: false,
                message: 'Invoice not found',
            });
            return;
        }
        invoice.status = 'paid';
        invoice.paidDate = new Date();
        invoice.paymentMethod = paymentMethod;
        invoice.paymentReference = paymentReference;
        await invoice.save();
        res.status(200).json({
            success: true,
            data: invoice,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};
exports.markInvoiceAsPaid = markInvoiceAsPaid;
// @desc    Delete invoice
// @route   DELETE /api/v1/invoices/:id
// @access  Private (Admin)
const deleteInvoice = async (req, res) => {
    try {
        const invoice = await Invoice_1.default.findByPk(req.params.id);
        if (!invoice) {
            res.status(404).json({
                success: false,
                message: 'Invoice not found',
            });
            return;
        }
        await invoice.destroy();
        res.status(200).json({
            success: true,
            message: 'Invoice deleted successfully',
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};
exports.deleteInvoice = deleteInvoice;
// @desc    Get financial summary
// @route   GET /api/v1/invoices/stats/summary
// @access  Private
const getFinancialSummary = async (_req, res) => {
    try {
        const { fn, col } = require('sequelize');
        // Total revenue
        const totalRevenueResult = await Invoice_1.default.findOne({
            attributes: [[fn('SUM', col('total')), 'total']],
            raw: true,
        });
        // Paid invoices
        const paidResult = await Invoice_1.default.findOne({
            where: { status: 'paid' },
            attributes: [[fn('SUM', col('total')), 'total']],
            raw: true,
        });
        // Pending invoices (sent or draft)
        const pendingResult = await Invoice_1.default.findOne({
            where: { status: { [sequelize_1.Op.in]: ['sent', 'draft'] } },
            attributes: [[fn('SUM', col('total')), 'total']],
            raw: true,
        });
        // Overdue invoices
        const overdueResult = await Invoice_1.default.findOne({
            where: { status: 'overdue' },
            attributes: [[fn('SUM', col('total')), 'total']],
            raw: true,
        });
        res.status(200).json({
            success: true,
            data: {
                totalRevenue: totalRevenueResult?.total || 0,
                collected: paidResult?.total || 0,
                pending: pendingResult?.total || 0,
                overdue: overdueResult?.total || 0,
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
exports.getFinancialSummary = getFinancialSummary;
//# sourceMappingURL=invoiceController.js.map