const express = require('express');
const feedbackController = require('../controllers/feedbackController');

const router = express.Router();

// Các route cho Feedback
router.post('/add', feedbackController.createFeedback); // Thêm feedback mới
router.put('/update/:feedbackId', feedbackController.updateFeedback); // Cập nhật feedback
router.delete('/delete/:feedbackId', feedbackController.deleteFeedback); // Xóa feedback
router.get('/get/:productId', feedbackController.getFeedbacksByProduct); // Lấy feedbacks của sản phẩm

module.exports = router;
