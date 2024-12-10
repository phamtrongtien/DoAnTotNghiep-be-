const Order = require('../models/OrderProduct'); // Import OrderModel
const Product = require('../models/ProductModel');
const User = require('../models/UserModel');

const createOrder = async (newOrder) => {
    try {
        const {
            paymentMethod,
            itemsPrice,
            shippingPrice,
            totalPrice,
            user,
            shippingAddress,
            orderItems,
            isPaid
        } = newOrder;

        // Kiểm tra đầu vào
        if (!orderItems || orderItems.length === 0) {
            return {
                status: 'ERR',
                message: 'Order items cannot be empty',
            };
        }

        // Xử lý từng sản phẩm trong đơn hàng
        const promises = orderItems.map(async (order) => {
            const productData = await Product.findOneAndUpdate(
                {
                    _id: order.product,
                    countInStock: { $gte: order.amount }, // Sửa lỗi `amount`
                },
                {
                    $inc: {
                        countInStock: -order.amount,
                        selled: +order.amount,
                    },
                },
                { new: true } // Trả về document mới nhất
            );

            if (!productData) {
                throw new Error(`Product with ID ${order.product} not available or insufficient quantity.`);
            }

            return productData;
        });

        // Chờ tất cả sản phẩm được xử lý
        await Promise.all(promises);

        // Tạo đơn hàng
        const order = new Order(newOrder);
        const savedOrder = await order.save();

        // Trả về kết quả đã lưu
        return {
            status: 'OK',
            message: 'Order created successfully',
            data: savedOrder,
        };
    } catch (error) {
        console.error('Error creating order:', error);

        // Trả về lỗi nếu xảy ra
        return {
            status: 'ERR',
            message: error.message || 'Failed to create order',
        };
    }
};

const getDetailOrder = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Tìm tất cả đơn hàng của người dùng theo id
            const orders = await Order.find({
                user: id
            });
            if (!orders || orders.length === 0) {
                return resolve({
                    status: 'ERR',
                    message: 'No orders found for this user'
                });
            }
            resolve({
                status: 'OK',
                data: orders
            });
        } catch (error) {
            reject({
                status: 'ERR',
                message: error.message
            });
        }
    });
};
const deleteOrder = async (orderId, data) => {
    try {
        // Tìm đơn hàng theo ID và cập nhật trạng thái hủy đơn (isCancel: true)
        const order = await Order.findByIdAndUpdate(
            orderId,
            { isCancel: true },
            { new: true } // Trả về document mới nhất sau khi cập nhật
        );

        if (!order) {
            return { status: 'ERR', message: 'Order not found' };  // Nếu không tìm thấy đơn hàng
        }



        // Lặp qua các sản phẩm trong đơn hàng để hoàn trả số lượng vào kho
        const promises = order.orderItems.map(async (order) => {
            const productData = await Product.findOneAndUpdate(
                {
                    _id: order.product,
                    countInStock: { $gte: order.amount }, // Sửa lỗi `amount`
                },
                {
                    $inc: {
                        countInStock: +order.amount,
                        selled: -order.amount,
                    },
                },
                { new: true } // Trả về document mới nhất
            );

            if (!productData) {
                throw new Error(`Product with ID ${order.product} not available or insufficient quantity.`);
            }

            return productData;
        });

        // Chờ cho tất cả các sản phẩm được xử lý
        await Promise.all(promises);

        // Trả về thông báo thành công
        return {
            status: 'OK',
            message: 'Order cancelled successfully and stock updated',
            data: order
        };

    } catch (error) {
        console.error('Error cancelling order:', error);
        return {
            status: 'ERR',
            message: error.message || 'Failed to cancel order'
        };
    }
};


const getAllOrder = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allOrder = await Order.find();
            resolve({
                status: 'OK',
                data: allOrder,

            });

        } catch (error) {
            reject({
                status: 'ERR',
                message: error.message
            });
        }
    });
};

// Service function to update delivery status
const updateDeliveryStatus = async (orderId, isDelivered) => {
    try {
        // Find the order by its ID and update the isDelivered status
        const order = await Order.findByIdAndUpdate(
            orderId,
            { isDelivered: isDelivered },
            { new: true } // Return the updated document
        );

        return order;
    } catch (error) {
        throw new Error('Error updating order delivery status: ' + error.message);
    }
};



module.exports = {
    createOrder,
    getDetailOrder,
    deleteOrder,
    getAllOrder,
    updateDeliveryStatus
};
