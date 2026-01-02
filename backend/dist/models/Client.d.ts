import { Model } from 'sequelize-typescript';
import Order from './Order';
import Invoice from './Invoice';
export default class Client extends Model {
    name: string;
    type: 'Restaurant' | 'Grocery' | 'Hotel' | 'Cafe' | 'Retail' | 'Wholesaler' | 'Other';
    email: string;
    phone: string;
    address: string;
    contact?: {
        name: string;
        position?: string;
        email?: string;
        phone?: string;
    };
    billingAddress?: {
        street: string;
        city: string;
        zipCode: string;
        country: string;
    };
    deliveryAddress?: {
        street: string;
        city: string;
        zipCode: string;
        country: string;
    };
    status: 'active' | 'inactive' | 'suspended';
    rating?: number;
    totalOrders: number;
    totalRevenue: number;
    monthlyRevenue: number;
    preferences?: {
        deliveryDays?: string[];
        paymentTerms?: number;
        deliveryTime?: string;
    };
    favoriteProducts: string[];
    lastOrderDate?: Date;
    notes?: string;
    orders: Order[];
    invoices: Invoice[];
}
//# sourceMappingURL=Client.d.ts.map