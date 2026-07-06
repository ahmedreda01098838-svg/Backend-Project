const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: String,
    image: String,
    price: Number,
    quantity: Number
});

const cartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [cartItemSchema],
    coupon: {
        code: { type: String, uppercase: true },
        discountType: { type: String, enum: ['percentage', 'fixed'] },
        discountValue: Number
    }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

// Mongoose Virtuals for calculations
cartSchema.virtual('subtotal').get(function() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
});

cartSchema.virtual('itemCount').get(function() {
    return this.items.reduce((count, item) => count + item.quantity, 0);
});

cartSchema.virtual('discountAmount').get(function() {
    if (!this.coupon || !this.coupon.discountValue) return 0;
    if (this.coupon.discountType === 'percentage') {
        return (this.subtotal * this.coupon.discountValue) / 100;
    }
    return this.coupon.discountValue;
});

cartSchema.virtual('total').get(function() {
    return this.subtotal - this.discountAmount;
});

module.exports = mongoose.model('Cart', cartSchema);