const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: String,
    image: String,
    price: Number,
    quantity: Number
});

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    shippingAddress: {
        fullName: String,
        phone: String,
        country: String,
        city: String,
        address: String,
        postalCode: String
    },
    paymentMethod: { type: String, enum: ['cash', 'stripe', 'paypal', 'paymob'], default: 'cash' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    transactionId: String,
    subtotal: { type: Number, required: true },
    shippingFee: { type: Number, default: 0 },
    tax: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'], 
        default: 'pending' 
    },
    paidAt: Date,
    deliveredAt: Date,
    cancelledAt: Date,
    customerNote: { type: String, maxlength: 1000 },
    adminNote: { type: String, maxlength: 1000 }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);