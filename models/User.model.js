const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const addressSchema = new mongoose.Schema({
    fullName: String,
    phone: String,
    country: String,
    city: String,
    address: String,
    postalCode: String
});

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    phone: { type: String },
    avatar: { type: String, default: 'placeholder.png' }, 
    role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
    addresses: [addressSchema], // تم إضافة addresses
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    otp: String,
    otpExpires: Date,
    isVerified: { type: Boolean, default: false },
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};
module.exports = mongoose.model('User', userSchema);

