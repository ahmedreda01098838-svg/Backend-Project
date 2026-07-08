const express = require('express');
const router = express.Router();
const { updateProfile, changePassword, changeUserRole } = require('../controllers/user.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

// روت تحديث البروفايل (أي يوزر مسجل)
router.put('/update-profile', protect, updateProfile);

// روت تغيير الباسورد (أي يوزر مسجل)
router.put('/change-password', protect, changePassword);

// روت تغيير الصلاحيات (للأدمن فقط)
router.patch('/change-role', protect, restrictTo('admin'), changeUserRole);

module.exports = router;