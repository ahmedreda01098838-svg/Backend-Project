const Product = require('../models/Product.model');
const cloudinary = require('../utils/cloudinary'); 
const streamifier = require('streamifier');

// Create Product
exports.createProduct = async (req, res) => {
    try {
        req.body.createdBy = req.user.id;

        if (req.files && req.files.length > 0) {
            const images = [];

            // رفع الصور بالتوازي باستخدام Promise.all
            await Promise.all(req.files.map(file => {
                return new Promise((resolve, reject) => {
                    let stream = cloudinary.uploader.upload_stream(
                        { folder: 'products' },
                        (error, result) => {
                            if (result) {
                                images.push({ public_id: result.public_id, url: result.secure_url });
                                resolve();
                            } else {
                                reject(error);
                            }
                        }
                    );
                    streamifier.createReadStream(file.buffer).pipe(stream);
                });
            }));

            req.body.images = images;
        }

        const product = await Product.create(req.body);
        res.status(201).json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getProducts = async (req, res) => {
    try {
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'keyword'];
        excludedFields.forEach(el => delete queryObj[el]);

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        
        let query = Product.find(JSON.parse(queryStr));

        if (req.query.keyword) {
            query = query.find({ $text: { $search: req.query.keyword } });
        }

        if (req.query.sort) {
            query = query.sort(req.query.sort.split(',').join(' '));
        } else {
            query = query.sort('-createdAt');
        }

        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 10;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);

        const products = await query;
        res.json({ success: true, count: products.length, data: products });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Single Product 
exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug });
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Product
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { 
            new: true, 
            runValidators: true 
        });
        if (!product) return res.status(404).json({ message: "Product not found" });
        await product.save(); // لتشغيل الـ pre-save hook الخاص بالـ slug
        res.json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};