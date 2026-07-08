const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });

// Pre-find hook to auto-populate products
wishlistSchema.pre(/^find/, function(next) {
    this.populate('products');
    next();
});

module.exports = mongoose.model('Wishlist', wishlistSchema);