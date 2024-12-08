const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderItems: [
        {
            name: { type: String, required: true },
            amount: { type: Number, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            }
        }
    ],
    shippingAddress: {
        fullName: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        // country: { type: String, required: true },
        phone: { type: Number, required: true }
    },
    paymentMethod: { type: String, required: true },
    itemsPrice: { type: Number, required: true },
    taxPrice: { type: Number, required: false },
    shippingPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
    isCancel: { type: Boolean, default: false },
    canceledAt: { type: Date, required: false },
    cancellationReason: { type: String, required: false },
    isRefunded: { type: Boolean, default: false }, // Trạng thái hoàn tiền
}, {
    timestamp: true,
}
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
