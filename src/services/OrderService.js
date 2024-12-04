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
}; const deleteOrder = async (orderId, data) => {
    try {
        // Tìm và xóa đơn hàng
        const order = await Order.findByIdAndDelete(orderId);
        if (!order) {
            return { status: 'ERR', message: 'Order not found' };
        }

        console.log('Deleted order:', order);

        // Lặp qua các sản phẩm trong đơn hàng để hoàn trả số lượng vào kho
        const promises = data.orderItems.map(async (orderItem) => {
            try {
                const productData = await Product.findOneAndUpdate(
                    {
                        _id: orderItem.product,
                        countInStock: { $gte: orderItem.amount }, // Kiểm tra số lượng trong kho đủ để trả lại
                    },
                    {
                        $inc: {
                            countInStock: +orderItem.amount,  // Tăng số lượng tồn kho
                            selled: -orderItem.amount,       // Giảm số lượng đã bán
                        },
                    },
                    { new: true } // Trả về document mới nhất
                );

                // Nếu sản phẩm không tồn tại hoặc không đủ số lượng
                if (!productData) {
                    throw new Error(`Product with ID ${orderItem.product} not available or insufficient quantity.`);
                }

                return productData;  // Trả về dữ liệu sản phẩm đã được cập nhật
            } catch (error) {
                console.error(`Error updating product with ID ${orderItem.product}:`, error);
                return { status: 'ERR', message: error.message || 'Failed to update product stock' };
            }
        });

        // Chờ cho tất cả các sản phẩm được xử lý
        const productUpdates = await Promise.all(promises);

        // Kiểm tra nếu có lỗi nào từ các cập nhật sản phẩm
        const failedUpdates = productUpdates.filter(update => update.status === 'ERR');
        if (failedUpdates.length > 0) {
            return { status: 'ERR', message: 'Failed to update some products', data: failedUpdates };
        }

        // Trả về thông báo thành công
        return { status: 'OK', message: 'Order deleted successfully and stock updated', data: order };

    } catch (error) {
        console.error('Error deleting order:', error);
        return { status: 'ERR', message: error.message || 'Failed to delete order' };
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
