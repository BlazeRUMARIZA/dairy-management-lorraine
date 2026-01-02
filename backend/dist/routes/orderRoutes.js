"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router
    .route('/')
    .get(auth_1.protect, orderController_1.getOrders)
    .post(auth_1.protect, (0, auth_1.authorize)('admin', 'manager'), orderController_1.createOrder);
router
    .route('/:id')
    .get(auth_1.protect, orderController_1.getOrder)
    .put(auth_1.protect, (0, auth_1.authorize)('admin', 'manager'), orderController_1.updateOrder);
router.patch('/:id/status', auth_1.protect, orderController_1.updateOrderStatus);
router.patch('/:id/assign-driver', auth_1.protect, (0, auth_1.authorize)('admin', 'manager'), orderController_1.assignDriver);
router.patch('/:id/cancel', auth_1.protect, (0, auth_1.authorize)('admin', 'manager'), orderController_1.cancelOrder);
exports.default = router;
//# sourceMappingURL=orderRoutes.js.map