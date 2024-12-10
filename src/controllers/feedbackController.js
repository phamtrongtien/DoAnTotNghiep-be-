const feedbackService = require('../services/feedbackService');

// Thêm feedback mới
const createFeedback = async (req, res) => {
    const { userId, productId, comment } = req.body;
    try {
        const feedback = await feedbackService.createFeedback(userId, productId, comment);
        res.status(201).json(feedback);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Cập nhật feedback
const updateFeedback = async (req, res) => {
    const { feedbackId } = req.params;
    const { comment } = req.body;
    try {
        const feedback = await feedbackService.updateFeedback(feedbackId, comment);
        res.status(200).json(feedback);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Xóa feedback
const deleteFeedback = async (req, res) => {
    const { feedbackId } = req.params;

    try {
        const feedback = await feedbackService.deleteFeedback(feedbackId);
        res.status(200).json({ message: 'Feedback deleted successfully', feedback });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Lấy tất cả feedback của một sản phẩm
const getFeedbacksByProduct = async (req, res) => {
    const { productId } = req.params;
    try {
        const feedbacks = await feedbackService.getFeedbacksByProduct(productId);
        res.status(200).json(feedbacks);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { createFeedback, updateFeedback, deleteFeedback, getFeedbacksByProduct };
