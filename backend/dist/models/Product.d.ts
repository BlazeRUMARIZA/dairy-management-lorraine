import { Model } from 'sequelize-typescript';
export default class Product extends Model {
    name: string;
    category: 'Milk' | 'Yogurt' | 'Cheese' | 'Butter' | 'Cream' | 'Other';
    sku: string;
    barcode?: string;
    description?: string;
    currentStock: number;
    minThreshold: number;
    maxCapacity: number;
    unit: 'L' | 'kg' | 'units' | 'g' | 'ml';
    unitPrice: number;
    costPrice: number;
    location?: string;
    shelfLife?: number;
    storageTemp?: string;
    status: 'normal' | 'low' | 'critical' | 'out-of-stock';
    image?: string;
    supplier?: string;
    lastRestocked?: Date;
    static initHooks(): void;
}
//# sourceMappingURL=Product.d.ts.map