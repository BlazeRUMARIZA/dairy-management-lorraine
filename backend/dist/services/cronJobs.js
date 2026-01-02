"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startLowStockAlert = startLowStockAlert;
exports.startExpirationWarning = startExpirationWarning;
exports.startPaymentReminders = startPaymentReminders;
exports.startDailyProductionReport = startDailyProductionReport;
exports.startAllCronJobs = startAllCronJobs;
exports.stopAllCronJobs = stopAllCronJobs;
const node_cron_1 = __importDefault(require("node-cron"));
const sequelize_1 = require("sequelize");
const Product_1 = __importDefault(require("../models/Product"));
const Batch_1 = __importDefault(require("../models/Batch"));
const Invoice_1 = __importDefault(require("../models/Invoice"));
const User_1 = require("../models/User");
const Client_1 = __importDefault(require("../models/Client"));
const emailService_1 = __importDefault(require("./emailService"));
// Store cron job instances
const jobs = {};
// Get admin/manager emails for alerts
async function getAdminEmails() {
    const admins = await User_1.User.findAll({
        where: {
            role: {
                [sequelize_1.Op.in]: ['admin', 'manager'],
            },
            status: 'active',
        },
    });
    return admins.map(admin => ({ email: admin.email, name: admin.name || admin.email }));
}
// Job 1: Check low stock (runs every 6 hours)
function startLowStockAlert() {
    const jobName = 'lowStockAlert';
    // Stop existing job if running
    if (jobs[jobName]) {
        jobs[jobName].stop();
    }
    // Run every day at 9 AM
    jobs[jobName] = node_cron_1.default.schedule('0 9 * * *', async () => {
        try {
            console.log('🔍 Running low stock check...');
            // Find products where current stock is below minimum threshold
            const lowStockProducts = await Product_1.default.findAll({
                where: {
                    currentStock: {
                        [sequelize_1.Op.lt]: Product_1.default.sequelize.col('minThreshold'),
                    },
                },
            });
            if (lowStockProducts.length > 0) {
                const admins = await getAdminEmails();
                for (const admin of admins) {
                    await emailService_1.default.sendLowStockAlert(lowStockProducts, admin.email, admin.name);
                }
                console.log(`✅ Low stock alert sent for ${lowStockProducts.length} products`);
            }
            else {
                console.log('✅ All products have sufficient stock');
            }
        }
        catch (error) {
            console.error('❌ Low stock alert error:', error);
        }
    });
    console.log('📅 Low stock alert cron job started (runs daily at 9 AM)');
}
// Job 2: Check expiring batches (runs daily)
function startExpirationWarning() {
    const jobName = 'expirationWarning';
    if (jobs[jobName]) {
        jobs[jobName].stop();
    }
    // Run every day at 8 AM
    jobs[jobName] = node_cron_1.default.schedule('0 8 * * *', async () => {
        try {
            console.log('🔍 Running expiration check...');
            // Find batches that are approaching expiration (within 7 days)
            const batches = await Batch_1.default.findAll({
                where: {
                    status: {
                        [sequelize_1.Op.in]: ['completed', 'in-progress'],
                    },
                },
                include: [{ model: Product_1.default, as: 'productRef' }],
            });
            const expiringBatches = batches.filter(batch => {
                const productShelfLife = batch.productRef?.shelfLife || 7;
                const expiryDate = new Date(batch.startTime);
                expiryDate.setDate(expiryDate.getDate() + Number(productShelfLife));
                const daysUntilExpiry = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                return daysUntilExpiry >= 0 && daysUntilExpiry <= 7;
            });
            if (expiringBatches.length > 0) {
                const admins = await getAdminEmails();
                for (const admin of admins) {
                    await emailService_1.default.sendExpirationWarning(expiringBatches, admin.email, admin.name);
                }
                console.log(`✅ Expiration warning sent for ${expiringBatches.length} batches`);
            }
            else {
                console.log('✅ No batches expiring soon');
            }
        }
        catch (error) {
            console.error('❌ Expiration warning error:', error);
        }
    });
    console.log('📅 Expiration warning cron job started (runs daily at 8 AM)');
}
// Job 3: Check overdue invoices (runs daily)
function startPaymentReminders() {
    const jobName = 'paymentReminders';
    if (jobs[jobName]) {
        jobs[jobName].stop();
    }
    // Run every day at 10 AM
    jobs[jobName] = node_cron_1.default.schedule('0 10 * * *', async () => {
        try {
            console.log('🔍 Running payment reminder check...');
            // Find overdue invoices
            const overdueInvoices = await Invoice_1.default.findAll({
                where: {
                    status: {
                        [sequelize_1.Op.in]: ['sent', 'overdue'],
                    },
                    dueDate: {
                        [sequelize_1.Op.lt]: new Date(),
                    },
                },
                include: [{ model: Client_1.default, as: 'client' }],
            });
            if (overdueInvoices.length > 0) {
                for (const invoice of overdueInvoices) {
                    if (invoice.client && invoice.client.email) {
                        await emailService_1.default.sendPaymentReminder(invoice, invoice.client.email, invoice.client.name);
                    }
                }
                // Also update invoice status to overdue
                await Invoice_1.default.update({ status: 'overdue' }, {
                    where: {
                        id: {
                            [sequelize_1.Op.in]: overdueInvoices.map(inv => inv.id),
                        },
                        status: 'sent',
                    },
                });
                console.log(`✅ Payment reminders sent for ${overdueInvoices.length} invoices`);
            }
            else {
                console.log('✅ No overdue invoices');
            }
        }
        catch (error) {
            console.error('❌ Payment reminder error:', error);
        }
    });
    console.log('📅 Payment reminder cron job started (runs daily at 10 AM)');
}
// Job 4: Daily production report (runs at end of day)
function startDailyProductionReport() {
    const jobName = 'dailyProductionReport';
    if (jobs[jobName]) {
        jobs[jobName].stop();
    }
    // Run every day at 6 PM
    jobs[jobName] = node_cron_1.default.schedule('0 18 * * *', async () => {
        try {
            console.log('🔍 Generating daily production report...');
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            // Get batches completed today
            const batches = await Batch_1.default.findAll({
                where: {
                    status: 'completed',
                    endTime: {
                        [sequelize_1.Op.gte]: today,
                        [sequelize_1.Op.lt]: tomorrow,
                    },
                },
                include: [{ model: Product_1.default, as: 'productRef' }],
            });
            // Calculate statistics
            const totalProduction = batches.reduce((sum, batch) => sum + Number(batch.quantity || 0), 0);
            const productionByProduct = {};
            batches.forEach(batch => {
                const productName = batch.productRef?.name || `Product ${batch.productId}`;
                productionByProduct[productName] =
                    (productionByProduct[productName] || 0) + Number(batch.quantity || 0);
            });
            const productionArray = Object.entries(productionByProduct).map(([productName, quantity]) => ({ productName, quantity }));
            // Get unique operators
            const uniqueOperators = new Set(batches.map(b => b.operatorId));
            const reportData = {
                date: today.toLocaleDateString(),
                totalProduction,
                batchesCompleted: batches.length,
                productionByProduct: productionArray,
                activeOperators: uniqueOperators.size,
            };
            // Send to admins and managers
            const recipients = await getAdminEmails();
            for (const recipient of recipients) {
                await emailService_1.default.sendDailyProductionReport(reportData, recipient.email, recipient.name);
            }
            console.log(`✅ Daily production report sent to ${recipients.length} recipients`);
        }
        catch (error) {
            console.error('❌ Daily production report error:', error);
        }
    });
    console.log('📅 Daily production report cron job started (runs daily at 6 PM)');
}
// Start all cron jobs
function startAllCronJobs() {
    console.log('\n🚀 Starting all cron jobs...\n');
    startLowStockAlert();
    startExpirationWarning();
    startPaymentReminders();
    startDailyProductionReport();
    console.log('\n✅ All cron jobs started successfully\n');
}
// Stop all cron jobs
function stopAllCronJobs() {
    Object.values(jobs).forEach(job => job.stop());
    console.log('🛑 All cron jobs stopped');
}
exports.default = {
    startAllCronJobs,
    stopAllCronJobs,
    startLowStockAlert,
    startExpirationWarning,
    startPaymentReminders,
    startDailyProductionReport,
};
//# sourceMappingURL=cronJobs.js.map