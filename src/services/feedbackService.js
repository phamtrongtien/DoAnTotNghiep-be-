const Feedback = require('../models/feedBackModel'); // Đảm bảo đường dẫn đúng với vị trí model

// Tạo mới một feedback
const createFeedback = async (userId, productId, comment) => {
    try {
        const feedback = new Feedback({
            user: userId,
            product: productId,
            comment,
        });
        await feedback.save();
        return feedback;
    } catch (error) {
        throw new Error('Error creating feedback: ' + error.message);
    }
};

// Cập nhật feedback
const updateFeedback = async (feedbackId, comment) => {
    try {
        const feedback = await Feedback.findByIdAndUpdate(
            feedbackId,
            { comment },
            { new: true }
        );
        if (!feedback) {
            throw new Error('Feedback not found');
        }
        return feedback;
    } catch (error) {
        throw new Error('Error updating feedback: ' + error.message);
    }
};

// Xóa feedback
const deleteFeedback = async (feedbackId) => {
    try {
        const feedback = await Feedback.findByIdAndDelete(feedbackId);
        if (!feedback) {
            throw new Error('Feedback not found');
        }
        return feedback;
    } catch (error) {
        throw new Error('Error deleting feedback: ' + error.message);
    }
};

// Lấy tất cả feedbacks cho một sản phẩm
const getFeedbacksByProduct = async (productId) => {
    try {
        const feedbacks = await Feedback.find({ product: productId }).populate('user', 'name');
        return feedbacks;
    } catch (error) {
        throw new Error('Error fetching feedbacks: ' + error.message);
    }
};

module.exports = { createFeedback, updateFeedback, deleteFeedback, getFeedbacksByProduct };
