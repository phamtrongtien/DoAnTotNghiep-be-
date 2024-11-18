const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, require: true },
    image: { type: String },
    type: { type: String },
    price: { type: Number },
    countInStock: { type: Number },
    rating: { type: Number },
    description: { type: String },
    discount: { type: Number },
    selled: { type: Number },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
