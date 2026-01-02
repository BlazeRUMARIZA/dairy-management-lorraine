"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const batchController_1 = require("../controllers/batchController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router
    .route('/')
    .get(auth_1.protect, batchController_1.getBatches)
    .post(auth_1.protect, (0, auth_1.authorize)('admin', 'manager', 'operator'), batchController_1.createBatch);
router
    .route('/:id')
    .get(auth_1.protect, batchController_1.getBatch)
    .put(auth_1.protect, (0, auth_1.authorize)('admin', 'manager', 'operator'), batchController_1.updateBatch)
    .delete(auth_1.protect, (0, auth_1.authorize)('admin'), batchController_1.deleteBatch);
router.patch('/:id/complete', auth_1.protect, (0, auth_1.authorize)('admin', 'manager', 'operator'), batchController_1.completeBatch);
router.patch('/:id/quality-checks', auth_1.protect, (0, auth_1.authorize)('admin', 'manager', 'operator'), batchController_1.updateQualityChecks);
exports.default = router;
//# sourceMappingURL=batchRoutes.js.map