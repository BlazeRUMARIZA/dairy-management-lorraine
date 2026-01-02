"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = exports.resetPassword = exports.forgotPassword = exports.getMe = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const sequelize_1 = require("sequelize");
const User_1 = require("../models/User");
const emailService_1 = __importDefault(require("../services/emailService"));
// Generate JWT Token
const generateToken = (id) => {
    const secret = process.env.JWT_SECRET || 'secret';
    const expiresIn = process.env.JWT_EXPIRE || '7d';
    return jsonwebtoken_1.default.sign({ id }, secret, { expiresIn });
};
// @desc    Register new user
// @route   POST /api/v1/auth/register
// @access  Public
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        // Check if user exists
        const userExists = await User_1.User.findOne({ where: { email } });
        if (userExists) {
            res.status(400).json({
                success: false,
                message: 'User already exists',
            });
            return;
        }
        // Create user
        const user = await User_1.User.create({
            name,
            email,
            password,
            role: role || 'viewer',
        });
        // Generate token
        const token = generateToken(user.id);
        res.status(201).json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};
exports.register = register;
// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validate email & password
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: 'Please provide email and password',
            });
            return;
        }
        // Check for user (password is included by default in Sequelize)
        const user = await User_1.User.findOne({ where: { email } });
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
            return;
        }
        // Check if password matches
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
            return;
        }
        // Check if user is active
        if (user.status !== 'active') {
            res.status(401).json({
                success: false,
                message: 'Your account is inactive. Please contact administrator.',
            });
            return;
        }
        // Update last login
        user.lastLogin = new Date();
        await user.save();
        // Generate token
        const token = generateToken(user.id);
        res.status(200).json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                avatar: user.avatar,
                lastLogin: user.lastLogin,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};
exports.login = login;
// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        const user = req.user;
        res.status(200).json({
            success: true,
            user,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};
exports.getMe = getMe;
// @desc    Forgot password
// @route   POST /api/v1/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User_1.User.findOne({ where: { email } });
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found',
            });
            return;
        }
        // Generate reset token
        const resetToken = crypto_1.default.randomBytes(32).toString('hex');
        // Hash token and set to resetPasswordToken field
        user.resetPasswordToken = crypto_1.default
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        // Set expire (1 hour)
        user.resetPasswordExpire = new Date(Date.now() + 60 * 60 * 1000);
        await user.save();
        // Send email with reset token
        const emailSent = await emailService_1.default.sendPasswordResetEmail(user.email, user.name, resetToken);
        if (!emailSent) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            res.status(500).json({
                success: false,
                message: 'Email could not be sent',
            });
            return;
        }
        // In development, also return the reset URL
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
        res.status(200).json({
            success: true,
            message: 'Password reset email sent',
            resetUrl: process.env.NODE_ENV === 'development' ? resetUrl : undefined,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};
exports.forgotPassword = forgotPassword;
// @desc    Reset password
// @route   PUT /api/v1/auth/reset-password/:resetToken
// @access  Public
const resetPassword = async (req, res) => {
    try {
        // Get hashed token
        const resetPasswordToken = crypto_1.default
            .createHash('sha256')
            .update(req.params.resetToken)
            .digest('hex');
        const user = await User_1.User.findOne({
            where: {
                resetPasswordToken,
                resetPasswordExpire: {
                    [sequelize_1.Op.gt]: new Date()
                }
            }
        });
        if (!user) {
            res.status(400).json({
                success: false,
                message: 'Invalid or expired token',
            });
            return;
        }
        // Set new password
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        // Generate token
        const token = generateToken(user.id);
        res.status(200).json({
            success: true,
            token,
            message: 'Password reset successful',
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};
exports.resetPassword = resetPassword;
// @desc    Update password
// @route   PUT /api/v1/auth/update-password
// @access  Private
const updatePassword = async (req, res) => {
    try {
        const user = await User_1.User.findByPk(req.user?.id);
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found',
            });
            return;
        }
        // Check current password
        const isMatch = await user.comparePassword(req.body.currentPassword);
        if (!isMatch) {
            res.status(401).json({
                success: false,
                message: 'Current password is incorrect',
            });
            return;
        }
        user.password = req.body.newPassword;
        await user.save();
        const token = generateToken(user.id);
        res.status(200).json({
            success: true,
            token,
            message: 'Password updated successfully',
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};
exports.updatePassword = updatePassword;
//# sourceMappingURL=authController.js.map