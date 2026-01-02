import { Model } from 'sequelize-typescript';
import Client from './Client';
import User from './User';
export default class Order extends Model {
    orderNumber: string;
    clientId: number;
    client: Client;
    clientName: string;
    status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'in-transit' | 'delivered' | 'cancelled';
    items: Array<{
        productId: number;
        productName: string;
        quantity: number;
        unit: string;
        unitPrice: number;
        total: number;
    }>;
    subtotal: number;
    tax: number;
    discount?: number;
    total: number;
    deliveryAddress: {
        street: string;
        city: string;
        zipCode: string;
        country: string;
    };
    deliveryDate: Date;
    deliveryTime?: string;
    driverId?: number;
    driver?: User;
    driverName?: string;
    specialInstructions?: string;
    tracking: {
        status: string;
        events: Array<{
            status: string;
            timestamp: string;
            updatedBy?: number;
        }>;
    };
    paymentStatus: 'pending' | 'paid' | 'partial' | 'overdue';
    paymentMethod?: string;
    notes?: string;
    createdBy: number;
    creator: User;
    static initHooks(): void;
}
//# sourceMappingURL=Order.d.ts.map