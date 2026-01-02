"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var User_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
let User = User_1 = class User extends sequelize_typescript_1.Model {
    // Instance method to compare password
    async comparePassword(enteredPassword) {
        return bcryptjs_1.default.compare(enteredPassword, this.password);
    }
    // Generate password reset token
    getResetPasswordToken() {
        const resetToken = crypto_1.default.randomBytes(20).toString('hex');
        this.resetPasswordToken = crypto_1.default
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        this.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        return resetToken;
    }
    // Static method to initialize lifecycle hooks
    static initHooks() {
        User_1.beforeCreate(async (user) => {
            if (user.password) {
                const salt = await bcryptjs_1.default.genSalt(10);
                user.password = await bcryptjs_1.default.hash(user.password, salt);
            }
        });
        User_1.beforeUpdate(async (user) => {
            if (user.changed('password')) {
                const salt = await bcryptjs_1.default.genSalt(10);
                user.password = await bcryptjs_1.default.hash(user.password, salt);
            }
        });
    }
};
exports.User = User;
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    }),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        unique: true,
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM('admin', 'manager', 'operator', 'driver', 'viewer'),
        allowNull: false,
        defaultValue: 'viewer',
    }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], User.prototype, "avatar", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM('active', 'inactive', 'suspended'),
        allowNull: false,
        defaultValue: 'active',
    }),
    __metadata("design:type", String)
], User.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], User.prototype, "resetPasswordToken", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
    }),
    __metadata("design:type", Date)
], User.prototype, "resetPasswordExpire", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
    }),
    __metadata("design:type", Date)
], User.prototype, "lastLogin", void 0);
exports.User = User = User_1 = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'users',
        timestamps: true,
    })
], User);
exports.default = User;
//# sourceMappingURL=User.js.map