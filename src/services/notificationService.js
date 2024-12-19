// services/notificationService.js
const Notification = require('../models/notification'); // Mô hình Notification

// Tạo một thông báo mới
const createNotificationsForOrders = async (userId, orders) => {
    try {
        const notifications = orders.map(order => ({
            user: userId,
            title: `Đơn hàng ${order.id} đã được duyệt`,
            message: `Đơn hàng ${order.id} của bạn đã được admin duyệt thành công.`,
            type: 'success',
            isRead: false,
        }));

        // Lưu tất cả các thông báo vào cơ sở dữ liệu
        return await Notification.insertMany(notifications);
    } catch (error) {
        throw new Error('Không thể tạo thông báo cho đơn hàng: ' + error.message);
    }
};

// Lấy tất cả thông báo của người dùng
const getUserNotifications = async (userId) => {
    try {
        const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });
        return notifications;
    } catch (error) {
        throw new Error('Lỗi khi lấy thông báo: ' + error.message);
    }
};

// Cập nhật trạng thái đã đọc cho thông báo
const markAsRead = async (notificationId) => {
    try {
        const notification = await Notification.findById(notificationId);
        if (!notification) throw new Error('Thông báo không tồn tại');
        notification.isRead = true;
        await notification.save();
        return notification;
    } catch (error) {
        throw new Error('Lỗi khi cập nhật trạng thái thông báo: ' + error.message);
    }
};

module.exports = {
    createNotificationsForOrders,
    getUserNotifications,
    markAsRead,
};
