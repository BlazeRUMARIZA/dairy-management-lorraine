import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const getInvoices: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getInvoice: (req: AuthRequest, res: Response) => Promise<void>;
export declare const createInvoiceFromOrder: (req: AuthRequest, res: Response) => Promise<void>;
export declare const createInvoice: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateInvoice: (req: AuthRequest, res: Response) => Promise<void>;
export declare const markInvoiceAsPaid: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteInvoice: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getFinancialSummary: (_req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=invoiceController.d.ts.map