import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const getBatches: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getBatch: (req: AuthRequest, res: Response) => Promise<void>;
export declare const createBatch: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateBatch: (req: AuthRequest, res: Response) => Promise<void>;
export declare const completeBatch: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateQualityChecks: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteBatch: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=batchController.d.ts.map