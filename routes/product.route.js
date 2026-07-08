const express = require('express');
const router = express.Router();
const { 
    createProduct, 
    getProducts, 
    getProduct, 
    updateProduct, 
    deleteProduct 
} = require('../controllers/product.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// --- المسارات العامة (متاحة لأي مستخدم) ---
router.get('/', getProducts);
router.get('/:slug', getProduct);

// --- المسارات المحمية (لا يمكن الوصول إليها إلا بعد تسجيل الدخول) ---
router.use(protect);

// --- مسارات الأدمن فقط (التعديل، الإضافة، والحذف) ---
router.use(restrictTo('admin'));

router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

router.post('/', protect, restrictTo('admin'), upload.array('images', 5), createProduct);

module.exports = router;




