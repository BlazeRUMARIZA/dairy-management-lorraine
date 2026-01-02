"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserStatus = exports.deleteUser = exports.updateUser = exports.getUser = exports.getUsers = void 0;
const User_1 = require("../models/User");
// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private (Admin only)
const getUsers = async (req, res) => {
    try {
        const users = await User_1.User.findAll({
            attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpire'] },
            order: [['createdAt', 'DESC']],
        });
        res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};
exports.getUsers = getUsers;
// @desc    Get single user
// @route   GET /api/v1/users/:id
// @access  Private (Admin only)
const getUser = async (req, res) => {
    try {
        const user = await User_1.User.findByPk(req.params.id, {
            attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpire'] },
        });
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found',
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};
exports.getUser = getUser;
// @desc    Update user
// @route   PUT /api/v1/users/:id
// @access  Private (Admin only)
const updateUser = async (req, res) => {
    try {
        const user = await User_1.User.findByPk(req.params.id);
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found',
            });
            return;
        }
        // Don't allow updating password through this endpoint
        const { password, resetPasswordToken, resetPasswordExpire, ...updateData } = req.body;
        // Check if email is being changed and if it's already taken
        if (updateData.email && updateData.email !== user.email) {
            const emailExists = await User_1.User.findOne({ where: { email: updateData.email } });
            if (emailExists) {
                res.status(400).json({
                    success: false,
                    message: 'Email already exists',
                });
                return;
            }
        }
        await user.update(updateData);
        // Return user without password
        const updatedUser = await User_1.User.findByPk(user.id, {
            attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpire'] },
        });
        res.status(200).json({
            success: true,
            data: updatedUser,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};
exports.updateUser = updateUser;
// @desc    Delete user
// @route   DELETE /api/v1/users/:id
// @access  Private (Admin only)
const deleteUser = async (req, res) => {
    try {
        const user = await User_1.User.findByPk(req.params.id);
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found',
            });
            return;
        }
        // Prevent deleting yourself
        if (req.user && user.id === req.user.id) {
            res.status(400).json({
                success: false,
                message: 'You cannot delete your own account',
            });
            return;
        }
        await user.destroy();
        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};
exports.deleteUser = deleteUser;
// @desc    Update user status (activate/deactivate)
// @route   PATCH /api/v1/users/:id/status
// @access  Private (Admin only)
const updateUserStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!status || !['active', 'inactive'].includes(status)) {
            res.status(400).json({
                success: false,
                message: 'Valid status is required (active or inactive)',
            });
            return;
        }
        const user = await User_1.User.findByPk(req.params.id);
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found',
            });
            return;
        }
        // Prevent deactivating yourself
        if (req.user && user.id === req.user.id) {
            res.status(400).json({
                success: false,
                message: 'You cannot deactivate your own account',
            });
            return;
        }
        user.status = status;
        await user.save();
        // Return user without password
        const updatedUser = await User_1.User.findByPk(user.id, {
            attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpire'] },
        });
        res.status(200).json({
            success: true,
            data: updatedUser,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};
exports.updateUserStatus = updateUserStatus;
//# sourceMappingURL=userController.js.map