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
const Product_1 = __importDefault(require("./Product"));
const User_1 = __importDefault(require("./User"));
let Batch = class Batch extends sequelize_typescript_1.Model {
    static initHooks() {
        this.addHook('beforeCreate', (batch) => {
            if (!batch.batchNumber) {
                const randomSuffix = Math.random().toString(36).substring(2, 15).toUpperCase();
                batch.batchNumber = `BATCH-${Date.now()}-${randomSuffix}`;
            }
            if (!batch.qualityChecks) {
                batch.qualityChecks = {
                    temperature: 'pending',
                    pH: 'pending',
                    bacteria: 'pending'
                };
            }
            if (!batch.ingredients) {
                batch.ingredients = [];
            }
            if (!batch.equipment) {
                batch.equipment = [];
            }
            if (batch.yield === undefined || batch.yield === null) {
                batch.yield = 0;
            }
        });
    }
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        unique: true,
    }),
    __metadata("design:type", String)
], Batch.prototype, "batchNumber", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Batch.prototype, "product", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM('milk', 'yogurt', 'cheese', 'butter', 'cream', 'other'),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Batch.prototype, "productType", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Product_1.default),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
    }),
    __metadata("design:type", Number)
], Batch.prototype, "productId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Product_1.default),
    __metadata("design:type", Product_1.default)
], Batch.prototype, "productRef", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(10, 2),
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Batch.prototype, "quantity", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM('L', 'kg', 'units'),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Batch.prototype, "unit", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM('pending', 'in-progress', 'completed', 'failed', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending',
    }),
    __metadata("design:type", String)
], Batch.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User_1.default),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Batch.prototype, "operatorId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User_1.default, 'operatorId'),
    __metadata("design:type", User_1.default)
], Batch.prototype, "operatorRef", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Batch.prototype, "operator", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], Batch.prototype, "startTime", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
    }),
    __metadata("design:type", Date)
], Batch.prototype, "endTime", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(5, 2),
        allowNull: true,
    }),
    __metadata("design:type", Number)
], Batch.prototype, "temperature", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(4, 2),
        allowNull: true,
    }),
    __metadata("design:type", Number)
], Batch.prototype, "pH", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(5, 2),
        allowNull: true,
    }),
    __metadata("design:type", Number)
], Batch.prototype, "yield", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: false,
    }),
    __metadata("design:type", Object)
], Batch.prototype, "qualityChecks", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Batch.prototype, "notes", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: true,
    }),
    __metadata("design:type", Array)
], Batch.prototype, "ingredients", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: true,
    }),
    __metadata("design:type", Array)
], Batch.prototype, "equipment", void 0);
Batch = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'batches',
        timestamps: true,
    })
], Batch);
exports.default = Batch;
//# sourceMappingURL=Batch.js.map