import { Model } from 'sequelize-typescript';
import Product from './Product';
import User from './User';
export default class Batch extends Model {
    batchNumber: string;
    product: string;
    productType: 'milk' | 'yogurt' | 'cheese' | 'butter' | 'cream' | 'other';
    productId?: number;
    productRef?: Product;
    quantity: number;
    unit: 'L' | 'kg' | 'units';
    status: 'pending' | 'in-progress' | 'completed' | 'failed' | 'cancelled';
    operatorId: number;
    operatorRef?: User;
    operator: string;
    startTime: Date;
    endTime?: Date;
    temperature?: number;
    pH?: number;
    yield?: number;
    qualityChecks: {
        temperature?: string;
        pH?: string;
        bacteria?: string;
    };
    notes?: string;
    ingredients?: any[];
    equipment?: any[];
    static initHooks(): void;
}
//# sourceMappingURL=Batch.d.ts.map