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
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const Order_1 = __importDefault(require("./Order"));
const Invoice_1 = __importDefault(require("./Invoice"));
let Client = class Client extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], Client.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM('Restaurant', 'Grocery', 'Hotel', 'Cafe', 'Retail', 'Wholesaler', 'Other'),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Client.prototype, "type", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        validate: {
            isEmail: {
                msg: 'Please enter a valid email',
            },
        },
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], Client.prototype, "email", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Client.prototype, "phone", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Client.prototype, "address", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], Client.prototype, "contact", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], Client.prototype, "billingAddress", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], Client.prototype, "deliveryAddress", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM('active', 'inactive', 'suspended'),
        allowNull: false,
        defaultValue: 'active',
    }),
    __metadata("design:type", String)
], Client.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(2, 1),
        allowNull: true,
        validate: {
            min: 0,
            max: 5,
        },
    }),
    __metadata("design:type", Number)
], Client.prototype, "rating", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0,
        },
    }),
    __metadata("design:type", Number)
], Client.prototype, "totalOrders", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0,
        },
    }),
    __metadata("design:type", Number)
], Client.prototype, "totalRevenue", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0,
        },
    }),
    __metadata("design:type", Number)
], Client.prototype, "monthlyRevenue", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], Client.prototype, "preferences", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: false,
        defaultValue: [],
    }),
    __metadata("design:type", Array)
], Client.prototype, "favoriteProducts", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
    }),
    __metadata("design:type", Date)
], Client.prototype, "lastOrderDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Client.prototype, "notes", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Order_1.default),
    __metadata("design:type", Array)
], Client.prototype, "orders", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Invoice_1.default),
    __metadata("design:type", Array)
], Client.prototype, "invoices", void 0);
Client = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'clients',
        timestamps: true,
        indexes: [
            {
                type: 'FULLTEXT',
                fields: ['name', 'email']
            }
        ]
    })
], Client);
exports.default = Client;
//# sourceMappingURL=Client.js.map