import { Model } from 'sequelize-typescript';
export declare class User extends Model {
    id: number;
    name: string;
    email: string;
    password: string;
    role: string;
    phone?: string;
    avatar?: string;
    status: string;
    resetPasswordToken?: string;
    resetPasswordExpire?: Date;
    lastLogin?: Date;
    comparePassword(enteredPassword: string): Promise<boolean>;
    getResetPasswordToken(): string;
    static initHooks(): void;
}
export default User;
//# sourceMappingURL=User.d.ts.map