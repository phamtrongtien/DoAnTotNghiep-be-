const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false, required: true },
    phone: { type: Number, required: true },
    address: { type: String, require: true },
    avatar: { type: String },
    city: { type: String },
    isEmployeeWarehouse: {
        type: Boolean, default: false
    },
    isEmployeeSale: {
        type: Boolean, default: false
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;
