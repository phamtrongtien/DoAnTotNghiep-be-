// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Tạo thông báo
router.post('/', notificationController.createNotification);

// Lấy thông báo của người dùng
router.get('/:userId', notificationController.getUserNotifications);

// Cập nhật trạng thái đã đọc cho thông báo
router.put('/:notificationId', notificationController.markAsRead);

module.exports = router;
