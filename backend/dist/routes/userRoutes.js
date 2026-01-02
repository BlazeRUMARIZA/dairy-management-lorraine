"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// All routes are protected and require admin role
router
    .route('/')
    .get(auth_1.protect, (0, auth_1.authorize)('admin'), userController_1.getUsers);
router
    .route('/:id')
    .get(auth_1.protect, (0, auth_1.authorize)('admin'), userController_1.getUser)
    .put(auth_1.protect, (0, auth_1.authorize)('admin'), userController_1.updateUser)
    .delete(auth_1.protect, (0, auth_1.authorize)('admin'), userController_1.deleteUser);
router.patch('/:id/status', auth_1.protect, (0, auth_1.authorize)('admin'), userController_1.updateUserStatus);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map