"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const invoiceController_1 = require("../controllers/invoiceController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get('/stats/summary', auth_1.protect, invoiceController_1.getFinancialSummary);
router
    .route('/')
    .get(auth_1.protect, invoiceController_1.getInvoices)
    .post(auth_1.protect, (0, auth_1.authorize)('admin', 'manager'), invoiceController_1.createInvoice);
router.post('/from-order/:orderId', auth_1.protect, (0, auth_1.authorize)('admin', 'manager'), invoiceController_1.createInvoiceFromOrder);
router
    .route('/:id')
    .get(auth_1.protect, invoiceController_1.getInvoice)
    .put(auth_1.protect, (0, auth_1.authorize)('admin', 'manager'), invoiceController_1.updateInvoice)
    .delete(auth_1.protect, (0, auth_1.authorize)('admin'), invoiceController_1.deleteInvoice);
router.patch('/:id/pay', auth_1.protect, (0, auth_1.authorize)('admin', 'manager'), invoiceController_1.markInvoiceAsPaid);
exports.default = router;
//# sourceMappingURL=invoiceRoutes.js.map