import Order from '../models/Order';
import Product from '../models/Product';
import Invoice from '../models/Invoice';
import Batch from '../models/Batch';
export declare const testEmailConnection: () => Promise<boolean>;
export declare const sendPasswordResetEmail: (email: string, name: string, resetToken: string) => Promise<boolean>;
export declare const sendOrderConfirmationEmail: (order: Order, clientEmail: string, clientName: string) => Promise<boolean>;
export declare const sendLowStockAlert: (products: Product[], recipientEmail: string, recipientName: string) => Promise<boolean>;
export declare const sendExpirationWarning: (batches: Array<Batch & {
    productRef?: Product;
}>, recipientEmail: string, recipientName: string) => Promise<boolean>;
export declare const sendPaymentReminder: (invoice: Invoice, clientEmail: string, clientName: string) => Promise<boolean>;
export declare const sendDailyProductionReport: (reportData: {
    date: string;
    totalProduction: number;
    batchesCompleted: number;
    productionByProduct: Array<{
        productName: string;
        quantity: number;
    }>;
    activeOperators: number;
}, recipientEmail: string, recipientName: string) => Promise<boolean>;
declare const _default: {
    testEmailConnection: () => Promise<boolean>;
    sendPasswordResetEmail: (email: string, name: string, resetToken: string) => Promise<boolean>;
    sendOrderConfirmationEmail: (order: Order, clientEmail: string, clientName: string) => Promise<boolean>;
    sendLowStockAlert: (products: Product[], recipientEmail: string, recipientName: string) => Promise<boolean>;
    sendExpirationWarning: (batches: Array<Batch & {
        productRef?: Product;
    }>, recipientEmail: string, recipientName: string) => Promise<boolean>;
    sendPaymentReminder: (invoice: Invoice, clientEmail: string, clientName: string) => Promise<boolean>;
    sendDailyProductionReport: (reportData: {
        date: string;
        totalProduction: number;
        batchesCompleted: number;
        productionByProduct: Array<{
            productName: string;
            quantity: number;
        }>;
        activeOperators: number;
    }, recipientEmail: string, recipientName: string) => Promise<boolean>;
};
export default _default;
//# sourceMappingURL=emailService.d.ts.map