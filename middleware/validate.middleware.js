const Joi = require('joi');

const validateRegister = (req, res, next) => {
    // 1. تعريف الـ Schema
    const schema = Joi.object({
        username: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        phone: Joi.string().pattern(/^[0-9]{11}$/).optional()
    });

    // 2. التحقق
    const { error } = schema.validate(req.body);
    
    // 3. في حالة الخطأ نوقف الطلب
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    // 4. التأكد من وجود next قبل استدعائها
    if (typeof next === 'function') {
        next();
    } else {
        console.error("Critical Error: next is not defined in validation middleware");
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { validateRegister };