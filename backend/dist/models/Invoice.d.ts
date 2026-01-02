import { Model } from 'sequelize-typescript';
import Client from './Client';
import Order from './Order';
import User from './User';
export default class Invoice extends Model {
    invoiceNumber: string;
    orderId?: number;
    order?: Order;
    clientId: number;
    client: Client;
    clientName: string;
    items: Array<{
        description: string;
        quantity: number;
        unitPrice: number;
        total: number;
    }>;
    subtotal: number;
    tax: number;
    discount?: number;
    total: number;
    status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
    issueDate: Date;
    dueDate: Date;
    paidDate?: Date;
    paymentMethod?: string;
    paymentReference?: string;
    notes?: string;
    termsAndConditions?: string;
    createdBy: number;
    creator: User;
    static initHooks(): void;
}
//# sourceMappingURL=Invoice.d.ts.map