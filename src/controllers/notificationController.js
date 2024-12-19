// controllers/notificationController.js
const notificationService = require('../services/notificationService');

// Tạo thông báo
const createNotification = async (req, res) => {
    const { userId, orders } = req.body;  // Giả sử orders là danh sách các đơn hàng

    try {
        // Gọi service để tạo thông báo cho tất cả các đơn hàng
        const notifications = await notificationService.createNotificationsForOrders(userId, orders);
        return res.status(201).json(notifications);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

// Lấy thông báo của người dùng
const getUserNotifications = async (req, res) => {
    try {
        const { userId } = req.params; // Lấy userId từ URL
        const notifications = await notificationService.getUserNotifications(userId);
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật trạng thái đã đọc cho thông báo
const markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params; // Lấy notificationId từ URL
        const notification = await notificationService.markAsRead(notificationId);
        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createNotification,
    getUserNotifications,
    markAsRead,
};
