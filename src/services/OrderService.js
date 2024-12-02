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
                        selled: order.amount,
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

module.exports = {
    createOrder,
    getDetailOrder
};
