const User = require('../models/User.model');

// تحديث بيانات المستخدم (بدون الباسورد)
exports.updateProfile = async (req, res) => {
    try {
        const { username, phone, avatar, addresses } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { username, phone, avatar, addresses },
            { new: true, runValidators: true }
        ).select('-password');
        res.json({ success: true, data: updatedUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// تغيير كلمة المرور (روت مستقل)
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id).select('+password');
        if (!(await user.comparePassword(currentPassword))) {
            return res.status(401).json({ message: "Current password is incorrect" });
        }
        user.password = newPassword;
        await user.save();
        res.json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// تغيير الصلاحيات (للأدمن فقط)
exports.changeUserRole = async (req, res) => {
    try {
        const { userId, newRole } = req.body;
        if (!['admin', 'customer'].includes(newRole)) {
            return res.status(400).json({ message: "Invalid role" });
        }
        const user = await User.findByIdAndUpdate(userId, { role: newRole }, { new: true }).select('-password');
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ success: true, message: "User role updated successfully", data: user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};