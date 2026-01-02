"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dashboardController_1 = require("../controllers/dashboardController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Dashboard
router.get('/dashboard/stats', auth_1.protect, dashboardController_1.getDashboardStats);
// Reports
router.get('/reports/sales', auth_1.protect, dashboardController_1.getSalesReport);
router.get('/reports/production', auth_1.protect, dashboardController_1.getProductionReport);
router.get('/reports/inventory', auth_1.protect, dashboardController_1.getInventoryReport);
router.get('/reports/clients', auth_1.protect, dashboardController_1.getClientReport);
router.get('/reports/financial', auth_1.protect, (0, auth_1.authorize)('admin', 'manager'), dashboardController_1.getFinancialReport);
exports.default = router;
//# sourceMappingURL=dashboardRoutes.js.map