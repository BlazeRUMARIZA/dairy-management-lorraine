"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const clientController_1 = require("../controllers/clientController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router
    .route('/')
    .get(auth_1.protect, clientController_1.getClients)
    .post(auth_1.protect, (0, auth_1.authorize)('admin', 'manager'), clientController_1.createClient);
router
    .route('/:id')
    .get(auth_1.protect, clientController_1.getClient)
    .put(auth_1.protect, (0, auth_1.authorize)('admin', 'manager'), clientController_1.updateClient)
    .delete(auth_1.protect, (0, auth_1.authorize)('admin'), clientController_1.deleteClient);
router.get('/:id/stats', auth_1.protect, clientController_1.getClientStats);
exports.default = router;
//# sourceMappingURL=clientRoutes.js.map