const User = require('../models/User.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Register
// Register
exports.register = async (req, res) => {
    try {
        const { username, email, password, phone } = req.body;
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // 1. تشفير الباسورد يدوياً هنا
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // 2. إنشاء المستخدم بالباسورد المتهيشة
        const user = new User({ 
            username, email, password: hashedPassword, phone,
            otp: otp,
            otpExpires: Date.now() + 10 * 60 * 1000 
        });

        await user.save(); 

        res.status(201).json({ success: true, message: "User registered successfully", otp });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email, otp, otpExpires: { $gt: Date.now() } });

        if (!user) return res.status(400).json({ message: "Invalid or expired OTP" });

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.json({ success: true, message: "Account verified successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');
        
        if (!user) {
            console.log("User not found for email:", email);
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await user.comparePassword(password);
        console.log("Password match result:", isMatch); // سيطبع true أو false في الـ Terminal

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        
        if (!user.isVerified) {
            return res.status(401).json({ message: "Please verify your account first" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        res.json({ success: true, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
        await user.save();

        res.json({ message: "Reset token generated", resetToken });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Reset Password
exports.resetPassword = async (req, res) => {
    try {
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
        const user = await User.findOne({ resetPasswordToken, resetPasswordExpires: { $gt: Date.now() } });

        if (!user) return res.status(400).json({ message: "Invalid or expired token" });

        user.password = req.body.password; // سيتم تشفيرها تلقائياً عبر الـ Model
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// changePassword
exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        // جلب الباسورد لأنها مختفية في الموديل (select: false)
        const user = await User.findById(req.user.id).select('+password');

        // التحقق من الباسورد القديمة قبل السماح بالتغيير
        if (!(await user.comparePassword(oldPassword))) {
            return res.status(401).json({ message: "Current password is incorrect" });
        }

        user.password = newPassword;
        await user.save(); 

        res.json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};