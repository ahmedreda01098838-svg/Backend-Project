const User = require('../models/User.model');

exports.getProfile = async (req, res) => {
    const user = await User.findById(req.user.id);
    res.json({ success: true, data: user });
};

exports.updateProfile = async (req, res) => {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true });
    res.json({ success: true, data: user });
};

exports.deleteAccount = async (req, res) => {
    await User.findByIdAndDelete(req.user.id);
    res.json({ success: true, message: "Account deleted successfully" });
};