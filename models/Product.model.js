const mongoose = require('mongoose');
const slugify = require('slugify');

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: String
}, { timestamps: true });

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, maxlength: 200 },
    slug: { type: String },
    shortDescription: { type: String, required: true, maxlength: 500 },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, default: 0 },
    stock: { type: Number, required: true },
    sku: String,
    images: [{ public_id: String, url: String }],
    category: { type: String, required: true, lowercase: true },
    subcategory: String,
    brand: String,
    tags: [String],
    reviews: [reviewSchema],
    averageRating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Hooks & Methods
productSchema.pre('save', function(next) {
    if (this.isModified('name')) {
        this.slug = slugify(this.name, { lower: true });
    }
    next();
});

productSchema.methods.calcAverageRating = function() {
    const ratingsSum = this.reviews.reduce((acc, item) => acc + item.rating, 0);
    this.numReviews = this.reviews.length;
    this.averageRating = this.reviews.length > 0 ? ratingsSum / this.reviews.length : 0;
};

// Indexes
productSchema.index({ name: 'text', description: 'text', brand: 'text' });
productSchema.index({ category: 1, brand: 1, price: 1, averageRating: 1, createdAt: -1 });

module.exports = mongoose.model('Product', productSchema);