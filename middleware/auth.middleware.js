const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

const protect = async (req, res, next) => {
    let token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Not authorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) return res.status(401).json({ message: "User not found" });
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid Token" });
    }
};

const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "You do not have permission" });
        }
        next();
    };
};

module.exports = { protect, restrictTo };