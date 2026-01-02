import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const getDashboardStats: (_req: AuthRequest, res: Response) => Promise<void>;
export declare const getSalesReport: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getProductionReport: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getInventoryReport: (_req: AuthRequest, res: Response) => Promise<void>;
export declare const getClientReport: (_req: AuthRequest, res: Response) => Promise<void>;
export declare const getFinancialReport: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=dashboardController.d.ts.map