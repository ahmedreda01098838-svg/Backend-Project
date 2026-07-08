const express = require('express');
const router = express.Router();
const { register, verifyOTP, login, forgotPassword, resetPassword , changePassword } = require('../controllers/auth.controller');
const { protect , restrictTo } = require('../middleware/auth.middleware');
const { validateRegister } = require('../middleware/validate.middleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.put('/upload-image', protect, upload.any(), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "مفيش ملف وصل يا هندسة!" });
        }
        
        console.log("الملف اللي وصل:", req.files[0]);
        
        res.status(200).json({ success: true, message: "الصورة وصلت بنجاح" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.post('/register', validateRegister, register);
router.post('/verify-otp', verifyOTP);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);


router.get('/profile', protect, (req, res) => {
    res.json({ success: true, data: req.user });
});


router.put('/upload-image', protect, upload.any(), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "مفيش ملف وصل يا هندسة!" });
        }
        
        console.log("الملف اللي وصل:", req.files[0]);
        
        res.status(200).json({ success: true, message: "الصورة وصلت بنجاح" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.put('/change-password', protect, restrictTo('customer'), changePassword);

module.exports = router;





