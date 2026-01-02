import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const getClients: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getClient: (req: AuthRequest, res: Response) => Promise<void>;
export declare const createClient: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateClient: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteClient: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getClientStats: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=clientController.d.ts.map