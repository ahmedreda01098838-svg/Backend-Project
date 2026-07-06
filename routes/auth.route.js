const express = require('express');
const router = express.Router();
const { register, verifyOTP, login, forgotPassword, resetPassword } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const { validateRegister } = require('../middleware/validate.middleware');

router.post('/register', validateRegister, register);
router.post('/verify-otp', verifyOTP);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

router.get('/profile', protect, (req, res) => {
    res.json({ success: true, data: req.user });
});

module.exports = router;