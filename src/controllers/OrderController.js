const OrderService = require('../services/OrderService');

const createOrder = async (req, res) => {
    try {
        // Lấy dữ liệu từ request body

        const { paymentMethod,
            itemsPrice,
            shippingPrice,
            totalPrice,
            user,
            shippingAddress, orderItems, isPaid } = req.body;


        // Kiểm tra các trường dữ liệu bắt buộc
        if (!paymentMethod ||
            !itemsPrice ||
            !shippingPrice ||
            !totalPrice ||
            !user ||
            !shippingAddress ||
            !orderItems) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The input fields are required ở đây'
            });
        }


        // Gọi hàm tạo sản phẩm từ ProductService
        const result = await OrderService.createOrder(req.body);

        return res.status(201).json(result); // Trả về kết quả tạo sản phẩm thành công
    } catch (e) {
        console.error('Error creating product:', e);  // Log lỗi để dễ dàng debug
        return res.status(500).json({
            status: 'ERR',
            message: e.message || 'Internal Server Error' // Trả về thông điệp lỗi
        });
    }
};

const getDetailOrder = async (req, res) => {
    try {
        const userId = req.params.id;

        // Kiểm tra xem productId có tồn tại không
        if (!userId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'userId is required'
            });
        }

        // Gọi hàm getDetailProduct từ ProductService
        const result = await OrderService.getDetailOrder(userId);

        // Kiểm tra kết quả
        if (result.status === 'ERR') {
            return res.status(404).json(result); // Trả về lỗi không tìm thấy
        }

        return res.status(200).json(result); // Trả về thông tin sản phẩm
    } catch (e) {
        return res.status(500).json({
            message: e.message // Trả về thông điệp lỗi
        });
    }
};
const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params; // Lấy id từ params
        const data = req.body
        console.log(data)
        const result = await OrderService.deleteOrder(id, data); // Gọi service để xóa đơn hàng

        if (result.status === 'ERR') {
            return res.status(404).json(result); // Nếu không tìm thấy đơn hàng
        }

        return res.status(200).json(result); // Trả về kết quả thành công
    } catch (e) {
        return res.status(500).json({
            message: e.message || 'Internal Server Error'
        });
    }
};

const getAllOrder = async (req, res) => {
    try {

        // Chuyển limit thành undefined nếu không được cung cấp
        const result = await OrderService.getAllOrder();

        return res.status(200).json(result); // Trả về danh sách sản phẩm
    } catch (e) {
        return res.status(500).json({
            message: e.message // Trả về thông điệp lỗi
        });
    }
};
const updateDelivery = async (req, res) => {
    const { orderId } = req.params;  // Get orderId from URL params
    const { isDelivered } = req.body;  // Get isDelivered status from request body

    try {
        // Call service to update delivery status
        const updatedOrder = await OrderService.updateDeliveryStatus(orderId, isDelivered);

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        return res.status(200).json({
            message: 'Order delivery status updated successfully',
            order: updatedOrder,
        });
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};
module.exports = {
    createOrder,
    getDetailOrder,
    deleteOrder,
    getAllOrder,
    updateDelivery
};